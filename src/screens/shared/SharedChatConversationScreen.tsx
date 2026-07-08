import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  KeyboardAvoidingView,
  ActivityIndicator,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useAuth } from '../../context/AuthContext';
import { useChatMessages } from '../../hooks/useChat';
import type { Message } from '../../types';

interface ChatConversationParams {
  threadId: string;
  participantName: string;
}

interface Props {
  /** Icon shown in the header avatar */
  headerIcon?: keyof typeof Ionicons.glyphMap;
  /** Subtitle under the participant name */
  subtitle?: string;
}

export default function SharedChatConversationScreen({
  headerIcon = 'person',
  subtitle = 'Messages are private & secure',
}: Props) {
  const navigation = useNavigation();
  const route = useRoute();
  const { threadId, participantName } = route.params as ChatConversationParams;

  const { user } = useAuth();
  const { messages, loading, sending, sendMessage, partnerTyping, setTyping } = useChatMessages(threadId);

  const [input, setInput] = useState('');
  const flatListRef = useRef<FlatList<Message>>(null);

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    if (messages.length > 0) {
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  }, [messages.length]);

  // Notify typing state on input changes
  const handleInputChange = useCallback((text: string) => {
    setInput(text);
    setTyping(text.length > 0);
  }, [setTyping]);

  async function handleSend() {
    const trimmed = input.trim();
    if (!trimmed) return;

    setInput('');
    setTyping(false);

    const { error } = await sendMessage(trimmed);
    if (error) {
      setInput(trimmed); // Restore on failure
    }
  }

  function formatMessageTime(dateStr: string) {
    const date = new Date(dateStr);
    return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
  }

  function formatDateSeparator(dateStr: string) {
    const date = new Date(dateStr);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) return 'Today';
    if (date.toDateString() === yesterday.toDateString()) return 'Yesterday';
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  }

  function renderMessage({ item, index }: { item: Message; index: number }) {
    const isMe = item.sender_id === user?.id;
    const showDate =
      index === 0 ||
      new Date(item.created_at).toDateString() !==
        new Date(messages[index - 1].created_at).toDateString();

    return (
      <View>
        {showDate && (
          <View className="items-center my-3">
            <Text className="text-[10px] text-grey bg-beige px-3 py-1 rounded-full">
              {formatDateSeparator(item.created_at)}
            </Text>
          </View>
        )}

        <View className={`px-4 mb-2 ${isMe ? 'items-end' : 'items-start'}`}>
          <View
            className={`max-w-[80%] px-4 py-2.5 ${
              isMe
                ? 'bg-primary rounded-tl-[16px] rounded-tr-[4px] rounded-bl-[16px] rounded-br-[16px]'
                : 'bg-white rounded-tl-[4px] rounded-tr-[16px] rounded-bl-[16px] rounded-br-[16px] border border-gray-100'
            }`}
          >
            <Text className={`text-sm ${isMe ? 'text-white' : 'text-dark'}`}>
              {item.content}
            </Text>
          </View>
          <View className="flex-row items-center mt-1 mx-1">
            <Text className="text-[10px] text-grey">
              {formatMessageTime(item.created_at)}
            </Text>
            {isMe && (
              <Ionicons
                name="checkmark-done"
                size={12}
                color="#9BA1A8"
                style={{ marginLeft: 4 }}
              />
            )}
          </View>
        </View>
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
      <View className="px-5 pt-14 pb-3 flex-row items-center bg-beige border-b border-gray-100">
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          className="w-10 h-10 rounded-full bg-white items-center justify-center shadow-sm mr-3"
          activeOpacity={0.7}
        >
          <Ionicons name="arrow-back" size={22} color="#343434" />
        </TouchableOpacity>
        <View className="w-9 h-9 rounded-full bg-primary/15 items-center justify-center mr-3">
          <Ionicons name={headerIcon} size={16} color="#71924F" />
        </View>
        <View className="flex-1">
          <Text className="text-base font-semibold text-dark">{participantName}</Text>
          <Text className="text-[10px] text-grey">{subtitle}</Text>
        </View>
      </View>

      {/* Messages */}
      <KeyboardAvoidingView
        className="flex-1"
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={0}
      >
        <FlatList
          ref={flatListRef}
          data={messages}
          keyExtractor={(item) => item.id}
          renderItem={renderMessage}
          contentContainerStyle={{ paddingVertical: 12 }}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View className="items-center pt-20">
              <Ionicons name="chatbubble-ellipses-outline" size={40} color="#D1D5DB" />
              <Text className="text-sm text-grey mt-3">Start a conversation</Text>
            </View>
          }
        />

        {/* Typing Indicator */}
        {partnerTyping && (
          <View className="px-4 py-2">
            <View className="flex-row items-center">
              <View className="flex-row items-center bg-white rounded-full px-3 py-1.5 border border-gray-100">
                <View className="w-2 h-2 rounded-full bg-primary/60 mr-1" />
                <View className="w-2 h-2 rounded-full bg-primary/40 mr-1" />
                <View className="w-2 h-2 rounded-full bg-primary/20" />
              </View>
              <Text className="text-[10px] text-grey ml-2">{participantName} is typing...</Text>
            </View>
          </View>
        )}

        {/* Input */}
        <View className="px-4 pb-6 pt-3 bg-white border-t border-gray-100">
          <View className="flex-row items-end">
            <TextInput
              className="flex-1 bg-input-bg rounded-btn px-4 py-3 text-sm text-dark max-h-[100px]"
              placeholder="Type a message..."
              placeholderTextColor="#A7A7A7"
              value={input}
              onChangeText={handleInputChange}
              multiline
              maxLength={2000}
              returnKeyType="default"
            />
            <TouchableOpacity
              onPress={handleSend}
              disabled={!input.trim() || sending}
              className={`ml-3 w-10 h-10 rounded-full items-center justify-center ${
                input.trim() ? 'bg-primary' : 'bg-gray-200'
              }`}
              activeOpacity={0.7}
            >
              {sending ? (
                <ActivityIndicator size="small" color="#FFF" />
              ) : (
                <Ionicons name="send" size={18} color={input.trim() ? '#FFF' : '#9BA1A8'} />
              )}
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}
