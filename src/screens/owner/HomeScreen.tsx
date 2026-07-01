import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors, Typography } from '../../lib/constants';

export default function HomeScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Home</Text>
      <Text style={styles.subtitle}>Vet browsing, categories, and booking will go here</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background, justifyContent: 'center', alignItems: 'center', padding: 24 },
  title: { ...Typography.h2, color: Colors.text, marginBottom: 8 },
  subtitle: { ...Typography.body, color: Colors.textSecondary, textAlign: 'center' },
});
