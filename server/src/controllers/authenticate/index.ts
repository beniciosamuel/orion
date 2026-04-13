import { Request, Response } from "express";

import { UserUseCase } from "../../models/User/UserUseCase";
import { AuthTokenUseCase } from "../../models/AuthToken/AuthTokenUseCase";
import { AuthenticateRequestSchema } from "./schema";
import { Context } from "../../services/Context";

export class AuthenticateController {
  static async handler(req: Request, res: Response): Promise<Response> {
    try {
      const { email, password } = AuthenticateRequestSchema.parse(req.body);

      const context = req.context ?? (await Context.initialize());

      const user = await UserUseCase.authenticate({ email, password }, context);

      if (!user) {
        throw new Error("User not found");
      }

      const authToken = await AuthTokenUseCase.findByUserId(
        user?.id ?? "",
        context,
      );

      if (authToken.length === 0) {
        await AuthTokenUseCase.create(user.id, context);
      }

      return res.status(200).json({ user, authToken: authToken[0]?.token });
    } catch (error) {
      if (error instanceof Error && error.message.includes("not found")) {
        return res.status(404).json({ error: error.message });
      }
      if (
        error instanceof Error &&
        error.message.includes("Invalid password")
      ) {
        return res.status(401).json({ error: error.message });
      }

      return res.status(500).json({ error: "Internal Server Error" });
    }
  }
}
