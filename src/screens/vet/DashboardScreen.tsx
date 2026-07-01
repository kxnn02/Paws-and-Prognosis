import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors, Typography } from '../../lib/constants';
import { useAuth } from '../../context/AuthContext';

export default function DashboardScreen() {
  const { profile } = useAuth();

  return (
    <View style={styles.container}>
      <Text style={styles.greeting}>Hello, {profile?.name || 'Doctor'}!</Text>
      <Text style={styles.subtitle}>Reminders, upcoming cases, and patient info will go here</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background, justifyContent: 'center', alignItems: 'center', padding: 24 },
  greeting: { ...Typography.h2, color: Colors.text, marginBottom: 8 },
  subtitle: { ...Typography.body, color: Colors.textSecondary, textAlign: 'center' },
});
