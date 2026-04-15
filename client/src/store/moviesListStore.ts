import { create } from "zustand";
import type { SetStateAction } from "react";

import type { MovieListItem } from "../components/MovieList";
import { MoviesService } from "../services/MoviesService";

interface MoviesListStoreState {
  movies: MovieListItem[];
  currentPage: number;
  totalPages: number;
  totalMovies: number;
  moviesPerPage: number;
  searchTerm: string;
  selectedGenres: string[];
  releaseDate?: string;
  duration?: number;
  isLoading: boolean;
  error: string | null;
  setCurrentPage: (page: SetStateAction<number>) => void;
  setSearchTerm: (value: string) => void;
  setSelectedGenres: (genres: string[]) => void;
  setRelease: (releaseDate: string) => void;
  setDuration: (duration: number | undefined) => void;
  fetchMovies: () => Promise<void>;
}

const normalizeGenres = (genres: string): string[] => {
  return genres
    .split(",")
    .map((genre) => genre.trim())
    .filter(Boolean);
};

const mapGenreToServerGenre = (genre: string): string => {
  const normalizedGenre = genre.toLowerCase();

  const genreMap: Record<string, string> = {
    acao: "Action",
    "a\u00e7\u00e3o": "Action",
    comedia: "Comedy",
    "com\u00e9dia": "Comedy",
    drama: "Drama",
    "ficcao cientifica": "Sci-Fi",
    "fic\u00e7\u00e3o cient\u00edfica": "Sci-Fi",
    animacao: "Animation",
    "anima\u00e7\u00e3o": "Animation",
    suspense: "Thriller",
  };

  return genreMap[normalizedGenre] ?? genre;
};

const ratingToPercentile = (rating: number | null | undefined): number => {
  const safeRating = rating ?? 0;

  return Math.round((Math.min(5, Math.max(0, safeRating)) / 5) * 100);
};

export const useMoviesListStore = create<MoviesListStoreState>((set, get) => ({
  movies: [],
  currentPage: 1,
  totalPages: 1,
  totalMovies: 0,
  moviesPerPage: 10,
  searchTerm: "",
  selectedGenres: [],
  isLoading: false,
  error: null,
  setCurrentPage: (page) => {
    set((state) => ({
      currentPage: typeof page === "function" ? page(state.currentPage) : page,
    }));
  },
  setSearchTerm: (value) => {
    set({
      searchTerm: value,
      currentPage: 1,
    });
  },
  setSelectedGenres: (genres) => {
    set({
      selectedGenres: genres,
      currentPage: 1,
    });
  },
  setRelease: (releaseDate) => {
    set({
      releaseDate,
    });
  },
  setDuration: (duration) => {
    set({
      duration,
    });
  },
  fetchMovies: async () => {
    const {
      currentPage,
      moviesPerPage,
      searchTerm,
      selectedGenres,
      releaseDate,
      duration,
    } = get();

    set({ isLoading: true, error: null });

    try {
      const normalizedTerm = searchTerm.trim();
      const mappedGenres = selectedGenres.map(mapGenreToServerGenre);

      const hasGenresFilter = mappedGenres.length > 0;
      const hasReleaseDateFilter = !!releaseDate;
      const hasDurationFilter =
        duration !== undefined && duration !== null && duration !== 0;
      const shouldUseSearch =
        normalizedTerm ||
        hasGenresFilter ||
        hasReleaseDateFilter ||
        hasDurationFilter;

      console.log("Fetching movies with filters:", {
        page: currentPage,
        pageSize: moviesPerPage,
        title: normalizedTerm,
        genres: mappedGenres,
        releaseDate,
        duration,
      });

      const response = shouldUseSearch
        ? await MoviesService.searchMovies({
            page: currentPage,
            pageSize: moviesPerPage,
            ...(normalizedTerm ? { title: normalizedTerm } : {}),
            ...(hasGenresFilter ? { genres: mappedGenres } : {}),
            ...(hasReleaseDateFilter ? { releaseDate } : {}),
            ...(hasDurationFilter ? { duration } : {}),
          })
        : await MoviesService.listMovies({
            page: currentPage,
            pageSize: moviesPerPage,
          });

      const mappedMovies: MovieListItem[] = response.data.map((movie) => ({
        id: movie.id,
        title: movie.title,
        categories: normalizeGenres(movie.genres),
        votePercentile: ratingToPercentile(movie.movieRating ?? movie.rating),
        posterUrl: movie.images?.posterUri ?? undefined,
        url: "",
      }));

      set({
        movies: mappedMovies,
        totalPages: Math.max(1, response.pagination.totalPages),
        totalMovies: response.pagination.total,
        isLoading: false,
      });
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Failed to load movies. Please try again.";

      set({
        isLoading: false,
        error: message,
      });
    }
  },
}));
