import React from 'react';
import { View, Text, TouchableOpacity, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useAuth } from '../../context/AuthContext';
import type { VetStackParamList } from '../../types';

type NavigationProp = NativeStackNavigationProp<VetStackParamList>;

export default function VetAccountScreen() {
  const navigation = useNavigation<NavigationProp>();
  const { profile, signOut } = useAuth();

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
        <View className="w-[80px] h-[80px] rounded-full bg-primary/20 items-center justify-center mb-3">
          <Ionicons name="medical" size={36} color="#71924F" />
        </View>
        <Text className="text-xl font-semibold text-dark">
          {profile?.name || 'Doctor'}
        </Text>
        <Text className="text-sm text-grey mt-1">{profile?.email || ''}</Text>
        <Text className="text-xs text-primary mt-1 font-medium">Veterinarian</Text>
      </View>

      {/* Menu */}
      <View className="px-5">
        <MenuItem icon="person-circle-outline" label="Edit Profile" onPress={() => navigation.navigate('EditProfile')} />
        <MenuItem icon="notifications-outline" label="Notifications" onPress={() => {}} />
        <MenuItem icon="time-outline" label="Working Hours" onPress={() => {}} />
        <MenuItem icon="shield-checkmark-outline" label="Privacy & Security" onPress={() => {}} />
        <MenuItem icon="help-circle-outline" label="Help & Support" onPress={() => {}} />
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
