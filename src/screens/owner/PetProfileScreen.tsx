import React from 'react';
import {
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RouteProp } from '@react-navigation/native';
import { usePets } from '../../hooks/usePets';
import type { OwnerStackParamList } from '../../types';

type PetProfileRouteProp = RouteProp<OwnerStackParamList, 'PetProfile'>;
type NavigationProp = NativeStackNavigationProp<OwnerStackParamList>;

export default function PetProfileScreen() {
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<PetProfileRouteProp>();
  const { petId } = route.params;
  const { pets, deletePet } = usePets();

  const pet = pets.find((p) => p.id === petId);

  if (!pet) {
    return (
      <View className="flex-1 bg-beige items-center justify-center px-8">
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          className="absolute top-14 left-5 w-10 h-10 rounded-full bg-white items-center justify-center shadow-sm"
          activeOpacity={0.7}
        >
          <Ionicons name="arrow-back" size={22} color="#343434" />
        </TouchableOpacity>
        <Ionicons name="alert-circle-outline" size={48} color="#9BA1A8" />
        <Text className="text-grey text-base mt-3">Pet not found</Text>
      </View>
    );
  }

  function handleDelete() {
    Alert.alert(
      'Delete Pet',
      `Are you sure you want to remove ${pet!.name} from your pets?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            const { error } = await deletePet(pet!.id);
            if (error) {
              Alert.alert('Error', error.message);
            } else {
              navigation.goBack();
            }
          },
        },
      ]
    );
  }

  return (
    <View className="flex-1 bg-beige">
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View className="px-5 pt-14 pb-4 flex-row items-center justify-between">
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            className="w-10 h-10 rounded-full bg-white items-center justify-center shadow-sm"
            activeOpacity={0.7}
            accessibilityLabel="Go back"
            accessibilityRole="button"
          >
            <Ionicons name="arrow-back" size={22} color="#343434" />
          </TouchableOpacity>
          <Text className="text-lg font-semibold text-heading">Pet Profile</Text>
          <View className="flex-row gap-2">
            <TouchableOpacity
              onPress={() => navigation.navigate('EditPet', { petId: pet.id })}
              className="w-10 h-10 rounded-full bg-white items-center justify-center shadow-sm"
              activeOpacity={0.7}
              accessibilityLabel="Edit pet"
              accessibilityRole="button"
            >
              <Ionicons name="create-outline" size={20} color="#71924F" />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={handleDelete}
              className="w-10 h-10 rounded-full bg-white items-center justify-center shadow-sm"
              activeOpacity={0.7}
              accessibilityLabel="Delete pet"
              accessibilityRole="button"
            >
              <Ionicons name="trash-outline" size={20} color="#EF4444" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Pet Photo */}
        <View className="items-center mt-2">
          <View className="w-[140px] h-[140px] rounded-full overflow-hidden bg-input-bg border-[3px] border-primary-border">
            {pet.image_url ? (
              <Image
                source={{ uri: pet.image_url }}
                className="w-full h-full"
                resizeMode="cover"
              />
            ) : (
              <View className="w-full h-full items-center justify-center">
                <Ionicons name="paw" size={50} color="#71924F" />
              </View>
            )}
          </View>
          <Text className="text-2xl font-bold text-heading mt-4">{pet.name}</Text>
          <Text className="text-sm text-grey mt-1">{pet.breed || pet.species}</Text>
        </View>

        {/* Info Cards */}
        <View className="mx-5 mt-6">
          <View className="flex-row flex-wrap gap-3">
            <InfoCard icon="paw" label="Species" value={pet.species} />
            {pet.gender && <InfoCard icon="male-female" label="Gender" value={pet.gender} />}
            {pet.age && <InfoCard icon="calendar" label="Age" value={`${pet.age} ${Number(pet.age) === 1 ? 'year' : 'years'}`} />}
            {pet.weight && <InfoCard icon="fitness" label="Weight" value={`${pet.weight} kg`} />}
            {pet.color && <InfoCard icon="color-palette" label="Color" value={pet.color} />}
          </View>
        </View>

        {/* Additional Info */}
        {pet.card_number && (
          <View className="mx-5 mt-4 bg-white rounded-card p-4">
            <Text className="text-sm font-medium text-heading">Card Number</Text>
            <Text className="text-sm text-grey mt-1">{pet.card_number}</Text>
          </View>
        )}

        {pet.sterilization_date && (
          <View className="mx-5 mt-3 bg-white rounded-card p-4">
            <Text className="text-sm font-medium text-heading">Sterilization Date</Text>
            <Text className="text-sm text-grey mt-1">{pet.sterilization_date}</Text>
          </View>
        )}

        <View className="h-[40px]" />
      </ScrollView>
    </View>
  );
}

function InfoCard({ icon, label, value }: { icon: string; label: string; value: string }) {
  return (
    <View className="w-[48%] bg-white rounded-card p-4 shadow-sm">
      <View className="flex-row items-center mb-2">
        <View className="w-8 h-8 rounded-full bg-primary/10 items-center justify-center mr-2">
          <Ionicons name={icon as keyof typeof Ionicons.glyphMap} size={16} color="#71924F" />
        </View>
        <Text className="text-xs text-grey">{label}</Text>
      </View>
      <Text className="text-sm font-medium text-dark">{value}</Text>
    </View>
  );
}
