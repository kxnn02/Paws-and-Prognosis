import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { Colors, Typography, Spacing } from '../../lib/constants';
import { useAuth } from '../../context/AuthContext';

export default function VetAccountScreen() {
  const { profile, signOut } = useAuth();

  function handleLogout() {
    Alert.alert(
      'Leaving already?',
      'Are you sure you want to log out?',
      [
        { text: 'Stay', style: 'cancel' },
        { text: 'Log out', style: 'destructive', onPress: signOut },
      ]
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{profile?.name || 'Account'}</Text>
      <Text style={styles.subtitle}>Veterinarian</Text>
      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutText}>Log out</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background, justifyContent: 'center', alignItems: 'center', padding: 24 },
  title: { ...Typography.h2, color: Colors.textDark, marginBottom: 8 },
  subtitle: { ...Typography.body, color: Colors.textGrey, marginBottom: Spacing['3xl'] },
  logoutButton: { backgroundColor: Colors.error, paddingHorizontal: 32, paddingVertical: 12, borderRadius: 8 },
  logoutText: { ...Typography.button, color: '#FFF' },
});
