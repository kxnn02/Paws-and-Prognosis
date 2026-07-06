import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';
import type { Reminder } from '../types';

export function useReminders() {
  const { user } = useAuth();
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [loading, setLoading] = useState(true);

  // Resolve vet_id from user
  const fetchReminders = useCallback(async () => {
    if (!user) {
      setReminders([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);

      // Get vet record for current user
      const { data: vetData } = await supabase
        .from('vets')
        .select('id')
        .eq('user_id', user.id)
        .single();

      if (!vetData) {
        // Vet record doesn't exist yet — silently return empty
        setReminders([]);
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from('reminders')
        .select('*')
        .eq('vet_id', vetData.id)
        .order('due_date', { ascending: true });

      if (error) throw error;
      setReminders((data as Reminder[]) || []);
    } catch (err) {
      console.error('Error fetching reminders:', err);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchReminders();
  }, [fetchReminders]);

  async function markAsRead(reminderId: string) {
    try {
      const { error } = await supabase
        .from('reminders')
        .update({ is_read: true })
        .eq('id', reminderId);

      if (error) throw error;

      setReminders((prev) =>
        prev.map((r) => (r.id === reminderId ? { ...r, is_read: true } : r))
      );
      return { error: null };
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to mark reminder';
      return { error: new Error(message) };
    }
  }

  function getUnreadCount() {
    return reminders.filter((r) => !r.is_read).length;
  }

  function getUpcoming() {
    const today = new Date().toISOString().split('T')[0];
    return reminders.filter((r) => r.due_date >= today && !r.is_read);
  }

  return { reminders, loading, markAsRead, getUnreadCount, getUpcoming, fetchReminders };
}
