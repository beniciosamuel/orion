import { useEffect, useMemo } from "react";

import { useMoviesListStore } from "../store/moviesListStore";

export const useMoviesList = () => {
  const movies = useMoviesListStore((state) => state.movies);
  const currentPage = useMoviesListStore((state) => state.currentPage);
  const totalPages = useMoviesListStore((state) => state.totalPages);
  const moviesPerPage = useMoviesListStore((state) => state.moviesPerPage);
  const totalMovies = useMoviesListStore((state) => state.totalMovies);
  const searchTerm = useMoviesListStore((state) => state.searchTerm);
  const selectedGenres = useMoviesListStore((state) => state.selectedGenres);
  const releaseDate = useMoviesListStore((state) => state.releaseDate);
  const duration = useMoviesListStore((state) => state.duration);
  const isLoading = useMoviesListStore((state) => state.isLoading);
  const error = useMoviesListStore((state) => state.error);
  const setCurrentPage = useMoviesListStore((state) => state.setCurrentPage);
  const setSearchTerm = useMoviesListStore((state) => state.setSearchTerm);
  const setSelectedGenres = useMoviesListStore(
    (state) => state.setSelectedGenres,
  );
  const setRelease = useMoviesListStore((state) => state.setRelease);
  const setDuration = useMoviesListStore((state) => state.setDuration);
  const fetchMovies = useMoviesListStore((state) => state.fetchMovies);

  useEffect(() => {
    void fetchMovies();
  }, [
    fetchMovies,
    currentPage,
    searchTerm,
    selectedGenres,
    releaseDate,
    duration,
  ]);

  const pageNumbers = useMemo(
    () => Array.from({ length: totalPages }, (_, index) => index + 1),
    [totalPages],
  );

  return {
    movies,
    currentPage,
    totalPages,
    moviesPerPage,
    totalMovies,
    searchTerm,
    selectedGenres,
    releaseDate,
    duration,
    isLoading,
    error,
    pageNumbers,
    setCurrentPage,
    setSearchTerm,
    setSelectedGenres,
    setRelease,
    setDuration,
    fetchMovies,
  };
};
