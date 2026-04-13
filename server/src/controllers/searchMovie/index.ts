import { Request, Response } from "express";

import { SearchMovieRequestSchema } from "./schema";
import { Context } from "../../services/Context";
import { MovieUseCase } from "../../models/Movie/MovieUseCase";

export class SearchMovieController {
  static async handler(req: Request, res: Response): Promise<Response> {
    try {
      const { title, genres, pagination } = SearchMovieRequestSchema.parse(
        req.body,
      );

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

      const result = await MovieUseCase.searchWithRating(
        {
          title,
          genres,
          pagination,
        },
        authenticatedUser?.id ?? null,
        context,
      );

      const totalPages = Math.ceil(result.total / pagination.pageSize);

      return res.status(200).json({
        status: 200,
        data: result.data,
        pagination: {
          total: result.total,
          page: pagination.page,
          pageSize: pagination.pageSize,
          totalPages,
        },
      });
    } catch (error) {
      if (error instanceof Error && error.name === "ZodError") {
        return res.status(400).json({ error: "Invalid request payload" });
      }

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
