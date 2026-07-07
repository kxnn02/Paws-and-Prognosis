import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';
import type { Appointment } from '../types';

/**
 * Hook for managing pet owner appointments.
 *
 * Provides CRUD operations for appointments with automatic
 * state management and Supabase integration.
 *
 * @returns appointments - Array of all user appointments
 * @returns loading - Whether initial fetch is in progress
 * @returns error - Error message if fetch failed
 * @returns fetchAppointments - Manual refresh function
 * @returns bookAppointment - Create a new appointment
 * @returns cancelAppointment - Cancel an existing appointment
 * @returns getAppointmentsForDate - Filter appointments by date
 * @returns getMarkedDates - Get calendar marker data
 */
export function useAppointments() {
  const { user } = useAuth();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAppointments = useCallback(async () => {
    if (!user) {
      setAppointments([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const { data, error: fetchError } = await supabase
        .from('appointments')
        .select(`
          *,
          pet:pets(*),
          vet:vets(*)
        `)
        .eq('owner_id', user.id)
        .order('date', { ascending: true });

      if (fetchError) throw fetchError;
      setAppointments((data as Appointment[]) || []);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to fetch appointments';
      setError(message);
      console.error('Error fetching appointments:', err);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchAppointments();
  }, [fetchAppointments]);

  async function bookAppointment(params: {
    vetId: string;
    petId: string | null;
    date: string;
    time: string;
    notes?: string;
  }) {
    if (!user) return { error: new Error('Not authenticated') };

    try {
      const { data, error: insertError } = await supabase
        .from('appointments')
        .insert({
          owner_id: user.id,
          vet_id: params.vetId,
          pet_id: params.petId,
          date: params.date,
          time: params.time,
          status: 'upcoming',
          notes: params.notes || null,
        })
        .select(`
          *,
          pet:pets(*),
          vet:vets(*)
        `)
        .single();

      if (insertError) throw insertError;

      setAppointments((prev) => [...prev, data as Appointment]);
      return { error: null, appointment: data as Appointment };
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to book appointment';
      return { error: new Error(message) };
    }
  }

  async function cancelAppointment(appointmentId: string) {
    try {
      const { error: updateError } = await supabase
        .from('appointments')
        .update({ status: 'cancelled' })
        .eq('id', appointmentId);

      if (updateError) throw updateError;

      setAppointments((prev) =>
        prev.map((a) =>
          a.id === appointmentId ? { ...a, status: 'cancelled' } : a
        )
      );
      return { error: null };
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to cancel appointment';
      return { error: new Error(message) };
    }
  }

  // Get appointments for a specific date
  function getAppointmentsForDate(date: string) {
    return appointments.filter((a) => a.date === date && a.status !== 'cancelled');
  }

  // Get marked dates for calendar (dates that have appointments)
  function getMarkedDates() {
    const marks: Record<string, { marked: boolean; dotColor: string }> = {};
    appointments.forEach((a) => {
      if (a.status !== 'cancelled') {
        marks[a.date] = { marked: true, dotColor: '#71924F' };
      }
    });
    return marks;
  }

  return {
    appointments,
    loading,
    error,
    fetchAppointments,
    bookAppointment,
    cancelAppointment,
    getAppointmentsForDate,
    getMarkedDates,
  };
}
