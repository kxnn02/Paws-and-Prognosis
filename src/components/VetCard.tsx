import React from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import type { Vet } from '../types';

interface VetCardProps {
  vet: Vet;
  onPress: () => void;
}

export default function VetCard({ vet, onPress }: VetCardProps) {
  return (
    <TouchableOpacity
      className="bg-primary rounded-card w-[48%] pb-4 mb-4 shadow-md"
      onPress={onPress}
      activeOpacity={0.8}
      accessibilityRole="button"
      accessibilityLabel={`${vet.name}, ${vet.specialty}, rated ${vet.rating} stars`}
      accessibilityHint="Opens veterinarian details"
    >
      <View className="items-center pt-2">
        {vet.image_url ? (
          <Image
            source={{ uri: vet.image_url }}
            className="w-[130px] h-[130px] rounded-full border-[3px] border-primary-border"
            accessibilityRole="image"
            accessibilityLabel={`Photo of ${vet.name}`}
          />
        ) : (
          <View className="w-[130px] h-[130px] rounded-full border-[3px] border-primary-border bg-primary-light items-center justify-center">
            <Ionicons name="person" size={50} color="#FFF" />
          </View>
        )}
      </View>
      <View className="px-3 mt-3">
        <Text className="text-[14px] font-semibold text-white" numberOfLines={1}>
          {vet.name}
        </Text>
        <Text className="text-[12px] text-white/80 mt-[2px]" numberOfLines={1}>
          {vet.specialty}
        </Text>
        <View className="flex-row items-center mt-1">
          <Ionicons name="star" size={12} color="#7BBD38" />
          <Text className="text-[12px] text-white/90 ml-1">{vet.rating}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}
