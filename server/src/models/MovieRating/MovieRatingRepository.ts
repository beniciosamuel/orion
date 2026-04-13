import { Context } from "../../services/Context";
import { MovieRatingCreateDTO } from "./MovieRatingDTO";

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
}
