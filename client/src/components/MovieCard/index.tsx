import type { CSSProperties } from "react";
import styles from "./MovieCard.module.css";

export type MovieCardProps = {
  title?: string;
  posterUrl?: string;
  categories?: string[];
  votePercentile?: number;
  className?: string;
};

const DEFAULT_POSTER_URL =
  "https://img.elo7.com.br/product/zoom/2692B33/big-poster-filme-bumblebee-lo01-tamanho-90x60-cm-presente-nerd.jpg?_gl=1*124bd3z*_gcl_au*OTE4NzkxMzY2LjE3NzU5NTk2OTM.*_ga*MTU2NDQ5NjAwMC4xNzc1OTU5Njk1*_ga_22YVRK2WCW*czE3NzU5NTk2OTQkbzEkZzAkdDE3NzU5NTk2OTQkajYwJGwwJGg2ODM0NTE5MzA.";

export const MovieCard: React.FC<MovieCardProps> = ({
  title = "Bumblebee",
  posterUrl = DEFAULT_POSTER_URL,
  categories = ["Ação", "Aventura", "Ficção Científica"],
  votePercentile = 86,
  className,
}) => {
  const categoriesLabel = categories.join(", ");
  const safeVotePercentile = Math.min(
    100,
    Math.max(0, Math.round(votePercentile)),
  );
  const voteCircleStyle = {
    "--vote-percent": safeVotePercentile,
  } as CSSProperties;

  return (
    <article className={[styles.card, className].filter(Boolean).join(" ")}>
      <div
        className={styles.voteCircle}
        aria-label={`User vote percentile: ${safeVotePercentile}%`}
        style={voteCircleStyle}
      >
        <span className={styles.voteValue}>{safeVotePercentile}%</span>
      </div>
      <p className={styles.categories}>{categoriesLabel}</p>
      <p className={styles.title}>{title}</p>
      <img className={styles.poster} src={posterUrl} alt="Movie poster" />
    </article>
  );
};
