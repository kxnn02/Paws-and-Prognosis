import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { Colors, Typography, Spacing, Radius } from '../../lib/constants';
import { useAuth } from '../../context/AuthContext';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { AuthStackParamList, UserRole } from '../../types';

interface Props {
  navigation: NativeStackNavigationProp<AuthStackParamList, 'SignUp'>;
}

export default function SignUpScreen({ navigation }: Props) {
  const { signUp } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<UserRole>('pet_owner');
  const [loading, setLoading] = useState(false);

  async function handleSignUp() {
    if (!name || !email || !password) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }
    setLoading(true);
    const { error } = await signUp(email, password, name, role);
    if (error) Alert.alert('Error', error.message);
    setLoading(false);
  }

  return (
    <View style={styles.container}>
      <Text style={styles.brand}>Paws & Prognosis Veterinary Clinic</Text>

      <View style={styles.card}>
        <Text style={styles.title}>Join the Pack!</Text>

        <TextInput
          style={styles.input}
          placeholder="Full Name"
          value={name}
          onChangeText={setName}
        />
        <TextInput
          style={styles.input}
          placeholder="Email Address"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />
        <TextInput
          style={styles.input}
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />

        <View style={styles.roleContainer}>
          <TouchableOpacity
            style={[styles.roleButton, role === 'pet_owner' && styles.roleActive]}
            onPress={() => setRole('pet_owner')}
          >
            <Text style={[styles.roleText, role === 'pet_owner' && styles.roleTextActive]}>Pet Owner</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.roleButton, role === 'veterinarian' && styles.roleActive]}
            onPress={() => setRole('veterinarian')}
          >
            <Text style={[styles.roleText, role === 'veterinarian' && styles.roleTextActive]}>Veterinarian</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.button} onPress={handleSignUp} disabled={loading}>
          <Text style={styles.buttonText}>{loading ? 'Creating Account...' : 'Create Account'}</Text>
        </TouchableOpacity>

        <View style={styles.footer}>
          <Text style={styles.footerText}>Already have an account? </Text>
          <TouchableOpacity onPress={() => navigation.navigate('Login')}>
            <Text style={styles.link}>Log In</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.cream,
    padding: Spacing.lg,
    justifyContent: 'center',
  },
  brand: {
    ...Typography.bodySmall,
    color: Colors.textSecondary,
    marginBottom: Spacing['2xl'],
  },
  card: {
    backgroundColor: Colors.card,
    borderRadius: Radius.lg,
    padding: Spacing['2xl'],
  },
  title: {
    ...Typography.h2,
    color: Colors.text,
    textAlign: 'center',
    marginBottom: Spacing['2xl'],
  },
  input: {
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: Radius.sm,
    padding: Spacing.md,
    marginBottom: Spacing.md,
    fontSize: 16,
  },
  roleContainer: {
    flexDirection: 'row',
    gap: Spacing.sm,
    marginBottom: Spacing.lg,
  },
  roleButton: {
    flex: 1,
    padding: Spacing.md,
    borderRadius: Radius.sm,
    borderWidth: 1,
    borderColor: Colors.border,
    alignItems: 'center',
  },
  roleActive: {
    backgroundColor: Colors.primaryLight,
    borderColor: Colors.primary,
  },
  roleText: {
    ...Typography.bodySmall,
    color: Colors.textSecondary,
  },
  roleTextActive: {
    color: Colors.primary,
    fontWeight: '600',
  },
  button: {
    backgroundColor: Colors.primary,
    borderRadius: Radius.sm,
    padding: Spacing.lg,
    alignItems: 'center',
    marginBottom: Spacing.lg,
  },
  buttonText: {
    ...Typography.button,
    color: '#FFFFFF',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  footerText: {
    ...Typography.bodySmall,
    color: Colors.textSecondary,
  },
  link: {
    ...Typography.bodySmall,
    color: Colors.primary,
    fontWeight: '600',
  },
});
