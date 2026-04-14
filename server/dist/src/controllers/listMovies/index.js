"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ListMoviesController = void 0;
const Context_1 = require("../../services/Context");
const MovieUseCase_1 = require("../../models/Movie/MovieUseCase");
const schema_1 = require("./schema");
class ListMoviesController {
    static async handler(req, res) {
        try {
            const { pagination } = schema_1.ListMoviesRequestSchema.parse(req.body);
            const context = req.context ?? (await Context_1.Context.initialize());
            const authenticatedUser = context.model?.user;
            const result = await MovieUseCase_1.MovieUseCase.listWithRating(pagination, authenticatedUser?.id ?? null, context);
            const totalPages = Math.ceil(result.total / pagination.pageSize);
            return res.status(200).json({
                status: 200,
                data: result.data,
                pagination: {
                    total: result.total,
                    page: pagination.page,
                    pageSize: pagination.pageSize,
                    totalPages,
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
exports.ListMoviesController = ListMoviesController;
