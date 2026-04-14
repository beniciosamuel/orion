import { Request, Response } from "express";

import { Context } from "../../services/Context";
import { MovieUseCase } from "../../models/Movie/MovieUseCase";
import { UpdateMovieRequestSchema } from "./schema";

export class UpdateMovieController {
  static async handler(req: Request, res: Response): Promise<Response> {
    try {
      const dataRequestParsed = UpdateMovieRequestSchema.parse(req.body);

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

      const existingMovie = await MovieUseCase.fromId(
        dataRequestParsed.id,
        context,
      );

      if (!existingMovie) {
        return res.status(404).json({ error: "Movie not found" });
      }

      const contributors = await MovieUseCase.listContributorsByMovieId(
        dataRequestParsed.id,
        context,
      );

      const isContributor = contributors.some(
        ({ userId }) => userId === authenticatedUser.id,
      );

      if (!isContributor) {
        return res.status(403).json({ error: "Forbidden" });
      }

      const updated = await MovieUseCase.update(
        dataRequestParsed.id,
        {
          id: dataRequestParsed.id,
          resumeTitle: dataRequestParsed.resumeTitle,
          title: dataRequestParsed.title,
          description: dataRequestParsed.description,
          userComment: dataRequestParsed.userComment,
          director: dataRequestParsed.director,
          duration: dataRequestParsed.duration,
          genres: dataRequestParsed.genres,
          language: dataRequestParsed.language,
          ageRating: dataRequestParsed.ageRating,
          budget: dataRequestParsed.budget,
          revenue: dataRequestParsed.revenue,
          profit: dataRequestParsed.profit,
          productionCompany: dataRequestParsed.productionCompany,
          trailerUrl: dataRequestParsed.trailerUrl,
          releaseDate: new Date(dataRequestParsed.releaseDate),
        },
        context,
      );

      if (!updated) {
        return res.status(500).json({ error: "Movie update failed" });
      }

      const movie = await MovieUseCase.fromIdWithRating(
        dataRequestParsed.id,
        authenticatedUser.id,
        context,
      );

      if (!movie) {
        return res.status(404).json({ error: "Movie not found" });
      }

      return res.status(200).json({ movie: { ...movie, isContributor: true } });
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
