import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';
import type { Pet } from '../types';

export function usePets() {
  const { user } = useAuth();
  const [pets, setPets] = useState<Pet[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPets = useCallback(async () => {
    if (!user) {
      setPets([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const { data, error: fetchError } = await supabase
        .from('pets')
        .select('*')
        .eq('owner_id', user.id)
        .order('created_at', { ascending: false });

      if (fetchError) throw fetchError;
      setPets((data as Pet[]) || []);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to fetch pets';
      setError(message);
      console.error('Error fetching pets:', err);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchPets();
  }, [fetchPets]);

  async function addPet(petData: Omit<Pet, 'id' | 'owner_id' | 'created_at'>) {
    if (!user) return { error: new Error('Not authenticated') };

    try {
      const { data, error: insertError } = await supabase
        .from('pets')
        .insert({ ...petData, owner_id: user.id })
        .select()
        .single();

      if (insertError) throw insertError;

      setPets((prev) => [data as Pet, ...prev]);
      return { error: null, pet: data as Pet };
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to add pet';
      return { error: new Error(message) };
    }
  }

  async function deletePet(petId: string) {
    try {
      const { error: deleteError } = await supabase
        .from('pets')
        .delete()
        .eq('id', petId);

      if (deleteError) throw deleteError;

      setPets((prev) => prev.filter((p) => p.id !== petId));
      return { error: null };
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to delete pet';
      return { error: new Error(message) };
    }
  }

  async function uploadPetImage(petId: string, uri: string): Promise<string | null> {
    if (!user) return null;

    try {
      const fileExt = uri.split('.').pop() || 'jpg';
      const fileName = `${user.id}/${petId}.${fileExt}`;

      // Fetch the image as blob
      const response = await fetch(uri);
      const blob = await response.blob();

      // Convert blob to ArrayBuffer
      const arrayBuffer = await new Response(blob).arrayBuffer();

      const { error: uploadError } = await supabase.storage
        .from('pet-images')
        .upload(fileName, arrayBuffer, {
          contentType: `image/${fileExt}`,
          upsert: true,
        });

      if (uploadError) throw uploadError;

      const { data: urlData } = supabase.storage
        .from('pet-images')
        .getPublicUrl(fileName);

      // Update pet record with image URL
      await supabase
        .from('pets')
        .update({ image_url: urlData.publicUrl })
        .eq('id', petId);

      // Update local state
      setPets((prev) =>
        prev.map((p) => (p.id === petId ? { ...p, image_url: urlData.publicUrl } : p))
      );

      return urlData.publicUrl;
    } catch (err) {
      console.error('Error uploading pet image:', err);
      return null;
    }
  }

  return { pets, loading, error, fetchPets, addPet, deletePet, uploadPetImage };
}
