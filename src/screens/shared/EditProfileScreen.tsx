import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../components/Toast';
import { editProfileSchema, EditProfileFormData } from '../../lib/schemas';

export default function EditProfileScreen() {
  const navigation = useNavigation();
  const { profile, user, refreshProfile } = useAuth();
  const { showToast } = useToast();

  const [saving, setSaving] = useState(false);

  const { control, handleSubmit, formState: { errors, isDirty } } = useForm<EditProfileFormData>({
    resolver: zodResolver(editProfileSchema),
    mode: 'onBlur',
    defaultValues: {
      name: profile?.name || '',
      phone: profile?.phone || '',
      specialty: '',
    },
  });

  // Unsaved changes warning
  React.useEffect(() => {
    const unsubscribe = navigation.addListener('beforeRemove', (e) => {
      if (!isDirty) return;
      e.preventDefault();
      Alert.alert(
        'Discard Changes?',
        'You have unsaved changes. Are you sure you want to leave?',
        [
          { text: 'Stay', style: 'cancel' },
          { text: 'Discard', style: 'destructive', onPress: () => navigation.dispatch(e.data.action) },
        ]
      );
    });
    return unsubscribe;
  }, [navigation, isDirty]);

  async function onSubmit(data: EditProfileFormData) {
    if (!user) return;
    setSaving(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          name: data.name.trim(),
          phone: data.phone?.trim() || null,
        })
        .eq('id', user.id);
      if (error) throw error;

      // Update vet specialty if applicable
      if (profile?.role === 'veterinarian' && data.specialty?.trim()) {
        await supabase
          .from('vets')
          .update({ specialty: data.specialty.trim() })
          .eq('user_id', user.id);
      }

      await refreshProfile();
      showToast('Profile updated successfully!', 'success');
      navigation.goBack();
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to update profile';
      showToast(message, 'error');
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
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
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
          <Text className="text-[13px] font-semibold text-heading mb-1.5">Name</Text>
          <Controller
            control={control}
            name="name"
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                className={`bg-white rounded-btn px-4 h-[46px] text-sm text-dark border ${errors.name ? 'border-red-400' : 'border-gray-200'} mb-1`}
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                placeholder="Your name"
                placeholderTextColor="#A7A7A7"
              />
            )}
          />
          {errors.name && (
            <Text className="text-xs text-red-500 mb-3">{errors.name.message}</Text>
          )}
          {!errors.name && <View className="mb-3" />}

          {/* Email (read-only) */}
          <Text className="text-[13px] font-semibold text-heading mb-1.5">Email</Text>
          <View className="bg-input-bg rounded-btn px-4 h-[46px] justify-center mb-4">
            <Text className="text-[14px] text-grey">{profile?.email || ''}</Text>
          </View>
          <Text className="text-xs text-grey -mt-3 mb-4">Email cannot be changed</Text>

          {/* Phone */}
          <Text className="text-[13px] font-semibold text-heading mb-1.5">Phone Number</Text>
          <Controller
            control={control}
            name="phone"
            render={({ field: { onChange, onBlur, value } }) => (
              <View className="flex-row items-center mb-1">
                <View className="bg-input-bg rounded-l-btn px-3 h-[46px] justify-center border border-r-0 border-gray-200">
                  <Text className="text-sm text-grey">+63</Text>
                </View>
                <TextInput
                  className={`flex-1 bg-white rounded-r-btn px-4 h-[46px] text-sm text-dark border ${errors.phone ? 'border-red-400' : 'border-gray-200'}`}
                  value={value?.replace('+63', '')}
                  onChangeText={(text) => {
                    const digits = text.replace(/[^0-9]/g, '').slice(0, 10);
                    onChange(digits ? `+63${digits}` : '');
                  }}
                  onBlur={onBlur}
                  placeholder="9XX XXX XXXX"
                  placeholderTextColor="#A7A7A7"
                  keyboardType="phone-pad"
                  maxLength={10}
                />
              </View>
            )}
          />
          {errors.phone && (
            <Text className="text-xs text-red-500 mb-1">{errors.phone.message}</Text>
          )}
          {!errors.phone && <View className="mb-3" />}

          {/* Role (read-only) */}
          <Text className="text-[13px] font-semibold text-heading mb-1.5">Role</Text>
          <View className="bg-input-bg rounded-btn px-4 h-[46px] justify-center mb-4">
            <Text className="text-[14px] text-grey capitalize">
              {profile?.role === 'pet_owner' ? 'Pet Owner' : 'Veterinarian'}
            </Text>
          </View>

          {/* Specialty (vet only) */}
          {profile?.role === 'veterinarian' && (
            <>
              <Text className="text-[13px] font-semibold text-heading mb-1.5">Specialty / Expertise</Text>
              <Controller
                control={control}
                name="specialty"
                render={({ field: { onChange, onBlur, value } }) => (
                  <TextInput
                    className="bg-white rounded-btn px-4 h-[46px] text-sm text-dark border border-gray-200 mb-4"
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    placeholder="e.g. Surgery & Emergency"
                    placeholderTextColor="#A7A7A7"
                  />
                )}
              />
            </>
          )}
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Save Button */}
      <View className="px-5 pb-8 pt-4">
        <TouchableOpacity
          onPress={handleSubmit(onSubmit)}
          disabled={saving}
          className={`bg-primary h-[52px] rounded-btn items-center justify-center shadow-md ${saving ? 'opacity-60' : ''}`}
          activeOpacity={0.8}
        >
          {saving ? (
            <ActivityIndicator color="#FFF" />
          ) : (
            <Text className="text-white text-[15px] font-bold">Save Changes</Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
}
