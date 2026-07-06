import { useState, useCallback } from 'react';

const DEFAULT_PAGE_SIZE = 20;

interface PaginationState {
  page: number;
  pageSize: number;
  hasMore: boolean;
}

/**
 * Pagination helper for Supabase queries.
 * Returns range (from, to) for `.range()` calls.
 */
export function usePagination(pageSize: number = DEFAULT_PAGE_SIZE) {
  const [state, setState] = useState<PaginationState>({
    page: 0,
    pageSize,
    hasMore: true,
  });

  const getRange = useCallback((): [number, number] => {
    const from = state.page * state.pageSize;
    const to = from + state.pageSize - 1;
    return [from, to];
  }, [state.page, state.pageSize]);

  const nextPage = useCallback(() => {
    setState((prev) => ({ ...prev, page: prev.page + 1 }));
  }, []);

  const reset = useCallback(() => {
    setState((prev) => ({ ...prev, page: 0, hasMore: true }));
  }, []);

  const setHasMore = useCallback((hasMore: boolean) => {
    setState((prev) => ({ ...prev, hasMore }));
  }, []);

  return {
    page: state.page,
    pageSize: state.pageSize,
    hasMore: state.hasMore,
    getRange,
    nextPage,
    reset,
    setHasMore,
  };
}
