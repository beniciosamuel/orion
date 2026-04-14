import { MovieUseCase } from "../../models/Movie/MovieUseCase";
import { Context } from "../../services/Context";
import { MessageBroker } from "../../services/MessageBroker";

export class GetReleasedMoviesCronJob {
  static async execute(): Promise<void> {
    try {
      const context = await Context.initialize();
      const now = new Date();
      const releasedMovies = await MovieUseCase.listReleasedFromDay(
        now,
        context,
      );

      console.log(`Found ${releasedMovies.length} movie(s) released today.`);
      if (!releasedMovies.length) {
        console.info("No movies released today.");
        return;
      }

      if (!releasedMovies.length) {
        console.info("No movies released today.");
        return;
      }

      await Promise.all(
        releasedMovies.map((movie) =>
          MessageBroker.publish("notifyReleases", {
            releaseId: movie.id,
          }),
        ),
      );

      console.info(
        `Queued ${releasedMovies.length} released movie(s) for notification.`,
      );
    } catch (error) {
      console.error("Error in GetReleasedMoviesCronJob:", error);
    }
  }
}
