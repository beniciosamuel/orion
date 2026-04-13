import { MovieEntityInterface, MovieRecord } from "./MovieDTO";

export class MovieEntity implements MovieEntityInterface {
  id: string;
  resumeTitle: string;
  title: string;
  description: string;
  userComment: string | null;
  director: string;
  duration: number;
  genres: string;
  language: string;
  ageRating: string;
  budget: string | null;
  revenue: string | null;
  profit: string | null;
  productionCompany: string | null;
  trailerUrl: string | null;
  releaseDate: Date;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;

  constructor(data: MovieEntityInterface) {
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

  static fromRecord(record: MovieRecord): MovieEntity {
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
