import React, { useState } from 'react';
import {
  View,
  Text,
  Image,
  TextInput,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { supabase } from '../../lib/supabase';
import { forgotPasswordSchema } from '../../lib/schemas';

export default function ForgotPasswordScreen() {
  const navigation = useNavigation();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  async function handleReset() {
    const result = forgotPasswordSchema.safeParse({ email: email.trim() });
    if (!result.success) {
      Alert.alert('Error', result.error.errors[0].message);
      return;
    }

    const trimmed = email.trim();

    setLoading(true);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(trimmed, {
        redirectTo: 'pawsandprognosis://reset-password',
      });

      if (error) throw error;
      setSent(true);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to send reset email';
      Alert.alert('Error', message);
    } finally {
      setLoading(false);
    }
  }

  if (sent) {
    return (
      <View className="flex-1 bg-beige items-center justify-center px-8">
        <View className="w-16 h-16 rounded-full bg-primary/10 items-center justify-center mb-4">
          <Ionicons name="mail-outline" size={32} color="#71924F" />
        </View>
        <Text className="text-[20px] font-bold text-heading text-center">Check Your Email</Text>
        <Text className="text-sm text-grey text-center mt-3 leading-5">
          We{"'"}ve sent a password reset link to{'\n'}
          <Text className="font-medium text-dark">{email.trim()}</Text>
        </Text>
        <Text className="text-xs text-grey text-center mt-4">
          Didn{"'"}t receive it? Check your spam folder or try again.
        </Text>

        <TouchableOpacity
          onPress={() => setSent(false)}
          className="mt-6 bg-primary/10 px-5 py-3 rounded-btn"
          activeOpacity={0.7}
        >
          <Text className="text-sm font-medium text-primary">Try Another Email</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => navigation.goBack()}
          className="mt-4"
          activeOpacity={0.7}
        >
          <Text className="text-sm text-grey">Back to Login</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-beige">
      {/* Header */}
      <View className="px-5 pt-14 pb-4 flex-row items-center">
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          className="w-10 h-10 rounded-full bg-white items-center justify-center shadow-sm"
          activeOpacity={0.7}
        >
          <Ionicons name="arrow-back" size={22} color="#343434" />
        </TouchableOpacity>
      </View>

      <KeyboardAvoidingView
        className="flex-1"
        behavior='padding'
      >
        <View className="flex-1 px-7 pt-6">
          <Image
            source={require('../../../assets/logo-transparent.png')}
            className="w-[154px] h-[154px] self-center mb-4"
            resizeMode="contain"
          />
          <Text className="text-[22px] font-bold text-heading">Forgot Password</Text>
          <Text className="text-sm text-grey mt-2 leading-5">
            Enter the email address associated with your account and we{"'"}ll send you a link to
            reset your password.
          </Text>

          {/* Email Input */}
          <View className="mt-8">
            <Text className="text-sm font-medium text-dark mb-2">Email Address</Text>
            <TextInput
              className="bg-white rounded-btn px-4 h-[50px] text-sm text-dark border border-gray-200"
              placeholder="you@example.com"
              placeholderTextColor="#A7A7A7"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              maxLength={100}
            />
          </View>

          {/* Submit Button */}
          <TouchableOpacity
            onPress={handleReset}
            disabled={loading}
            className={`bg-primary h-[52px] rounded-btn items-center justify-center mt-6 shadow-md ${loading ? 'opacity-60' : ''}`}
            activeOpacity={0.8}
          >
            {loading ? (
              <ActivityIndicator color="#FFF" />
            ) : (
              <Text className="text-white text-[15px] font-bold">Send Reset Link</Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => navigation.goBack()}
            className="self-center mt-6"
            activeOpacity={0.7}
          >
            <Text className="text-sm text-grey">
              Remember your password? <Text className="font-semibold text-dark">Log In</Text>
            </Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}
