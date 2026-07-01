import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Image,
  Dimensions,
} from 'react-native';
import { Colors, Spacing, Radius } from '../../lib/constants';
import { useAuth } from '../../context/AuthContext';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { AuthStackParamList } from '../../types';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

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
    <View style={styles.container}>
      {/* Background cream color */}
      <View style={styles.backgroundOverlay} />

      {/* Decoration image — paw blobs */}
      <Image
        source={require('../../../assets/login-decoration.png')}
        style={styles.decoration}
        resizeMode="cover"
      />

      <KeyboardAvoidingView
        style={styles.keyboardView}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Brand — Top Left */}
          <View style={styles.brandSection}>
            <View style={styles.brandRow}>
              <Text style={styles.brandPaws}>Paws</Text>
              <Text style={styles.brandAnd}> & </Text>
              <Text style={styles.brandPrognosis}>Prognosis</Text>
            </View>
            <Text style={styles.brandSubtitle}>Veterinary Clinic</Text>
          </View>

          {/* Spacer to push card down */}
          <View style={styles.spacer} />

          {/* Glass Card */}
          <View style={styles.card}>
            <Text style={styles.cardTitle}>
              Take Care Of{'\n'}Your Pet
            </Text>

            {/* Email Input */}
            <TextInput
              style={styles.input}
              placeholder="Email Address"
              placeholderTextColor="#AA865D"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
            />

            {/* Password Input */}
            <TextInput
              style={styles.input}
              placeholder="Password"
              placeholderTextColor="#AA865D"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />

            {/* Log In Button */}
            <TouchableOpacity
              style={[styles.loginBtn, loading && { opacity: 0.6 }]}
              onPress={handleLogin}
              disabled={loading}
              activeOpacity={0.8}
            >
              <Text style={styles.loginBtnText}>
                {loading ? 'Logging in...' : 'Log In'}
              </Text>
            </TouchableOpacity>

            {/* Google Button */}
            <TouchableOpacity style={styles.googleBtn} activeOpacity={0.8}>
              <Image
                source={require('../../../assets/google-logo.png')}
                style={styles.googleIcon}
                resizeMode="contain"
              />
              <Text style={styles.googleBtnText}>Log In With Google</Text>
            </TouchableOpacity>

            {/* Footer */}
            <View style={styles.footer}>
              <Text style={styles.footerText}>Don't have an account? </Text>
              <TouchableOpacity onPress={() => navigation.navigate('SignUp')}>
                <Text style={styles.footerLink}>Sign In</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  backgroundOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(248, 224, 196, 0.3)',
  },
  decoration: {
    position: 'absolute',
    top: 133,
    left: -30,
    width: SCREEN_WIDTH + 60,
    height: 700,
    opacity: 1,
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 34,
  },
  brandSection: {
    paddingTop: 62,
    paddingLeft: 28,
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  brandPaws: {
    fontSize: 30,
    fontWeight: '700',
    color: '#7A5C4F',
  },
  brandAnd: {
    fontSize: 30,
    fontWeight: '700',
    color: '#544864',
  },
  brandPrognosis: {
    fontSize: 30,
    fontWeight: '700',
    color: '#71924F',
  },
  brandSubtitle: {
    fontSize: 15,
    color: '#544864',
    marginTop: 2,
  },
  spacer: {
    flex: 1,
    minHeight: 100,
  },
  card: {
    marginHorizontal: 28,
    backgroundColor: 'rgba(255, 255, 255, 0.55)',
    borderRadius: 29,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.95)',
    paddingHorizontal: 22,
    paddingTop: 32,
    paddingBottom: 24,
    // Glassmorphism shadow
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 20 },
    shadowOpacity: 0.38,
    shadowRadius: 40,
    elevation: 12,
  },
  cardTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#544864',
    textAlign: 'center',
    lineHeight: 40,
    marginBottom: 24,
  },
  input: {
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
    paddingHorizontal: 16,
    height: 44,
    fontSize: 14,
    fontStyle: 'italic',
    color: '#343434',
    marginBottom: 12,
    // Subtle shadow like Figma
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 2,
  },
  loginBtn: {
    backgroundColor: '#71924F',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#7DAE4A',
    height: 52,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 3,
  },
  loginBtnText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  googleBtn: {
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
    height: 52,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 3,
  },
  googleIcon: {
    width: 20,
    height: 20,
    marginRight: 10,
  },
  googleBtnText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#343434',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20,
  },
  footerText: {
    fontSize: 14,
    color: '#343434',
  },
  footerLink: {
    fontSize: 14,
    fontWeight: '600',
    color: '#343434',
  },
});
