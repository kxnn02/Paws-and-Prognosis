import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { Colors, Radius, Shadow, Spacing } from '../lib/constants';

interface CardProps {
  children: React.ReactNode;
  style?: ViewStyle;
  variant?: 'default' | 'glass';
}

export default function Card({ children, style, variant = 'default' }: CardProps) {
  return (
    <View style={[styles.base, variant === 'glass' && styles.glass, style]}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  base: {
    backgroundColor: Colors.card,
    borderRadius: Radius.lg,
    padding: Spacing['2xl'],
    ...Shadow.md,
  },
  glass: {
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.8)',
    borderRadius: Radius.xl,
  },
});
