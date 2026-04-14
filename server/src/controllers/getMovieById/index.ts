import { Request, Response } from "express";

import { Context } from "../../services/Context";
import { MovieUseCase } from "../../models/Movie/MovieUseCase";
import { GetMovieByIdRequestSchema } from "./schema";

export class GetMovieByIdController {
  static async handler(req: Request, res: Response): Promise<Response> {
    try {
      const { id } = GetMovieByIdRequestSchema.parse({
        id: req.query.id ?? req.body?.id,
      });

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

      const movie = await MovieUseCase.fromIdWithRating(
        id,
        authenticatedUser?.id ?? null,
        context,
      );

      if (!movie) {
        return res.status(404).json({ error: "Movie not found" });
      }

      return res.status(200).json({ movie });
    } catch (error) {
      const cause = error instanceof Error ? error.message : "Unknown error";

      if (error instanceof Error && error.message.includes("not found")) {
        return res.status(404).json({ error: error.message, cause });
      }

      return res.status(500).json({ error: "Internal Server Error", cause });
    }
  }
}
