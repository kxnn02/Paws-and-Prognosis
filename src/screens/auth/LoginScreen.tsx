import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Image,
} from 'react-native';
import { BlurView } from 'expo-blur';
import { Ionicons } from '@expo/vector-icons';
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
  const [showPassword, setShowPassword] = useState(false);

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
    <View className="flex-1 bg-cream">
      {/* Decoration */}
      <Image
        source={require('../../../assets/Decoration.png')}
        className="absolute top-[90px] left-[-30px] w-[482px] h-[750px]"
        resizeMode="contain"
      />

      <KeyboardAvoidingView
        className="flex-1"
        behavior="padding"
      >
        <ScrollView
          contentContainerStyle={{ flexGrow: 1 }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Brand */}
          <View className="pt-[62px] pl-[28px]">
            <View className="flex-row items-baseline">
              <Text className="text-[30px] font-bold text-[#7A5C4F]">Paws</Text>
              <Text className="text-[30px] font-bold text-heading"> & </Text>
              <Text className="text-[30px] font-bold text-primary">Prognosis</Text>
            </View>
            <Text className="text-[15px] text-heading mt-[2px]">Veterinary Clinic</Text>
          </View>

          {/* Spacer */}
          <View className="flex-1 min-h-[80px]" />

          {/* Glassmorphism Card */}
          <BlurView
            intensity={50}
            tint="light"
            className="mx-[28px] rounded-glass overflow-hidden border border-white/80"
          >
            <View className="px-[22px] pt-[28px] pb-[20px] bg-white/40">
              <Text className="text-[28px] font-bold text-heading text-center leading-[40px] mb-[20px]">
                Take Care Of{'\n'}Your Pet
              </Text>

              {/* Email */}
              <TextInput
                className="bg-input-bg rounded-btn px-4 h-[42px] text-sm italic text-dark mb-[10px] shadow-sm"
                placeholder="Email Address"
                placeholderTextColor="#AA865D"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                maxLength={100}
              />

              {/* Password */}
              <View className="relative mb-[10px]">
                <TextInput
                  className="bg-input-bg rounded-btn px-4 h-[42px] text-sm italic text-dark pr-12 shadow-sm"
                  placeholder="Password"
                  placeholderTextColor="#AA865D"
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry={!showPassword}
                  maxLength={72}
                />
                <TouchableOpacity
                  className="absolute right-3 top-[10px]"
                  onPress={() => setShowPassword(!showPassword)}
                >
                  <Ionicons name={showPassword ? 'eye-off' : 'eye'} size={22} color="#808080" />
                </TouchableOpacity>
              </View>

              {/* Log In Button */}
              <TouchableOpacity
                className={`bg-primary rounded-btn h-[52px] items-center justify-center mt-[6px] border border-primary-border shadow-md ${loading ? 'opacity-60' : ''}`}
                onPress={handleLogin}
                disabled={loading}
                activeOpacity={0.8}
              >
                <Text className="text-sm font-semibold text-white">
                  {loading ? 'Logging in...' : 'Log In'}
                </Text>
              </TouchableOpacity>

              {/* Forgot Password */}
              <TouchableOpacity
                onPress={() => navigation.navigate('ForgotPassword')}
                className="self-end mt-2"
                activeOpacity={0.7}
              >
                <Text className="text-xs text-grey">Forgot Password?</Text>
              </TouchableOpacity>

              {/* Google Button */}
              <TouchableOpacity
                className="bg-input-bg rounded-btn h-[52px] flex-row items-center justify-center mt-[10px] shadow-md opacity-70"
                activeOpacity={0.8}
                onPress={() => Alert.alert('Coming Soon', 'Google Sign-In requires a development build and will be available in the production version.')}
              >
                <Image
                  source={require('../../../assets/google-logo.png')}
                  className="w-5 h-5 mr-[10px]"
                  resizeMode="contain"
                />
                <Text className="text-sm font-semibold text-dark">Log In With Google</Text>
              </TouchableOpacity>

              {/* Footer */}
              <View className="flex-row justify-center mt-[16px]">
                <Text className="text-sm text-dark">Don't have an account? </Text>
                <TouchableOpacity onPress={() => navigation.navigate('SignUp')}>
                  <Text className="text-sm font-semibold text-dark">Sign Up</Text>
                </TouchableOpacity>
              </View>
            </View>
          </BlurView>

          {/* Bottom padding */}
          <View className="h-[34px]" />
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}
