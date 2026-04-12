import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";

import { MovieDetails } from "../../components/MovieDetails";
import { MovieDeleteConfirmationModal } from "../../components/MovieDeleteConfirmationModal";
import { MovieEditSidebar } from "../../components/MovieEditSidebar";
import {
  fetchMovieDetailsById,
  movieDetailsMock,
  type MovieTableRecord,
} from "../../components/MovieDetails/movieDetailsMock";
import { MainLayout } from "../../layouts/MainLayout";
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

export const MovieDetailsPage: React.FC = () => {
  const { t } = useTranslation();
  const { movieId } = useParams<{ movieId: string }>();
  const [isEditSidebarOpen, setIsEditSidebarOpen] = useState<boolean>(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false);
  const [movieData, setMovieData] = useState<MovieTableRecord | null>(
    movieDetailsMock,
  );

  useEffect(() => {
    let isMounted = true;

    const loadMovieDetails = async () => {
      if (!movieId) {
        setMovieData(movieDetailsMock);
        return;
      }

      const fetchedMovie = await fetchMovieDetailsById(movieId);
      if (!isMounted) {
        return;
      }

      setMovieData(fetchedMovie ?? movieDetailsMock);
    };

    void loadMovieDetails();

    return () => {
      isMounted = false;
    };
  }, [movieId]);

  const trailerUrl = movieData?.trailer_url ?? "";
  const embeddedTrailerUrl = trailerUrl ? getYoutubeEmbedUrl(trailerUrl) : "";

  return (
    <MainLayout>
      <section className={styles.page}>
        <div className={styles.content}>
          <MovieDetails
            movieId={movieId}
            onEdit={() => setIsEditSidebarOpen(true)}
            onDelete={() => setIsDeleteModalOpen(true)}
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
                title={`${movieData?.title ?? movieDetailsMock.title} trailer`}
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
        initialValues={{
          title: movieData?.resume_title ?? movieDetailsMock.resume_title,
          userComment: movieData?.user_comment ?? "",
          overview: movieData?.description ?? movieDetailsMock.description,
        }}
      />

      <MovieDeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        movieTitle={movieData?.resume_title ?? movieDetailsMock.resume_title}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={() => setIsDeleteModalOpen(false)}
      />
    </MainLayout>
  );
};
