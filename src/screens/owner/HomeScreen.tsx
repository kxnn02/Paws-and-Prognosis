import React, { useState, useMemo, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Image,
  RefreshControl,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useVets } from '../../hooks/useVets';
import { useAuth } from '../../context/AuthContext';
import { useFavoriteVets } from '../../hooks/useFavoriteVets';
import { VetCardSkeleton } from '../../components/Skeleton';
import type { Vet, OwnerStackParamList } from '../../types';

type NavigationProp = NativeStackNavigationProp<OwnerStackParamList>;

const CATEGORIES = [
  { id: '1', name: 'Health', icon: 'heart' as const },
  { id: '2', name: 'Grooming', icon: 'cut' as const },
  { id: '3', name: 'Pet Food', icon: 'nutrition' as const },
  { id: '4', name: 'Boarding', icon: 'home' as const },
];

// Map category IDs to specialty keywords for filtering
const CATEGORY_FILTER: Record<string, string[]> = {
  '1': ['health', 'general', 'behavioral', 'surgery', 'internal'],
  '2': ['grooming', 'dermatology'],
  '3': ['nutrition', 'diet'],
  '4': ['boarding', 'hospitalization'],
};

export default function HomeScreen() {
  const navigation = useNavigation<NavigationProp>();
  const { profile } = useAuth();
  const { vets: supabaseVets, loading: vetsLoading, fetchVets, error: vetsError } = useVets();
  const { isFavorite, toggleFavorite } = useFavoriteVets();
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [tipsDismissed, setTipsDismissed] = useState(false);

  useEffect(() => {
    AsyncStorage.getItem('tips_banner_dismissed').then((val) => {
      if (val === 'true') setTipsDismissed(true);
    });
  }, []);

  function handleDismissTips() {
    setTipsDismissed(true);
    AsyncStorage.setItem('tips_banner_dismissed', 'true');
  }

  // Use real vets from Supabase
  const allVets = supabaseVets;

  const filteredVets = useMemo(() => allVets.filter((v) => {
    const matchesSearch = !search ||
      v.name.toLowerCase().includes(search.toLowerCase()) ||
      v.specialty.toLowerCase().includes(search.toLowerCase());

    const matchesCategory = !activeCategory ||
      CATEGORY_FILTER[activeCategory]?.some((keyword) =>
        v.specialty.toLowerCase().includes(keyword)
      );

    return matchesSearch && matchesCategory;
  }), [allVets, search, activeCategory]);

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
      {/* Header with Logo */}
      <View className="px-5 mt-14 mb-2 flex-row items-center justify-between">
        <View>
          <Text className="text-[13px] text-grey">Hello,</Text>
          <Text className="text-[22px] font-bold text-heading">{profile?.name || 'Pet Parent'} 👋</Text>
        </View>
        <Image
          source={require('../../../assets/logo-transparent.png')}
          className="w-[78px] h-[78px]"
          resizeMode="contain"
        />
      </View>

      {/* Banner */}
      {!tipsDismissed && (
      <View>
      <TouchableOpacity
        className="mx-5 mt-2 rounded-card overflow-hidden"
        activeOpacity={0.8}
        onPress={() => navigation.navigate('TipsScreen')}
      >
        <View className="bg-primary/80 p-5 flex-row items-center justify-between relative">
          <View className="flex-1 mr-3">
            <Text className="text-white font-bold text-[15px]">
              Take care of pet{"'"}s health
            </Text>
            <Text className="text-white/70 text-xs mt-1">
              Tips and tricks for your pet
            </Text>
          </View>
          <View className="w-10 h-10 bg-white/20 rounded-full items-center justify-center">
            <Ionicons name="arrow-forward" size={20} color="#FFF" />
          </View>
          <TouchableOpacity
            onPress={(e) => { e.stopPropagation(); handleDismissTips(); }}
            className="absolute top-2 right-2 w-6 h-6 rounded-full bg-white/30 items-center justify-center"
            activeOpacity={0.7}
          >
            <Ionicons name="close" size={14} color="#FFF" />
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
      </View>
      )}

      {/* Categories */}
      <View className="mt-4 px-5">
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View className="flex-row gap-2 py-1">
            {CATEGORIES.map((cat) => (
              <TouchableOpacity
                key={cat.id}
                onPress={() => setActiveCategory(activeCategory === cat.id ? null : cat.id)}
                className={`flex-row items-center px-4 py-2.5 rounded-full ${activeCategory === cat.id ? 'bg-primary' : 'bg-white border border-gray-200'}`}
                activeOpacity={0.7}
                accessibilityLabel={cat.name}
                accessibilityRole="button"
              >
                <Ionicons name={cat.icon} size={16} color={activeCategory === cat.id ? '#FFF' : '#71924F'} />
                <Text className={`text-sm font-medium ml-2 ${activeCategory === cat.id ? 'text-white' : 'text-dark'}`}>
                  {cat.name}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
      </View>

      {/* Search Bar */}
      <View className="mx-5 mt-6 flex-row items-center bg-white border border-primary-light rounded-btn h-[52px] px-4">
        <TextInput
          className="flex-1 text-base text-dark"
          placeholder="Search"
          placeholderTextColor="#A7A7A7"
          value={search}
          onChangeText={setSearch}
          accessibilityLabel="Search veterinarians"
        />
        <View className="w-[1px] h-6 bg-gray-200 mx-3" />
        <Ionicons name="search" size={22} color="#A7A7A7" />
      </View>

      {/* Veterinary Grid */}
      <View className="px-5 mt-6 mb-6">
        <Text className="text-lg font-bold text-heading mb-3">Veterinary</Text>

        {vetsLoading ? (
          <View className="flex-row flex-wrap justify-between">
            {[1, 2, 3, 4].map((i) => (
              <VetCardSkeleton key={i} />
            ))}
          </View>
        ) : vetsError ? (
          <View className="items-center py-8">
            <Ionicons name="cloud-offline-outline" size={36} color="#9BA1A8" />
            <Text className="text-sm text-grey mt-3 text-center">
              Could not load veterinarians
            </Text>
            <TouchableOpacity onPress={onRefresh} className="mt-3 bg-primary/10 px-4 py-2 rounded-btn">
              <Text className="text-xs font-medium text-primary">Try Again</Text>
            </TouchableOpacity>
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
              <VetCard
                key={vet.id}
                vet={vet}
                isFav={isFavorite(vet.id)}
                onFavToggle={() => toggleFavorite(vet.id)}
                onPress={() => navigation.navigate('VetDetails', { vetId: vet.id })}
              />
            ))}
          </View>
        )}
      </View>

      {/* Bottom spacing for tab bar */}
      <View className="h-[100px]" />
    </ScrollView>
  );
}

const VetCard = React.memo(function VetCard({ vet, isFav, onFavToggle, onPress }: { vet: Vet; isFav: boolean; onFavToggle: () => void; onPress: () => void }) {
  return (
    <TouchableOpacity
      className="bg-primary rounded-card w-[48%] mb-4 pb-4 shadow-md"
      activeOpacity={0.8}
      onPress={onPress}
    >
      {/* Favorite Button */}
      <TouchableOpacity
        onPress={onFavToggle}
        className="absolute top-2 right-2 z-10 w-7 h-7 rounded-full bg-white/30 items-center justify-center"
        activeOpacity={0.7}
        accessibilityLabel={isFav ? 'Remove from favorites' : 'Add to favorites'}
        accessibilityRole="button"
      >
        <Ionicons
          name={isFav ? 'heart' : 'heart-outline'}
          size={16}
          color={isFav ? '#EF4444' : '#FFF'}
        />
      </TouchableOpacity>

      {/* Vet Image */}
      <View className="items-center pt-2">
        {vet.image_url ? (
          <Image
            source={{ uri: vet.image_url }}
            className="w-[130px] h-[130px] rounded-full border-[3px] border-primary-border"
          />
        ) : (
          <View className="w-[130px] h-[130px] rounded-full border-[3px] border-primary-border bg-primary-light items-center justify-center">
            <Ionicons name="person" size={50} color="#FFF" />
          </View>
        )}
      </View>

      {/* Info */}
      <View className="px-3 mt-3">
        <Text className="text-[14px] font-semibold text-white" numberOfLines={1}>
          {vet.name}
        </Text>
        <Text className="text-[12px] text-white/80 mt-1" numberOfLines={1}>
          {vet.specialty}
        </Text>
        <View className="flex-row items-center mt-1">
          <Ionicons name="star" size={12} color="#7BBD38" />
          <Text className="text-[12px] text-white/90 ml-1">{vet.rating}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
});
