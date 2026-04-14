"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MovieRepository = void 0;
const MovieEntity_1 = require("./MovieEntity");
class MovieRepository {
    static async listReleasedFromDay(day, context) {
        const targetDate = day.toISOString().split("T")[0];
        const results = await context
            .database("movie")
            .whereRaw("release_date::date = ?", [targetDate])
            .whereNull("deleted_at")
            .orderBy("release_date", "asc")
            .orderBy("created_at", "asc");
        return results.map((result) => MovieEntity_1.MovieEntity.fromRecord(result));
    }
    static async listContributorsByMovieId(movieId, context) {
        const results = await context
            .database("movie_contributors")
            .where({ movie_id: movieId })
            .select("user_id", "created_at", "updated_at");
        return results.map((result) => ({
            userId: result.user_id,
            createdAt: result.created_at,
            updatedAt: result.updated_at,
        }));
    }
    static async fromId(id, context) {
        const result = await context
            .database("movie")
            .where({ id })
            .whereNull("deleted_at")
            .first();
        if (!result) {
            return null;
        }
        return MovieEntity_1.MovieEntity.fromRecord(result);
    }
    static async fromTitle(title, context) {
        const results = await context
            .database("movie")
            .where("title", "like", `%${title}%`)
            .whereNull("deleted_at");
        return results.map((result) => MovieEntity_1.MovieEntity.fromRecord(result));
    }
    static async search(filters, pagination, context) {
        const query = context.database("movie").whereNull("deleted_at");
        if (filters.title) {
            query.where("title", "ilike", `%${filters.title}%`);
        }
        if (filters.genres?.length) {
            query.andWhere((builder) => {
                filters.genres?.forEach((genre, index) => {
                    if (index === 0) {
                        builder.where("genres", "ilike", `%${genre}%`);
                        return;
                    }
                    builder.orWhere("genres", "ilike", `%${genre}%`);
                });
            });
        }
        const countResult = await query
            .clone()
            .clearSelect()
            .clearOrder()
            .count("id as count")
            .first();
        const offset = (pagination.page - 1) * pagination.pageSize;
        const results = await query
            .clone()
            .orderBy("created_at", "desc")
            .offset(offset)
            .limit(pagination.pageSize);
        return {
            data: results.map((result) => MovieEntity_1.MovieEntity.fromRecord(result)),
            total: Number(countResult?.count ?? 0),
        };
    }
    static async list(pagination, context) {
        const baseQuery = context.database("movie").whereNull("deleted_at");
        const countResult = await baseQuery
            .clone()
            .clearSelect()
            .clearOrder()
            .count("id as count")
            .first();
        const offset = (pagination.page - 1) * pagination.pageSize;
        const results = await baseQuery
            .clone()
            .orderBy("created_at", "desc")
            .offset(offset)
            .limit(pagination.pageSize);
        return {
            data: results.map((result) => MovieEntity_1.MovieEntity.fromRecord(result)),
            total: Number(countResult?.count ?? 0),
        };
    }
    static async create(args, context) {
        const result = await context.database.transaction(async (trx) => {
            const [createdMovie] = await trx("movie")
                .insert({
                resume_title: args.resumeTitle,
                title: args.title,
                description: args.description,
                user_comment: args.userComment,
                director: args.director,
                duration: args.duration,
                genres: args.genres,
                language: args.language,
                age_rating: args.ageRating,
                budget: args.budget,
                revenue: args.revenue,
                profit: args.profit,
                production_company: args.productionCompany,
                trailer_url: args.trailerUrl,
                release_date: args.releaseDate,
            })
                .returning("*");
            await trx("movie_contributors").insert({
                movie_id: createdMovie.id,
                user_id: args.userId,
            });
            return createdMovie;
        });
        return MovieEntity_1.MovieEntity.fromRecord(result);
    }
    static async update(id, data, context) {
        const updated = await context
            .database("movie")
            .where("id", id)
            .whereNull("deleted_at")
            .update({
            resume_title: data.resumeTitle,
            title: data.title,
            description: data.description,
            user_comment: data.userComment,
            director: data.director,
            duration: data.duration,
            genres: data.genres,
            language: data.language,
            age_rating: data.ageRating,
            budget: data.budget,
            revenue: data.revenue,
            profit: data.profit,
            production_company: data.productionCompany,
            trailer_url: data.trailerUrl,
            release_date: data.releaseDate,
            updated_at: new Date().toISOString(),
        });
        return updated > 0;
    }
    static async delete(id, context) {
        const deleted = await context
            .database("movie")
            .where("id", id)
            .whereNull("deleted_at")
            .update({ deleted_at: new Date().toISOString() });
        return deleted > 0;
    }
}
exports.MovieRepository = MovieRepository;
