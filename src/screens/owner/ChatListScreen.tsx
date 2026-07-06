import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  RefreshControl,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useChatThreads } from '../../hooks/useChat';
import { formatRelativeTime } from '../../lib/formatters';
import Avatar from '../../components/Avatar';
import { ChatThreadSkeleton } from '../../components/Skeleton';
import type { ChatThread, OwnerStackParamList } from '../../types';

type NavigationProp = NativeStackNavigationProp<OwnerStackParamList>;

export default function ChatListScreen() {
  const navigation = useNavigation<NavigationProp>();
  const { threads, loading, fetchThreads } = useChatThreads();
  const [refreshing, setRefreshing] = useState(false);
  const [search, setSearch] = useState('');

  // Filter threads by search query
  const filteredThreads = useMemo(() => {
    if (!search.trim()) return threads;
    const query = search.toLowerCase();
    return threads.filter((t) => t.participant.name.toLowerCase().includes(query));
  }, [threads, search]);

  async function onRefresh() {
    setRefreshing(true);
    await fetchThreads();
    setRefreshing(false);
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
        <Avatar
          uri={item.participant.avatar_url}
          name={item.participant.name}
          size={48}
          fallbackIcon={item.participant.role === 'veterinarian' ? 'medical' : 'person'}
        />

        <View className="flex-1 ml-3 mr-2">
          <View className="flex-row items-center justify-between">
            <Text className="text-sm font-semibold text-dark" numberOfLines={1}>
              {item.participant.name}
            </Text>
            <Text className="text-[10px] text-grey">
              {formatRelativeTime(item.lastMessageTime)}
            </Text>
          </View>
          <Text className="text-xs text-grey mt-1" numberOfLines={1}>
            {item.lastMessage}
          </Text>
        </View>

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
    if (search.trim()) {
      return (
        <View className="items-center pt-20">
          <Ionicons name="search-outline" size={36} color="#D1D5DB" />
          <Text className="text-sm text-grey mt-3">No conversations matching "{search}"</Text>
        </View>
      );
    }
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
      <View className="flex-1 bg-beige">
        <View className="px-5 pt-14 pb-4">
          <Text className="text-2xl font-bold text-heading">Messages</Text>
        </View>
        {[1, 2, 3, 4].map((i) => (
          <ChatThreadSkeleton key={i} />
        ))}
      </View>
    );
  }

  return (
    <View className="flex-1 bg-beige">
      {/* Header */}
      <View className="px-5 pt-14 pb-2">
        <Text className="text-2xl font-bold text-heading">Messages</Text>
        <Text className="text-xs text-grey mt-1">Your conversations are end-to-end private</Text>
      </View>

      {/* Search Bar */}
      {threads.length > 0 && (
        <View className="mx-5 mt-2 mb-2 flex-row items-center bg-white rounded-btn h-[42px] px-4 border border-gray-100">
          <Ionicons name="search" size={18} color="#9BA1A8" />
          <TextInput
            className="flex-1 ml-2 text-sm text-dark"
            placeholder="Search conversations..."
            placeholderTextColor="#A7A7A7"
            value={search}
            onChangeText={setSearch}
            maxLength={50}
          />
          {search.length > 0 && (
            <TouchableOpacity onPress={() => setSearch('')}>
              <Ionicons name="close-circle" size={18} color="#9BA1A8" />
            </TouchableOpacity>
          )}
        </View>
      )}

      <FlatList
        data={filteredThreads}
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
