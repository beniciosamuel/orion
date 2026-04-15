import { Context } from "../../services/Context";
import { Cache } from "../../services/Cache";
import { MovieCreateDTO, MovieUpdateDTO } from "./MovieDTO";
import { MovieEntity } from "./MovieEntity";
import {
  SearchMovieFilters,
  PaginationInput,
  PaginatedMovieResult,
  AdvancedSearchMovieFilters,
  CachedMovieEntity,
  MovieContributorResult,
  CachedPaginatedMovieResult,
} from "./MovieDTO";

export class MovieRepository {
  private static readonly listCachePrefix = "movies:list";

  private static getListCacheKey(pagination: PaginationInput): string {
    return `${this.listCachePrefix}#page#${pagination.page}#pageSize#${pagination.pageSize}`;
  }

  private static getListCachePattern(): string {
    return `${this.listCachePrefix}#page#*#pageSize#*`;
  }

  private static toCachedMovieEntity(movie: MovieEntity): CachedMovieEntity {
    return {
      id: movie.id,
      resumeTitle: movie.resumeTitle,
      title: movie.title,
      description: movie.description,
      userComment: movie.userComment,
      director: movie.director,
      duration: movie.duration,
      genres: movie.genres,
      language: movie.language,
      ageRating: movie.ageRating,
      budget: movie.budget,
      revenue: movie.revenue,
      profit: movie.profit,
      productionCompany: movie.productionCompany,
      trailerUrl: movie.trailerUrl,
      releaseDate: movie.releaseDate.toISOString(),
      createdAt: movie.createdAt.toISOString(),
      updatedAt: movie.updatedAt.toISOString(),
      deletedAt: movie.deletedAt ? movie.deletedAt.toISOString() : null,
    };
  }

  private static fromCachedMovieEntity(movie: CachedMovieEntity): MovieEntity {
    return new MovieEntity({
      id: movie.id,
      resumeTitle: movie.resumeTitle,
      title: movie.title,
      description: movie.description,
      userComment: movie.userComment,
      director: movie.director,
      duration: movie.duration,
      genres: movie.genres,
      language: movie.language,
      ageRating: movie.ageRating,
      budget: movie.budget,
      revenue: movie.revenue,
      profit: movie.profit,
      productionCompany: movie.productionCompany,
      trailerUrl: movie.trailerUrl,
      releaseDate: new Date(movie.releaseDate),
      createdAt: new Date(movie.createdAt),
      updatedAt: new Date(movie.updatedAt),
      deletedAt: movie.deletedAt ? new Date(movie.deletedAt) : null,
    });
  }

  private static async invalidateListCache(): Promise<void> {
    await Cache.delByPattern(this.getListCachePattern());
  }

  static async listReleasedFromDay(
    day: Date,
    context: Context,
  ): Promise<MovieEntity[]> {
    const targetDate = day.toISOString().split("T")[0];

    const results = await context
      .database("movie")
      .whereRaw("release_date::date = ?", [targetDate])
      .whereNull("deleted_at")
      .orderBy("release_date", "asc")
      .orderBy("created_at", "asc");

    return results.map((result) => MovieEntity.fromRecord(result));
  }

  static async listContributorsByMovieId(
    movieId: string,
    context: Context,
  ): Promise<MovieContributorResult[]> {
    const results = await context
      .database("movie_contributors")
      .where({ movie_id: movieId })
      .select("user_id", "created_at", "updated_at");

    return results.map((result) => ({
      userId: result.user_id,
      createdAt: result.created_at,
      updatedAt: result.updated_at,
    }));
  }

  static async fromId(
    id: string,
    context: Context,
  ): Promise<MovieEntity | null> {
    const result = await context
      .database("movie")
      .where({ id })
      .whereNull("deleted_at")
      .first();

    if (!result) {
      return null;
    }

    return MovieEntity.fromRecord(result);
  }

  static async fromTitle(
    title: string,
    context: Context,
  ): Promise<MovieEntity[]> {
    const results = await context
      .database("movie")
      .where("title", "like", `%${title}%`)
      .whereNull("deleted_at");

    return results.map((result) => MovieEntity.fromRecord(result));
  }

  static async search(
    filters: SearchMovieFilters,
    pagination: PaginationInput,
    context: Context,
  ): Promise<PaginatedMovieResult> {
    const query = context.database("movie").whereNull("deleted_at");

    if (filters.title) {
      query.where("title", "ilike", `%${filters.title}%`);
    }

    if (filters.genres?.length) {
      query.andWhere((builder) => {
        filters.genres?.forEach((genre, index) => {
          if (index === 0) {
            builder.where("genres", "ilike", `%${genre}%`);
            return;
          }

          builder.orWhere("genres", "ilike", `%${genre}%`);
        });
      });
    }

    const countResult = await query
      .clone()
      .clearSelect()
      .clearOrder()
      .count<{ count: string }>("id as count")
      .first();

    const offset = (pagination.page - 1) * pagination.pageSize;

    const results = await query
      .clone()
      .orderBy("created_at", "desc")
      .offset(offset)
      .limit(pagination.pageSize);

    return {
      data: results.map((result) => MovieEntity.fromRecord(result)),
      total: Number(countResult?.count ?? 0),
    };
  }

  static async list(
    pagination: PaginationInput,
    context: Context,
  ): Promise<PaginatedMovieResult> {
    const cacheKey = this.getListCacheKey(pagination);
    const cachedList = await context.cache.get(cacheKey);

    // console.log(`Cache key for movie list: ${cacheKey}`);
    // console.log(`Cached list found: ${cachedList}`);

    if (cachedList) {
      const cachedResult = JSON.parse(cachedList) as CachedPaginatedMovieResult;

      return {
        data: cachedResult.data.map((movie) =>
          this.fromCachedMovieEntity(movie),
        ),
        total: cachedResult.total,
      };
    }

    const baseQuery = context.database("movie").whereNull("deleted_at");

    const countResult = await baseQuery
      .clone()
      .clearSelect()
      .clearOrder()
      .count<{ count: string }>("id as count")
      .first();

    const offset = (pagination.page - 1) * pagination.pageSize;

    const results = await baseQuery
      .clone()
      .orderBy("created_at", "desc")
      .offset(offset)
      .limit(pagination.pageSize);

    const result = {
      data: results.map((result) => MovieEntity.fromRecord(result)),
      total: Number(countResult?.count ?? 0),
    };

    await context.cache.set(
      cacheKey,
      JSON.stringify({
        data: result.data.map((movie) => this.toCachedMovieEntity(movie)),
        total: result.total,
      }),
    );

    return result;
  }

  static async create(
    args: MovieCreateDTO,
    context: Context,
  ): Promise<MovieEntity> {
    const result = await context.database.transaction(async (trx) => {
      console.log("Creating movie with title:", args.title);
      const [createdMovie] = await trx("movie")
        .insert({
          resume_title: args.resumeTitle,
          title: args.title,
          description: args.description,
          user_comment: args.userComment,
          director: args.director,
          duration: args.duration,
          genres: args.genres,
          language: args.language,
          age_rating: args.ageRating,
          budget: args.budget,
          revenue: args.revenue,
          profit: args.profit,
          production_company: args.productionCompany,
          trailer_url: args.trailerUrl,
          release_date: args.releaseDate,
        })
        .returning("*");

      console.log("Movie created with ID:", createdMovie.id);

      await trx("movie_contributors").insert({
        movie_id: createdMovie.id,
        user_id: args.userId,
      });

      console.log("Movie contributor record created for user ID:", args.userId);

      return createdMovie;
    });

    await this.invalidateListCache();

    return MovieEntity.fromRecord(result);
  }

  static async update(
    id: string,
    data: MovieUpdateDTO,
    context: Context,
  ): Promise<boolean> {
    const updated = await context
      .database("movie")
      .where("id", id)
      .whereNull("deleted_at")
      .update({
        resume_title: data.resumeTitle,
        title: data.title,
        description: data.description,
        user_comment: data.userComment,
        director: data.director,
        duration: data.duration,
        genres: data.genres,
        language: data.language,
        age_rating: data.ageRating,
        budget: data.budget,
        revenue: data.revenue,
        profit: data.profit,
        production_company: data.productionCompany,
        trailer_url: data.trailerUrl,
        release_date: data.releaseDate,
        updated_at: new Date().toISOString(),
      });

    if (updated > 0) {
      await this.invalidateListCache();
    }

    return updated > 0;
  }

  static async delete(id: string, context: Context): Promise<boolean> {
    const deleted = await context
      .database("movie")
      .where("id", id)
      .whereNull("deleted_at")
      .update({ deleted_at: new Date().toISOString() });

    if (deleted > 0) {
      await this.invalidateListCache();
    }

    return deleted > 0;
  }

  static async searchWithFilters(
    filters: AdvancedSearchMovieFilters,
    pagination: PaginationInput,
    context: Context,
  ): Promise<PaginatedMovieResult> {
    const query = context.database("movie").whereNull("deleted_at");

    if (filters.title) {
      query.where("title", "ilike", `%${filters.title}%`);
    }

    if (filters.genres?.length) {
      query.andWhere((builder) => {
        filters.genres?.forEach((genre, index) => {
          if (index === 0) {
            builder.where("genres", "ilike", `%${genre}%`);
            return;
          }

          builder.orWhere("genres", "ilike", `%${genre}%`);
        });
      });
    }

    if (filters.releaseDate) {
      let dateStr: string;

      if (filters.releaseDate instanceof Date) {
        dateStr = filters.releaseDate.toISOString().split("T")[0];
      } else {
        dateStr = filters.releaseDate;
      }

      query.andWhereRaw("release_date::date = ?", [dateStr]);
    }

    if (typeof filters.duration === "number") {
      query.andWhere("duration", filters.duration);
    }

    const countResult = await query
      .clone()
      .clearSelect()
      .clearOrder()
      .count<{ count: string }>("id as count")
      .first();

    const offset = (pagination.page - 1) * pagination.pageSize;

    const results = await query
      .clone()
      .orderBy("created_at", "desc")
      .offset(offset)
      .limit(pagination.pageSize);

    return {
      data: results.map((result) => MovieEntity.fromRecord(result)),
      total: Number(countResult?.count ?? 0),
    };
  }
}
