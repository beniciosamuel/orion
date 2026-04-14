"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SetMovieVoteController = void 0;
const Context_1 = require("../../services/Context");
const MovieUseCase_1 = require("../../models/Movie/MovieUseCase");
const MovieRatingUseCase_1 = require("../../models/MovieRating/MovieRatingUseCase");
const schema_1 = require("./schema");
class SetMovieVoteController {
    static async handler(req, res) {
        try {
            const { movieId, rating } = schema_1.SetMovieVoteRequestSchema.parse(req.body);
            const context = req.context ?? (await Context_1.Context.initialize());
            const authenticatedUser = context.model?.user;
            if (!authenticatedUser) {
                return res.status(401).json({ error: "Unauthorized" });
            }
            const userExists = await context
                .database("user")
                .where("id", authenticatedUser.id)
                .whereNull("deleted_at")
                .first();
            if (!userExists) {
                return res.status(404).json({ error: "User not found" });
            }
            const movie = await MovieUseCase_1.MovieUseCase.fromId(movieId, context);
            if (!movie) {
                return res.status(404).json({ error: "Movie not found" });
            }
            await MovieRatingUseCase_1.MovieRatingUseCase.setVote({
                movieId,
                userId: authenticatedUser.id,
                rating,
            }, context);
            return res.status(201).json({
                status: 201,
                data: {
                    movieId,
                    userId: authenticatedUser.id,
                    rating,
                },
            });
        }
        catch (error) {
            if (error instanceof Error && error.name === "ZodError") {
                return res.status(400).json({ error: "Invalid request payload" });
            }
            return res.status(500).json({ error: "Internal Server Error" });
        }
    }
}
exports.SetMovieVoteController = SetMovieVoteController;
