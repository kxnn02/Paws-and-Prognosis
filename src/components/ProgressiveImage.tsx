import React, { useState } from 'react';
import { View, Image, ImageProps, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface ProgressiveImageProps extends Omit<ImageProps, 'source'> {
  uri: string | null | undefined;
  fallbackIcon?: keyof typeof Ionicons.glyphMap;
  iconSize?: number;
  iconColor?: string;
  showLoader?: boolean;
}

/**
 * Image component with loading state and fallback.
 * Shows a placeholder icon while loading or if the image fails.
 */
export default function ProgressiveImage({
  uri,
  fallbackIcon = 'image-outline',
  iconSize = 32,
  iconColor = '#9BA1A8',
  showLoader = true,
  className,
  style,
  ...props
}: ProgressiveImageProps) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  if (!uri || error) {
    return (
      <View
        className={`bg-gray-100 items-center justify-center ${className || ''}`}
        style={style}
        accessibilityRole="image"
      >
        <Ionicons name={fallbackIcon} size={iconSize} color={iconColor} />
      </View>
    );
  }

  return (
    <View className={className} style={style}>
      {loading && showLoader && (
        <View className="absolute inset-0 bg-gray-100 items-center justify-center z-10">
          <ActivityIndicator size="small" color="#71924F" />
        </View>
      )}
      <Image
        source={{ uri }}
        className={className}
        style={[style, { position: loading ? 'absolute' : 'relative' }]}
        onLoad={() => setLoading(false)}
        onError={() => { setError(true); setLoading(false); }}
        {...props}
      />
    </View>
  );
}
