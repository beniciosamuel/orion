import { useEffect, useRef } from "react";

import { Button } from "../Button";
import { Input } from "../Input";
import styles from "./MovieFiltersModal.module.css";

type MovieFiltersModalProps = {
  isOpen: boolean;
  onClose: () => void;
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
}) => {
  const closeButtonRef = useRef<HTMLButtonElement>(null);

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
    onClose();
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
          <div>
            <p className={styles.eyebrow}>Listagem de filmes</p>
            <h2 id="movie-filters-title" className={styles.title}>
              Filtros
            </h2>
          </div>

          <button
            ref={closeButtonRef}
            type="button"
            className={styles.closeButton}
            onClick={onClose}
          >
            Fechar
          </button>
        </div>

        <p id="movie-filters-description" className={styles.description}>
          Refine a lista selecionando os critérios abaixo.
        </p>

        <form className={styles.form} onSubmit={handleSubmit}>
          <section className={styles.section}>
            <h3 className={styles.sectionTitle}>Gêneros</h3>

            <div className={styles.genreGrid}>
              {genreOptions.map((genre) => (
                <label key={genre} className={styles.checkboxCard}>
                  <input type="checkbox" name="genres" value={genre} />
                  <span>{genre}</span>
                </label>
              ))}
            </div>
          </section>

          <div className={styles.columns}>
            <label className={styles.field}>
              <span className={styles.fieldLabel}>Ano inicial</span>
              <Input type="number" min="1900" placeholder="Ex.: 2020" />
            </label>

            <label className={styles.field}>
              <span className={styles.fieldLabel}>Ano final</span>
              <Input type="number" min="1900" placeholder="Ex.: 2026" />
            </label>
          </div>

          <label className={styles.field}>
            <span className={styles.fieldLabel}>Ordenar por</span>
            <select className={styles.select} defaultValue="popularidade">
              <option value="popularidade">Maior popularidade</option>
              <option value="recentes">Mais recentes</option>
              <option value="avaliacao">Maior avaliação</option>
            </select>
          </label>

          <div className={styles.actions}>
            <Button
              variant="secondary"
              size="compact"
              type="button"
              onClick={onClose}
            >
              Cancelar
            </Button>
            <Button size="compact" type="submit">
              Aplicar filtros
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
