import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors, Typography } from '../../lib/constants';
import { useAuth } from '../../context/AuthContext';

export default function SplashScreen() {
  const { loading } = useAuth();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Paws & Prognosis</Text>
      <Text style={styles.subtitle}>Veterinary Clinic</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.cream,
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
    color: Colors.textSecondary,
  },
});
