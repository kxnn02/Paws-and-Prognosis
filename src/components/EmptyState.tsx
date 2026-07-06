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

/**
 * Reusable empty state placeholder with icon, text, and optional CTA.
 */
export default function EmptyState({
  icon,
  title,
  description,
  actionLabel,
  onAction,
}: EmptyStateProps) {
  return (
    <View className="flex-1 items-center justify-center px-10 py-16">
      {/* Illustration placeholder — icon in circular background */}
      <View className="w-[90px] h-[90px] rounded-full bg-primary/8 items-center justify-center mb-5">
        <View className="w-[70px] h-[70px] rounded-full bg-primary/12 items-center justify-center">
          <Ionicons name={icon} size={32} color="#71924F" />
        </View>
      </View>

      <Text className="text-lg font-semibold text-heading text-center">{title}</Text>
      <Text className="text-sm text-grey text-center mt-2 leading-5">{description}</Text>

      {actionLabel && onAction && (
        <TouchableOpacity
          onPress={onAction}
          className="mt-5 bg-primary px-6 py-3 rounded-btn shadow-sm"
          activeOpacity={0.8}
        >
          <Text className="text-sm font-medium text-white">{actionLabel}</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}
