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

export interface UpdateMoviePayload extends CreateMoviePayload {
  id: string;
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

export interface DeleteMoviePayload {
  id: string;
}

export interface DeleteMovieResponse {
  message: string;
}

export interface SetMovieVotePayload {
  movieId: string;
  rating: number;
}

export interface SetMovieVoteResponse {
  status: number;
  data: {
    movieId: string;
    userId: string;
    rating: number;
  };
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

export interface MovieDetailsResponseItem {
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
  budget: number | null;
  revenue: number | null;
  profit: number | null;
  productionCompany: string | null;
  trailerUrl: string | null;
  releaseDate: string;
  createdAt: string;
  updatedAt: string;
  rating: number;
  movieRating: number;
  userRating: number | null;
  hasUserVoted: boolean;
  isContributor?: boolean;
  images: {
    posterUri: string | null;
    backdropUri: string | null;
  };
}

interface MovieByIdApiResponse {
  movie: MovieDetailsResponseItem;
}

interface UpdateMovieApiResponse {
  movie: MovieDetailsResponseItem;
}

const apiService = new ApiService();

export class MoviesService {
  static async createMovie(payload: CreateMoviePayload) {
    return apiService.post<CreateMovieResponse, CreateMoviePayload>(
      "/createMovie",
      payload,
    );
  }

  static async updateMovie(payload: UpdateMoviePayload) {
    return apiService.post<UpdateMovieApiResponse, UpdateMoviePayload>(
      "/movies/updateMovie",
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

  static async getMovieById(id: string) {
    return apiService.get<MovieByIdApiResponse, { id: string }>(
      "/movies/getById",
      { id },
    );
  }

  static async deleteMovie(payload: DeleteMoviePayload) {
    return apiService.post<DeleteMovieResponse, DeleteMoviePayload>(
      "/movies/deleteMovie",
      payload,
    );
  }

  static async setMovieVote(payload: SetMovieVotePayload) {
    return apiService.post<SetMovieVoteResponse, SetMovieVotePayload>(
      "/movies/setMovieVote",
      payload,
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
