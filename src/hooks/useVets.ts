import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import type { Vet } from '../types';

const PAGE_SIZE = 20;

/**
 * Hook to fetch vets from Supabase with pagination.
 */
export function useVets() {
  const [vets, setVets] = useState<Vet[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(0);

  const fetchVets = useCallback(async (reset = true) => {
    try {
      if (reset) {
        setLoading(true);
        setPage(0);
      } else {
        setLoadingMore(true);
      }
      setError(null);

      const currentPage = reset ? 0 : page;
      const from = currentPage * PAGE_SIZE;
      const to = from + PAGE_SIZE - 1;

      const { data, error: fetchError } = await supabase
        .from('vets')
        .select('*')
        .order('rating', { ascending: false })
        .range(from, to);

      if (fetchError) throw fetchError;

      const newVets = (data as Vet[]) || [];

      if (reset) {
        setVets(newVets);
      } else {
        setVets((prev) => [...prev, ...newVets]);
      }

      setHasMore(newVets.length === PAGE_SIZE);
      if (!reset) setPage((p) => p + 1);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to fetch vets';
      setError(message);
      console.error('Error fetching vets:', err);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }, [page]);

  useEffect(() => {
    fetchVets(true);
  }, []);

  const loadMore = useCallback(() => {
    if (!loadingMore && hasMore) {
      fetchVets(false);
    }
  }, [loadingMore, hasMore, fetchVets]);

  return { vets, loading, loadingMore, error, hasMore, fetchVets: () => fetchVets(true), loadMore };
}
