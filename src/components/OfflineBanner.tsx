import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface OfflineBannerProps {
  onRetry?: () => void;
}

export default function OfflineBanner({ onRetry }: OfflineBannerProps) {
  return (
    <View
      className="bg-red-500 px-4 py-2 flex-row items-center justify-center"
      accessibilityRole="alert"
      accessibilityLabel="No internet connection"
    >
      <Ionicons name="cloud-offline-outline" size={16} color="#FFF" />
      <Text className="text-white text-xs font-medium ml-2">No Internet Connection</Text>
      {onRetry && (
        <TouchableOpacity
          onPress={onRetry}
          className="ml-3 bg-white/20 px-2 py-1 rounded"
          accessibilityRole="button"
          accessibilityLabel="Retry connection"
        >
          <Text className="text-white text-xs">Retry</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}
