"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MovieRatingUseCase = void 0;
const MovieRatingRepository_1 = require("./MovieRatingRepository");
class MovieRatingUseCase {
    static async setVote(args, context) {
        await MovieRatingRepository_1.MovieRatingRepository.setVote(args, context);
    }
}
exports.MovieRatingUseCase = MovieRatingUseCase;
