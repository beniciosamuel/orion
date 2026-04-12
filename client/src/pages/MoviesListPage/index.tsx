import { useEffect, useMemo, useState } from "react";
import { MainLayout } from "../../layouts/MainLayout";
import { MovieList } from "../../components/MovieList";
import { PaginationControl } from "../../components/MovieList/PaginationControl";
import { SearchBar } from "../../components/SearchBar";
import { useTranslation } from "react-i18next";
import { Button } from "../../components/Button";
import { movieListMock } from "../../components/MovieList/movieListMock";
import { MovieFiltersModal } from "../../components/MovieFiltersModal";
import { MovieAddSidebar } from "../../components/MovieAddSidebar";
import { FilterIcon } from "../../components/Icons";
import styles from "./MoviesListPage.module.css";

export const MoviesListPage: React.FC = () => {
  const { t } = useTranslation();
  const moviesPerPage = 10;
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [isFiltersModalOpen, setIsFiltersModalOpen] = useState(false);
  const [isAddSidebarOpen, setIsAddSidebarOpen] = useState(false);

  const normalizedSearchTerm = useMemo(
    () =>
      searchTerm
        .trim()
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, ""),
    [searchTerm],
  );

  const filteredMovies = useMemo(() => {
    if (!normalizedSearchTerm) {
      return movieListMock;
    }

    return movieListMock.filter((movie) =>
      movie.title
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .includes(normalizedSearchTerm),
    );
  }, [normalizedSearchTerm]);

  const totalPages = useMemo(
    () => Math.max(1, Math.ceil(filteredMovies.length / moviesPerPage)),
    [filteredMovies.length, moviesPerPage],
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  const paginatedMovies = useMemo(() => {
    const startIndex = (currentPage - 1) * moviesPerPage;
    return filteredMovies.slice(startIndex, startIndex + moviesPerPage);
  }, [currentPage, filteredMovies, moviesPerPage]);

  const pageNumbers = useMemo(
    () => Array.from({ length: totalPages }, (_, index) => index + 1),
    [totalPages],
  );

  return (
    <MainLayout>
      <section className={styles.page}>
        <div className={styles.actions}>
          <SearchBar
            wrapperClassName={styles.search}
            placeholder={t("auth.movieList.searchPlaceholder")}
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
          />
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
          >
            Adicionar Filme
          </Button>
        </div>

        <div className={styles.listContainer}>
          <MovieList movies={paginatedMovies} />
          <PaginationControl
            currentPage={currentPage}
            totalPages={totalPages}
            pageNumbers={pageNumbers}
            onPageChange={setCurrentPage}
          />
        </div>
        <MovieFiltersModal
          isOpen={isFiltersModalOpen}
          onClose={() => setIsFiltersModalOpen(false)}
        />
        <MovieAddSidebar
          isOpen={isAddSidebarOpen}
          onClose={() => setIsAddSidebarOpen(false)}
        />
      </section>
    </MainLayout>
  );
};
