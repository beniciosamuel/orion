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
