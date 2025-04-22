import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import '../styles/Pagination.css';

interface PaginationProps {
  currentPage: number;
  totalItems: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
}

export default function Pagination({ 
  currentPage, 
  totalItems, 
  itemsPerPage, 
  onPageChange 
}: PaginationProps) {
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  if (totalPages <= 1) return null;

  return (
    <div className="pagination-container">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="pagination-arrow"
        aria-label="Página anterior"
      >
        <FaChevronLeft className={`arrow-icon ${currentPage === 1 ? 'disabled' : ''}`} />
      </button>
      
      <span className="page-indicator">
        Página {currentPage} de {totalPages}
      </span>
      
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="pagination-arrow"
        aria-label="Próxima página"
      >
        <FaChevronRight className={`arrow-icon ${currentPage === totalPages ? 'disabled' : ''}`} />
      </button>
    </div>
  );
}