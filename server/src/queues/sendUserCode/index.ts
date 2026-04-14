import { Context } from "../../services/Context";
import { UserUseCase } from "../../models/User/UserUseCase";

export class SendUserCodeQueue {
  static async send(userId: string, code: string) {
    const subject = "Your Verification Code";
    const html = `<p>Your verification code is: <strong>${code}</strong></p>`;
    const text = `Your verification code is: ${code}`;

    const context = await Context.initialize();

    await UserUseCase.sendEmailByUserId(
      {
        userId,
        subject,
        html,
        text,
      },
      context,
    );
  }

  static async handler(data: { userId: string; code: string }) {
    const { userId, code } = data;

    try {
      await this.send(userId, code);
      console.log(`Verification code sent to user ${userId}`);
    } catch (error) {
      console.error(
        `Failed to send verification code to user ${userId}:`,
        error,
      );
    }
  }
}
