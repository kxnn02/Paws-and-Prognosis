import React from 'react';
import { View, Text, TouchableOpacity, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useAuth } from '../../context/AuthContext';
import { useAvatarUpload } from '../../hooks/useAvatarUpload';
import MenuItem from '../../components/MenuItem';
import Avatar from '../../components/Avatar';
import type { VetStackParamList } from '../../types';

type NavigationProp = NativeStackNavigationProp<VetStackParamList>;

export default function VetAccountScreen() {
  const navigation = useNavigation<NavigationProp>();
  const { profile, signOut } = useAuth();
  const { pickAndUploadAvatar } = useAvatarUpload();

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
        <Text className="text-2xl font-bold text-heading">Account</Text>
      </View>

      {/* Profile Info */}
      <View className="items-center px-5 mb-6">
        <TouchableOpacity onPress={pickAndUploadAvatar} activeOpacity={0.8}>
          <Avatar uri={profile?.avatar_url} name={profile?.name} size={80} fallbackIcon="medical" />
          <View className="absolute bottom-0 right-0 w-6 h-6 rounded-full bg-primary items-center justify-center border-2 border-white">
            <Ionicons name="camera" size={12} color="#FFF" />
          </View>
        </TouchableOpacity>
        <Text className="text-xl font-semibold text-dark mt-3">
          {profile?.name || 'Doctor'}
        </Text>
        <Text className="text-sm text-grey mt-1">{profile?.email || ''}</Text>
        <Text className="text-xs text-primary mt-1 font-medium">Veterinarian</Text>
      </View>

      {/* Menu */}
      <View className="px-5">
        <MenuItem icon="person-circle-outline" label="Edit Profile" onPress={() => navigation.navigate('EditProfile')} />
        <MenuItem icon="notifications-outline" label="Notifications" onPress={() => Alert.alert('Coming Soon', 'Notifications will be available in a future update.')} />
        <MenuItem icon="time-outline" label="Working Hours" onPress={() => Alert.alert('Coming Soon', 'Working hours settings will be available in a future update.')} />
        <MenuItem icon="shield-checkmark-outline" label="Privacy & Security" onPress={() => Alert.alert('Coming Soon', 'Privacy settings will be available in a future update.')} />
        <MenuItem icon="help-circle-outline" label="Help & Support" onPress={() => Alert.alert('Help & Support', 'For assistance, email support@pawsandprognosis.com')} />
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
