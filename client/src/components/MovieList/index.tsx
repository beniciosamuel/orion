import { Link } from "react-router-dom";
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
};

export const MovieList: React.FC<MovieListProps> = ({
  movies = movieListMock,
}) => {
  return (
    <div className={styles.listWrapper}>
      <section className={styles.listSection}>
        <div className={styles.listGrid}>
          {movies.map((movie) => (
            <Link
              key={movie.id}
              to={`/movies/${movie.id}`}
              className={styles.movieLink}
            >
              <MovieCard
                className={styles.movieCard}
                title={movie.title}
                categories={movie.categories}
                votePercentile={movie.votePercentile}
                posterUrl={movie.posterUrl}
              />
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
};
