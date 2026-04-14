import { Request, Response } from "express";
import { UserUseCase } from "../../models/User/UserUseCase";
import { Context } from "../../services/Context";
import { updateUserPasswordSchema } from "./schema";

export class UpdateUserPasswordController {
  static async handler(req: Request, res: Response): Promise<Response> {
    try {
      const { userId, code, newPassword } = updateUserPasswordSchema.parse(
        req.body,
      );

      const context = req.context ?? (await Context.initialize());

      const isCodeValid = await UserUseCase.verifyUserCode(
        userId,
        code,
        context,
      );

      if (!isCodeValid) {
        return res.status(401).json({ error: "Invalid or expired code" });
      }

      const result = await UserUseCase.update(
        userId,
        {
          password: newPassword,
        },
        context,
      );

      return res
        .status(200)
        .json({ message: "Password updated successfully", result });
    } catch (error) {
      return res.status(500).json({
        error: "Internal server error",
        cause: error instanceof Error ? error.message : String(error),
      });
    }
  }
}
