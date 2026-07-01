import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../context/AuthContext';

export default function EditProfileScreen() {
  const navigation = useNavigation();
  const { profile, user, refreshProfile } = useAuth();

  const [name, setName] = useState(profile?.name || '');
  const [phone, setPhone] = useState(profile?.phone || '');
  const [saving, setSaving] = useState(false);

  async function handleSave() {
    if (!name.trim()) {
      Alert.alert('Error', 'Name cannot be empty.');
      return;
    }
    if (!user) return;

    setSaving(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          name: name.trim(),
          phone: phone.trim() || null,
        })
        .eq('id', user.id);

      if (error) throw error;

      await refreshProfile();
      Alert.alert('Saved', 'Your profile has been updated.', [
        { text: 'OK', onPress: () => navigation.goBack() },
      ]);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to update profile';
      Alert.alert('Error', message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <View className="flex-1 bg-beige">
      {/* Header */}
      <View className="px-5 pt-14 pb-4 flex-row items-center">
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          className="w-10 h-10 rounded-full bg-white items-center justify-center shadow-sm"
          activeOpacity={0.7}
        >
          <Ionicons name="arrow-back" size={22} color="#343434" />
        </TouchableOpacity>
        <Text className="flex-1 text-center text-lg font-semibold text-heading mr-10">
          Edit Profile
        </Text>
      </View>

      <KeyboardAvoidingView
        className="flex-1"
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView className="flex-1 px-5" keyboardShouldPersistTaps="handled">
          {/* Avatar placeholder */}
          <View className="items-center mt-4 mb-6">
            <View className="w-[90px] h-[90px] rounded-full bg-primary/20 items-center justify-center">
              <Ionicons
                name={profile?.role === 'veterinarian' ? 'medical' : 'person'}
                size={40}
                color="#71924F"
              />
            </View>
          </View>

          {/* Name */}
          <Text className="text-sm font-medium text-dark mb-2">Name</Text>
          <TextInput
            className="bg-white rounded-btn px-4 h-[46px] text-sm text-dark border border-gray-200 mb-4"
            value={name}
            onChangeText={setName}
            placeholder="Your name"
            placeholderTextColor="#A7A7A7"
          />

          {/* Email (read-only) */}
          <Text className="text-sm font-medium text-dark mb-2">Email</Text>
          <View className="bg-input-bg rounded-btn px-4 h-[46px] justify-center mb-4">
            <Text className="text-sm text-grey">{profile?.email || ''}</Text>
          </View>
          <Text className="text-xs text-grey -mt-3 mb-4">Email cannot be changed</Text>

          {/* Phone */}
          <Text className="text-sm font-medium text-dark mb-2">Phone Number</Text>
          <TextInput
            className="bg-white rounded-btn px-4 h-[46px] text-sm text-dark border border-gray-200 mb-4"
            value={phone}
            onChangeText={setPhone}
            placeholder="+63 9XX XXX XXXX"
            placeholderTextColor="#A7A7A7"
            keyboardType="phone-pad"
          />

          {/* Role (read-only) */}
          <Text className="text-sm font-medium text-dark mb-2">Role</Text>
          <View className="bg-input-bg rounded-btn px-4 h-[46px] justify-center mb-4">
            <Text className="text-sm text-grey capitalize">
              {profile?.role === 'pet_owner' ? 'Pet Owner' : 'Veterinarian'}
            </Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Save Button */}
      <View className="px-5 pb-8 pt-4">
        <TouchableOpacity
          onPress={handleSave}
          disabled={saving}
          className={`bg-primary h-[52px] rounded-btn items-center justify-center shadow-md ${saving ? 'opacity-60' : ''}`}
          activeOpacity={0.8}
        >
          {saving ? (
            <ActivityIndicator color="#FFF" />
          ) : (
            <Text className="text-white text-base font-semibold">Save Changes</Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
}
