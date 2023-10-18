import React from 'react';
import styles from './pagination.css';

interface PaginationInterface {
  pagesArray: number[],
  totalPages: number,
  currentPage: number,
  changePage: (page: number) => void;
}

export const Pagination = ({ pagesArray, totalPages, currentPage, changePage }: PaginationInterface) => {
  function createPages(pages: number[], pagesCount: number, currentPage: number) {
    if (pagesCount > 10) {
      if (currentPage > 5) {
        for (let i = currentPage - 4; i <= currentPage + 5; i++) {
          pages.push(i);
          if (i === pagesCount) break;
        }
      } else {
        for (let i = 1; i <= 10; i++) {
          pages.push(i);
          if (i === pagesCount) break;
        }
      }
    } else {
      for (let i = 1; i <= pagesCount; i++) {
        pages.push(i);
      }
    }
  }
  createPages(pagesArray, totalPages, currentPage);
  return (
    <div className={styles.pagination}>
      {pagesArray.map((page, index) =>
        <span
          onClick={() => changePage(page)}
          key={index + 1}
          className={currentPage === page ? [styles.page, styles.page__current].join(' ') : styles.page}>
          {page}
        </span>
      )}
    </div>
  );
};
