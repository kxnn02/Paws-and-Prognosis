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
} from 'react-native';
import { BlurView } from 'expo-blur';
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
    <View style={styles.screen}>
      {/* Decoration from Figma — exported PNG with transparency */}
      <Image
        source={require('../../../assets/Decoration.png')}
        style={styles.decoration}
      />

      <KeyboardAvoidingView
        style={styles.flex}
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

          {/* Push card to bottom */}
          <View style={styles.spacer} />

          {/* Glassmorphism Card */}
          <BlurView intensity={50} tint="light" style={styles.blurCard}>
            <View style={styles.cardInner}>
              <Text style={styles.cardTitle}>
                Take Care Of{'\n'}Your Pet
              </Text>

              {/* Email */}
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

              {/* Password */}
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
          </BlurView>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: 'rgba(248, 224, 196, 0.3)',
  },
  flex: {
    flex: 1,
  },
  decoration: {
    position: 'absolute',
    top: 90,
    left: -30,
    width: 482,
    height: 750,
    resizeMode: 'contain',
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
    minHeight: 80,
  },
  blurCard: {
    marginHorizontal: 28,
    borderRadius: 29,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.8)',
  },
  cardInner: {
    paddingHorizontal: 22,
    paddingTop: 28,
    paddingBottom: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.4)',
  },
  cardTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#544864',
    textAlign: 'center',
    lineHeight: 40,
    marginBottom: 20,
  },
  input: {
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
    paddingHorizontal: 16,
    height: 42,
    fontSize: 14,
    fontStyle: 'italic',
    color: '#343434',
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
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
    marginTop: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 4,
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
    marginTop: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 4,
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
    marginTop: 16,
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
