import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface CategoryIconProps {
  name: string;
  icon: string;
  isActive?: boolean;
  onPress: () => void;
}

export default function CategoryIcon({ name, icon, isActive = false, onPress }: CategoryIconProps) {
  return (
    <TouchableOpacity className="items-center w-[75px]" onPress={onPress} activeOpacity={0.7}>
      <View
        className={`w-[75px] h-[75px] rounded-full items-center justify-center ${
          isActive ? 'bg-primary' : 'bg-primary-light'
        }`}
      >
        <Ionicons name={icon as keyof typeof Ionicons.glyphMap} size={37} color="#FFF" />
      </View>
      <Text className="text-xs font-medium text-heading mt-2 text-center">{name}</Text>
    </TouchableOpacity>
  );
}
