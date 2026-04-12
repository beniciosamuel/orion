import { useEffect } from "react";

import { Button } from "../Button";
import styles from "./MovieDeleteConfirmationModal.module.css";

type MovieDeleteConfirmationModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  movieTitle?: string;
};

export const MovieDeleteConfirmationModal: React.FC<
  MovieDeleteConfirmationModalProps
> = ({ isOpen, onClose, onConfirm, movieTitle }) => {
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

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) {
    return null;
  }

  const handleOverlayClick = (
    event: React.MouseEvent<HTMLDivElement>,
  ): void => {
    if (event.target === event.currentTarget) {
      onClose();
    }
  };

  const handleConfirm = (): void => {
    onConfirm();
    onClose();
  };

  return (
    <div className={styles.overlay} onClick={handleOverlayClick}>
      <div
        className={styles.modal}
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="movie-delete-confirmation-title"
        aria-describedby="movie-delete-confirmation-description"
      >
        <h2 id="movie-delete-confirmation-title" className={styles.title}>
          Excluir filme
        </h2>

        <p
          id="movie-delete-confirmation-description"
          className={styles.description}
        >
          {movieTitle
            ? `Tem certeza que deseja excluir "${movieTitle}"?`
            : "Tem certeza que deseja excluir este filme?"}
        </p>

        <div className={styles.actions}>
          <Button
            variant="secondary"
            size="compact"
            className={styles.actionButton}
            type="button"
            onClick={onClose}
            autoFocus
          >
            Cancelar
          </Button>
          <Button
            size="compact"
            className={styles.actionButton}
            type="button"
            onClick={handleConfirm}
          >
            Excluir
          </Button>
        </div>
      </div>
    </div>
  );
};
