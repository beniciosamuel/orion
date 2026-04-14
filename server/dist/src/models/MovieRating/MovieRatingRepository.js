"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MovieRatingRepository = void 0;
class MovieRatingRepository {
    static async setVote(args, context) {
        await context
            .database("movie_rating")
            .insert({
            movie_id: args.movieId,
            user_id: args.userId,
            rating: args.rating,
        })
            .onConflict(["movie_id", "user_id"])
            .merge({ rating: args.rating });
    }
    static async getSummaryByMovieId(movieId, userId, context) {
        const [ratingRow] = await context
            .database("movie_rating")
            .where({ movie_id: movieId })
            .select(context.database.raw("ROUND(AVG(rating)::numeric, 2) as rating"));
        const userVoteRow = userId
            ? await context
                .database("movie_rating")
                .select("rating")
                .where({ movie_id: movieId, user_id: userId })
                .first()
            : null;
        const userRating = userVoteRow?.rating ?? null;
        return {
            movieId,
            rating: Number(ratingRow?.rating) || 0,
            userRating,
            hasUserVoted: userRating !== null,
        };
    }
}
exports.MovieRatingRepository = MovieRatingRepository;
