import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onNext: () => void;
  onPrevious: () => void;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export const Pagination: React.FC<PaginationProps> = ({
  currentPage, totalPages, onNext, onPrevious, hasNextPage, hasPreviousPage,
}) => {
  if (totalPages <= 1) return null;
  return (
    <div className="flex items-center justify-between border-t app-border px-6 py-4">
      <button onClick={onPrevious} disabled={!hasPreviousPage}
        className="inline-flex items-center gap-1 px-3 py-2 text-sm font-medium rounded-md app-label hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-40 disabled:cursor-not-allowed">
        <ChevronLeft className="w-4 h-4" /> Previous
      </button>
      <span className="text-sm app-muted">Page {currentPage} of {totalPages}</span>
      <button onClick={onNext} disabled={!hasNextPage}
        className="inline-flex items-center gap-1 px-3 py-2 text-sm font-medium rounded-md app-label hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-40 disabled:cursor-not-allowed">
        Next <ChevronRight className="w-4 h-4" />
      </button>
    </div>
  );
};