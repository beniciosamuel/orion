import { ChevronLeftIcon, ChevronRightIcon } from "../Icons";
import styles from "./MovieList.module.css";

type PaginationControlProps = {
  currentPage: number;
  totalPages: number;
  pageNumbers: number[];
  onPageChange: React.Dispatch<React.SetStateAction<number>>;
};

export const PaginationControl: React.FC<PaginationControlProps> = ({
  currentPage,
  totalPages,
  pageNumbers,
  onPageChange,
}) => {
  return (
    <footer className={styles.pagination}>
      <button
        className={styles.paginationButton}
        aria-label="Previous page"
        onClick={() => onPageChange((page) => Math.max(1, page - 1))}
        disabled={currentPage === 1}
      >
        <ChevronLeftIcon />
      </button>

      {pageNumbers.map((pageNumber) => (
        <button
          key={pageNumber}
          className={styles.paginationButton}
          aria-label={`Page ${pageNumber}`}
          aria-current={currentPage === pageNumber ? "page" : undefined}
          data-active={currentPage === pageNumber}
          onClick={() => onPageChange(pageNumber)}
        >
          {pageNumber}
        </button>
      ))}

      <button
        className={styles.paginationButton}
        aria-label="Next page"
        onClick={() => onPageChange((page) => Math.min(totalPages, page + 1))}
        disabled={currentPage === totalPages}
      >
        <ChevronRightIcon />
      </button>
    </footer>
  );
};
