import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors, Typography } from '../../lib/constants';

export default function VetAppointmentsScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Appointments</Text>
      <Text style={styles.subtitle}>Monthly calendar with day view for all booked visits</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background, justifyContent: 'center', alignItems: 'center', padding: 24 },
  title: { ...Typography.h2, color: Colors.textDark, marginBottom: 8 },
  subtitle: { ...Typography.body, color: Colors.textGrey, textAlign: 'center' },
});
