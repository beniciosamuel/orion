"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MovieUseCase = void 0;
const MovieRepository_1 = require("./MovieRepository");
const MovieRatingRepository_1 = require("../MovieRating/MovieRatingRepository");
class MovieUseCase {
    static async enrichWithRatings(movies, userId, context) {
        const summaries = await Promise.all(movies.map((movie) => MovieRatingRepository_1.MovieRatingRepository.getSummaryByMovieId(movie.id, userId, context)));
        return movies.map((movie, index) => {
            const summary = summaries[index];
            return {
                ...movie,
                rating: summary?.rating ?? 0,
                movieRating: summary?.rating ?? 0,
                userRating: summary?.userRating ?? null,
                hasUserVoted: summary?.hasUserVoted ?? false,
            };
        });
    }
    static async list(pagination, context) {
        return MovieRepository_1.MovieRepository.list(pagination, context);
    }
    static async fromId(id, context) {
        return MovieRepository_1.MovieRepository.fromId(id, context);
    }
    static async listContributorsByMovieId(movieId, context) {
        return MovieRepository_1.MovieRepository.listContributorsByMovieId(movieId, context);
    }
    static async listReleasedFromDay(day, context) {
        return MovieRepository_1.MovieRepository.listReleasedFromDay(day, context);
    }
    static async fromIdWithRating(id, userId, context) {
        const movie = await MovieRepository_1.MovieRepository.fromId(id, context);
        if (!movie) {
            return null;
        }
        const [enrichedMovie] = await this.enrichWithRatings([movie], userId, context);
        return enrichedMovie ?? null;
    }
    static async create(args, context) {
        const movie = await MovieRepository_1.MovieRepository.create(args, context);
        return movie;
    }
    static async update(id, data, context) {
        return MovieRepository_1.MovieRepository.update(id, data, context);
    }
    static async delete(id, context) {
        return MovieRepository_1.MovieRepository.delete(id, context);
    }
    static async search(filters, context) {
        return MovieRepository_1.MovieRepository.search({
            title: filters.title,
            genres: filters.genres,
        }, filters.pagination, context);
    }
    static async listWithRating(pagination, userId, context) {
        const result = await MovieRepository_1.MovieRepository.list(pagination, context);
        return {
            data: await this.enrichWithRatings(result.data, userId, context),
            total: result.total,
        };
    }
    static async searchWithRating(filters, userId, context) {
        const result = await this.search(filters, context);
        return {
            data: await this.enrichWithRatings(result.data, userId, context),
            total: result.total,
        };
    }
}
exports.MovieUseCase = MovieUseCase;
