import { Request, Response } from "express";

import { Context } from "../../services/Context";
import { MovieUseCase } from "../../models/Movie/MovieUseCase";
import { DeleteMovieRequestSchema } from "./schema";

export class DeleteMovieController {
  static async handler(req: Request, res: Response): Promise<Response> {
    try {
      const { id } = DeleteMovieRequestSchema.parse(req.body);

      const context = req.context ?? (await Context.initialize());

      const authenticatedUser = (
        context as Context & {
          models?: {
            user?: {
              id: string;
              scope: "viewer" | "editor" | "admin";
            };
          };
        }
      ).models?.user;

      if (!authenticatedUser) {
        return res.status(401).json({ error: "Unauthorized" });
      }

      if (authenticatedUser.scope !== "editor") {
        return res.status(403).json({ error: "Forbidden" });
      }

      const existingMovie = await MovieUseCase.fromId(id, context);

      if (!existingMovie) {
        return res.status(404).json({ error: "Movie not found" });
      }

      const contributors = await MovieUseCase.listContributorsByMovieId(
        id,
        context,
      );

      const isContributor = contributors.some(
        ({ userId }) => userId === authenticatedUser.id,
      );

      if (!isContributor) {
        return res.status(403).json({ error: "Forbidden" });
      }

      const deleted = await MovieUseCase.delete(id, context);

      if (!deleted) {
        return res.status(500).json({ error: "Movie delete failed" });
      }

      return res.status(200).json({ message: "Movie deleted successfully" });
    } catch (error) {
      const cause = error instanceof Error ? error.message : "Unknown error";

      if (error instanceof Error && error.name === "ZodError") {
        return res
          .status(400)
          .json({ error: "Invalid request payload", cause });
      }

      return res.status(500).json({ error: "Internal Server Error", cause });
    }
  }
}
