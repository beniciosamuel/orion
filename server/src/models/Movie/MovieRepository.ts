import { Context } from "../../services/Context";
import { MovieCreateDTO, MovieUpdateDTO } from "./MovieDTO";
import { MovieEntity } from "./MovieEntity";

interface SearchMovieFilters {
  title?: string;
  genres?: string[];
}

export class MovieRepository {
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
    context: Context,
  ): Promise<MovieEntity[]> {
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

    const results = await query;

    return results.map((result) => MovieEntity.fromRecord(result));
  }

  static async create(
    args: MovieCreateDTO,
    context: Context,
  ): Promise<MovieEntity> {
    const [result] = await context
      .database("movie")
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

    return updated > 0;
  }

  static async delete(id: string, context: Context): Promise<boolean> {
    const deleted = await context
      .database("movie")
      .where("id", id)
      .whereNull("deleted_at")
      .update({ deleted_at: new Date().toISOString() });

    return deleted > 0;
  }
}
