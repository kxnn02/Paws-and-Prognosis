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
import { useForm, Controller, Control } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { petSchema, PetFormData, PET_SPECIES_OPTIONS, PET_GENDER_OPTIONS } from '../../lib/schemas';
import { usePets } from '../../hooks/usePets';
import type { OwnerStackParamList } from '../../types';

type NavigationProp = NativeStackNavigationProp<OwnerStackParamList>;

export default function AddPetScreen() {
  const navigation = useNavigation<NavigationProp>();
  const { addPet, uploadPetImage } = usePets();
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors, isDirty },
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

  React.useEffect(() => {
    const unsubscribe = navigation.addListener('beforeRemove', (e) => {
      if (!isDirty && !imageUri) return;
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
  }, [navigation, isDirty, imageUri]);

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
            accessibilityLabel="Add pet photo"
            accessibilityRole="button"
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
                {PET_SPECIES_OPTIONS.map((sp) => (
                  <TouchableOpacity
                    key={sp}
                    onPress={() => onChange(sp)}
                    className={`px-4 py-2 rounded-btn ${
                      value === sp ? 'bg-primary' : 'bg-white border border-gray-200'
                    }`}
                    activeOpacity={0.7}
                    accessibilityRole="radio"
                    accessibilityState={{ selected: value === sp }}
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
              <View className="mt-4">
                <Text className="text-sm font-medium text-dark mb-2">Age (years)</Text>
                <Controller
                  control={control}
                  name="age"
                  render={({ field: { onChange, onBlur, value } }) => (
                    <TextInput
                      className="bg-white rounded-btn px-4 h-[46px] text-sm text-dark border border-gray-200"
                      placeholder="e.g. 3"
                      placeholderTextColor="#A7A7A7"
                      value={value}
                      onChangeText={(text) => onChange(text.replace(/[^0-9]/g, ''))}
                      onBlur={onBlur}
                      keyboardType="number-pad"
                      maxLength={2}
                    />
                  )}
                />
                {errors.age && <Text className="text-xs text-red-500 mt-1">{errors.age.message}</Text>}
              </View>
            </View>
            <View className="flex-1">
              <View className="mt-4">
                <Text className="text-sm font-medium text-dark mb-2">Weight (kg)</Text>
                <Controller
                  control={control}
                  name="weight"
                  render={({ field: { onChange, onBlur, value } }) => (
                    <TextInput
                      className="bg-white rounded-btn px-4 h-[46px] text-sm text-dark border border-gray-200"
                      placeholder="e.g. 5.2"
                      placeholderTextColor="#A7A7A7"
                      value={value}
                      onChangeText={(text) => {
                        // Allow only digits and one decimal point
                        const cleaned = text.replace(/[^0-9.]/g, '');
                        // Prevent multiple decimal points
                        const parts = cleaned.split('.');
                        const formatted = parts.length > 2
                          ? parts[0] + '.' + parts.slice(1).join('')
                          : cleaned;
                        onChange(formatted);
                      }}
                      onBlur={onBlur}
                      keyboardType="decimal-pad"
                      maxLength={5}
                    />
                  )}
                />
                {errors.weight && <Text className="text-xs text-red-500 mt-1">{errors.weight.message}</Text>}
              </View>
            </View>
          </View>

          {/* Gender Segmented Control */}
          <View className="mt-4">
            <Text className="text-sm font-medium text-dark mb-2">Gender</Text>
            <Controller
              control={control}
              name="gender"
              render={({ field: { onChange, value } }) => (
                <View className="flex-row gap-2">
                  {PET_GENDER_OPTIONS.map((option) => (
                    <TouchableOpacity
                      key={option}
                      onPress={() => onChange(value === option ? '' : option)}
                      className={`flex-1 py-2.5 rounded-btn items-center ${
                        value === option ? 'bg-primary' : 'bg-white border border-gray-200'
                      }`}
                      activeOpacity={0.7}
                      accessibilityRole="radio"
                      accessibilityState={{ selected: value === option }}
                      accessibilityLabel={option}
                    >
                      <Text className={`text-sm font-medium ${value === option ? 'text-white' : 'text-dark'}`}>
                        {option}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              )}
            />
            {errors.gender && <Text className="text-xs text-red-500 mt-1">{errors.gender.message}</Text>}
          </View>

          <FormField
            label="Color"
            name="color"
            control={control}
            placeholder="e.g. Golden"
            error={errors.color?.message}
          />
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
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  control: Control<PetFormData, any, any>;
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
