import { useEffect, useRef, useState } from "react";

import { Button } from "../Button";
import styles from "./MovieFiltersModal.module.css";

type MovieFiltersModalProps = {
  isOpen: boolean;
  onClose: () => void;
  selectedGenres: string[];
  onApplyGenres: (genres: string[]) => void;
};

const genreOptions = [
  "Ação",
  "Comédia",
  "Drama",
  "Ficção científica",
  "Suspense",
  "Animação",
];

export const MovieFiltersModal: React.FC<MovieFiltersModalProps> = ({
  isOpen,
  onClose,
  selectedGenres,
  onApplyGenres,
}) => {
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const [draftSelectedGenres, setDraftSelectedGenres] =
    useState<string[]>(selectedGenres);

  useEffect(() => {
    if (isOpen) {
      setDraftSelectedGenres(selectedGenres);
    }
  }, [isOpen, selectedGenres]);

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
    onApplyGenres(draftSelectedGenres);
    onClose();
  };

  const toggleGenre = (genre: string) => {
    setDraftSelectedGenres((currentGenres) => {
      if (currentGenres.includes(genre)) {
        return currentGenres.filter((value) => value !== genre);
      }

      return [...currentGenres, genre];
    });
  };

  return (
    <div className={styles.overlay} onClick={handleOverlayClick}>
      <div
        className={styles.modal}
        role="dialog"
        aria-modal="true"
        aria-labelledby="movie-filters-title"
        aria-describedby="movie-filters-description"
      >
        <div className={styles.header}>
          <h2 id="movie-filters-title" className={styles.title}>
            Filtro
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

        <p id="movie-filters-description" className={styles.description}>
          Refine a lista selecionando os critérios abaixo.
        </p>

        <form className={styles.form} onSubmit={handleSubmit}>
          <div className={styles.fieldsLimit}>
            <section className={styles.section}>
              <h3 className={styles.sectionTitle}>Gêneros</h3>

              <div className={styles.genreGrid}>
                {genreOptions.map((genre) => (
                  <label key={genre} className={styles.checkboxCard}>
                    <input
                      type="checkbox"
                      name="genres"
                      value={genre}
                      checked={draftSelectedGenres.includes(genre)}
                      onChange={() => toggleGenre(genre)}
                    />
                    <span>{genre}</span>
                  </label>
                ))}
              </div>
            </section>
          </div>

          <div className={styles.actions}>
            <Button
              variant="secondary"
              size="compact"
              className={styles.actionButton}
              type="button"
              onClick={onClose}
            >
              Cancelar
            </Button>
            <Button
              size="compact"
              className={styles.actionButton}
              type="submit"
            >
              Aplicar filtros
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
