import React from 'react';
import { View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useChatThreads } from '../hooks/useChat';

interface ChatTabIconProps {
  color: string;
  size: number;
}

export default function ChatTabIcon({ color, size }: ChatTabIconProps) {
  const { threads } = useChatThreads();
  const unreadCount = threads.reduce((sum, t) => sum + t.unreadCount, 0);

  return (
    <View>
      <Ionicons name="chatbubble-outline" size={size} color={color} />
      {unreadCount > 0 && (
        <View className="absolute -top-1 -right-2 bg-red-500 rounded-full min-w-[16px] h-[16px] items-center justify-center px-1">
          <Text className="text-[10px] text-white font-bold">
            {unreadCount > 99 ? '99+' : unreadCount}
          </Text>
        </View>
      )}
    </View>
  );
}
