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
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { usePets } from '../../hooks/usePets';
import type { OwnerStackParamList } from '../../types';

type NavigationProp = NativeStackNavigationProp<OwnerStackParamList>;

const petSchema = z.object({
  name: z.string().min(1, 'Pet name is required'),
  species: z.string().min(1, 'Species is required'),
  breed: z.string().min(1, 'Breed is required'),
  age: z.string().optional(),
  gender: z.string().optional(),
  weight: z.string().optional(),
  color: z.string().optional(),
});

type PetFormData = z.infer<typeof petSchema>;

const SPECIES_OPTIONS = ['Dog', 'Cat', 'Bird', 'Rabbit', 'Hamster', 'Fish', 'Other'];

export default function AddPetScreen() {
  const navigation = useNavigation<NavigationProp>();
  const { addPet, uploadPetImage } = usePets();
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<PetFormData>({
    resolver: zodResolver(petSchema),
    defaultValues: {
      name: '',
      species: '',
      breed: '',
      age: '',
      gender: '',
      weight: '',
      color: '',
    },
  });

  async function pickImage() {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission Required', 'Please allow access to your photo library to add a pet photo.');
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
      Alert.alert('Permission Required', 'Please allow camera access to take a pet photo.');
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
    Alert.alert('Add Photo', 'Choose an option', [
      { text: 'Camera', onPress: takePhoto },
      { text: 'Photo Library', onPress: pickImage },
      { text: 'Cancel', style: 'cancel' },
    ]);
  }

  async function onSubmit(data: PetFormData) {
    setSubmitting(true);
    try {
      const { error, pet } = await addPet({
        name: data.name,
        species: data.species,
        breed: data.breed,
        age: data.age || null,
        gender: data.gender || null,
        weight: data.weight || null,
        color: data.color || null,
        country: null,
        card_number: null,
        sterilization_date: null,
        image_url: null,
      });

      if (error) {
        Alert.alert('Error', error.message);
        return;
      }

      // Upload image if selected
      if (imageUri && pet) {
        await uploadPetImage(pet.id, imageUri);
      }

      Alert.alert('Success', `${data.name} has been added!`, [
        { text: 'OK', onPress: () => navigation.goBack() },
      ]);
    } catch (err) {
      Alert.alert('Error', 'Something went wrong. Please try again.');
    } finally {
      setSubmitting(false);
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
          Add Pet
        </Text>
      </View>

      <KeyboardAvoidingView
        className="flex-1"
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          className="flex-1 px-5"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 120 }}
          keyboardShouldPersistTaps="handled"
        >
          {/* Image Picker */}
          <TouchableOpacity
            onPress={showImageOptions}
            className="self-center mt-4 mb-6"
            activeOpacity={0.8}
          >
            <View className="w-[120px] h-[120px] rounded-full overflow-hidden bg-input-bg border-[3px] border-primary-border items-center justify-center">
              {imageUri ? (
                <Image
                  source={{ uri: imageUri }}
                  className="w-full h-full"
                  resizeMode="cover"
                />
              ) : (
                <View className="items-center">
                  <Ionicons name="camera" size={32} color="#71924F" />
                  <Text className="text-xs text-grey mt-1">Add Photo</Text>
                </View>
              )}
            </View>
            {imageUri && (
              <View className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-primary items-center justify-center border-2 border-white">
                <Ionicons name="pencil" size={14} color="#FFF" />
              </View>
            )}
          </TouchableOpacity>

          {/* Form Fields */}
          <FormField
            label="Pet Name"
            name="name"
            control={control}
            placeholder="e.g. Max"
            error={errors.name?.message}
          />

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
                    <Text
                      className={`text-sm ${value === sp ? 'text-white font-medium' : 'text-dark'}`}
                    >
                      {sp}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          />
          {errors.species && (
            <Text className="text-xs text-red-500 mt-1">{errors.species.message}</Text>
          )}

          <FormField
            label="Breed"
            name="breed"
            control={control}
            placeholder="e.g. Golden Retriever"
            error={errors.breed?.message}
          />

          <View className="flex-row gap-3">
            <View className="flex-1">
              <FormField
                label="Age"
                name="age"
                control={control}
                placeholder="e.g. 2 years"
                error={errors.age?.message}
              />
            </View>
            <View className="flex-1">
              <FormField
                label="Gender"
                name="gender"
                control={control}
                placeholder="Male / Female"
                error={errors.gender?.message}
              />
            </View>
          </View>

          <View className="flex-row gap-3">
            <View className="flex-1">
              <FormField
                label="Weight"
                name="weight"
                control={control}
                placeholder="e.g. 12 kg"
                error={errors.weight?.message}
              />
            </View>
            <View className="flex-1">
              <FormField
                label="Color"
                name="color"
                control={control}
                placeholder="e.g. Golden"
                error={errors.color?.message}
              />
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Submit Button */}
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
            <Text className="text-white text-base font-semibold">Add Pet</Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
}

// Reusable form field component
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
          />
        )}
      />
      {error && <Text className="text-xs text-red-500 mt-1">{error}</Text>}
    </View>
  );
}
