import { Request, Response } from "express";

import { CreateUserRequestSchema } from "./schema";
import { UserUseCase } from "../../models/User/UserUseCase";
import { AuthTokenUseCase } from "../../models/AuthToken/AuthTokenUseCase";
import { Context } from "../../services/Context";

export class CreateUserController {
  static async handler(req: Request, res: Response) {
    try {
      const { fullName, email, password, scope } =
        CreateUserRequestSchema.parse(req.body);

      const context = req.context ?? (await Context.initialize());

      const user = await UserUseCase.create(
        { fullName, email, password, scope },
        context,
      );

      const token = await AuthTokenUseCase.create(user.id, context);

      return res.status(201).json({ user, token: token.token });
    } catch (error) {
      const cause = error instanceof Error ? error.message : "Unknown error";

      if (error instanceof Error && error.message.includes("already exists")) {
        return res.status(409).json({ error: error.message, cause });
      }

      return res.status(500).json({ error: "Internal Server Error", cause });
    }
  }
}
