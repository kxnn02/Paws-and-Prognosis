import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';

export interface WorkingHours {
  monday: string | null;
  tuesday: string | null;
  wednesday: string | null;
  thursday: string | null;
  friday: string | null;
  saturday: string | null;
  sunday: string | null;
}

const DEFAULT_HOURS: WorkingHours = {
  monday: '9:00 AM - 4:00 PM',
  tuesday: '9:00 AM - 4:00 PM',
  wednesday: '9:00 AM - 4:00 PM',
  thursday: '9:00 AM - 4:00 PM',
  friday: '9:00 AM - 4:00 PM',
  saturday: '9:00 AM - 12:00 PM',
  sunday: null, // Closed
};

/**
 * Fetches working hours for a specific vet.
 * Falls back to default clinic hours if vet_working_hours table doesn't exist
 * or the vet hasn't set custom hours.
 *
 * Expected table: vet_working_hours (vet_id uuid PK FK vets, monday text, tuesday text, ..., sunday text)
 */
export function useVetWorkingHours(vetId: string | undefined) {
  const [hours, setHours] = useState<WorkingHours>(DEFAULT_HOURS);
  const [loading, setLoading] = useState(true);

  const fetchHours = useCallback(async () => {
    if (!vetId) {
      setHours(DEFAULT_HOURS);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('vet_working_hours')
        .select('*')
        .eq('vet_id', vetId)
        .single();

      if (error || !data) {
        // Table may not exist yet or vet hasn't set hours — use defaults
        setHours(DEFAULT_HOURS);
      } else {
        setHours({
          monday: data.monday || DEFAULT_HOURS.monday,
          tuesday: data.tuesday || DEFAULT_HOURS.tuesday,
          wednesday: data.wednesday || DEFAULT_HOURS.wednesday,
          thursday: data.thursday || DEFAULT_HOURS.thursday,
          friday: data.friday || DEFAULT_HOURS.friday,
          saturday: data.saturday || DEFAULT_HOURS.saturday,
          sunday: data.sunday || DEFAULT_HOURS.sunday,
        });
      }
    } catch {
      setHours(DEFAULT_HOURS);
    } finally {
      setLoading(false);
    }
  }, [vetId]);

  useEffect(() => {
    fetchHours();
  }, [fetchHours]);

  return { hours, loading };
}
