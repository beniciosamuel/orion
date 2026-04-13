import { Context } from "../../services/Context";
import { MovieRatingCreateDTO, MovieRatingSummaryDTO } from "./MovieRatingDTO";

export class MovieRatingRepository {
  static async setVote(
    args: MovieRatingCreateDTO,
    context: Context,
  ): Promise<void> {
    await context
      .database("movie_rating")
      .insert({
        movie_id: args.movieId,
        user_id: args.userId,
        rating: args.rating,
      })
      .onConflict(["movie_id", "user_id"])
      .merge({ rating: args.rating });
  }

  static async getSummaryByMovieId(
    movieId: string,
    userId: string | null,
    context: Context,
  ): Promise<MovieRatingSummaryDTO> {
    const [ratingRow] = await context
      .database("movie_rating")
      .where({ movie_id: movieId })
      .select<{ rating: string | number }[]>(
        context.database.raw("ROUND(AVG(rating)::numeric, 2) as rating"),
      );

    const userVoteRow = userId
      ? await context
          .database("movie_rating")
          .select<{ rating: number }[]>("rating")
          .where({ movie_id: movieId, user_id: userId })
          .first()
      : null;

    const userRating = userVoteRow?.rating ?? null;

    return {
      movieId,
      rating: Number(ratingRow?.rating) || 0,
      userRating,
      hasUserVoted: userRating !== null,
    };
  }
}
