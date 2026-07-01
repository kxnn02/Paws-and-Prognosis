import React from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { Colors, Typography } from '../../lib/constants';

export default function SplashScreen() {

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Paws & Prognosis</Text>
      <Text style={styles.subtitle}>Veterinary Clinic</Text>
      <ActivityIndicator size="large" color={Colors.primary} style={{ marginTop: 24 }} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    ...Typography.h1,
    color: Colors.primary,
    marginBottom: 8,
  },
  subtitle: {
    ...Typography.body,
    color: Colors.textGrey,
  },
});
