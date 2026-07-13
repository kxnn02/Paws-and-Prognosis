import { useState } from 'react';
import { Alert, Platform } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { decode } from 'base64-arraybuffer';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';

export function useAvatarUpload() {
  const { user, refreshProfile } = useAuth();
  const [uploading, setUploading] = useState(false);

  async function pickAndUploadAvatar() {
    if (!user) {
      Alert.alert('Error', 'You must be logged in to upload a photo.');
      return;
    }

    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Required', 'Please allow photo library access in your device settings.');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsEditing: false,
        quality: 0.7,
        base64: true,
      });

      if (result.canceled || !result.assets[0]) return;

      const asset = result.assets[0];

      // Get base64 data — either from picker directly or by fetching the URI
      let base64Data = asset.base64;

      if (!base64Data) {
        // Fallback: read the file via fetch and convert to base64
        const response = await fetch(asset.uri);
        const blob = await response.blob();
        base64Data = await new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.onloadend = () => {
            const dataUrl = reader.result as string;
            // Strip the data:image/...;base64, prefix
            const b64 = dataUrl.split(',')[1];
            if (b64) resolve(b64);
            else reject(new Error('Failed to read image as base64'));
          };
          reader.onerror = reject;
          reader.readAsDataURL(blob);
        });
      }

      if (!base64Data) {
        Alert.alert('Error', 'Could not read image data. Please try a different photo.');
        return;
      }

      setUploading(true);

      const fileExt = Platform.OS === 'android' ? 'jpg' : (asset.uri.split('.').pop()?.toLowerCase() || 'jpg');
      const fileName = `${user.id}/avatar.${fileExt}`;
      const contentType = fileExt === 'png' ? 'image/png' : 'image/jpeg';

      // Decode base64 to ArrayBuffer — the only reliable upload method on React Native
      const arrayBuffer = decode(base64Data);

      const { error: uploadError } = await supabase.storage
        .from('pet-images')
        .upload(fileName, arrayBuffer, {
          contentType,
          upsert: true,
        });

      if (uploadError) {
        console.error('Storage upload error:', uploadError);
        Alert.alert('Upload Failed', uploadError.message || 'Could not upload photo to storage.');
        return;
      }

      const { data: urlData } = supabase.storage.from('pet-images').getPublicUrl(fileName);

      // Append cache-busting timestamp so image cache shows the new file
      const publicUrlWithCacheBust = `${urlData.publicUrl}?t=${Date.now()}`;

      const { error: updateError } = await supabase
        .from('profiles')
        .update({ avatar_url: publicUrlWithCacheBust })
        .eq('id', user.id);

      if (updateError) {
        console.error('Profile update error:', updateError);
        Alert.alert('Error', 'Photo uploaded but failed to save to your profile.');
        return;
      }

      await refreshProfile();
      Alert.alert('Success', 'Profile photo updated!');
    } catch (err) {
      console.error('Avatar upload error:', err);
      const message = err instanceof Error ? err.message : 'Unknown error';
      Alert.alert('Error', `Failed to upload photo: ${message}`);
    } finally {
      setUploading(false);
    }
  }

  return { pickAndUploadAvatar, uploading };
}
