import React from 'react';
import { TouchableOpacity, Text, ActivityIndicator } from 'react-native';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'google';
  loading?: boolean;
  disabled?: boolean;
  className?: string;
}

export default function Button({
  title,
  onPress,
  variant = 'primary',
  loading = false,
  disabled = false,
  className = '',
}: ButtonProps) {
  const baseClasses = 'h-[52px] rounded-btn items-center justify-center shadow-sm';

  const variantClasses = {
    primary: 'bg-primary border border-primary-border',
    secondary: 'bg-primary-light',
    outline: 'bg-transparent border border-primary',
    google: 'bg-input-bg',
  };

  const textClasses = {
    primary: 'text-white',
    secondary: 'text-primary',
    outline: 'text-primary',
    google: 'text-dark',
  };

  const disabledClass = disabled || loading ? 'opacity-60' : '';

  return (
    <TouchableOpacity
      className={`${baseClasses} ${variantClasses[variant]} ${disabledClass} ${className}`}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.8}
      accessibilityRole="button"
      accessibilityLabel={title}
      accessibilityState={{ disabled: disabled || loading }}
    >
      {loading ? (
        <ActivityIndicator color={variant === 'primary' ? '#FFF' : '#71924F'} />
      ) : (
        <Text className={`text-sm font-semibold ${textClasses[variant]}`}>{title}</Text>
      )}
    </TouchableOpacity>
  );
}
