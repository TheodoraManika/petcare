import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import './Pagination.css';

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  if (totalPages <= 1) return null;

  return (
    <div className="pagination">
      <button
        className="pagination__btn"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
      >
        <ChevronLeft size={16} />
        Προηγούμενη
      </button>
      
      <span className="pagination__info">
        Σελίδα {currentPage} από {totalPages}
      </span>
      
      <button
        className="pagination__btn pagination__btn--next"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
      >
        Επόμενη
        <ChevronRight size={16} />
      </button>
    </div>
  );
};

export default Pagination;
