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
  "https://storage.cloud.google.com/orion-cubos-movies-bucket/fallback-image.webp";

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
        <span className={styles.voteValue}>
          <span className={styles.voteNumber}>{safeVotePercentile}</span>
          <span className={styles.votePercent}>%</span>
        </span>
      </div>
      <p className={styles.categories}>{categoriesLabel}</p>
      <p className={styles.title}>{title}</p>
      <img className={styles.poster} src={posterUrl} alt="Movie poster" />
    </article>
  );
};
