import { Request, Response } from "express";

import { Context } from "../../services/Context";
import { MovieUseCase } from "../../models/Movie/MovieUseCase";
import { GetMovieByIdRequestSchema } from "./schema";

export class GetMovieByIdController {
  static async handler(req: Request, res: Response): Promise<Response> {
    try {
      const { id } = GetMovieByIdRequestSchema.parse(req.body);

      const context = req.context ?? (await Context.initialize());

      const movie = await MovieUseCase.fromId(id, context);

      if (!movie) {
        return res.status(404).json({ error: "Movie not found" });
      }

      return res.status(200).json({ movie });
    } catch (error) {
      if (error instanceof Error && error.message.includes("not found")) {
        return res.status(404).json({ error: error.message });
      }

      return res.status(500).json({ error: "Internal Server Error" });
    }
  }
}
