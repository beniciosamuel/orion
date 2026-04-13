import { Request, Response } from "express";

import { SearchMovieRequestSchema } from "./schema";
import { Context } from "../../services/Context";
import { MovieUseCase } from "../../models/Movie/MovieUseCase";

export class SearchMovieController {
  static async handler(req: Request, res: Response): Promise<Response> {
    try {
      const { title, genres } = SearchMovieRequestSchema.parse({
        title: req.query.title,
        genres: req.query.genres,
      });

      const context = req.context ?? (await Context.initialize());

      const movies = await MovieUseCase.search(
        {
          title,
          genres,
        },
        context,
      );

      return res.status(200).json({ movies });
    } catch (error) {
      if (
        error instanceof Error &&
        error.message.includes("At least one filter")
      ) {
        return res.status(400).json({ error: error.message });
      }

      return res.status(500).json({ error: "Internal Server Error" });
    }
  }
}
