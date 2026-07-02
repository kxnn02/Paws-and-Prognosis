import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useChatThreads } from '../../hooks/useChat';
import type { ChatThread, OwnerStackParamList } from '../../types';

type NavigationProp = NativeStackNavigationProp<OwnerStackParamList>;

export default function ChatListScreen() {
  const navigation = useNavigation<NavigationProp>();
  const { threads, loading, fetchThreads } = useChatThreads();
  const [refreshing, setRefreshing] = useState(false);

  async function onRefresh() {
    setRefreshing(true);
    await fetchThreads();
    setRefreshing(false);
  }

  function formatTime(dateStr: string) {
    const date = new Date(dateStr);
    const now = new Date();
    const diffDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));

    if (diffDays === 0) {
      return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
    } else if (diffDays === 1) {
      return 'Yesterday';
    } else if (diffDays < 7) {
      return date.toLocaleDateString('en-US', { weekday: 'short' });
    }
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  }

  function renderThread({ item }: { item: ChatThread }) {
    return (
      <TouchableOpacity
        onPress={() =>
          navigation.navigate('ChatConversation', {
            threadId: item.id,
            participantName: item.participant.name,
          })
        }
        className="bg-white mx-5 mb-3 rounded-card p-4 flex-row items-center shadow-sm"
        activeOpacity={0.7}
      >
        {/* Avatar */}
        <View className="w-[48px] h-[48px] rounded-full bg-primary/15 items-center justify-center mr-3">
          <Ionicons
            name={item.participant.role === 'veterinarian' ? 'medical' : 'person'}
            size={22}
            color="#71924F"
          />
        </View>

        {/* Content */}
        <View className="flex-1 mr-2">
          <View className="flex-row items-center justify-between">
            <Text className="text-sm font-semibold text-dark" numberOfLines={1}>
              {item.participant.name}
            </Text>
            <Text className="text-[10px] text-grey">{formatTime(item.lastMessageTime)}</Text>
          </View>
          <Text className="text-xs text-grey mt-1" numberOfLines={1}>
            {item.lastMessage}
          </Text>
        </View>

        {/* Unread badge */}
        {item.unreadCount > 0 && (
          <View className="w-5 h-5 rounded-full bg-primary items-center justify-center">
            <Text className="text-[10px] text-white font-bold">
              {item.unreadCount > 9 ? '9+' : item.unreadCount}
            </Text>
          </View>
        )}
      </TouchableOpacity>
    );
  }

  function renderEmpty() {
    return (
      <View className="flex-1 items-center justify-center px-10 pt-20">
        <View className="w-[80px] h-[80px] rounded-full bg-primary/10 items-center justify-center mb-4">
          <Ionicons name="chatbubbles-outline" size={36} color="#71924F" />
        </View>
        <Text className="text-lg font-semibold text-heading text-center">No messages yet</Text>
        <Text className="text-sm text-grey text-center mt-2">
          Start a conversation by messaging a vet from their profile page.
        </Text>
        <TouchableOpacity
          onPress={() => navigation.getParent()?.navigate('Home')}
          className="mt-4 bg-primary px-5 py-2.5 rounded-btn"
          activeOpacity={0.8}
        >
          <Text className="text-sm font-medium text-white">Find a Vet</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (loading) {
    return (
      <View className="flex-1 bg-beige items-center justify-center">
        <ActivityIndicator size="large" color="#71924F" />
      </View>
    );
  }

  return (
    <View className="flex-1 bg-beige">
      {/* Header */}
      <View className="px-5 pt-14 pb-4">
        <Text className="text-2xl font-bold text-heading">Messages</Text>
        <Text className="text-xs text-grey mt-1">Your conversations are end-to-end private</Text>
      </View>

      <FlatList
        data={threads}
        keyExtractor={(item) => item.id}
        renderItem={renderThread}
        ListEmptyComponent={renderEmpty}
        contentContainerStyle={{ paddingTop: 4, paddingBottom: 100 }}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#71924F" />
        }
      />
    </View>
  );
}
