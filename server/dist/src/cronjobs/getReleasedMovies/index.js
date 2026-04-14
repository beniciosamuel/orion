"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetReleasedMoviesCronJob = void 0;
const MovieUseCase_1 = require("../../models/Movie/MovieUseCase");
const Context_1 = require("../../services/Context");
const MessageBroker_1 = require("../../services/MessageBroker");
class GetReleasedMoviesCronJob {
    static async execute() {
        try {
            const context = await Context_1.Context.initialize();
            const now = new Date();
            const releasedMovies = await MovieUseCase_1.MovieUseCase.listReleasedFromDay(now, context);
            if (!releasedMovies.length) {
                console.info("No movies released today.");
                return;
            }
            await Promise.all(releasedMovies.map((movie) => MessageBroker_1.MessageBroker.publish("notifyReleases", {
                releaseId: movie.id,
            })));
            console.info(`Queued ${releasedMovies.length} released movie(s) for notification.`);
        }
        catch (error) {
            console.error("Error in GetReleasedMoviesCronJob:", error);
        }
    }
}
exports.GetReleasedMoviesCronJob = GetReleasedMoviesCronJob;
