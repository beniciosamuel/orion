import { ApiService } from "./Api";

export interface MoviesPaginationRequest {
  page: number;
  pageSize: number;
}

export interface CreateMoviePayload {
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
  releaseDate: string;
}

export interface CreateMovieResponse {
  movie: {
    id: string;
  };
}

export interface UploadMovieFilesPayload {
  movieId: string;
  poster: File;
  backdrop: File;
}

export interface UploadMovieFilesResponse {
  message: string;
}

interface MoviesListApiResponseItem {
  id: string;
  title: string;
  genres: string;
  movieRating?: number;
  rating?: number;
  images?: {
    posterUri: string | null;
    backdropUri: string | null;
  };
}

interface MoviesApiResponse {
  status: number;
  data: MoviesListApiResponseItem[];
  pagination: {
    total: number;
    page: number;
    pageSize: number;
    totalPages: number;
  };
}

const apiService = new ApiService();

export class MoviesService {
  static async createMovie(payload: CreateMoviePayload) {
    return apiService.post<CreateMovieResponse, CreateMoviePayload>(
      "/createMovie",
      payload,
    );
  }

  static async uploadFiles(payload: UploadMovieFilesPayload) {
    const formData = new FormData();

    formData.append("movieId", payload.movieId);
    formData.append("poster[originalName]", payload.poster.name);
    formData.append("poster[fileName]", payload.poster.name);
    formData.append("backdrop[originalName]", payload.backdrop.name);
    formData.append("backdrop[fileName]", payload.backdrop.name);
    formData.append("posterOriginalName", payload.poster.name);
    formData.append("posterFileName", payload.poster.name);
    formData.append("backdropOriginalName", payload.backdrop.name);
    formData.append("backdropFileName", payload.backdrop.name);
    formData.append("poster", payload.poster);
    formData.append("backdrop", payload.backdrop);

    return apiService.postFormData<UploadMovieFilesResponse>(
      "/uploadFiles",
      formData,
    );
  }

  static async listMovies(pagination: MoviesPaginationRequest) {
    return apiService.get<MoviesApiResponse, MoviesPaginationRequest>(
      "/movies/list",
      pagination,
    );
  }

  static async searchMovies(args: {
    page: number;
    pageSize: number;
    title?: string;
    genres?: string[];
  }) {
    const params = {
      page: args.page,
      pageSize: args.pageSize,
      ...(args.title ? { title: args.title } : {}),
      ...(args.genres && args.genres.length > 0
        ? { genres: args.genres.join(",") }
        : {}),
    };

    return apiService.get<
      MoviesApiResponse,
      {
        page: number;
        pageSize: number;
        title?: string;
        genres?: string;
      }
    >("/movies/search", params);
  }
}
