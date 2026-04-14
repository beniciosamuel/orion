import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";

import { MovieDetails } from "../../components/MovieDetails";
import { MovieDeleteConfirmationModal } from "../../components/MovieDeleteConfirmationModal";
import { MovieEditSidebar } from "../../components/MovieEditSidebar";
import { MovieVoteModal } from "../../components/MovieVoteModal";
import { MainLayout } from "../../layouts/MainLayout";
import {
  MoviesService,
  type MovieDetailsResponseItem,
} from "../../services/MoviesService";
import styles from "./MovieDetailsPage.module.css";

const getYoutubeEmbedUrl = (url: string): string => {
  try {
    const parsedUrl = new URL(url);
    const videoId = parsedUrl.searchParams.get("v");

    if (videoId) {
      return `https://www.youtube.com/embed/${videoId}`;
    }

    if (parsedUrl.hostname.includes("youtu.be")) {
      const pathVideoId = parsedUrl.pathname.replace("/", "");
      if (pathVideoId) {
        return `https://www.youtube.com/embed/${pathVideoId}`;
      }
    }
  } catch {
    return url;
  }

  return url;
};

const formatReleaseDate = (value: string): string => {
  const parsedDate = new Date(value);

  if (Number.isNaN(parsedDate.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  }).format(parsedDate);
};

const formatReleaseDateForInput = (value: string): string => {
  const parsedDate = new Date(value);

  if (Number.isNaN(parsedDate.getTime())) {
    return "";
  }

  return parsedDate.toISOString().slice(0, 10);
};

export const MovieDetailsPage: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { movieId } = useParams<{ movieId: string }>();
  const userScope = localStorage.getItem("userScope");
  const [isEditSidebarOpen, setIsEditSidebarOpen] = useState<boolean>(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false);
  const [isVoteModalOpen, setIsVoteModalOpen] = useState<boolean>(false);
  const [movieData, setMovieData] = useState<MovieDetailsResponseItem | null>(
    null,
  );
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    const loadMovieDetails = async () => {
      if (!movieId) {
        if (!isMounted) {
          return;
        }

        setMovieData(null);
        setError(
          t("auth.movieDetails.notFound", {
            defaultValue: "Filme nao encontrado.",
          }),
        );
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        const response = await MoviesService.getMovieById(movieId);

        if (!isMounted) {
          return;
        }

        setMovieData(response.movie);
      } catch (loadError) {
        if (!isMounted) {
          return;
        }

        const message =
          loadError instanceof Error
            ? loadError.message
            : t("auth.movieDetails.notFound", {
                defaultValue: "Filme nao encontrado.",
              });

        setMovieData(null);
        setError(message);
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    void loadMovieDetails();

    return () => {
      isMounted = false;
    };
  }, [movieId, t]);

  const backdropUrl = movieData?.images.backdropUri ?? "";
  const posterUrl = movieData?.images.posterUri ?? undefined;
  const trailerUrl = movieData?.trailerUrl ?? "";
  const canEditMovie =
    userScope === "editor" && Boolean(movieData?.isContributor);
  const movieVotePercentile = Math.round(
    ((movieData?.movieRating ?? movieData?.rating ?? 0) / 5) * 100,
  );
  const categories = movieData?.genres
    .split(",")
    .map((genre) => genre.trim())
    .filter(Boolean);
  const embeddedTrailerUrl = trailerUrl ? getYoutubeEmbedUrl(trailerUrl) : "";

  const handleDeleteMovie = async () => {
    if (!movieData) {
      throw new Error("Filme nao encontrado.");
    }

    await MoviesService.deleteMovie({ id: movieData.id });
    navigate("/movies");
  };

  const handleVoteMovie = async (rating: number) => {
    if (!movieData) {
      throw new Error("Filme nao encontrado.");
    }

    await MoviesService.setMovieVote({ movieId: movieData.id, rating });

    const refreshedMovie = await MoviesService.getMovieById(movieData.id);
    setMovieData(refreshedMovie.movie);
  };

  const details = movieData
    ? [
        {
          label: t("auth.movieDetails.details.ratingLabel", {
            defaultValue: "Classificacao indicativa",
          }),
          value:
            movieData.ageRating ||
            t("auth.movieDetails.details.ratingValue", {
              defaultValue: "12 anos",
            }),
        },
        {
          label: t("auth.movieDetails.details.votesLabel", {
            defaultValue: "Votos",
          }),
          value: String(movieData.userRating ?? 0),
        },
        {
          label: t("auth.movieDetails.details.releaseLabel", {
            defaultValue: "Lancamento",
          }),
          value: formatReleaseDate(movieData.releaseDate),
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
      ]
    : undefined;

  if (isLoading) {
    return (
      <MainLayout>
        <section className={styles.page}>
          <p className={styles.sectionTitle}>
            {t("auth.movieDetails.loading", {
              defaultValue: "Carregando filme...",
            })}
          </p>
        </section>
      </MainLayout>
    );
  }

  if (error || !movieData) {
    return (
      <MainLayout>
        <section className={styles.page}>
          <p className={styles.sectionTitle}>
            {error ??
              t("auth.movieDetails.notFound", {
                defaultValue: "Filme nao encontrado.",
              })}
          </p>
        </section>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <section className={styles.page}>
        <div className={styles.content}>
          <MovieDetails
            title={movieData.resumeTitle}
            originalTitle={movieData.title}
            userComment={movieData.userComment ?? ""}
            overview={movieData.description}
            categories={categories}
            posterUrl={posterUrl ?? undefined}
            backdropUrl={backdropUrl || undefined}
            canEditMovie={canEditMovie}
            voteButtonLabel={
              movieData.hasUserVoted ? "Alterar voto" : "Registrar voto"
            }
            votePercentile={movieVotePercentile}
            details={details}
            onEdit={() => setIsEditSidebarOpen(true)}
            onDelete={() => setIsDeleteModalOpen(true)}
            onVote={() => setIsVoteModalOpen(true)}
          />
        </div>

        {embeddedTrailerUrl ? (
          <section className={styles.trailerSection}>
            <p className={styles.sectionTitle}>
              {t("auth.movieDetails.trailer", { defaultValue: "Trailer" })}
            </p>
            <div className={styles.trailerFrameWrapper}>
              <iframe
                className={styles.trailerFrame}
                src={embeddedTrailerUrl}
                title={`${movieData.title} trailer`}
                loading="lazy"
                referrerPolicy="strict-origin-when-cross-origin"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
              />
            </div>
          </section>
        ) : null}
      </section>

      <MovieEditSidebar
        isOpen={isEditSidebarOpen}
        onClose={() => setIsEditSidebarOpen(false)}
        movieId={movieData.id}
        initialValues={{
          resumeTitle: movieData.resumeTitle,
          title: movieData.title,
          description: movieData.description,
          userComment: movieData.userComment ?? "",
          director: movieData.director,
          duration: String(movieData.duration),
          genres: movieData.genres,
          language: movieData.language,
          ageRating: movieData.ageRating,
          budget: movieData.budget?.toString() ?? "",
          revenue: movieData.revenue?.toString() ?? "",
          profit: movieData.profit?.toString() ?? "",
          productionCompany: movieData.productionCompany ?? "",
          trailerUrl: movieData.trailerUrl ?? "",
          releaseDate: formatReleaseDateForInput(movieData.releaseDate),
        }}
        onMovieUpdated={setMovieData}
      />

      <MovieDeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        movieTitle={movieData.resumeTitle}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDeleteMovie}
      />

      <MovieVoteModal
        isOpen={isVoteModalOpen}
        movieTitle={movieData.resumeTitle}
        currentRating={movieData.userRating ?? 3}
        onClose={() => setIsVoteModalOpen(false)}
        onConfirm={handleVoteMovie}
      />
    </MainLayout>
  );
};
