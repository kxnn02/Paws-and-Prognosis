import React from 'react';
import { View, Text, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { getInitials } from '../lib/formatters';

interface AvatarProps {
  uri?: string | null;
  name?: string | null;
  size?: number;
  /** Fallback icon if no name available */
  fallbackIcon?: keyof typeof Ionicons.glyphMap;
}

/**
 * Avatar component with:
 * 1. Image (if uri provided)
 * 2. Initials (if name provided but no uri)
 * 3. Icon fallback (if neither)
 */
export default function Avatar({
  uri,
  name,
  size = 48,
  fallbackIcon = 'person',
}: AvatarProps) {
  const initials = getInitials(name);
  const fontSize = size * 0.38;
  const iconSize = size * 0.5;

  return (
    <View
      className="rounded-full bg-primary/15 items-center justify-center overflow-hidden"
      style={{ width: size, height: size }}
    >
      {uri ? (
        <Image
          source={{ uri }}
          style={{ width: size, height: size }}
          resizeMode="cover"
        />
      ) : name ? (
        <Text
          className="font-bold text-primary"
          style={{ fontSize }}
        >
          {initials}
        </Text>
      ) : (
        <Ionicons name={fallbackIcon} size={iconSize} color="#71924F" />
      )}
    </View>
  );
}
