import { Request, Response } from "express";

import { CreateUserRequestSchema } from "./schema";
import { UserUseCase } from "../../models/User/UserUseCase";
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

      return res.status(201).json({ user });
    } catch (error) {
      if (error instanceof Error && error.message.includes("already exists")) {
        return res.status(409).json({ error: error.message });
      }

      return res.status(500).json({ error: "Internal Server Error" });
    }
  }
}
