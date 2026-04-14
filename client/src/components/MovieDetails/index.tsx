import { useEffect, useState, type CSSProperties } from "react";
import { useTranslation } from "react-i18next";

import { Button } from "../Button";
import { MovieCard } from "../MovieCard";
import {
  fetchMovieDetailsById,
  movieDetailsMock,
  type MovieTableRecord,
} from "./movieDetailsMock";
import styles from "./MovieDetails.module.css";

type MovieDetailsInfoItem = {
  label: string;
  value: string;
};

export type MovieDetailsProps = {
  movieId?: string;
  title?: string;
  originalTitle?: string;
  userComment?: string;
  overview?: string;
  categories?: string[];
  posterUrl?: string;
  backdropUrl?: string;
  votePercentile?: number;
  details?: MovieDetailsInfoItem[];
  canEditMovie?: boolean;
  voteButtonLabel?: string;
  onEdit?: () => void;
  onDelete?: () => void;
  onVote?: () => void | Promise<void>;
};

export const MovieDetails: React.FC<MovieDetailsProps> = ({
  movieId,
  title,
  originalTitle,
  userComment,
  overview,
  categories,
  posterUrl,
  backdropUrl,
  votePercentile = 86,
  details,
  canEditMovie = true,
  voteButtonLabel = "Registrar voto",
  onEdit,
  onDelete,
  onVote,
}) => {
  const { t } = useTranslation();
  const [movieData, setMovieData] = useState<MovieTableRecord | null>(
    movieId ? null : movieDetailsMock,
  );
  const [isLoading, setIsLoading] = useState<boolean>(Boolean(movieId));

  useEffect(() => {
    let isMounted = true;

    const loadMovieDetails = async () => {
      if (!movieId) {
        setMovieData(movieDetailsMock);
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      const fetchedMovie = await fetchMovieDetailsById(movieId);

      if (!isMounted) {
        return;
      }

      setMovieData(fetchedMovie);
      setIsLoading(false);
    };

    void loadMovieDetails();

    return () => {
      isMounted = false;
    };
  }, [movieId]);

  if (isLoading) {
    return (
      <section className={styles.wrapper}>
        <p className={styles.sectionContent}>
          {t("auth.movieDetails.loading", {
            defaultValue: "Carregando filme...",
          })}
        </p>
      </section>
    );
  }

  if (!movieData) {
    return (
      <section className={styles.wrapper}>
        <p className={styles.sectionContent}>
          {t("auth.movieDetails.notFound", {
            defaultValue: "Filme nao encontrado.",
          })}
        </p>
      </section>
    );
  }

  const resolvedTitle = title ?? movieData.resume_title;
  const resolvedOriginalTitle = originalTitle ?? movieData.title;
  const resolvedUserComment = userComment ?? movieData.user_comment ?? "";
  const resolvedOverview = overview ?? movieData.description;
  const resolvedCategories =
    categories ?? movieData.genres.split(",").map((genre) => genre.trim());

  const safeVotePercentile = Math.min(
    100,
    Math.max(0, Math.round(votePercentile)),
  );
  const voteCircleStyle = {
    "--vote-percent": safeVotePercentile,
  } as CSSProperties;
  const wrapperStyle = backdropUrl
    ? ({
        "--backdrop-image": `url(${backdropUrl})`,
      } as CSSProperties)
    : undefined;

  const detailsFallback: MovieDetailsInfoItem[] = [
    {
      label: t("auth.movieDetails.details.ratingLabel", {
        defaultValue: "Classificacao indicativa",
      }),
      value:
        movieData.age_rating ||
        t("auth.movieDetails.details.ratingValue", {
          defaultValue: "12 anos",
        }),
    },
    {
      label: t("auth.movieDetails.details.votesLabel", {
        defaultValue: "Votos",
      }),
      value: "100",
    },
    {
      label: t("auth.movieDetails.details.releaseLabel", {
        defaultValue: "Lancamento",
      }),
      value: movieData.release_date,
    },
    {
      label: t("auth.movieDetails.details.durationLabel", {
        defaultValue: "Duracao",
      }),
      value: `${movieData.duration} min`,
    },
    {
      label: t("auth.movieDetails.details.statusLabel", {
        defaultValue: "Situacao",
      }),
      value: t("auth.movieDetails.details.statusValue", {
        defaultValue: "Lancado",
      }),
    },
    {
      label: t("auth.movieDetails.details.languageLabel", {
        defaultValue: "Idioma",
      }),
      value:
        movieData.language ||
        t("auth.movieDetails.details.languageValue", {
          defaultValue: "Portugues",
        }),
    },
    {
      label: t("auth.movieDetails.details.budgetLabel", {
        defaultValue: "Orcamento",
      }),
      value: `$ ${movieData.budget ?? 0}`,
    },
    {
      label: t("auth.movieDetails.details.revenueLabel", {
        defaultValue: "Receita",
      }),
      value: `$ ${movieData.revenue ?? 0}`,
    },
    {
      label: t("auth.movieDetails.details.profitLabel", {
        defaultValue: "Lucro",
      }),
      value: `$ ${movieData.profit ?? 0}`,
    },
  ];
  const movieDetailsItems: MovieDetailsInfoItem[] =
    details && details.length > 0 ? details : detailsFallback;
  const [
    ratingInfo,
    votesInfo,
    releaseInfo,
    durationInfo,
    statusInfo,
    languageInfo,
    budgetInfo,
    revenueInfo,
    profitInfo,
  ] = movieDetailsItems;

  return (
    <section className={styles.wrapper} style={wrapperStyle}>
      <header className={styles.header}>
        <div className={styles.heading}>
          <h1 className={styles.title}>{resolvedTitle}</h1>
          <p className={styles.originalTitle}>
            {t("auth.movieDetails.originalTitle", {
              title: resolvedOriginalTitle,
              defaultValue: `Titulo original: ${resolvedOriginalTitle}`,
            })}
          </p>
        </div>

        <div className={styles.actions}>
          {onVote ? (
            <Button
              variant="primary"
              size="compact"
              type="button"
              onClick={onVote}
            >
              {voteButtonLabel}
            </Button>
          ) : null}

          {canEditMovie ? (
            <>
              <Button
                variant="primary"
                size="compact"
                type="button"
                onClick={onEdit}
              >
                {t("auth.movieDetails.edit", { defaultValue: "Editar" })}
              </Button>
              <Button
                variant="secondary"
                size="compact"
                type="button"
                onClick={onDelete}
              >
                {t("auth.movieDetails.delete", { defaultValue: "Excluir" })}
              </Button>
            </>
          ) : null}
        </div>
      </header>

      <div className={styles.content}>
        <MovieCard
          className={styles.posterCard}
          title={resolvedTitle}
          categories={resolvedCategories}
          votePercentile={votePercentile}
          posterUrl={posterUrl}
        />

        <div className={styles.mobileActions}>
          {onVote ? (
            <Button
              variant="primary"
              size="compact"
              type="button"
              onClick={onVote}
            >
              {voteButtonLabel}
            </Button>
          ) : null}

          {canEditMovie ? (
            <>
              <Button
                variant="primary"
                size="compact"
                type="button"
                onClick={onEdit}
              >
                {t("auth.movieDetails.edit", { defaultValue: "Editar" })}
              </Button>
              <Button
                variant="secondary"
                size="compact"
                type="button"
                onClick={onDelete}
              >
                {t("auth.movieDetails.delete", { defaultValue: "Excluir" })}
              </Button>
            </>
          ) : null}
        </div>

        <div className={styles.body}>
          <section className={styles.copySection}>
            <p className={styles.sectionContent}>{resolvedUserComment}</p>

            <div className={styles.overviewBox}>
              <p className={styles.sectionTitle}>
                {t("auth.movieDetails.overview", { defaultValue: "Sinopse" })}
              </p>
              <p className={styles.sectionContent}>{resolvedOverview}</p>
            </div>

            <div>
              <p className={styles.sectionTitle}>
                {t("auth.movieDetails.genres", { defaultValue: "Generos" })}
              </p>

              <div className={styles.tags}>
                {resolvedCategories.map((category) => (
                  <span key={category} className={styles.tag}>
                    {category}
                  </span>
                ))}
              </div>
            </div>
          </section>

          <div
            className={[
              styles.infoLine,
              styles.firstRow,
              styles.infoLineWithVote,
            ].join(" ")}
          >
            <article className={styles.infoCard}>
              <p className={styles.infoLabel}>{ratingInfo?.label}</p>
              <p className={styles.infoValue}>{ratingInfo?.value}</p>
            </article>
            <article className={styles.infoCard}>
              <p className={styles.infoLabel}>{votesInfo?.label}</p>
              <p className={styles.infoValue}>{votesInfo?.value}</p>
            </article>
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
          </div>

          <section
            className={styles.infoGrid}
            aria-label={t("auth.movieDetails.detailsAriaLabel", {
              defaultValue: "Detalhes do filme",
            })}
          >
            <div className={styles.infoLine}>
              <article className={styles.infoCard}>
                <p className={styles.infoLabel}>{releaseInfo?.label}</p>
                <p className={styles.infoValue}>{releaseInfo?.value}</p>
              </article>
              <article className={styles.infoCard}>
                <p className={styles.infoLabel}>{durationInfo?.label}</p>
                <p className={styles.infoValue}>{durationInfo?.value}</p>
              </article>
            </div>

            <div className={styles.infoLine}>
              <article className={styles.infoCard}>
                <p className={styles.infoLabel}>{statusInfo?.label}</p>
                <p className={styles.infoValue}>{statusInfo?.value}</p>
              </article>
              <article className={styles.infoCard}>
                <p className={styles.infoLabel}>{languageInfo?.label}</p>
                <p className={styles.infoValue}>{languageInfo?.value}</p>
              </article>
            </div>

            <div className={styles.infoLineThreeColumns}>
              <article className={styles.infoCard}>
                <p className={styles.infoLabel}>{budgetInfo?.label}</p>
                <p className={styles.infoValue}>{budgetInfo?.value}</p>
              </article>
              <article className={styles.infoCard}>
                <p className={styles.infoLabel}>{revenueInfo?.label}</p>
                <p className={styles.infoValue}>{revenueInfo?.value}</p>
              </article>
              <article className={styles.infoCard}>
                <p className={styles.infoLabel}>{profitInfo?.label}</p>
                <p className={styles.infoValue}>{profitInfo?.value}</p>
              </article>
            </div>
          </section>
        </div>
      </div>
    </section>
  );
};
