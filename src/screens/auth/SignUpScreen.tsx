import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { Colors, Typography, Spacing, Radius, Shadow } from '../../lib/constants';
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
    if (password.length < 6) {
      Alert.alert('Error', 'Password must be at least 6 characters');
      return;
    }
    if (!email.includes('@')) {
      Alert.alert('Error', 'Please enter a valid email address');
      return;
    }
    setLoading(true);
    const { error } = await signUp(email, password, name, role);
    if (error) {
      Alert.alert('Sign Up Failed', error.message);
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
          <Text style={styles.title}>Let's get you and your fur baby started</Text>

          {/* Name */}
          <Text style={styles.inputLabel}>Your Name</Text>
          <TextInput
            style={styles.input}
            placeholder="What should we call you?"
            placeholderTextColor="#AA865D"
            value={name}
            onChangeText={setName}
            autoCorrect={false}
          />

          {/* Email */}
          <Text style={styles.inputLabel}>Email Address</Text>
          <TextInput
            style={styles.input}
            placeholder="We'll only use this for important updates."
            placeholderTextColor="#AA865D"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
          />

          {/* Password */}
          <Text style={styles.inputLabel}>Create a Password</Text>
          <TextInput
            style={styles.input}
            placeholder="Something secure, but easy to remember."
            placeholderTextColor="#AA865D"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />

          {/* Role Selection */}
          <Text style={styles.inputLabel}>I am a...</Text>
          <View style={styles.roleContainer}>
            <TouchableOpacity
              style={[styles.roleButton, role === 'pet_owner' && styles.roleActive]}
              onPress={() => setRole('pet_owner')}
              activeOpacity={0.7}
            >
              <Text style={[styles.roleText, role === 'pet_owner' && styles.roleTextActive]}>
                🐾 Pet Owner
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.roleButton, role === 'veterinarian' && styles.roleActive]}
              onPress={() => setRole('veterinarian')}
              activeOpacity={0.7}
            >
              <Text style={[styles.roleText, role === 'veterinarian' && styles.roleTextActive]}>
                🩺 Veterinarian
              </Text>
            </TouchableOpacity>
          </View>

          {/* Sign Up Button */}
          <TouchableOpacity
            style={[styles.signUpButton, loading && styles.buttonDisabled]}
            onPress={handleSignUp}
            disabled={loading}
            activeOpacity={0.8}
          >
            <Text style={styles.signUpButtonText}>
              {loading ? 'Creating account...' : 'Join the pack!'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>Already a furparent here? </Text>
          <TouchableOpacity onPress={() => navigation.navigate('Login')}>
            <Text style={styles.footerLink}>Log in</Text>
          </TouchableOpacity>
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
    paddingTop: 60,
    paddingBottom: 40,
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
    marginBottom: Spacing['2xl'],
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
    marginBottom: Spacing['2xl'],
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
    fontStyle: 'italic',
    color: Colors.textDark,
    marginBottom: Spacing.lg,
    ...Shadow.sm,
  },
  roleContainer: {
    flexDirection: 'row',
    gap: Spacing.sm,
    marginBottom: Spacing['2xl'],
  },
  roleButton: {
    flex: 1,
    paddingVertical: Spacing.md,
    borderRadius: Radius.md,
    backgroundColor: '#F5F5F5',
    alignItems: 'center',
    ...Shadow.sm,
  },
  roleActive: {
    backgroundColor: Colors.primary,
  },
  roleText: {
    ...Typography.smallSemiBold,
    color: Colors.textDark,
  },
  roleTextActive: {
    color: Colors.textWhite,
  },
  signUpButton: {
    backgroundColor: Colors.primary,
    borderRadius: Radius.md,
    borderWidth: 1,
    borderColor: '#7DAE4A',
    height: 52,
    alignItems: 'center',
    justifyContent: 'center',
    ...Shadow.sm,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  signUpButtonText: {
    ...Typography.button,
    color: Colors.textWhite,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: Spacing.lg,
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
