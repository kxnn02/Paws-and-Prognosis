import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useVets } from '../../hooks/useVets';
import { mockVets } from '../../data/mockVets';
import type { Vet, OwnerStackParamList } from '../../types';

type NavigationProp = NativeStackNavigationProp<OwnerStackParamList>;

const CATEGORIES = [
  { id: '1', name: 'Health', icon: 'heart' as const },
  { id: '2', name: 'Grooming', icon: 'cut' as const },
  { id: '3', name: 'Pet Food', icon: 'nutrition' as const },
  { id: '4', name: 'Boarding', icon: 'home' as const },
];

export default function HomeScreen() {
  const navigation = useNavigation<NavigationProp>();
  const { vets: supabaseVets, loading: vetsLoading, fetchVets } = useVets();
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  // Use real vets from Supabase, fall back to mock if none exist yet
  const allVets = supabaseVets.length > 0 ? supabaseVets : mockVets;

  const filteredVets = search
    ? allVets.filter((v) =>
        v.name.toLowerCase().includes(search.toLowerCase()) ||
        v.specialty.toLowerCase().includes(search.toLowerCase())
      )
    : allVets;

  async function onRefresh() {
    setRefreshing(true);
    await fetchVets();
    setRefreshing(false);
  }

  return (
    <ScrollView
      className="flex-1 bg-beige"
      showsVerticalScrollIndicator={false}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#71924F" />
      }
    >
      {/* Banner */}
      <TouchableOpacity
        className="mx-5 mt-16 rounded-card overflow-hidden"
        activeOpacity={0.8}
        onPress={() => navigation.navigate('TipsScreen')}
      >
        <View className="bg-primary/80 p-5 flex-row items-center justify-between">
          <View className="flex-1 mr-3">
            <Text className="text-white font-bold text-base">
              Take care of pet's health
            </Text>
            <Text className="text-white/70 text-xs mt-1">
              Tips and tricks for your pet
            </Text>
          </View>
          <View className="w-10 h-10 bg-white/20 rounded-full items-center justify-center">
            <Ionicons name="arrow-forward" size={20} color="#FFF" />
          </View>
        </View>
      </TouchableOpacity>

      {/* Categories */}
      <View className="mt-6 px-5">
        <Text className="text-xl font-bold text-heading mb-4">Category</Text>
        <View className="flex-row justify-between">
          {CATEGORIES.map((cat) => (
            <TouchableOpacity
              key={cat.id}
              className="items-center"
              onPress={() => setActiveCategory(activeCategory === cat.id ? null : cat.id)}
              activeOpacity={0.7}
            >
              <View
                className={`w-[70px] h-[70px] rounded-full items-center justify-center shadow-sm ${
                  activeCategory === cat.id ? 'bg-primary' : 'bg-primary-light'
                }`}
              >
                <Ionicons name={cat.icon} size={32} color="#FFF" />
              </View>
              <Text className="text-xs font-medium text-heading mt-2">{cat.name}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Search Bar */}
      <View className="mx-5 mt-6 flex-row items-center bg-white border border-primary-light rounded-btn h-[52px] px-4">
        <TextInput
          className="flex-1 text-base text-dark"
          placeholder="Search"
          placeholderTextColor="#A7A7A7"
          value={search}
          onChangeText={setSearch}
        />
        <View className="w-[1px] h-6 bg-gray-200 mx-3" />
        <Ionicons name="search" size={22} color="#A7A7A7" />
      </View>

      {/* Veterinary Grid */}
      <View className="px-5 mt-6 mb-6">
        <Text className="text-xl font-bold text-heading mb-4">Veterinary</Text>

        {vetsLoading ? (
          <View className="items-center py-8">
            <ActivityIndicator size="large" color="#71924F" />
          </View>
        ) : filteredVets.length === 0 ? (
          <View className="items-center py-8">
            <Ionicons name="search-outline" size={36} color="#9BA1A8" />
            <Text className="text-sm text-grey mt-3 text-center">
              {search ? `No vets found for "${search}"` : 'No veterinarians available'}
            </Text>
          </View>
        ) : (
          <View className="flex-row flex-wrap justify-between">
            {filteredVets.map((vet) => (
              <VetCard key={vet.id} vet={vet} onPress={() => navigation.navigate('VetDetails', { vetId: vet.id })} />
            ))}
          </View>
        )}
      </View>

      {/* Bottom spacing for tab bar */}
      <View className="h-[100px]" />
    </ScrollView>
  );
}

function VetCard({ vet, onPress }: { vet: Vet; onPress: () => void }) {
  return (
    <TouchableOpacity
      className="bg-primary rounded-card w-[48%] mb-4 pb-4 shadow-md"
      activeOpacity={0.8}
      onPress={onPress}
    >
      {/* Vet Image */}
      <View className="items-center pt-2">
        <Image
          source={{ uri: vet.image_url || '' }}
          className="w-[130px] h-[130px] rounded-full border-[3px] border-primary-border"
        />
      </View>

      {/* Info */}
      <View className="px-3 mt-2">
        <Text className="text-[13px] font-semibold text-white" numberOfLines={1}>
          {vet.name}
        </Text>
        <Text className="text-[11px] text-dark mt-[2px]" numberOfLines={1}>
          {vet.specialty}
        </Text>
        <View className="flex-row items-center mt-1">
          <Ionicons name="star" size={12} color="#7BBD38" />
          <Text className="text-[11px] text-dark ml-1">{vet.rating}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}
