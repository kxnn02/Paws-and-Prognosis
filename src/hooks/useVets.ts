import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import type { Vet } from '../types';

/**
 * Hook to fetch real vets from Supabase.
 * Falls back to mock data if no vets exist in the database yet.
 */
export function useVets() {
  const [vets, setVets] = useState<Vet[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchVets = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const { data, error: fetchError } = await supabase
        .from('vets')
        .select('*')
        .order('rating', { ascending: false });

      if (fetchError) throw fetchError;

      setVets((data as Vet[]) || []);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to fetch vets';
      setError(message);
      console.error('Error fetching vets:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchVets();
  }, [fetchVets]);

  return { vets, loading, error, fetchVets };
}
