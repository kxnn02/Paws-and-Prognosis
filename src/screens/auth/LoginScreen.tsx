import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { Colors, Typography, Spacing, Radius } from '../../lib/constants';
import { useAuth } from '../../context/AuthContext';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { AuthStackParamList } from '../../types';

interface Props {
  navigation: NativeStackNavigationProp<AuthStackParamList, 'Login'>;
}

export default function LoginScreen({ navigation }: Props) {
  const { signIn } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleLogin() {
    if (!email || !password) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }
    setLoading(true);
    const { error } = await signIn(email, password);
    if (error) Alert.alert('Error', error.message);
    setLoading(false);
  }

  return (
    <View style={styles.container}>
      <Text style={styles.brand}>Paws & Prognosis Veterinary Clinic</Text>

      <View style={styles.card}>
        <Text style={styles.title}>Welcome Back!</Text>

        <TextInput
          style={styles.input}
          placeholder="Email"
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

        <TouchableOpacity style={styles.button} onPress={handleLogin} disabled={loading}>
          <Text style={styles.buttonText}>{loading ? 'Logging in...' : 'Log In'}</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.googleButton}>
          <Text style={styles.googleButtonText}>Log in with Google</Text>
        </TouchableOpacity>

        <View style={styles.footer}>
          <Text style={styles.footerText}>Don't have an account? </Text>
          <TouchableOpacity onPress={() => navigation.navigate('SignUp')}>
            <Text style={styles.link}>Sign Up</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    padding: Spacing.lg,
    justifyContent: 'center',
  },
  brand: {
    ...Typography.small,
    color: Colors.textGrey,
    textAlign: 'left',
    marginBottom: Spacing['3xl'],
  },
  card: {
    backgroundColor: Colors.card,
    borderRadius: Radius.lg,
    padding: Spacing['2xl'],
    marginBottom: Spacing.lg,
  },
  title: {
    ...Typography.h2,
    color: Colors.textDark,
    textAlign: 'center',
    marginBottom: Spacing['2xl'],
  },
  input: {
    backgroundColor: Colors.card,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: Radius.sm,
    padding: Spacing.md,
    marginBottom: Spacing.md,
    fontSize: 16,
  },
  button: {
    backgroundColor: Colors.primary,
    borderRadius: Radius.sm,
    padding: Spacing.lg,
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  buttonText: {
    ...Typography.button,
    color: '#FFFFFF',
  },
  googleButton: {
    backgroundColor: '#F5F5F5',
    borderRadius: Radius.sm,
    padding: Spacing.lg,
    alignItems: 'center',
    marginBottom: Spacing.lg,
  },
  googleButtonText: {
    ...Typography.button,
    color: Colors.textDark,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  footerText: {
    ...Typography.small,
    color: Colors.textGrey,
  },
  link: {
    ...Typography.small,
    color: Colors.primary,
    fontWeight: '600',
  },
});
