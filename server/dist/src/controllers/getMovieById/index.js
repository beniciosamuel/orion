"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetMovieByIdController = void 0;
const Context_1 = require("../../services/Context");
const MovieUseCase_1 = require("../../models/Movie/MovieUseCase");
const schema_1 = require("./schema");
class GetMovieByIdController {
    static async handler(req, res) {
        try {
            const { id } = schema_1.GetMovieByIdRequestSchema.parse(req.body);
            const context = req.context ?? (await Context_1.Context.initialize());
            const authenticatedUser = context.model?.user;
            const movie = await MovieUseCase_1.MovieUseCase.fromIdWithRating(id, authenticatedUser?.id ?? null, context);
            if (!movie) {
                return res.status(404).json({ error: "Movie not found" });
            }
            return res.status(200).json({ movie });
        }
        catch (error) {
            if (error instanceof Error && error.message.includes("not found")) {
                return res.status(404).json({ error: error.message });
            }
            return res.status(500).json({ error: "Internal Server Error" });
        }
    }
}
exports.GetMovieByIdController = GetMovieByIdController;
