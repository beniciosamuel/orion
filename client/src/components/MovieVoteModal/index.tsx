import { useEffect, useRef, useState } from "react";

import { Button } from "../Button";
import styles from "./MovieVoteModal.module.css";

type MovieVoteModalProps = {
  isOpen: boolean;
  movieTitle?: string;
  currentRating?: number;
  onClose: () => void;
  onConfirm: (rating: number) => void | Promise<void>;
};

const clampRating = (value: number | undefined): number => {
  if (!value || Number.isNaN(value)) {
    return 3;
  }

  return Math.min(5, Math.max(1, Math.round(value)));
};

export const MovieVoteModal: React.FC<MovieVoteModalProps> = ({
  isOpen,
  movieTitle,
  currentRating,
  onClose,
  onConfirm,
}) => {
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const [selectedRating, setSelectedRating] = useState<number>(3);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    setSelectedRating(clampRating(currentRating));
    setIsSubmitting(false);
    setErrorMessage(null);
  }, [currentRating, isOpen]);

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

  const handleOverlayClick = (
    event: React.MouseEvent<HTMLDivElement>,
  ): void => {
    if (event.target === event.currentTarget) {
      onClose();
    }
  };

  const handleConfirm = async (): Promise<void> => {
    try {
      setIsSubmitting(true);
      setErrorMessage(null);
      await onConfirm(selectedRating);
      onClose();
    } catch (error) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Falha ao registrar o voto. Tente novamente.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={styles.overlay} onClick={handleOverlayClick}>
      <div
        className={styles.modal}
        role="dialog"
        aria-modal="true"
        aria-labelledby="movie-vote-modal-title"
        aria-describedby="movie-vote-modal-description"
      >
        <div className={styles.header}>
          <div>
            <h2 id="movie-vote-modal-title" className={styles.title}>
              Registrar voto
            </h2>
            <p id="movie-vote-modal-description" className={styles.description}>
              {movieTitle
                ? `Selecione uma nota de 1 a 5 para "${movieTitle}".`
                : "Selecione uma nota de 1 a 5 para o filme."}
            </p>
          </div>

          <button
            ref={closeButtonRef}
            type="button"
            className={styles.closeButton}
            onClick={onClose}
            aria-label="Fechar"
          >
            ×
          </button>
        </div>

        {errorMessage ? (
          <div className={styles.errorMessage}>{errorMessage}</div>
        ) : null}

        <div className={styles.ratingGrid} role="group" aria-label="Nota">
          {[1, 2, 3, 4, 5].map((rating) => (
            <button
              key={rating}
              type="button"
              className={[
                styles.ratingButton,
                selectedRating === rating ? styles.ratingButtonActive : "",
              ]
                .filter(Boolean)
                .join(" ")}
              onClick={() => setSelectedRating(rating)}
              disabled={isSubmitting}
            >
              {rating}
            </button>
          ))}
        </div>

        <div className={styles.actions}>
          <Button
            variant="secondary"
            size="compact"
            className={styles.actionButton}
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
          >
            Cancelar
          </Button>
          <Button
            size="compact"
            className={styles.actionButton}
            type="button"
            onClick={handleConfirm}
            disabled={isSubmitting}
          >
            {isSubmitting ? "Registrando..." : "Confirmar voto"}
          </Button>
        </div>
      </div>
    </div>
  );
};
