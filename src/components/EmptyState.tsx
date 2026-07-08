import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface EmptyStateProps {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
}

export default function EmptyState({
  icon,
  title,
  description,
  actionLabel,
  onAction,
}: EmptyStateProps) {
  return (
    <View className="flex-1 items-center justify-center px-10 py-16" accessibilityRole="alert">
      <View className="w-[90px] h-[90px] rounded-full bg-primary/10 items-center justify-center mb-5">
        <View className="w-[70px] h-[70px] rounded-full bg-primary/15 items-center justify-center">
          <Ionicons name={icon} size={32} color="#71924F" />
        </View>
      </View>

      <Text className="text-xl font-semibold text-heading text-center" accessibilityRole="header">
        {title}
      </Text>
      <Text className="text-[13px] text-grey text-center mt-2 leading-5">{description}</Text>

      {actionLabel && onAction && (
        <TouchableOpacity
          onPress={onAction}
          className="mt-5 bg-primary px-6 py-3 rounded-btn shadow-sm"
          activeOpacity={0.8}
          accessibilityRole="button"
          accessibilityLabel={actionLabel}
        >
          <Text className="text-[15px] font-semibold text-white">{actionLabel}</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}
