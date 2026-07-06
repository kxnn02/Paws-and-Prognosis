import React, { useEffect, useRef } from 'react';
import { View, Animated } from 'react-native';

interface SkeletonProps {
  width?: number | string;
  height?: number;
  borderRadius?: number;
  className?: string;
}

/**
 * Shimmer skeleton placeholder for loading states.
 */
export function Skeleton({ width, height = 16, borderRadius = 8, className = '' }: SkeletonProps) {
  const opacity = useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, { toValue: 0.7, duration: 800, useNativeDriver: true }),
        Animated.timing(opacity, { toValue: 0.3, duration: 800, useNativeDriver: true }),
      ])
    );
    animation.start();
    return () => animation.stop();
  }, [opacity]);

  return (
    <Animated.View
      style={[
        {
          width: width as number | undefined,
          height,
          borderRadius,
          backgroundColor: '#E5E7EB',
          opacity,
        },
      ]}
      className={className}
    />
  );
}

/**
 * Skeleton card for vet list loading state.
 */
export function VetCardSkeleton() {
  return (
    <View className="bg-white rounded-card w-[48%] mb-4 p-3 items-center">
      <Skeleton width={100} height={100} borderRadius={50} />
      <View className="mt-3 w-full items-center">
        <Skeleton width="80%" height={14} />
        <View className="mt-2">
          <Skeleton width="60%" height={12} />
        </View>
        <View className="mt-2">
          <Skeleton width={40} height={12} />
        </View>
      </View>
    </View>
  );
}

/**
 * Skeleton for appointment card loading.
 */
export function AppointmentCardSkeleton() {
  return (
    <View className="bg-white rounded-card p-4 mb-3">
      <View className="flex-row items-center">
        <Skeleton width={44} height={44} borderRadius={22} />
        <View className="ml-3 flex-1">
          <Skeleton width="60%" height={14} />
          <View className="mt-2">
            <Skeleton width="40%" height={12} />
          </View>
        </View>
        <Skeleton width={60} height={24} borderRadius={12} />
      </View>
    </View>
  );
}

/**
 * Skeleton for chat thread list.
 */
export function ChatThreadSkeleton() {
  return (
    <View className="flex-row items-center px-5 py-3">
      <Skeleton width={48} height={48} borderRadius={24} />
      <View className="ml-3 flex-1">
        <Skeleton width="50%" height={14} />
        <View className="mt-2">
          <Skeleton width="80%" height={12} />
        </View>
      </View>
      <Skeleton width={36} height={10} />
    </View>
  );
}

/**
 * Skeleton for pet card loading.
 */
export function PetCardSkeleton() {
  return (
    <View className="bg-white rounded-card p-4 flex-row items-center mb-3">
      <Skeleton width={56} height={56} borderRadius={28} />
      <View className="ml-3 flex-1">
        <Skeleton width="50%" height={14} />
        <View className="mt-2">
          <Skeleton width="30%" height={12} />
        </View>
      </View>
    </View>
  );
}
