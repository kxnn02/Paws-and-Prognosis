import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { Colors, Typography, Spacing, Radius, Shadow } from '../../lib/constants';
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
    if (password.length < 6) {
      Alert.alert('Error', 'Password must be at least 6 characters');
      return;
    }
    setLoading(true);
    const { error } = await signIn(email, password);
    if (error) {
      Alert.alert('Login Failed', error.message);
    }
    setLoading(false);
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
        {/* Brand */}
        <View style={styles.brandContainer}>
          <Text style={styles.brandPaws}>Paws</Text>
          <Text style={styles.brandAnd}> & </Text>
          <Text style={styles.brandPrognosis}>Prognosis</Text>
        </View>
        <Text style={styles.brandSubtitle}>Veterinary Clinic</Text>

        {/* Glassmorphism Card */}
        <View style={styles.card}>
          <Text style={styles.title}>Take Care Of{'\n'}Your Pet</Text>

          {/* Inputs */}
          <Text style={styles.inputLabel}>Email Address</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter your email"
            placeholderTextColor="#AA865D"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
          />

          <Text style={styles.inputLabel}>Password</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter your password"
            placeholderTextColor="#AA865D"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />

          {/* Login Button */}
          <TouchableOpacity
            style={[styles.loginButton, loading && styles.buttonDisabled]}
            onPress={handleLogin}
            disabled={loading}
            activeOpacity={0.8}
          >
            <Text style={styles.loginButtonText}>
              {loading ? 'Logging in...' : 'Log In'}
            </Text>
          </TouchableOpacity>

          {/* Google Button */}
          <TouchableOpacity style={styles.googleButton} activeOpacity={0.8}>
            <Text style={styles.googleButtonText}>Log In With Google</Text>
          </TouchableOpacity>

          {/* Footer */}
          <View style={styles.footer}>
            <Text style={styles.footerText}>Don't have an account? </Text>
            <TouchableOpacity onPress={() => navigation.navigate('SignUp')}>
              <Text style={styles.footerLink}>Sign Up</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: Spacing['2xl'],
    paddingTop: 80,
    paddingBottom: 40,
    justifyContent: 'center',
  },
  brandContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: 4,
  },
  brandPaws: {
    fontSize: 30,
    fontWeight: '700',
    color: '#7A5C4F',
  },
  brandAnd: {
    fontSize: 30,
    fontWeight: '700',
    color: Colors.textHeading,
  },
  brandPrognosis: {
    fontSize: 30,
    fontWeight: '700',
    color: Colors.primary,
  },
  brandSubtitle: {
    fontSize: 15,
    color: Colors.textHeading,
    marginBottom: Spacing['4xl'],
  },
  card: {
    backgroundColor: 'rgba(255, 255, 255, 0.6)',
    borderRadius: Radius.xl,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.9)',
    padding: Spacing['2xl'],
    ...Shadow.lg,
  },
  title: {
    ...Typography.h1,
    color: Colors.textHeading,
    textAlign: 'center',
    marginBottom: Spacing['3xl'],
    lineHeight: 40,
  },
  inputLabel: {
    ...Typography.small,
    color: Colors.textDark,
    marginBottom: Spacing.xs,
  },
  input: {
    backgroundColor: '#F5F5F5',
    borderRadius: Radius.md,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    fontSize: 14,
    color: Colors.textDark,
    marginBottom: Spacing.lg,
    ...Shadow.sm,
  },
  loginButton: {
    backgroundColor: Colors.primary,
    borderRadius: Radius.md,
    borderWidth: 1,
    borderColor: '#7DAE4A',
    height: 52,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.md,
    ...Shadow.sm,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  loginButtonText: {
    ...Typography.button,
    color: Colors.textWhite,
  },
  googleButton: {
    backgroundColor: '#F5F5F5',
    borderRadius: Radius.md,
    height: 52,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing['2xl'],
    ...Shadow.sm,
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
    color: Colors.textDark,
  },
  footerLink: {
    ...Typography.smallSemiBold,
    color: Colors.textDark,
  },
});
