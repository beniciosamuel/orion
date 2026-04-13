import { Request, Response } from "express";

import { Context } from "../../services/Context";
import { MovieUseCase } from "../../models/Movie/MovieUseCase";
import { MovieRatingUseCase } from "../../models/MovieRating/MovieRatingUseCase";
import { SetMovieVoteRequestSchema } from "./schema";

export class SetMovieVoteController {
  static async handler(req: Request, res: Response): Promise<Response> {
    try {
      const { movieId, rating } = SetMovieVoteRequestSchema.parse(req.body);

      const context = req.context ?? (await Context.initialize());

      const authenticatedUser = (
        context as Context & {
          model?: {
            user?: {
              id: string;
            };
          };
        }
      ).model?.user;

      if (!authenticatedUser) {
        return res.status(401).json({ error: "Unauthorized" });
      }

      const userExists = await context
        .database("user")
        .where("id", authenticatedUser.id)
        .whereNull("deleted_at")
        .first();

      if (!userExists) {
        return res.status(404).json({ error: "User not found" });
      }

      const movie = await MovieUseCase.fromId(movieId, context);

      if (!movie) {
        return res.status(404).json({ error: "Movie not found" });
      }

      await MovieRatingUseCase.setVote(
        {
          movieId,
          userId: authenticatedUser.id,
          rating,
        },
        context,
      );

      return res.status(201).json({
        status: 201,
        data: {
          movieId,
          userId: authenticatedUser.id,
          rating,
        },
      });
    } catch (error) {
      if (error instanceof Error && error.name === "ZodError") {
        return res.status(400).json({ error: "Invalid request payload" });
      }

      return res.status(500).json({ error: "Internal Server Error" });
    }
  }
}
