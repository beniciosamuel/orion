import { Request, Response } from "express";

import { Context } from "../../services/Context";
import { MovieUseCase } from "../../models/Movie/MovieUseCase";
import { ListMoviesRequestSchema } from "./schema";

export class ListMoviesController {
  static async handler(req: Request, res: Response): Promise<Response> {
    try {
      const { pagination } = ListMoviesRequestSchema.parse(req.body);

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

      const result = await MovieUseCase.listWithRating(
        pagination,
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

      return res.status(500).json({ error: "Internal Server Error" });
    }
  }
}
