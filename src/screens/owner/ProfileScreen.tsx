import React from 'react';
import { View, Text, TouchableOpacity, Alert, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../context/AuthContext';
import type { OwnerStackParamList } from '../../types';

type NavigationProp = NativeStackNavigationProp<OwnerStackParamList>;

export default function ProfileScreen() {
  const navigation = useNavigation<NavigationProp>();
  const { profile, user, signOut, refreshProfile } = useAuth();

  async function handleAvatarPick() {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission Required', 'Please allow photo library access.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7,
    });

    if (!result.canceled && result.assets[0] && user) {
      try {
        const uri = result.assets[0].uri;
        const fileExt = uri.split('.').pop() || 'jpg';
        const fileName = `${user.id}/avatar.${fileExt}`;

        const response = await fetch(uri);
        const blob = await response.blob();
        const arrayBuffer = await new Response(blob).arrayBuffer();

        await supabase.storage.from('pet-images').upload(fileName, arrayBuffer, {
          contentType: `image/${fileExt}`,
          upsert: true,
        });

        const { data: urlData } = supabase.storage.from('pet-images').getPublicUrl(fileName);

        await supabase.from('profiles').update({ avatar_url: urlData.publicUrl }).eq('id', user.id);
        await refreshProfile();
      } catch {
        Alert.alert('Error', 'Failed to upload photo.');
      }
    }
  }

  function handleLogout() {
    Alert.alert(
      'Leaving already?',
      'Are you sure you want to log out?',
      [
        { text: 'Stay', style: 'cancel' },
        { text: 'Log out', style: 'destructive', onPress: signOut },
      ]
    );
  }

  return (
    <View className="flex-1 bg-beige">
      {/* Header */}
      <View className="px-5 pt-14 pb-6">
        <Text className="text-2xl font-bold text-heading">Profile</Text>
      </View>

      {/* User Info */}
      <View className="items-center px-5 mb-6">
        <TouchableOpacity onPress={handleAvatarPick} activeOpacity={0.8}>
          <View className="w-[80px] h-[80px] rounded-full bg-primary/20 items-center justify-center mb-3 overflow-hidden">
            {profile?.avatar_url ? (
              <Image source={{ uri: profile.avatar_url }} className="w-full h-full" resizeMode="cover" />
            ) : (
              <Ionicons name="person" size={36} color="#71924F" />
            )}
          </View>
          <View className="absolute bottom-2 right-0 w-6 h-6 rounded-full bg-primary items-center justify-center border-2 border-white">
            <Ionicons name="camera" size={12} color="#FFF" />
          </View>
        </TouchableOpacity>
        <Text className="text-xl font-semibold text-dark">
          {profile?.name || 'User'}
        </Text>
        <Text className="text-sm text-grey mt-1">
          {profile?.email || ''}
        </Text>
        <Text className="text-xs text-primary mt-1 font-medium">
          {profile?.role === 'pet_owner' ? 'Pet Owner' : 'Veterinarian'}
        </Text>
      </View>

      {/* Menu Items */}
      <View className="px-5">
        <MenuItem
          icon="paw"
          label="My Pets"
          onPress={() => navigation.navigate('MyPets')}
        />
        <MenuItem
          icon="person-circle-outline"
          label="Account Info"
          onPress={() => navigation.navigate('EditProfile')}
        />
        <MenuItem
          icon="notifications-outline"
          label="Notifications"
          onPress={() => Alert.alert('Coming Soon', 'Notifications will be available in a future update.')}
        />
        <MenuItem
          icon="help-circle-outline"
          label="Help & Support"
          onPress={() => Alert.alert('Help & Support', 'For assistance, email support@pawsandprognosis.com')}
        />
      </View>

      {/* Logout */}
      <View className="px-5 mt-8">
        <TouchableOpacity
          onPress={handleLogout}
          className="bg-red-50 rounded-btn h-[48px] flex-row items-center justify-center"
          activeOpacity={0.8}
        >
          <Ionicons name="log-out-outline" size={20} color="#EF4444" />
          <Text className="text-sm font-semibold text-red-500 ml-2">Log Out</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

function MenuItem({ icon, label, onPress }: { icon: string; label: string; onPress: () => void }) {
  return (
    <TouchableOpacity
      onPress={onPress}
      className="bg-white rounded-btn px-4 h-[52px] flex-row items-center mb-3 shadow-sm"
      activeOpacity={0.7}
    >
      <View className="w-8 h-8 rounded-full bg-primary/10 items-center justify-center mr-3">
        <Ionicons name={icon as keyof typeof Ionicons.glyphMap} size={18} color="#71924F" />
      </View>
      <Text className="flex-1 text-sm font-medium text-dark">{label}</Text>
      <Ionicons name="chevron-forward" size={18} color="#9BA1A8" />
    </TouchableOpacity>
  );
}
