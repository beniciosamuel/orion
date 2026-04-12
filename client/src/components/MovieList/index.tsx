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
      </section>
    </div>
  );
};
