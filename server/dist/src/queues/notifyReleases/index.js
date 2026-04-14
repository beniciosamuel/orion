"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotifyReleasesQueue = void 0;
const Context_1 = require("../../services/Context");
const MessageBroker_1 = require("../../services/MessageBroker");
const MovieUseCase_1 = require("../../models/Movie/MovieUseCase");
const UserUseCase_1 = require("../../models/User/UserUseCase");
class NotifyReleasesQueue {
    static async process(data) {
        const context = await Context_1.Context.initialize();
        const movie = await MovieUseCase_1.MovieUseCase.fromId(data.releaseId, context);
        if (!movie) {
            throw new Error("Movie not found");
        }
        const contributors = await MovieUseCase_1.MovieUseCase.listContributorsByMovieId(movie.id, context);
        if (!contributors.length) {
            return;
        }
        await Promise.all(contributors.map(({ userId }) => UserUseCase_1.UserUseCase.sendEmailByUserId({
            userId,
            subject: `A movie you contributed to was released: ${movie.title}`,
            html: `<p>Hi!</p><p>The movie <strong>${movie.title}</strong> is now released.</p>`,
            text: `The movie ${movie.title} is now released.`,
        }, context)));
    }
    static async handler(subscriptionName = "notifyReleases") {
        try {
            MessageBroker_1.MessageBroker.subscribe(subscriptionName, this.process);
            console.info(`NotifyReleasesQueue subscribed to ${subscriptionName}.`);
        }
        catch (error) {
            console.error("Error in NotifyReleasesQueue:", error);
        }
    }
}
exports.NotifyReleasesQueue = NotifyReleasesQueue;
