import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  Image,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { usePets } from '../../hooks/usePets';
import type { Pet, OwnerStackParamList } from '../../types';

type NavigationProp = NativeStackNavigationProp<OwnerStackParamList>;

export default function MyPetsScreen() {
  const navigation = useNavigation<NavigationProp>();
  const { pets, loading } = usePets();

  function renderPetCard({ item }: { item: Pet }) {
    return (
      <TouchableOpacity
        onPress={() => navigation.navigate('PetProfile', { petId: item.id })}
        className="bg-white rounded-card mx-5 mb-4 p-4 flex-row items-center shadow-sm"
        activeOpacity={0.8}
      >
        {/* Pet Image */}
        <View className="w-[64px] h-[64px] rounded-full overflow-hidden bg-input-bg">
          {item.image_url ? (
            <Image
              source={{ uri: item.image_url }}
              className="w-full h-full"
              resizeMode="cover"
            />
          ) : (
            <View className="w-full h-full items-center justify-center">
              <Ionicons name="paw" size={28} color="#71924F" />
            </View>
          )}
        </View>

        {/* Pet Info */}
        <View className="flex-1 ml-4">
          <Text className="text-base font-semibold text-dark">{item.name}</Text>
          <Text className="text-sm text-grey mt-1">
            {item.breed || item.species}
          </Text>
          {item.age && (
            <Text className="text-xs text-light-grey mt-1">{item.age}</Text>
          )}
        </View>

        {/* Arrow */}
        <Ionicons name="chevron-forward" size={20} color="#9BA1A8" />
      </TouchableOpacity>
    );
  }

  function renderEmpty() {
    return (
      <View className="flex-1 items-center justify-center px-10 pt-20">
        <View className="w-[80px] h-[80px] rounded-full bg-primary/10 items-center justify-center mb-4">
          <Ionicons name="paw" size={40} color="#71924F" />
        </View>
        <Text className="text-lg font-semibold text-heading text-center">No pets yet</Text>
        <Text className="text-sm text-grey text-center mt-2">
          Add your first pet to get started with appointments and care tracking.
        </Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-beige">
      {/* Header */}
      <View className="px-5 pt-14 pb-4 flex-row items-center justify-between">
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          className="w-10 h-10 rounded-full bg-white items-center justify-center shadow-sm"
          activeOpacity={0.7}
        >
          <Ionicons name="arrow-back" size={22} color="#343434" />
        </TouchableOpacity>
        <Text className="text-lg font-semibold text-heading">My Pets</Text>
        <TouchableOpacity
          onPress={() => navigation.navigate('AddPet')}
          className="w-10 h-10 rounded-full bg-primary items-center justify-center"
          activeOpacity={0.7}
        >
          <Ionicons name="add" size={24} color="#FFF" />
        </TouchableOpacity>
      </View>

      {/* Content */}
      {loading ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#71924F" />
        </View>
      ) : (
        <FlatList
          data={pets}
          keyExtractor={(item) => item.id}
          renderItem={renderPetCard}
          ListEmptyComponent={renderEmpty}
          contentContainerStyle={{ paddingTop: 8, paddingBottom: 100 }}
          showsVerticalScrollIndicator={false}
        />
      )}

      {/* Floating Add Button (visible when pets exist) */}
      {!loading && pets.length > 0 && (
        <TouchableOpacity
          onPress={() => navigation.navigate('AddPet')}
          className="absolute bottom-8 right-6 w-[56px] h-[56px] rounded-full bg-primary items-center justify-center shadow-lg"
          activeOpacity={0.8}
        >
          <Ionicons name="add" size={28} color="#FFF" />
        </TouchableOpacity>
      )}
    </View>
  );
}
