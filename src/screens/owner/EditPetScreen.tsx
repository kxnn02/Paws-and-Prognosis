import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Image,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { useNavigation, useRoute } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RouteProp } from '@react-navigation/native';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { usePets } from '../../hooks/usePets';
import { supabase } from '../../lib/supabase';
import type { OwnerStackParamList } from '../../types';

type NavigationProp = NativeStackNavigationProp<OwnerStackParamList>;
type EditPetRouteProp = RouteProp<OwnerStackParamList, 'EditPet'>;

const petSchema = z.object({
  name: z.string().min(1, 'Pet name is required').max(50, 'Name too long'),
  species: z.string().min(1, 'Species is required'),
  breed: z.string().min(1, 'Breed is required').max(50, 'Breed too long'),
  age: z.string().max(20).optional(),
  gender: z.string().max(10).optional(),
  weight: z.string().max(20).optional(),
  color: z.string().max(30).optional(),
});

type PetFormData = z.infer<typeof petSchema>;

const SPECIES_OPTIONS = ['Dog', 'Cat', 'Bird', 'Rabbit', 'Hamster', 'Fish', 'Other'];

export default function EditPetScreen() {
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<EditPetRouteProp>();
  const { petId } = route.params;

  const { pets, fetchPets, uploadPetImage } = usePets();
  const pet = pets.find((p) => p.id === petId);

  const [imageUri, setImageUri] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<PetFormData>({
    resolver: zodResolver(petSchema),
    defaultValues: {
      name: pet?.name || '',
      species: pet?.species || '',
      breed: pet?.breed || '',
      age: pet?.age || '',
      gender: pet?.gender || '',
      weight: pet?.weight || '',
      color: pet?.color || '',
    },
  });

  if (!pet) {
    return (
      <View className="flex-1 bg-beige items-center justify-center">
        <Ionicons name="alert-circle-outline" size={48} color="#9BA1A8" />
        <Text className="text-grey text-base mt-3">Pet not found</Text>
        <TouchableOpacity onPress={() => navigation.goBack()} className="mt-4 bg-primary/10 px-4 py-2 rounded-btn">
          <Text className="text-primary font-medium text-sm">Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  async function pickImage() {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission Required', 'Please allow access to your photo library.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      setImageUri(result.assets[0].uri);
    }
  }

  async function takePhoto() {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission Required', 'Please allow camera access.');
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      setImageUri(result.assets[0].uri);
    }
  }

  function showImageOptions() {
    Alert.alert('Change Photo', 'Choose an option', [
      { text: 'Camera', onPress: takePhoto },
      { text: 'Photo Library', onPress: pickImage },
      { text: 'Cancel', style: 'cancel' },
    ]);
  }

  async function onSubmit(data: PetFormData) {
    setSubmitting(true);
    try {
      const { error } = await supabase
        .from('pets')
        .update({
          name: data.name.trim(),
          species: data.species,
          breed: data.breed.trim(),
          age: data.age?.trim() || null,
          gender: data.gender?.trim() || null,
          weight: data.weight?.trim() || null,
          color: data.color?.trim() || null,
        })
        .eq('id', petId);

      if (error) throw error;

      // Upload new image if selected
      if (imageUri) {
        await uploadPetImage(petId, imageUri);
      }

      await fetchPets();
      Alert.alert('Updated', `${data.name}'s info has been saved.`, [
        { text: 'OK', onPress: () => navigation.goBack() },
      ]);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to update pet';
      Alert.alert('Error', message);
    } finally {
      setSubmitting(false);
    }
  }

  const displayImage = imageUri || pet.image_url;

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
          Edit Pet
        </Text>
      </View>

      <KeyboardAvoidingView
        className="flex-1"
        behavior="padding"
      >
        <ScrollView
          className="flex-1 px-5"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 120 }}
          keyboardShouldPersistTaps="handled"
        >
          {/* Image */}
          <TouchableOpacity
            onPress={showImageOptions}
            className="self-center mt-4 mb-6"
            activeOpacity={0.8}
          >
            <View className="w-[120px] h-[120px] rounded-full overflow-hidden bg-input-bg border-[3px] border-primary-border items-center justify-center">
              {displayImage ? (
                <Image source={{ uri: displayImage }} className="w-full h-full" resizeMode="cover" />
              ) : (
                <View className="items-center">
                  <Ionicons name="camera" size={32} color="#71924F" />
                  <Text className="text-xs text-grey mt-1">Add Photo</Text>
                </View>
              )}
            </View>
            <View className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-primary items-center justify-center border-2 border-white">
              <Ionicons name="pencil" size={14} color="#FFF" />
            </View>
          </TouchableOpacity>

          {/* Form Fields */}
          <FormField label="Pet Name" name="name" control={control} placeholder="e.g. Max" error={errors.name?.message} />

          {/* Species Selector */}
          <Text className="text-sm font-medium text-dark mb-2 mt-4">Species</Text>
          <Controller
            control={control}
            name="species"
            render={({ field: { onChange, value } }) => (
              <View className="flex-row flex-wrap gap-2 mb-1">
                {SPECIES_OPTIONS.map((sp) => (
                  <TouchableOpacity
                    key={sp}
                    onPress={() => onChange(sp)}
                    className={`px-4 py-2 rounded-btn ${
                      value === sp ? 'bg-primary' : 'bg-white border border-gray-200'
                    }`}
                    activeOpacity={0.7}
                  >
                    <Text className={`text-sm ${value === sp ? 'text-white font-medium' : 'text-dark'}`}>
                      {sp}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          />
          {errors.species && <Text className="text-xs text-red-500 mt-1">{errors.species.message}</Text>}

          <FormField label="Breed" name="breed" control={control} placeholder="e.g. Golden Retriever" error={errors.breed?.message} />

          <View className="flex-row gap-3">
            <View className="flex-1">
              <FormField label="Age" name="age" control={control} placeholder="e.g. 2 years" error={errors.age?.message} />
            </View>
            <View className="flex-1">
              <FormField label="Gender" name="gender" control={control} placeholder="Male / Female" error={errors.gender?.message} />
            </View>
          </View>

          <View className="flex-row gap-3">
            <View className="flex-1">
              <FormField label="Weight" name="weight" control={control} placeholder="e.g. 12 kg" error={errors.weight?.message} />
            </View>
            <View className="flex-1">
              <FormField label="Color" name="color" control={control} placeholder="e.g. Golden" error={errors.color?.message} />
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Save Button */}
      <View className="absolute bottom-0 left-0 right-0 px-5 pb-8 pt-4 bg-beige">
        <TouchableOpacity
          onPress={handleSubmit(onSubmit)}
          disabled={submitting}
          className={`bg-primary h-[52px] rounded-btn items-center justify-center shadow-md ${submitting ? 'opacity-60' : ''}`}
          activeOpacity={0.8}
        >
          {submitting ? (
            <ActivityIndicator color="#FFF" />
          ) : (
            <Text className="text-white text-base font-semibold">Save Changes</Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
}

interface FormFieldProps {
  label: string;
  name: string;
  control: ReturnType<typeof useForm<PetFormData>>['control'];
  placeholder: string;
  error?: string;
}

function FormField({ label, name, control, placeholder, error }: FormFieldProps) {
  return (
    <View className="mt-4">
      <Text className="text-sm font-medium text-dark mb-2">{label}</Text>
      <Controller
        control={control}
        name={name as keyof PetFormData}
        render={({ field: { onChange, onBlur, value } }) => (
          <TextInput
            className="bg-white rounded-btn px-4 h-[46px] text-sm text-dark border border-gray-200"
            placeholder={placeholder}
            placeholderTextColor="#A7A7A7"
            value={value}
            onChangeText={onChange}
            onBlur={onBlur}
            maxLength={50}
          />
        )}
      />
      {error && <Text className="text-xs text-red-500 mt-1">{error}</Text>}
    </View>
  );
}
