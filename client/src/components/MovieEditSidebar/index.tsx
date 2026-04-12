import { useEffect, useRef, useState } from "react";

import { Button } from "../Button";
import { Input } from "../Input";
import styles from "./MovieEditSidebar.module.css";

type MovieEditSidebarProps = {
  isOpen: boolean;
  onClose: () => void;
  initialValues?: {
    title?: string;
    userComment?: string;
    overview?: string;
  };
};

type FormValues = {
  title: string;
  userComment: string;
  overview: string;
};

export const MovieEditSidebar: React.FC<MovieEditSidebarProps> = ({
  isOpen,
  onClose,
  initialValues,
}) => {
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const [formValues, setFormValues] = useState<FormValues>({
    title: "",
    userComment: "",
    overview: "",
  });

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    setFormValues({
      title: initialValues?.title ?? "",
      userComment: initialValues?.userComment ?? "",
      overview: initialValues?.overview ?? "",
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

  const setFieldValue = (field: keyof FormValues, value: string) => {
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
                stroke="white"
                strokeWidth="2"
                strokeLinecap="square"
                strokeLinejoin="round"
              />
              <path
                d="M6 6L18 18"
                stroke="white"
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

        <form className={styles.form} onSubmit={handleSubmit}>
          <div className={styles.fieldsLimit}>
            <label className={styles.field}>
              <span className={styles.fieldLabel}>Titulo</span>
              <Input
                value={formValues.title}
                onChange={(event) => setFieldValue("title", event.target.value)}
                placeholder="Ex.: Bumblebee"
              />
            </label>

            <label className={styles.field}>
              <span className={styles.fieldLabel}>Comentario</span>
              <textarea
                className={styles.textarea}
                value={formValues.userComment}
                onChange={(event) =>
                  setFieldValue("userComment", event.target.value)
                }
                rows={3}
                placeholder="Seu comentario sobre o filme"
              />
            </label>

            <label className={styles.field}>
              <span className={styles.fieldLabel}>Sinopse</span>
              <textarea
                className={styles.textarea}
                value={formValues.overview}
                onChange={(event) =>
                  setFieldValue("overview", event.target.value)
                }
                rows={5}
                placeholder="Descricao do filme"
              />
            </label>
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
              Editar filme
            </Button>
          </div>
        </form>
      </aside>
    </div>
  );
};
