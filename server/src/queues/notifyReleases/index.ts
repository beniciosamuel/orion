import { Context } from "../../services/Context";
import { MovieUseCase } from "../../models/Movie/MovieUseCase";
import { UserUseCase } from "../../models/User/UserUseCase";

export class NotifyReleasesQueue {
  static async process(data: { releaseId: string }): Promise<void> {
    const context = await Context.initialize();
    const movie = await MovieUseCase.fromId(data.releaseId, context);

    if (!movie) {
      throw new Error("Movie not found");
    }

    const contributors = await MovieUseCase.listContributorsByMovieId(
      movie.id,
      context,
    );

    if (!contributors.length) {
      return;
    }

    await Promise.all(
      contributors.map(({ userId }) =>
        UserUseCase.sendEmailByUserId(
          {
            userId,
            subject: `A movie you contributed to was released: ${movie.title}`,
            html: `<p>Hi!</p><p>The movie <strong>${movie.title}</strong> is now released.</p>`,
            text: `The movie ${movie.title} is now released.`,
          },
          context,
        ),
      ),
    );
  }

  static async handler(data: { releaseId: string }): Promise<void> {
    try {
      await this.process(data);
      console.log(`Notification sent for release ${data.releaseId}`);
    } catch (error) {
      console.error(
        `Failed to send notification for release ${data.releaseId}:`,
        error,
      );
    }
  }
}
