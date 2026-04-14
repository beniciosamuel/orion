"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MovieEntity = void 0;
class MovieEntity {
    id;
    resumeTitle;
    title;
    description;
    userComment;
    director;
    duration;
    genres;
    language;
    ageRating;
    budget;
    revenue;
    profit;
    productionCompany;
    trailerUrl;
    releaseDate;
    createdAt;
    updatedAt;
    deletedAt;
    constructor(data) {
        this.id = data.id;
        this.resumeTitle = data.resumeTitle;
        this.title = data.title;
        this.description = data.description;
        this.userComment = data.userComment;
        this.director = data.director;
        this.duration = data.duration;
        this.genres = data.genres;
        this.language = data.language;
        this.ageRating = data.ageRating;
        this.budget = data.budget;
        this.revenue = data.revenue;
        this.profit = data.profit;
        this.productionCompany = data.productionCompany;
        this.trailerUrl = data.trailerUrl;
        this.releaseDate = data.releaseDate;
        this.createdAt = data.createdAt;
        this.updatedAt = data.updatedAt;
        this.deletedAt = data.deletedAt;
    }
    static fromRecord(record) {
        return new MovieEntity({
            id: record.id,
            resumeTitle: record.resume_title,
            title: record.title,
            description: record.description,
            userComment: record.user_comment,
            director: record.director,
            duration: record.duration,
            genres: record.genres,
            language: record.language,
            ageRating: record.age_rating,
            budget: record.budget,
            revenue: record.revenue,
            profit: record.profit,
            productionCompany: record.production_company,
            trailerUrl: record.trailer_url,
            releaseDate: record.release_date,
            createdAt: record.created_at,
            updatedAt: record.updated_at,
            deletedAt: record.deleted_at,
        });
    }
}
exports.MovieEntity = MovieEntity;
