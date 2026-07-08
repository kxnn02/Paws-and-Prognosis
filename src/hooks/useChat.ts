import { useState, useEffect, useCallback, useRef } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';
import type { Message, ChatThread, Profile } from '../types';
import type { RealtimeChannel } from '@supabase/supabase-js';

/**
 * Chat hook with Supabase Realtime
 *
 * Security & Privacy:
 * - Messages are scoped to authenticated users only (RLS enforced server-side)
 * - Users can only read messages where they are sender OR receiver
 * - Users can only insert messages where they are the sender (prevents impersonation)
 * - No message content is stored locally/cached beyond React state
 * - Realtime subscriptions are authenticated and filtered per-user
 * - Message content is not logged or exposed to third parties
 */

export function useChatThreads() {
  const { user } = useAuth();
  const [threads, setThreads] = useState<ChatThread[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchThreads = useCallback(async () => {
    if (!user) {
      setThreads([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);

      const { data: messages, error } = await supabase
        .from('messages')
        .select('*')
        .or(`sender_id.eq.${user.id},receiver_id.eq.${user.id}`)
        .order('created_at', { ascending: false });

      if (error) throw error;
      if (!messages || messages.length === 0) {
        setThreads([]);
        setLoading(false);
        return;
      }

      // Group by conversation partner
      const threadMap = new Map<string, { messages: Message[]; partnerId: string }>();

      messages.forEach((msg: Message) => {
        const partnerId = msg.sender_id === user.id ? msg.receiver_id : msg.sender_id;
        if (!threadMap.has(partnerId)) {
          threadMap.set(partnerId, { messages: [], partnerId });
        }
        threadMap.get(partnerId)!.messages.push(msg);
      });

      // Fetch partner profiles
      const partnerIds = Array.from(threadMap.keys());
      const { data: profiles } = await supabase
        .from('profiles')
        .select('id, name, avatar_url, role')
        .in('id', partnerIds);

      const profileMap = new Map<string, Profile>();
      profiles?.forEach((p) => profileMap.set(p.id, p as Profile));

      // Build thread list
      const threadList: ChatThread[] = Array.from(threadMap.entries()).map(
        ([partnerId, { messages: msgs }]) => {
          const lastMsg = msgs[0];
          // Note: read_at column doesn't exist in DB, unread tracking unavailable
          const unread = 0;

          const partner = profileMap.get(partnerId);

          return {
            id: partnerId,
            participant: partner || {
              id: partnerId,
              name: 'Unknown',
              role: 'pet_owner',
              avatar_url: null,
              phone: null,
              email: '',
              created_at: '',
            },
            lastMessage: lastMsg.content,
            lastMessageTime: lastMsg.created_at,
            unreadCount: unread,
          };
        }
      );

      threadList.sort(
        (a, b) => new Date(b.lastMessageTime).getTime() - new Date(a.lastMessageTime).getTime()
      );

      setThreads(threadList);
    } catch (err) {
      console.error('Error fetching chat threads:', err);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchThreads();
  }, [fetchThreads]);

  // Subscribe to new messages to refresh threads
  useEffect(() => {
    if (!user) return;

    const channelName = `threads-${user.id}-${Date.now()}`;
    const channel = supabase
      .channel(channelName)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `receiver_id=eq.${user.id}`,
        },
        () => {
          fetchThreads();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  return { threads, loading, fetchThreads };
}

export function useChatMessages(partnerId: string) {
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [partnerTyping, setPartnerTyping] = useState(false);
  const channelRef = useRef<RealtimeChannel | null>(null);
  const lastSendRef = useRef<number>(0);
  const typingTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const fetchMessages = useCallback(async () => {
    if (!user || !partnerId) {
      setMessages([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);

      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .or(
          `and(sender_id.eq.${user.id},receiver_id.eq.${partnerId}),and(sender_id.eq.${partnerId},receiver_id.eq.${user.id})`
        )
        .order('created_at', { ascending: true });

      if (error) throw error;
      setMessages((data as Message[]) || []);
    } catch (err) {
      console.error('Error fetching messages:', err);
    } finally {
      setLoading(false);
    }
  }, [user, partnerId]);

  useEffect(() => {
    fetchMessages();
  }, [fetchMessages]);

  // Realtime subscription for live messages + typing
  useEffect(() => {
    if (!user || !partnerId) return;

    const channel = supabase
      .channel(`chat-${user.id}-${partnerId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
        },
        (payload) => {
          const newMsg = payload.new as Message;
          const isRelevant =
            (newMsg.sender_id === user.id && newMsg.receiver_id === partnerId) ||
            (newMsg.sender_id === partnerId && newMsg.receiver_id === user.id);

          if (isRelevant) {
            setMessages((prev) => {
              if (prev.some((m) => m.id === newMsg.id)) return prev;
              return [...prev, newMsg];
            });
          }
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'messages',
        },
        (payload) => {
          const updated = payload.new as Message;
          setMessages((prev) =>
            prev.map((m) => (m.id === updated.id ? updated : m))
          );
        }
      )
      // Presence for typing indicator
      .on('presence', { event: 'sync' }, () => {
        const state = channel.presenceState();
        const partnerPresence = Object.values(state).flat().find(
          (p: Record<string, unknown>) => p.user_id === partnerId && p.typing
        );
        setPartnerTyping(!!partnerPresence);
      })
      .subscribe(async (status) => {
        if (status === 'SUBSCRIBED') {
          await channel.track({ user_id: user.id, typing: false });
        }
      });

    channelRef.current = channel;

    return () => {
      supabase.removeChannel(channel);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, partnerId]);

  // Broadcast typing state
  function setTyping(isTyping: boolean) {
    if (!channelRef.current || !user) return;
    channelRef.current.track({ user_id: user.id, typing: isTyping });

    // Auto-stop after 3 seconds
    if (isTyping) {
      if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
      typingTimeoutRef.current = setTimeout(() => {
        channelRef.current?.track({ user_id: user.id, typing: false });
      }, 3000);
    }
  }

  async function sendMessage(content: string) {
    if (!user || !partnerId || !content.trim()) return { error: new Error('Invalid input') };

    // Rate limiting: prevent sends within 500ms
    const now = Date.now();
    if (now - lastSendRef.current < 500) {
      return { error: new Error('Please wait before sending another message') };
    }
    lastSendRef.current = now;

    // Input sanitization
    const sanitized = content.trim().slice(0, 2000);

    try {
      setSending(true);
      setTyping(false);

      const { data, error } = await supabase
        .from('messages')
        .insert({
          sender_id: user.id,
          receiver_id: partnerId,
          content: sanitized,
        })
        .select()
        .single();

      if (error) throw error;

      setMessages((prev) => {
        if (prev.some((m) => m.id === (data as Message).id)) return prev;
        return [...prev, data as Message];
      });

      return { error: null };
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to send message';
      return { error: new Error(message) };
    } finally {
      setSending(false);
    }
  }

  return { messages, loading, sending, sendMessage, fetchMessages, partnerTyping, setTyping };
}
