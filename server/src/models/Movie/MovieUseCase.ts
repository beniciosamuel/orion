import { Context } from "../../services/Context";
import { MovieCreateDTO, MovieUpdateDTO } from "./MovieDTO";
import { MovieEntity } from "./MovieEntity";
import { MovieRepository } from "./MovieRepository";
import { MovieRatingRepository } from "../MovieRating/MovieRatingRepository";
import { FileRepository } from "../File/FileRepository";

type MovieWithRating = MovieEntity & {
  rating: number;
  movieRating: number;
  userRating: number | null;
  hasUserVoted: boolean;
  images: {
    posterUri: string | null;
    backdropUri: string | null;
  };
};

type MovieContributor = {
  userId: string;
  createdAt: Date;
  updatedAt: Date;
};

export class MovieUseCase {
  private static async enrichWithRatingsAndMedia(
    movies: MovieEntity[],
    userId: string | null,
    context: Context,
  ): Promise<MovieWithRating[]> {
    const movieIds = movies.map((movie) => movie.id);

    const summaries = await Promise.all(
      movies.map((movie) =>
        MovieRatingRepository.getSummaryByMovieId(movie.id, userId, context),
      ),
    );

    const mediaByMovieId = await FileRepository.listMediaByMovieIds(
      movieIds,
      context,
    );

    return movies.map((movie, index) => {
      const summary = summaries[index];

      return {
        ...movie,
        rating: summary?.rating ?? 0,
        movieRating: summary?.rating ?? 0,
        userRating: summary?.userRating ?? null,
        hasUserVoted: summary?.hasUserVoted ?? false,
        images: mediaByMovieId[movie.id] ?? {
          posterUri: null,
          backdropUri: null,
        },
      };
    });
  }

  static async list(
    pagination: {
      page: number;
      pageSize: number;
    },
    context: Context,
  ): Promise<{ data: MovieEntity[]; total: number }> {
    return MovieRepository.list(pagination, context);
  }

  static async fromId(
    id: string,
    context: Context,
  ): Promise<MovieEntity | null> {
    return MovieRepository.fromId(id, context);
  }

  static async listContributorsByMovieId(
    movieId: string,
    context: Context,
  ): Promise<MovieContributor[]> {
    return MovieRepository.listContributorsByMovieId(movieId, context);
  }

  static async listReleasedFromDay(
    day: Date,
    context: Context,
  ): Promise<MovieEntity[]> {
    return MovieRepository.listReleasedFromDay(day, context);
  }

  static async fromIdWithRating(
    id: string,
    userId: string | null,
    context: Context,
  ): Promise<MovieWithRating | null> {
    const movie = await MovieRepository.fromId(id, context);

    if (!movie) {
      return null;
    }

    const [enrichedMovie] = await this.enrichWithRatingsAndMedia(
      [movie],
      userId,
      context,
    );

    return enrichedMovie ?? null;
  }

  static async create(
    args: MovieCreateDTO,
    context: Context,
  ): Promise<MovieEntity> {
    const movie = await MovieRepository.create(args, context);
    return movie;
  }

  static async update(
    id: string,
    data: MovieUpdateDTO,
    context: Context,
  ): Promise<boolean> {
    return MovieRepository.update(id, data, context);
  }

  static async delete(id: string, context: Context): Promise<boolean> {
    return MovieRepository.delete(id, context);
  }

  static async search(
    filters: {
      title?: string;
      genres?: string[];
      pagination: {
        page: number;
        pageSize: number;
      };
    },
    context: Context,
  ): Promise<{ data: MovieEntity[]; total: number }> {
    return MovieRepository.search(
      {
        title: filters.title,
        genres: filters.genres,
      },
      filters.pagination,
      context,
    );
  }

  static async listWithRating(
    pagination: {
      page: number;
      pageSize: number;
    },
    userId: string | null,
    context: Context,
  ): Promise<{ data: MovieWithRating[]; total: number }> {
    const result = await MovieRepository.list(pagination, context);

    return {
      data: await this.enrichWithRatingsAndMedia(result.data, userId, context),
      total: result.total,
    };
  }

  static async searchWithRating(
    filters: {
      title?: string;
      genres?: string[];
      pagination: {
        page: number;
        pageSize: number;
      };
    },
    userId: string | null,
    context: Context,
  ): Promise<{ data: MovieWithRating[]; total: number }> {
    const result = await this.search(filters, context);

    return {
      data: await this.enrichWithRatingsAndMedia(result.data, userId, context),
      total: result.total,
    };
  }
}
