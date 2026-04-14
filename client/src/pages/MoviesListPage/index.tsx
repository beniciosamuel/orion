import { useState } from "react";
import { MainLayout } from "../../layouts/MainLayout";
import { MovieList } from "../../components/MovieList";
import { PaginationControl } from "../../components/MovieList/PaginationControl";
import { SearchBar } from "../../components/SearchBar";
import { useTranslation } from "react-i18next";
import { Button } from "../../components/Button";
import { MovieFiltersModal } from "../../components/MovieFiltersModal";
import { MovieAddSidebar } from "../../components/MovieAddSidebar";
import { FilterIcon } from "../../components/Icons";
import { useMoviesList } from "../../hooks/useMoviesList";
import styles from "./MoviesListPage.module.css";

export const MoviesListPage: React.FC = () => {
  const { t } = useTranslation();
  const userScope = localStorage.getItem("userScope");
  const isViewerUser = userScope === "viewer";
  const {
    movies,
    currentPage,
    totalPages,
    pageNumbers,
    searchTerm,
    selectedGenres,
    isLoading,
    error,
    setCurrentPage,
    setSearchTerm,
    setSelectedGenres,
    fetchMovies,
  } = useMoviesList();
  const [isFiltersModalOpen, setIsFiltersModalOpen] = useState(false);
  const [isAddSidebarOpen, setIsAddSidebarOpen] = useState(false);

  const handlePageChange: React.Dispatch<React.SetStateAction<number>> = (
    value,
  ) => {
    const nextPage = typeof value === "function" ? value(currentPage) : value;

    setCurrentPage(nextPage);
  };

  return (
    <MainLayout>
      <section className={styles.page}>
        <div className={styles.searchRow}>
          <SearchBar
            wrapperClassName={styles.search}
            placeholder={t("auth.movieList.searchPlaceholder")}
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
          />
        </div>

        <div className={styles.actions}>
          <Button
            variant="secondary"
            size="compact"
            className={styles.filterButton}
            onClick={() => setIsFiltersModalOpen(true)}
          >
            <span className={styles.filterButtonContent}>
              <FilterIcon />
              Filtros
            </span>
          </Button>
          <Button
            size="compact"
            className={styles.addMovieButton}
            onClick={() => setIsAddSidebarOpen(true)}
            disabled={isViewerUser}
            title={
              isViewerUser
                ? "Somente usuarios editor ou admin podem adicionar filmes."
                : undefined
            }
          >
            Adicionar Filme
          </Button>
        </div>

        {isViewerUser && (
          <p className={styles.scopeHintMessage}>
            Seu usuario possui perfil viewer e nao pode adicionar filmes.
          </p>
        )}

        <div className={styles.listContainer}>
          {error && <p className={styles.errorMessage}>{error}</p>}
          {isLoading && (
            <p className={styles.loadingMessage}>Loading movies...</p>
          )}
          {!isLoading && !error && <MovieList movies={movies} />}
          <PaginationControl
            currentPage={currentPage}
            totalPages={totalPages}
            pageNumbers={pageNumbers}
            onPageChange={handlePageChange}
          />
        </div>
        <MovieFiltersModal
          isOpen={isFiltersModalOpen}
          onClose={() => setIsFiltersModalOpen(false)}
          selectedGenres={selectedGenres}
          onApplyGenres={setSelectedGenres}
        />
        <MovieAddSidebar
          isOpen={isAddSidebarOpen}
          onClose={() => setIsAddSidebarOpen(false)}
          onMovieCreated={() => fetchMovies()}
        />
      </section>
    </MainLayout>
  );
};
