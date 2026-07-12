import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';
import type { Rating } from '../types';

export function useRatings() {
  const { user } = useAuth();
  const [ratings, setRatings] = useState<Rating[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchRatings = useCallback(async () => {
    if (!user) {
      setRatings([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('ratings')
        .select('*')
        .eq('owner_id', user.id);

      if (error) throw error;
      setRatings((data as Rating[]) || []);
    } catch (err) {
      console.error('Error fetching ratings:', err);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchRatings();
  }, [fetchRatings]);

  // Check if user already rated a specific appointment
  function hasRated(appointmentId: string): boolean {
    return ratings.some((r) => r.appointment_id === appointmentId);
  }

  async function submitRating(params: {
    appointmentId: string;
    vetId: string;
    score: number;
  }) {
    if (!user) return { error: new Error('Not authenticated') };

    try {
      const { data, error } = await supabase
        .from('ratings')
        .insert({
          appointment_id: params.appointmentId,
          owner_id: user.id,
          vet_id: params.vetId,
          score: params.score,
        })
        .select()
        .single();

      if (error) throw error;

      setRatings((prev) => [...prev, data as Rating]);

      // Update vet's average rating
      const { error: avgError } = await updateVetAverageRating(params.vetId);
      if (avgError) {
        console.error('Rating saved but average update failed:', avgError);
      }

      return { error: null };
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to submit rating';
      return { error: new Error(message) };
    }
  }

  async function updateVetAverageRating(vetId: string): Promise<{ error: Error | null }> {
    try {
      // Calculate new average
      const { data, error: fetchError } = await supabase
        .from('ratings')
        .select('score')
        .eq('vet_id', vetId);

      if (fetchError) throw fetchError;
      if (!data || data.length === 0) return { error: null };

      const avg = data.reduce((sum, r) => sum + r.score, 0) / data.length;
      const rounded = Math.round(avg * 10) / 10;

      // Conditional update — only apply if rating differs
      const { error: updateError } = await supabase
        .from('vets')
        .update({ rating: rounded })
        .eq('id', vetId)
        .neq('rating', rounded);

      if (updateError) throw updateError;

      return { error: null };
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error updating vet rating';
      console.error('Error updating vet rating:', err);
      return { error: new Error(message) };
    }
  }

  return { ratings, loading, hasRated, submitRating, fetchRatings };
}
