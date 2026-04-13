import { Context } from "../../services/Context";
import { MessageBroker } from "../../services/MessageBroker";
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

  static async handler(subscriptionName = "notifyReleases"): Promise<void> {
    try {
      MessageBroker.subscribe(subscriptionName, this.process);
      console.info(`NotifyReleasesQueue subscribed to ${subscriptionName}.`);
    } catch (error) {
      console.error("Error in NotifyReleasesQueue:", error);
    }
  }
}
