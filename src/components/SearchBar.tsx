import React from 'react';
import { View, TextInput } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface SearchBarProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
}

export default function SearchBar({ value, onChangeText, placeholder = 'Search' }: SearchBarProps) {
  return (
    <View className="flex-row items-center bg-white border border-primary-light rounded-btn h-[52px] px-4 shadow-sm">
      <TextInput
        className="flex-1 text-base text-dark"
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor="#9BA1A8"
        accessibilityRole="search"
        accessibilityLabel={placeholder}
        returnKeyType="search"
      />
      <View className="w-[1px] h-6 bg-gray-200 mx-3" />
      <Ionicons name="search" size={22} color="#A7A7A7" />
    </View>
  );
}
