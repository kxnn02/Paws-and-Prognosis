import React from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { Colors, Spacing } from '../../lib/constants';

export default function SplashScreen() {
  return (
    <View style={styles.container}>
      <View style={styles.brandContainer}>
        <Text style={styles.brandPaws}>Paws</Text>
        <Text style={styles.brandAnd}> & </Text>
        <Text style={styles.brandPrognosis}>Prognosis</Text>
      </View>
      <Text style={styles.brandSubtitle}>Veterinary Clinic</Text>
      <ActivityIndicator size="large" color={Colors.primary} style={styles.loader} />
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
  brandContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: 4,
  },
  brandPaws: {
    fontSize: 36,
    fontWeight: '700',
    color: '#7A5C4F',
  },
  brandAnd: {
    fontSize: 36,
    fontWeight: '700',
    color: Colors.textHeading,
  },
  brandPrognosis: {
    fontSize: 36,
    fontWeight: '700',
    color: Colors.primary,
  },
  brandSubtitle: {
    fontSize: 16,
    color: Colors.textHeading,
    marginBottom: Spacing['2xl'],
  },
  loader: {
    marginTop: Spacing['3xl'],
  },
});
