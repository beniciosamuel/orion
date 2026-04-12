import { useEffect, useRef } from "react";

import { Button } from "../Button";
import { Input } from "../Input";
import styles from "./MovieAddSidebar.module.css";

type MovieAddSidebarProps = {
  isOpen: boolean;
  onClose: () => void;
};

export const MovieAddSidebar: React.FC<MovieAddSidebarProps> = ({
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
      <aside
        className={styles.sidebar}
        role="dialog"
        aria-modal="true"
        aria-labelledby="movie-add-sidebar-title"
        aria-describedby="movie-add-sidebar-description"
      >
        <header className={styles.header}>
          <div>
            <p className={styles.eyebrow}>Catálogo Orion</p>
            <h2 id="movie-add-sidebar-title" className={styles.title}>
              Adicionar filme
            </h2>
            <p id="movie-add-sidebar-description" className={styles.description}>
              Preencha as informações para cadastrar um novo título.
            </p>
          </div>

          <button
            ref={closeButtonRef}
            type="button"
            onClick={onClose}
            className={styles.closeButton}
          >
            Fechar
          </button>
        </header>

        <form className={styles.form} onSubmit={handleSubmit}>
          <label className={styles.field}>
            <span className={styles.fieldLabel}>Título</span>
            <Input name="title" placeholder="Ex.: Interestelar" required />
          </label>

          <label className={styles.field}>
            <span className={styles.fieldLabel}>Categorias</span>
            <Input name="categories" placeholder="Ex.: Ficção científica, Drama" required />
          </label>

          <div className={styles.columns}>
            <label className={styles.field}>
              <span className={styles.fieldLabel}>Ano</span>
              <Input type="number" name="year" min="1888" max="2100" placeholder="2026" required />
            </label>

            <label className={styles.field}>
              <span className={styles.fieldLabel}>Nota (%)</span>
              <Input type="number" name="rating" min="0" max="100" placeholder="85" required />
            </label>
          </div>

          <label className={styles.field}>
            <span className={styles.fieldLabel}>URL do pôster</span>
            <Input type="url" name="posterUrl" placeholder="https://..." required />
          </label>

          <label className={styles.field}>
            <span className={styles.fieldLabel}>Link do filme</span>
            <Input type="url" name="url" placeholder="https://..." required />
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
              Salvar filme
            </Button>
          </div>
        </form>
      </aside>
    </div>
  );
};
