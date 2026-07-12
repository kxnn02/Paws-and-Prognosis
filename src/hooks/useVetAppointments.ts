import { useState, useEffect, useCallback, useRef } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';
import { formatVetNotes } from '../lib/notesHelper';
import type { Appointment } from '../types';

export function useVetAppointments() {
  const { user } = useAuth();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [vetId, setVetId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const vetIdRef = useRef<string | null>(null);

  // First, resolve the vet record for the logged-in user
  const resolveVetId = useCallback(async () => {
    if (!user) return null;

    const { data, error: vetError } = await supabase
      .from('vets')
      .select('id')
      .eq('user_id', user.id)
      .single();

    if (!vetError && data) {
      return data.id as string;
    }

    // Vet record doesn't exist yet — auto-create for existing veterinarian users
    console.warn('Vet record missing, attempting to create...');
    const { data: profileData } = await supabase
      .from('profiles')
      .select('name')
      .eq('id', user.id)
      .single();

    const { data: newVet, error: insertError } = await supabase
      .from('vets')
      .insert({
        user_id: user.id,
        name: profileData?.name || 'Veterinarian',
        specialty: 'General Practice',
        bio: null,
        rating: 0,
        image_url: null,
      })
      .select('id')
      .single();

    if (insertError || !newVet) {
      console.error('Could not create vet record:', insertError);
      return null;
    }

    return newVet.id as string;
  }, [user]);

  const fetchAppointments = useCallback(async () => {
    if (!user) {
      setAppointments([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      let resolvedVetId = vetIdRef.current;
      if (!resolvedVetId) {
        resolvedVetId = await resolveVetId();
        if (!resolvedVetId) {
          setLoading(false);
          setError('Vet profile not found');
          return;
        }
        vetIdRef.current = resolvedVetId;
      }
      setVetId(resolvedVetId);

      const { data, error: fetchError } = await supabase
        .from('appointments')
        .select(`
          *,
          pet:pets(*),
          owner:profiles!appointments_owner_id_fkey(*)
        `)
        .eq('vet_id', resolvedVetId)
        .order('date', { ascending: true })
        .order('time', { ascending: true });

      if (fetchError) throw fetchError;
      setAppointments((data as Appointment[]) || []);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to fetch appointments';
      setError(message);
      console.error('Error fetching vet appointments:', err);
    } finally {
      setLoading(false);
    }
  }, [user, resolveVetId]);

  useEffect(() => {
    fetchAppointments();
  }, [fetchAppointments]);

  async function updateAppointmentStatus(appointmentId: string, status: string) {
    try {
      const { error: updateError } = await supabase
        .from('appointments')
        .update({ status })
        .eq('id', appointmentId);

      if (updateError) throw updateError;

      setAppointments((prev) =>
        prev.map((a) => (a.id === appointmentId ? { ...a, status: status as Appointment['status'] } : a))
      );
      return { error: null };
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to update appointment';
      return { error: new Error(message) };
    }
  }

  async function addNotes(appointmentId: string, vetNotes: string) {
    try {
      // Find current appointment to preserve owner notes
      const currentAppointment = appointments.find((a) => a.id === appointmentId);
      const formattedNotes = formatVetNotes(currentAppointment?.notes || null, vetNotes);

      const { error: updateError } = await supabase
        .from('appointments')
        .update({ notes: formattedNotes })
        .eq('id', appointmentId);

      if (updateError) throw updateError;

      setAppointments((prev) =>
        prev.map((a) => (a.id === appointmentId ? { ...a, notes: formattedNotes } : a))
      );
      return { error: null };
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to add notes';
      return { error: new Error(message) };
    }
  }

  // Get today's appointments
  function getTodayAppointments() {
    const today = new Date().toISOString().split('T')[0];
    return appointments.filter((a) => a.date === today && a.status !== 'cancelled');
  }

  // Get upcoming appointments (today and future, not cancelled)
  function getUpcomingAppointments() {
    const today = new Date().toISOString().split('T')[0];
    return appointments.filter((a) => a.date >= today && a.status !== 'cancelled');
  }

  // Get appointments for a specific date
  function getAppointmentsForDate(date: string) {
    return appointments.filter((a) => a.date === date && a.status !== 'cancelled');
  }

  // Get marked dates for calendar
  function getMarkedDates() {
    const marks: Record<string, { marked: boolean; dotColor: string }> = {};
    appointments.forEach((a) => {
      if (a.status !== 'cancelled') {
        marks[a.date] = { marked: true, dotColor: '#71924F' };
      }
    });
    return marks;
  }

  // Stats
  function getStats() {
    const today = new Date().toISOString().split('T')[0];
    const todayAppts = appointments.filter((a) => a.date === today && a.status !== 'cancelled');
    const upcoming = appointments.filter((a) => a.date >= today && a.status === 'upcoming');
    const completed = appointments.filter((a) => a.status === 'completed');

    return {
      todayCount: todayAppts.length,
      upcomingCount: upcoming.length,
      completedCount: completed.length,
      totalPatients: new Set(appointments.map((a) => a.owner_id)).size,
    };
  }

  return {
    appointments,
    vetId,
    loading,
    error,
    fetchAppointments,
    updateAppointmentStatus,
    addNotes,
    getTodayAppointments,
    getUpcomingAppointments,
    getAppointmentsForDate,
    getMarkedDates,
    getStats,
  };
}
