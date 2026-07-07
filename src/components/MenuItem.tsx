import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface MenuItemProps {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  onPress: () => void;
  iconColor?: string;
  iconBgColor?: string;
}

export default function MenuItem({
  icon,
  label,
  onPress,
  iconColor = '#71924F',
  iconBgColor = 'bg-primary/10',
}: MenuItemProps) {
  return (
    <TouchableOpacity
      onPress={onPress}
      className="bg-white rounded-btn px-4 h-[52px] flex-row items-center mb-3 shadow-sm"
      activeOpacity={0.7}
      accessibilityRole="button"
      accessibilityLabel={label}
    >
      <View className={`w-8 h-8 rounded-full ${iconBgColor} items-center justify-center mr-3`}>
        <Ionicons name={icon} size={18} color={iconColor} />
      </View>
      <Text className="flex-1 text-sm font-medium text-dark">{label}</Text>
      <Ionicons name="chevron-forward" size={18} color="#9BA1A8" />
    </TouchableOpacity>
  );
}
