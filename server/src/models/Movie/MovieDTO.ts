import { MovieEntity } from "./MovieEntity";

export interface MovieRecord {
  id: string;
  resume_title: string;
  title: string;
  description: string;
  user_comment: string | null;
  director: string;
  duration: number;
  genres: string;
  language: string;
  age_rating: string;
  budget: string | null;
  revenue: string | null;
  profit: string | null;
  production_company: string | null;
  trailer_url: string | null;
  release_date: Date;
  created_at: Date;
  updated_at: Date;
  deleted_at: Date | null;
}

export interface MovieEntityInterface {
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
}

export interface MovieCreateDTO {
  userId: string;
  resumeTitle: string;
  title: string;
  description: string;
  userComment?: string | null;
  director: string;
  duration: number;
  genres: string;
  language: string;
  ageRating: string;
  budget?: string | null;
  revenue?: string | null;
  profit?: string | null;
  productionCompany?: string | null;
  trailerUrl?: string | null;
  releaseDate: Date;
}

export interface MovieUpdateDTO {
  id: string;
  resumeTitle?: string;
  title?: string;
  description?: string;
  userComment?: string | null;
  director?: string;
  duration?: number;
  genres?: string;
  language?: string;
  ageRating?: string;
  budget?: string | null;
  revenue?: string | null;
  profit?: string | null;
  productionCompany?: string | null;
  trailerUrl?: string | null;
  releaseDate?: Date;
}

export interface SearchMovieFilters {
  title?: string;
  genres?: string[];
}

export interface PaginationInput {
  page: number;
  pageSize: number;
}

export interface PaginatedMovieResult {
  data: MovieEntity[];
  total: number;
}

export type CachedMovieEntity = {
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
  releaseDate: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
};

export interface CachedPaginatedMovieResult {
  data: CachedMovieEntity[];
  total: number;
}

export interface MovieContributorResult {
  userId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface AdvancedSearchMovieFilters {
  title?: string;
  genres?: string[];
  releaseDate?: string | Date;
  duration?: number;
}
