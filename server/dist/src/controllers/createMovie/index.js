"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateMovieController = void 0;
const schema_1 = require("./schema");
const MovieUseCase_1 = require("../../models/Movie/MovieUseCase");
const Context_1 = require("../../services/Context");
class CreateMovieController {
    static async handler(req, res) {
        try {
            const dataRequestParsed = schema_1.CreateMovieRequestSchema.parse(req.body);
            const context = req.context ?? (await Context_1.Context.initialize());
            const authenticatedUser = context.model?.user;
            if (!authenticatedUser) {
                return res.status(401).json({ error: "Unauthorized" });
            }
            if (authenticatedUser.scope !== "editor" &&
                authenticatedUser.scope !== "admin") {
                return res.status(403).json({ error: "Forbidden" });
            }
            const movie = await MovieUseCase_1.MovieUseCase.create({
                ...dataRequestParsed,
                userId: authenticatedUser.id,
                releaseDate: dataRequestParsed.releaseDate,
            }, context);
            res.status(201).json({ movie });
        }
        catch (error) {
            if (error instanceof Error && error.message.includes("already exists")) {
                return res.status(409).json({ error: error.message });
            }
            res.status(500).json({ error: "Internal server error" });
        }
    }
}
exports.CreateMovieController = CreateMovieController;
