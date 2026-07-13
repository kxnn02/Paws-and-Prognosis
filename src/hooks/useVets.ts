import { useState, useEffect, useCallback, useRef } from 'react';
import { supabase } from '../lib/supabase';
import { cache } from '../lib/cache';
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
  const pageRef = useRef(0);

  const fetchVets = useCallback(async (reset = true) => {
    try {
      if (reset) {
        // Load cached data immediately for instant display
        const cached = await cache.get<Vet[]>('vets_all');
        if (cached) {
          setVets(cached.data);
          setLoading(false);
        } else {
          setLoading(true);
        }
        pageRef.current = 0;
      } else {
        setLoadingMore(true);
      }
      setError(null);

      const currentPage = reset ? 0 : pageRef.current;
      const from = currentPage * PAGE_SIZE;
      const to = from + PAGE_SIZE - 1;

      const { data, error: fetchError } = await supabase
        .from('vets')
        .select('*, profiles:user_id(avatar_url)')
        .order('rating', { ascending: false })
        .range(from, to);

      if (fetchError) throw fetchError;

      // Merge profile avatar_url into vet image_url if vet has no image
      const newVets = ((data as Array<Vet & { profiles: { avatar_url: string | null } | null }>) || []).map((v) => ({
        ...v,
        image_url: v.image_url || v.profiles?.avatar_url || null,
        profiles: undefined,
      })) as Vet[];

      if (reset) {
        setVets(newVets);
        pageRef.current = 1;
        // Update cache with fresh data
        await cache.set('vets_all', newVets);
      } else {
        setVets((prev) => [...prev, ...newVets]);
      }

      setHasMore(newVets.length === PAGE_SIZE);
      if (!reset) pageRef.current += 1;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to fetch vets';
      setError(message);
      console.error('Error fetching vets:', err);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }, []);

  useEffect(() => {
    fetchVets(true);
  }, [fetchVets]);

  const loadMore = useCallback(() => {
    if (!loadingMore && hasMore) {
      fetchVets(false);
    }
  }, [loadingMore, hasMore, fetchVets]);

  return { vets, loading, loadingMore, error, hasMore, fetchVets: () => fetchVets(true), loadMore };
}
