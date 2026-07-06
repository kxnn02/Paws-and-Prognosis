import { useState, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAuth } from '../context/AuthContext';

const FAVORITES_KEY = 'favorite_vets';

/**
 * Hook to manage favorite vets (stored locally via AsyncStorage).
 * Scoped per user to prevent cross-account leaks.
 */
export function useFavoriteVets() {
  const { user } = useAuth();
  const [favoriteIds, setFavoriteIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  const storageKey = user ? `${FAVORITES_KEY}_${user.id}` : null;

  const loadFavorites = useCallback(async () => {
    if (!storageKey) {
      setFavoriteIds([]);
      setLoading(false);
      return;
    }

    try {
      const stored = await AsyncStorage.getItem(storageKey);
      if (stored) {
        setFavoriteIds(JSON.parse(stored));
      } else {
        setFavoriteIds([]);
      }
    } catch (err) {
      console.error('Error loading favorites:', err);
      setFavoriteIds([]);
    } finally {
      setLoading(false);
    }
  }, [storageKey]);

  useEffect(() => {
    loadFavorites();
  }, [loadFavorites]);

  async function toggleFavorite(vetId: string) {
    if (!storageKey) return;

    const updated = favoriteIds.includes(vetId)
      ? favoriteIds.filter((id) => id !== vetId)
      : [...favoriteIds, vetId];

    setFavoriteIds(updated);
    try {
      await AsyncStorage.setItem(storageKey, JSON.stringify(updated));
    } catch (err) {
      console.error('Error saving favorites:', err);
    }
  }

  function isFavorite(vetId: string): boolean {
    return favoriteIds.includes(vetId);
  }

  return { favoriteIds, loading, toggleFavorite, isFavorite };
}
