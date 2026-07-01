import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors, Typography } from '../../lib/constants';

export default function ChatListScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Chats</Text>
      <Text style={styles.subtitle}>Conversation threads with vets</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background, justifyContent: 'center', alignItems: 'center', padding: 24 },
  title: { ...Typography.h2, color: Colors.text, marginBottom: 8 },
  subtitle: { ...Typography.body, color: Colors.textSecondary, textAlign: 'center' },
});
