import { useState, useMemo } from 'react';

interface UsePaginationOptions<T> {
  data: T[];
  itemsPerPage?: number;
}

export function usePagination<T>({ data, itemsPerPage = 5 }: UsePaginationOptions<T>) {
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.max(1, Math.ceil(data.length / itemsPerPage));

  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return data.slice(start, start + itemsPerPage);
  }, [data, currentPage, itemsPerPage]);

  const hasNextPage = currentPage < totalPages;
  const hasPreviousPage = currentPage > 1;

  const goToNextPage = () => hasNextPage && setCurrentPage((p) => p + 1);
  const goToPreviousPage = () => hasPreviousPage && setCurrentPage((p) => p - 1);
  const goToPage = (page: number) => page >= 1 && page <= totalPages && setCurrentPage(page);

  return { currentPage, totalPages, paginatedData, goToNextPage, goToPreviousPage, goToPage, hasNextPage, hasPreviousPage };
}