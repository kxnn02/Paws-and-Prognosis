import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator, ViewStyle } from 'react-native';
import { Colors, Typography, Radius, Shadow, Spacing } from '../lib/constants';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'google';
  loading?: boolean;
  disabled?: boolean;
  style?: ViewStyle;
}

export default function Button({ title, onPress, variant = 'primary', loading = false, disabled = false, style }: ButtonProps) {
  const buttonStyle = [
    styles.base,
    variant === 'primary' && styles.primary,
    variant === 'secondary' && styles.secondary,
    variant === 'outline' && styles.outline,
    variant === 'google' && styles.google,
    disabled && styles.disabled,
    style,
  ];

  const textStyle = [
    styles.text,
    variant === 'primary' && styles.textPrimary,
    variant === 'secondary' && styles.textSecondary,
    variant === 'outline' && styles.textOutline,
    variant === 'google' && styles.textGoogle,
  ];

  return (
    <TouchableOpacity style={buttonStyle} onPress={onPress} disabled={disabled || loading} activeOpacity={0.8}>
      {loading ? (
        <ActivityIndicator color={variant === 'primary' ? '#FFF' : Colors.primary} />
      ) : (
        <Text style={textStyle}>{title}</Text>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  base: {
    height: 52,
    borderRadius: Radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    ...Shadow.sm,
  },
  primary: {
    backgroundColor: Colors.primary,
    borderWidth: 1,
    borderColor: Colors.primaryBorder,
  },
  secondary: {
    backgroundColor: Colors.primaryLight,
  },
  outline: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: Colors.primary,
  },
  google: {
    backgroundColor: '#F5F5F5',
  },
  disabled: {
    opacity: 0.6,
  },
  text: {
    ...Typography.button,
    textAlign: 'center',
  },
  textPrimary: {
    color: Colors.textWhite,
  },
  textSecondary: {
    color: Colors.primary,
  },
  textOutline: {
    color: Colors.primary,
  },
  textGoogle: {
    color: Colors.textDark,
  },
});
