import { useEffect, useRef, useState } from "react";

import { Button } from "../Button";
import { Input } from "../Input";
import { MoviesService } from "../../services/MoviesService";
import styles from "./MovieAddSidebar.module.css";

type MovieAddSidebarProps = {
  isOpen: boolean;
  onClose: () => void;
  onMovieCreated?: () => Promise<void> | void;
};

type UploadFieldName = "poster" | "backdrop";

const getOptionalFieldValue = (
  value: FormDataEntryValue | null,
): string | null => {
  if (typeof value !== "string") {
    return null;
  }

  const trimmedValue = value.trim();

  return trimmedValue.length > 0 ? trimmedValue : null;
};

export const MovieAddSidebar: React.FC<MovieAddSidebarProps> = ({
  isOpen,
  onClose,
  onMovieCreated,
}) => {
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const posterInputRef = useRef<HTMLInputElement>(null);
  const backdropInputRef = useRef<HTMLInputElement>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [files, setFiles] = useState<{
    poster: File | null;
    backdrop: File | null;
  }>({
    poster: null,
    backdrop: null,
  });
  const [activeDropzone, setActiveDropzone] = useState<UploadFieldName | null>(
    null,
  );

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
    setFiles({ poster: null, backdrop: null });
    setActiveDropzone(null);

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
    const formElement = event.currentTarget;

    const submitForm = async () => {
      setIsSubmitting(true);
      setServerError(null);

      try {
        if (!files.poster || !files.backdrop) {
          throw new Error("Selecione pôster e backdrop antes de adicionar.");
        }

        const formData = new FormData(formElement);
        const duration = Number(formData.get("duration"));

        if (!Number.isFinite(duration) || duration <= 0) {
          throw new Error("A duração precisa ser um número maior que zero.");
        }

        const releaseDate = formData.get("releaseDate");

        if (
          typeof releaseDate !== "string" ||
          releaseDate.trim().length === 0
        ) {
          throw new Error("A data de lançamento é obrigatória.");
        }

        const createMovieResponse = await MoviesService.createMovie({
          resumeTitle: String(formData.get("resumeTitle") ?? "").trim(),
          title: String(formData.get("title") ?? "").trim(),
          description: String(formData.get("description") ?? "").trim(),
          userComment: getOptionalFieldValue(formData.get("userComment")),
          director: String(formData.get("director") ?? "").trim(),
          duration,
          genres: String(formData.get("genres") ?? "").trim(),
          language: String(formData.get("language") ?? "").trim(),
          ageRating: String(formData.get("ageRating") ?? "").trim(),
          budget: getOptionalFieldValue(formData.get("budget")),
          revenue: getOptionalFieldValue(formData.get("revenue")),
          profit: getOptionalFieldValue(formData.get("profit")),
          productionCompany: getOptionalFieldValue(
            formData.get("productionCompany"),
          ),
          trailerUrl: getOptionalFieldValue(formData.get("trailerUrl")),
          releaseDate: releaseDate.trim(),
        });

        await MoviesService.uploadFiles({
          movieId: createMovieResponse.movie.id,
          poster: files.poster,
          backdrop: files.backdrop,
        });

        await onMovieCreated?.();
        onClose();
      } catch (error) {
        const rawMessage =
          error instanceof Error
            ? error.message
            : "Falha ao adicionar o filme. Tente novamente.";

        const message =
          rawMessage.includes("403") ||
          rawMessage.toLowerCase().includes("forbidden")
            ? "Seu usuario nao tem permissao para adicionar filmes. Entre com uma conta editor ou admin."
            : rawMessage;

        setServerError(message);
      } finally {
        setIsSubmitting(false);
      }
    };

    void submitForm();
  };

  const updateFile = (field: UploadFieldName, file: File | null) => {
    setFiles((currentFiles) => ({
      ...currentFiles,
      [field]: file,
    }));
  };

  const handleFileInputChange = (
    field: UploadFieldName,
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const selectedFile = event.target.files?.[0] ?? null;
    updateFile(field, selectedFile);
    event.target.value = "";
  };

  const handleDrop = (
    field: UploadFieldName,
    event: React.DragEvent<HTMLButtonElement>,
  ) => {
    event.preventDefault();
    setActiveDropzone(null);

    if (isSubmitting) {
      return;
    }

    const droppedFile = event.dataTransfer.files?.[0] ?? null;

    if (droppedFile) {
      updateFile(field, droppedFile);
    }
  };

  const openFileDialog = (field: UploadFieldName) => {
    if (isSubmitting) {
      return;
    }

    const targetInputRef =
      field === "poster" ? posterInputRef.current : backdropInputRef.current;

    targetInputRef?.click();
  };

  return (
    <div className={styles.overlay} onClick={handleOverlayClick}>
      <aside
        className={styles.sidebar}
        role="dialog"
        aria-modal="true"
        aria-labelledby="movie-add-sidebar-title"
      >
        <header className={styles.header}>
          <h2 id="movie-add-sidebar-title" className={styles.title}>
            Adicionar filme
          </h2>

          <button
            ref={closeButtonRef}
            type="button"
            onClick={onClose}
            className={styles.closeButton}
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
        </header>

        {serverError && (
          <div className={styles.errorMessage}>{serverError}</div>
        )}

        <form className={styles.form} onSubmit={handleSubmit}>
          <div className={styles.fieldsLimit}>
            <label className={styles.field}>
              <span className={styles.fieldLabel}>Título resumido</span>
              <Input
                name="resumeTitle"
                placeholder="Ex.: Interestelar"
                required
                disabled={isSubmitting}
              />
            </label>

            <label className={styles.field}>
              <span className={styles.fieldLabel}>Título</span>
              <Input
                name="title"
                placeholder="Ex.: Interestelar"
                required
                disabled={isSubmitting}
              />
            </label>

            <label className={styles.field}>
              <span className={styles.fieldLabel}>Sinopse</span>
              <textarea
                className={styles.textarea}
                name="description"
                placeholder="Descreva o filme"
                rows={4}
                required
                disabled={isSubmitting}
              />
            </label>

            <label className={styles.field}>
              <span className={styles.fieldLabel}>Comentário do usuário</span>
              <textarea
                className={styles.textarea}
                name="userComment"
                placeholder="Comentário opcional sobre o filme"
                rows={3}
                disabled={isSubmitting}
              />
            </label>

            <label className={styles.field}>
              <span className={styles.fieldLabel}>Diretor</span>
              <Input
                name="director"
                placeholder="Ex.: Christopher Nolan"
                required
                disabled={isSubmitting}
              />
            </label>

            <div className={styles.columns}>
              <label className={styles.field}>
                <span className={styles.fieldLabel}>Duração (min)</span>
                <Input
                  type="number"
                  name="duration"
                  min="1"
                  placeholder="169"
                  required
                  disabled={isSubmitting}
                />
              </label>

              <label className={styles.field}>
                <span className={styles.fieldLabel}>Data de lançamento</span>
                <Input
                  type="date"
                  name="releaseDate"
                  required
                  disabled={isSubmitting}
                />
              </label>
            </div>

            <div className={styles.columns}>
              <label className={styles.field}>
                <span className={styles.fieldLabel}>Gêneros</span>
                <Input
                  name="genres"
                  placeholder="Ex.: Ficção científica, Drama"
                  required
                  disabled={isSubmitting}
                />
              </label>

              <label className={styles.field}>
                <span className={styles.fieldLabel}>Idioma</span>
                <Input
                  name="language"
                  placeholder="Ex.: Inglês"
                  required
                  disabled={isSubmitting}
                />
              </label>
            </div>

            <div className={styles.columns}>
              <label className={styles.field}>
                <span className={styles.fieldLabel}>Classificação etária</span>
                <Input
                  name="ageRating"
                  placeholder="Ex.: 14"
                  required
                  disabled={isSubmitting}
                />
              </label>

              <label className={styles.field}>
                <span className={styles.fieldLabel}>Empresa produtora</span>
                <Input
                  name="productionCompany"
                  placeholder="Ex.: Syncopy"
                  disabled={isSubmitting}
                />
              </label>
            </div>

            <div className={styles.columns}>
              <label className={styles.field}>
                <span className={styles.fieldLabel}>Orçamento</span>
                <Input
                  name="budget"
                  placeholder="Ex.: 165000000"
                  disabled={isSubmitting}
                />
              </label>

              <label className={styles.field}>
                <span className={styles.fieldLabel}>Receita</span>
                <Input
                  name="revenue"
                  placeholder="Ex.: 760000000"
                  disabled={isSubmitting}
                />
              </label>
            </div>

            <div className={styles.columns}>
              <label className={styles.field}>
                <span className={styles.fieldLabel}>Lucro</span>
                <Input
                  name="profit"
                  placeholder="Ex.: 595000000"
                  disabled={isSubmitting}
                />
              </label>

              <label className={styles.field}>
                <span className={styles.fieldLabel}>Trailer</span>
                <Input
                  type="url"
                  name="trailerUrl"
                  placeholder="https://..."
                  disabled={isSubmitting}
                />
              </label>
            </div>

            <div className={styles.field}>
              <span className={styles.fieldLabel}>Arquivos do filme</span>
              <div className={styles.dropzoneGrid}>
                <button
                  type="button"
                  className={[
                    styles.dropzone,
                    activeDropzone === "poster" ? styles.dropzoneActive : "",
                    files.poster ? styles.dropzoneFilled : "",
                  ]
                    .filter(Boolean)
                    .join(" ")}
                  onClick={() => openFileDialog("poster")}
                  onDragOver={(event) => event.preventDefault()}
                  onDragEnter={() => setActiveDropzone("poster")}
                  onDragLeave={() => setActiveDropzone(null)}
                  onDrop={(event) => handleDrop("poster", event)}
                  disabled={isSubmitting}
                >
                  <span className={styles.dropzoneTitle}>Pôster</span>
                  <span className={styles.dropzoneSubtitle}>
                    Arraste uma imagem ou clique para selecionar
                  </span>
                  <span className={styles.dropzoneFileName}>
                    {files.poster
                      ? files.poster.name
                      : "Nenhum arquivo selecionado"}
                  </span>
                </button>

                <button
                  type="button"
                  className={[
                    styles.dropzone,
                    activeDropzone === "backdrop" ? styles.dropzoneActive : "",
                    files.backdrop ? styles.dropzoneFilled : "",
                  ]
                    .filter(Boolean)
                    .join(" ")}
                  onClick={() => openFileDialog("backdrop")}
                  onDragOver={(event) => event.preventDefault()}
                  onDragEnter={() => setActiveDropzone("backdrop")}
                  onDragLeave={() => setActiveDropzone(null)}
                  onDrop={(event) => handleDrop("backdrop", event)}
                  disabled={isSubmitting}
                >
                  <span className={styles.dropzoneTitle}>Backdrop</span>
                  <span className={styles.dropzoneSubtitle}>
                    Arraste uma imagem ou clique para selecionar
                  </span>
                  <span className={styles.dropzoneFileName}>
                    {files.backdrop
                      ? files.backdrop.name
                      : "Nenhum arquivo selecionado"}
                  </span>
                </button>
              </div>

              <input
                ref={posterInputRef}
                type="file"
                accept="image/*"
                className={styles.hiddenFileInput}
                onChange={(event) => handleFileInputChange("poster", event)}
                disabled={isSubmitting}
              />
              <input
                ref={backdropInputRef}
                type="file"
                accept="image/*"
                className={styles.hiddenFileInput}
                onChange={(event) => handleFileInputChange("backdrop", event)}
                disabled={isSubmitting}
              />
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
              {isSubmitting ? "Adicionando..." : "Adicionar filme"}
            </Button>
          </div>
        </form>
      </aside>
    </div>
  );
};
