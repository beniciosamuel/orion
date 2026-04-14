import { Request, Response } from "express";

import { UserUseCase } from "../../models/User/UserUseCase";
import { UserRepository } from "../../models/User/UserRepository";
import { Context } from "../../services/Context";
import { createUserCodeSchema } from "./schema";
import { MessageBroker } from "../../services/MessageBroker";

export class CreateUserCodeController {
  static async handler(req: Request, res: Response) {
    try {
      const { userId, email } = createUserCodeSchema.parse(req.body);

      const context = req.context ?? (await Context.initialize());

      let targetUserId = userId;

      if (!targetUserId && email) {
        const user = await UserRepository.fromEmail(email, context);

        if (!user) {
          return res.status(404).json({ error: "User not found" });
        }

        targetUserId = user.id;
      }

      if (!targetUserId) {
        return res.status(400).json({ error: "User ID is required" });
      }

      const code = await UserUseCase.createUserCode(targetUserId, context);

      await MessageBroker.publish("createUserCode", {
        userId: targetUserId,
        code,
      });

      return res.status(201).json({
        message: "Verification code sent",
        userId: targetUserId,
      });
    } catch (error) {
      console.error("Error creating user code:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  }
}
