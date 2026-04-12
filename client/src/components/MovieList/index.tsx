import { useEffect, useMemo, useState } from "react";
import { ChevronLeftIcon, ChevronRightIcon } from "../Icons";
import { MovieCard } from "../MovieCard";
import styles from "./MovieList.module.css";
import { movieListMock } from "./movieListMock";

export type MovieListItem = {
  id: number;
  title: string;
  categories: string[];
  votePercentile: number;
  posterUrl: string;
  url: string;
};

type MovieListProps = {
  movies?: MovieListItem[];
  moviesPerPage?: number;
};

export const MovieList: React.FC<MovieListProps> = ({
  movies = movieListMock,
  moviesPerPage = 10,
}) => {
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = useMemo(
    () => Math.max(1, Math.ceil(movies.length / moviesPerPage)),
    [movies.length, moviesPerPage],
  );

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  const paginatedMovies = useMemo(() => {
    const startIndex = (currentPage - 1) * moviesPerPage;
    return movies.slice(startIndex, startIndex + moviesPerPage);
  }, [currentPage, movies, moviesPerPage]);

  const pageNumbers = useMemo(
    () => Array.from({ length: totalPages }, (_, index) => index + 1),
    [totalPages],
  );

  return (
    <div className={styles.listWrapper}>
      <section className={styles.listSection}>
        <div className={styles.listGrid}>
          {paginatedMovies.map((movie) => (
            <a
              key={movie.id}
              href={movie.url}
              target="_blank"
              rel="noreferrer"
              className={styles.movieLink}
            >
              <MovieCard
                className={styles.movieCard}
                title={movie.title}
                categories={movie.categories}
                votePercentile={movie.votePercentile}
                posterUrl={movie.posterUrl}
              />
            </a>
          ))}
        </div>

        <footer className={styles.pagination}>
          <button
            className={styles.paginationButton}
            aria-label="Previous page"
            onClick={() => setCurrentPage((page) => Math.max(1, page - 1))}
            disabled={currentPage === 1}
          >
            <ChevronLeftIcon />
          </button>

          {pageNumbers.map((pageNumber) => (
            <button
              key={pageNumber}
              className={styles.paginationButton}
              aria-label={`Page ${pageNumber}`}
              aria-current={currentPage === pageNumber ? "page" : undefined}
              data-active={currentPage === pageNumber}
              onClick={() => setCurrentPage(pageNumber)}
            >
              {pageNumber}
            </button>
          ))}

          <button
            className={styles.paginationButton}
            aria-label="Next page"
            onClick={() =>
              setCurrentPage((page) => Math.min(totalPages, page + 1))
            }
            disabled={currentPage === totalPages}
          >
            <ChevronRightIcon />
          </button>
        </footer>
      </section>
    </div>
  );
};
