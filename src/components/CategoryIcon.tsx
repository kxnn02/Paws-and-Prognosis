import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Typography, Radius, Shadow, Spacing } from '../lib/constants';

interface CategoryIconProps {
  name: string;
  icon: string;
  isActive?: boolean;
  onPress: () => void;
}

export default function CategoryIcon({ name, icon, isActive = false, onPress }: CategoryIconProps) {
  return (
    <TouchableOpacity style={styles.container} onPress={onPress} activeOpacity={0.7}>
      <View style={[styles.iconCircle, isActive && styles.iconCircleActive]}>
        <Ionicons name={icon as keyof typeof Ionicons.glyphMap} size={37} color={Colors.textWhite} />
      </View>
      <Text style={styles.label}>{name}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    width: 75,
  },
  iconCircle: {
    width: 75,
    height: 75,
    borderRadius: Radius.full,
    backgroundColor: Colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    ...Shadow.category,
  },
  iconCircleActive: {
    backgroundColor: Colors.primary,
  },
  label: {
    ...Typography.captionMedium,
    color: Colors.textHeading,
    marginTop: Spacing.sm,
    textAlign: 'center',
  },
});
