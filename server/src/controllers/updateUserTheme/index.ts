import { Request, Response } from "express";

import { Context } from "../../services/Context";
import { UserUseCase } from "../../models/User/UserUseCase";
import { UpdateUserThemeRequestSchema } from "./schema";

export class UpdateUserThemeController {
  static async handler(req: Request, res: Response): Promise<Response> {
    try {
      const { theme } = UpdateUserThemeRequestSchema.parse(req.body);

      const context = req.context ?? (await Context.initialize());

      const authenticatedUser = (
        context as Context & {
          models?: {
            user?: {
              id: string;
            };
          };
        }
      ).models?.user;

      if (!authenticatedUser) {
        return res.status(401).json({ error: "Unauthorized" });
      }

      const wasUpdated = await UserUseCase.updateTheme(
        {
          userId: authenticatedUser.id,
          theme,
        },
        context,
      );

      if (!wasUpdated) {
        return res.status(404).json({ error: "User settings not found" });
      }

      return res.status(200).json({
        status: 200,
        data: {
          userId: authenticatedUser.id,
          theme,
        },
      });
    } catch (error) {
      const cause = error instanceof Error ? error.message : "Unknown error";

      if (error instanceof Error && error.name === "ZodError") {
        return res
          .status(400)
          .json({ error: "Invalid request payload", cause });
      }

      if (
        error instanceof Error &&
        error.message.includes("User settings not found")
      ) {
        return res.status(404).json({ error: error.message, cause });
      }

      return res.status(500).json({ error: "Internal Server Error", cause });
    }
  }
}
