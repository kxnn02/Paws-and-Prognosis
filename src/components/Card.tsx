import React from 'react';
import { View } from 'react-native';

interface CardProps {
  children: React.ReactNode;
  variant?: 'default' | 'glass';
  className?: string;
}

export default function Card({ children, variant = 'default', className = '' }: CardProps) {
  const baseClasses = variant === 'glass'
    ? 'bg-white/50 border border-white/80 rounded-glass p-5'
    : 'bg-white rounded-card p-5 shadow-md border border-gray-100';

  return (
    <View className={`${baseClasses} ${className}`} accessibilityRole="summary">
      {children}
    </View>
  );
}
