import React from 'react';
import { View, Text, TouchableOpacity, Alert, ScrollView, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useAuth } from '../../context/AuthContext';
import { useAvatarUpload } from '../../hooks/useAvatarUpload';
import MenuItem from '../../components/MenuItem';
import Avatar from '../../components/Avatar';
import type { OwnerStackParamList } from '../../types';

type NavigationProp = NativeStackNavigationProp<OwnerStackParamList>;

export default function ProfileScreen() {
  const navigation = useNavigation<NavigationProp>();
  const { profile, signOut } = useAuth();
  const { pickAndUploadAvatar, uploading } = useAvatarUpload();

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
    <ScrollView className="flex-1 bg-beige" showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>
      {/* Header */}
      <View className="px-5 pt-14 pb-6">
        <Text className="text-[22px] font-bold text-heading">Profile</Text>
      </View>

      {/* User Info */}
      <View className="items-center px-5 mb-6">
        <TouchableOpacity onPress={pickAndUploadAvatar} activeOpacity={0.8} disabled={uploading}>
          <Avatar uri={profile?.avatar_url} name={profile?.name} size={80} />
          <View className="absolute bottom-0 right-0 w-6 h-6 rounded-full bg-primary items-center justify-center border-2 border-white">
            {uploading ? (
              <ActivityIndicator size={10} color="#FFF" />
            ) : (
              <Ionicons name="camera" size={12} color="#FFF" />
            )}
          </View>
        </TouchableOpacity>
        {uploading && (
          <Text className="text-xs text-grey mt-2">Uploading...</Text>
        )}
        <Text className="text-lg font-semibold text-dark mt-3">
          {profile?.name || 'User'}
        </Text>
        <Text className="text-sm text-grey mt-1">
          {profile?.email || ''}
        </Text>
        <Text className="text-[11px] text-primary mt-1 font-semibold bg-primary/10 px-3 py-0.5 rounded-full">Pet Owner</Text>
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
          label="Notifications (coming soon)"
          onPress={() => Alert.alert('Coming Soon', 'Notifications will be available in a future update.')}
        />
        <MenuItem
          icon="help-circle-outline"
          label="Help & Support (coming soon)"
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
    </ScrollView>
  );
}
