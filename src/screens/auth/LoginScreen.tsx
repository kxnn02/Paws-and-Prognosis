import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  ScrollView,
  Image,
} from 'react-native';
import { BlurView } from 'expo-blur';
import { Ionicons } from '@expo/vector-icons';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAuth } from '../../context/AuthContext';
import { loginSchema, LoginFormData } from '../../lib/schemas';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { AuthStackParamList } from '../../types';

interface Props {
  navigation: NativeStackNavigationProp<AuthStackParamList, 'Login'>;
}

export default function LoginScreen({ navigation }: Props) {
  const { signIn } = useAuth();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const { control, handleSubmit, formState: { errors } } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    mode: 'onBlur',
    defaultValues: { email: '', password: '' },
  });

  async function onSubmit(data: LoginFormData) {
    setLoading(true);
    try {
      const { error } = await signIn(data.email.trim(), data.password);
      if (error) {
        Alert.alert('Login Failed', error.message);
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'An unexpected error occurred';
      Alert.alert('Login Failed', message);
    } finally {
      setLoading(false);
    }
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
        behavior='padding'
      >
        <ScrollView
          contentContainerStyle={{ flexGrow: 1 }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Brand Logo */}
          <View className="pt-[50px] items-center">
            <Image
              source={require('../../../assets/logo-transparent.png')}
              className="w-[200px] h-[200px]"
              resizeMode="contain"
            />
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
              <Text className="text-[22px] font-bold text-heading text-center mb-[16px]">
                Welcome Back
              </Text>

              {/* Email */}
              <Controller
                control={control}
                name="email"
                render={({ field: { onChange, onBlur, value } }) => (
                  <TextInput
                    className="bg-input-bg rounded-btn px-4 h-[46px] text-sm italic text-dark mb-[10px] shadow-sm"
                    placeholder="Email Address"
                    placeholderTextColor="#AA865D"
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    autoCorrect={false}
                    maxLength={100}
                    accessibilityLabel="Email address"
                  />
                )}
              />
              {errors.email && <Text className="text-red-500 text-xs mb-2 -mt-1">{errors.email.message}</Text>}

              {/* Password */}
              <View className="relative mb-[10px]">
                <Controller
                  control={control}
                  name="password"
                  render={({ field: { onChange, onBlur, value } }) => (
                    <TextInput
                      className="bg-input-bg rounded-btn px-4 h-[46px] text-sm italic text-dark pr-12 shadow-sm"
                      placeholder="Password"
                      placeholderTextColor="#AA865D"
                      value={value}
                      onChangeText={onChange}
                      onBlur={onBlur}
                      secureTextEntry={!showPassword}
                      maxLength={72}
                      accessibilityLabel="Password"
                    />
                  )}
                />
                <TouchableOpacity
                  className="absolute right-3 top-[10px]"
                  onPress={() => setShowPassword(!showPassword)}
                  accessibilityRole="button"
                  accessibilityLabel="Toggle password visibility"
                >
                  <Ionicons name={showPassword ? 'eye-off' : 'eye'} size={22} color="#808080" />
                </TouchableOpacity>
              </View>
              {errors.password && <Text className="text-red-500 text-xs mb-2 -mt-1">{errors.password.message}</Text>}

              {/* Log In Button */}
              <TouchableOpacity
                className={`bg-primary rounded-btn h-[52px] items-center justify-center mt-[6px] border border-primary-border shadow-md ${loading ? 'opacity-60' : ''}`}
                onPress={handleSubmit(onSubmit)}
                disabled={loading}
                activeOpacity={0.8}
                accessibilityRole="button"
                accessibilityLabel="Log in"
                accessibilityState={{ disabled: loading }}
              >
                <Text className="text-[15px] font-bold text-white">
                  {loading ? 'Logging in...' : 'Log In'}
                </Text>
              </TouchableOpacity>

              {/* Forgot Password */}
              <TouchableOpacity
                onPress={() => navigation.navigate('ForgotPassword')}
                className="self-end mt-2 py-2 px-3"
                activeOpacity={0.7}
                accessibilityRole="link"
              >
                <Text className="text-[13px] text-grey font-medium">Forgot Password?</Text>
              </TouchableOpacity>



              {/* Footer */}
              <View className="flex-row justify-center mt-[16px]">
                <Text className="text-[13px] text-dark">Don{"'"}t have an account? </Text>
                <TouchableOpacity onPress={() => navigation.navigate('SignUp')} accessibilityRole="link">
                  <Text className="text-[13px] font-bold text-primary">Sign Up</Text>
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
