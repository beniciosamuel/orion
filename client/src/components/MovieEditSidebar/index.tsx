import { useEffect, useRef, useState } from "react";

import { Button } from "../Button";
import { Input } from "../Input";
import {
  MoviesService,
  type MovieDetailsResponseItem,
} from "../../services/MoviesService";
import styles from "./MovieEditSidebar.module.css";

type MovieEditFormValues = {
  resumeTitle: string;
  title: string;
  description: string;
  userComment: string;
  director: string;
  duration: string;
  genres: string;
  language: string;
  ageRating: string;
  budget: string;
  revenue: string;
  profit: string;
  productionCompany: string;
  trailerUrl: string;
  releaseDate: string;
};

type MovieEditSidebarProps = {
  isOpen: boolean;
  onClose: () => void;
  initialValues?: {
    resumeTitle?: string;
    title?: string;
    description?: string;
    userComment?: string;
    director?: string;
    duration?: string;
    genres?: string;
    language?: string;
    ageRating?: string;
    budget?: string;
    revenue?: string;
    profit?: string;
    productionCompany?: string;
    trailerUrl?: string;
    releaseDate?: string;
  };
  movieId: string;
  onMovieUpdated?: (movie: MovieDetailsResponseItem) => void;
};

export const MovieEditSidebar: React.FC<MovieEditSidebarProps> = ({
  isOpen,
  onClose,
  initialValues,
  movieId,
  onMovieUpdated,
}) => {
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const [formValues, setFormValues] = useState<MovieEditFormValues>({
    resumeTitle: "",
    title: "",
    description: "",
    userComment: "",
    director: "",
    duration: "",
    genres: "",
    language: "",
    ageRating: "",
    budget: "",
    revenue: "",
    profit: "",
    productionCompany: "",
    trailerUrl: "",
    releaseDate: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    setFormValues({
      resumeTitle: initialValues?.resumeTitle ?? "",
      title: initialValues?.title ?? "",
      description: initialValues?.description ?? "",
      userComment: initialValues?.userComment ?? "",
      director: initialValues?.director ?? "",
      duration: initialValues?.duration ?? "",
      genres: initialValues?.genres ?? "",
      language: initialValues?.language ?? "",
      ageRating: initialValues?.ageRating ?? "",
      budget: initialValues?.budget ?? "",
      revenue: initialValues?.revenue ?? "",
      profit: initialValues?.profit ?? "",
      productionCompany: initialValues?.productionCompany ?? "",
      trailerUrl: initialValues?.trailerUrl ?? "",
      releaseDate: initialValues?.releaseDate ?? "",
    });
  }, [initialValues, isOpen]);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    closeButtonRef.current?.focus();
    setServerError(null);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) {
    return null;
  }

  const handleOverlayClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if (event.target === event.currentTarget) {
      onClose();
    }
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const submitForm = async () => {
      setIsSubmitting(true);
      setServerError(null);

      try {
        const duration = Number(formValues.duration);

        if (!Number.isFinite(duration) || duration <= 0) {
          throw new Error("A duração precisa ser um número maior que zero.");
        }

        if (!formValues.releaseDate.trim()) {
          throw new Error("A data de lançamento é obrigatória.");
        }

        const response = await MoviesService.updateMovie({
          id: movieId,
          resumeTitle: formValues.resumeTitle.trim(),
          title: formValues.title.trim(),
          description: formValues.description.trim(),
          userComment:
            formValues.userComment.trim().length > 0
              ? formValues.userComment.trim()
              : null,
          director: formValues.director.trim(),
          duration,
          genres: formValues.genres.trim(),
          language: formValues.language.trim(),
          ageRating: formValues.ageRating.trim(),
          budget:
            formValues.budget.trim().length > 0
              ? formValues.budget.trim()
              : null,
          revenue:
            formValues.revenue.trim().length > 0
              ? formValues.revenue.trim()
              : null,
          profit:
            formValues.profit.trim().length > 0
              ? formValues.profit.trim()
              : null,
          productionCompany:
            formValues.productionCompany.trim().length > 0
              ? formValues.productionCompany.trim()
              : null,
          trailerUrl:
            formValues.trailerUrl.trim().length > 0
              ? formValues.trailerUrl.trim()
              : null,
          releaseDate: formValues.releaseDate.trim(),
        });

        onMovieUpdated?.(response.movie);
        onClose();
      } catch (error) {
        const message =
          error instanceof Error
            ? error.message
            : "Falha ao editar o filme. Tente novamente.";

        setServerError(message);
      } finally {
        setIsSubmitting(false);
      }
    };

    void submitForm();
  };

  const setFieldValue = (field: keyof MovieEditFormValues, value: string) => {
    setFormValues((current) => ({ ...current, [field]: value }));
  };

  return (
    <div className={styles.overlay} onClick={handleOverlayClick}>
      <aside
        className={styles.sidebar}
        role="dialog"
        aria-modal="true"
        aria-labelledby="movie-edit-sidebar-title"
        aria-describedby="movie-edit-sidebar-description"
      >
        <div className={styles.header}>
          <h2 id="movie-edit-sidebar-title" className={styles.title}>
            Editar filme
          </h2>

          <button
            ref={closeButtonRef}
            type="button"
            className={styles.closeButton}
            onClick={onClose}
            aria-label="Fechar"
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
            >
              <path
                d="M18 6L6 18"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="square"
                strokeLinejoin="round"
              />
              <path
                d="M6 6L18 18"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="square"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>

        <p id="movie-edit-sidebar-description" className={styles.description}>
          Atualize os dados abaixo e salve as alteracoes.
        </p>

        {serverError ? (
          <div className={styles.errorMessage}>{serverError}</div>
        ) : null}

        <form className={styles.form} onSubmit={handleSubmit}>
          <div className={styles.fieldsLimit}>
            <label className={styles.field}>
              <span className={styles.fieldLabel}>Título resumido</span>
              <Input
                value={formValues.resumeTitle}
                onChange={(event) =>
                  setFieldValue("resumeTitle", event.target.value)
                }
                placeholder="Ex.: Bumblebee"
                disabled={isSubmitting}
              />
            </label>

            <label className={styles.field}>
              <span className={styles.fieldLabel}>Título</span>
              <Input
                value={formValues.title}
                onChange={(event) => setFieldValue("title", event.target.value)}
                placeholder="Ex.: Bumblebee"
                disabled={isSubmitting}
              />
            </label>

            <label className={styles.field}>
              <span className={styles.fieldLabel}>Sinopse</span>
              <textarea
                className={styles.textarea}
                value={formValues.description}
                onChange={(event) =>
                  setFieldValue("description", event.target.value)
                }
                rows={4}
                placeholder="Descreva o filme"
                disabled={isSubmitting}
              />
            </label>

            <label className={styles.field}>
              <span className={styles.fieldLabel}>Comentário do usuário</span>
              <textarea
                className={styles.textarea}
                value={formValues.userComment}
                onChange={(event) =>
                  setFieldValue("userComment", event.target.value)
                }
                rows={3}
                placeholder="Comentário opcional sobre o filme"
                disabled={isSubmitting}
              />
            </label>

            <label className={styles.field}>
              <span className={styles.fieldLabel}>Diretor</span>
              <Input
                value={formValues.director}
                onChange={(event) =>
                  setFieldValue("director", event.target.value)
                }
                placeholder="Ex.: Christopher Nolan"
                disabled={isSubmitting}
              />
            </label>

            <div className={styles.columns}>
              <label className={styles.field}>
                <span className={styles.fieldLabel}>Duração (min)</span>
                <Input
                  type="number"
                  min="1"
                  value={formValues.duration}
                  onChange={(event) =>
                    setFieldValue("duration", event.target.value)
                  }
                  placeholder="169"
                  disabled={isSubmitting}
                />
              </label>

              <label className={styles.field}>
                <span className={styles.fieldLabel}>Data de lançamento</span>
                <Input
                  type="date"
                  value={formValues.releaseDate}
                  onChange={(event) =>
                    setFieldValue("releaseDate", event.target.value)
                  }
                  disabled={isSubmitting}
                />
              </label>
            </div>

            <div className={styles.columns}>
              <label className={styles.field}>
                <span className={styles.fieldLabel}>Gêneros</span>
                <Input
                  value={formValues.genres}
                  onChange={(event) =>
                    setFieldValue("genres", event.target.value)
                  }
                  placeholder="Ex.: Ficção científica, Drama"
                  disabled={isSubmitting}
                />
              </label>

              <label className={styles.field}>
                <span className={styles.fieldLabel}>Idioma</span>
                <Input
                  value={formValues.language}
                  onChange={(event) =>
                    setFieldValue("language", event.target.value)
                  }
                  placeholder="Ex.: Inglês"
                  disabled={isSubmitting}
                />
              </label>
            </div>

            <div className={styles.columns}>
              <label className={styles.field}>
                <span className={styles.fieldLabel}>Classificação etária</span>
                <Input
                  value={formValues.ageRating}
                  onChange={(event) =>
                    setFieldValue("ageRating", event.target.value)
                  }
                  placeholder="Ex.: 14"
                  disabled={isSubmitting}
                />
              </label>

              <label className={styles.field}>
                <span className={styles.fieldLabel}>Empresa produtora</span>
                <Input
                  value={formValues.productionCompany}
                  onChange={(event) =>
                    setFieldValue("productionCompany", event.target.value)
                  }
                  placeholder="Ex.: Syncopy"
                  disabled={isSubmitting}
                />
              </label>
            </div>

            <div className={styles.columns}>
              <label className={styles.field}>
                <span className={styles.fieldLabel}>Orçamento</span>
                <Input
                  value={formValues.budget}
                  onChange={(event) =>
                    setFieldValue("budget", event.target.value)
                  }
                  placeholder="Ex.: 165000000"
                  disabled={isSubmitting}
                />
              </label>

              <label className={styles.field}>
                <span className={styles.fieldLabel}>Receita</span>
                <Input
                  value={formValues.revenue}
                  onChange={(event) =>
                    setFieldValue("revenue", event.target.value)
                  }
                  placeholder="Ex.: 760000000"
                  disabled={isSubmitting}
                />
              </label>
            </div>

            <div className={styles.columns}>
              <label className={styles.field}>
                <span className={styles.fieldLabel}>Lucro</span>
                <Input
                  value={formValues.profit}
                  onChange={(event) =>
                    setFieldValue("profit", event.target.value)
                  }
                  placeholder="Ex.: 595000000"
                  disabled={isSubmitting}
                />
              </label>

              <label className={styles.field}>
                <span className={styles.fieldLabel}>Trailer</span>
                <Input
                  type="url"
                  value={formValues.trailerUrl}
                  onChange={(event) =>
                    setFieldValue("trailerUrl", event.target.value)
                  }
                  placeholder="https://..."
                  disabled={isSubmitting}
                />
              </label>
            </div>
          </div>

          <div className={styles.actions}>
            <Button
              variant="secondary"
              size="compact"
              className={styles.actionButton}
              type="button"
              disabled={isSubmitting}
              onClick={onClose}
            >
              Cancelar
            </Button>
            <Button
              size="compact"
              className={styles.actionButton}
              type="submit"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Salvando..." : "Editar filme"}
            </Button>
          </div>
        </form>
      </aside>
    </div>
  );
};
