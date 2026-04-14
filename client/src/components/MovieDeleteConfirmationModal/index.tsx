import { useEffect } from "react";
import { useState } from "react";

import { Button } from "../Button";
import styles from "./MovieDeleteConfirmationModal.module.css";

type MovieDeleteConfirmationModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void | Promise<void>;
  movieTitle?: string;
};

export const MovieDeleteConfirmationModal: React.FC<
  MovieDeleteConfirmationModalProps
> = ({ isOpen, onClose, onConfirm, movieTitle }) => {
  const [isConfirming, setIsConfirming] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

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
    setIsConfirming(false);
    setErrorMessage(null);

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

  const handleConfirm = async (): Promise<void> => {
    try {
      setIsConfirming(true);
      setErrorMessage(null);
      await onConfirm();
      onClose();
    } catch (error) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Falha ao excluir o filme. Tente novamente.",
      );
    } finally {
      setIsConfirming(false);
    }
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

        {errorMessage ? (
          <div className={styles.errorMessage}>{errorMessage}</div>
        ) : null}

        <div className={styles.actions}>
          <Button
            variant="secondary"
            size="compact"
            className={styles.actionButton}
            type="button"
            onClick={onClose}
            disabled={isConfirming}
            autoFocus
          >
            Cancelar
          </Button>
          <Button
            size="compact"
            className={styles.actionButton}
            type="button"
            onClick={handleConfirm}
            disabled={isConfirming}
          >
            {isConfirming ? "Excluindo..." : "Excluir"}
          </Button>
        </div>
      </div>
    </div>
  );
};
