import { Context } from "../../services/Context";
import { MovieRatingCreateDTO } from "./MovieRatingDTO";
import { MovieRatingRepository } from "./MovieRatingRepository";

export class MovieRatingUseCase {
  static async setVote(
    args: MovieRatingCreateDTO,
    context: Context,
  ): Promise<void> {
    await MovieRatingRepository.setVote(args, context);
  }
}
