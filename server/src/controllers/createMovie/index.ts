import { Request, Response } from "express";
import { CreateMovieRequestSchema } from "./schema";
import { MovieUseCase } from "../../models/Movie/MovieUseCase";
import { Context } from "../../services/Context";

export class CreateMovieController {
  static async handler(req: Request, res: Response) {
    try {
      const dataRequestParsed = CreateMovieRequestSchema.parse(req.body);

      const context = req.context ?? (await Context.initialize());

      const authenticatedUser = (
        context as Context & {
          model?: {
            user?: {
              id: string;
              scope: "viewer" | "editor" | "admin";
            };
          };
        }
      ).model?.user;

      if (!authenticatedUser) {
        return res.status(401).json({ error: "Unauthorized" });
      }

      if (
        authenticatedUser.scope !== "editor" &&
        authenticatedUser.scope !== "admin"
      ) {
        return res.status(403).json({ error: "Forbidden" });
      }

      const movie = await MovieUseCase.create(
        {
          ...dataRequestParsed,
          userId: authenticatedUser.id,
          releaseDate: dataRequestParsed.releaseDate as unknown as Date,
        },
        context,
      );

      res.status(201).json({ movie });
    } catch (error) {
      if (error instanceof Error && error.message.includes("already exists")) {
        return res.status(409).json({ error: error.message });
      }
      res.status(500).json({ error: "Internal server error" });
    }
  }
}
