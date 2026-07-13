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
  Platform,
} from 'react-native';
import { BlurView } from 'expo-blur';
import { Ionicons } from '@expo/vector-icons';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAuth } from '../../context/AuthContext';
import { signUpFormSchema, type SignUpFormSchemaData } from '../../lib/schemas';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { AuthStackParamList } from '../../types';

interface Props {
  navigation: NativeStackNavigationProp<AuthStackParamList, 'SignUp'>;
}

export default function SignUpScreen({ navigation }: Props) {
  const { signUp } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const { control, handleSubmit, formState: { errors }, watch, setValue } = useForm<SignUpFormSchemaData>({
    resolver: zodResolver(signUpFormSchema),
    mode: 'onBlur',
    defaultValues: { name: '', email: '', password: '', confirmPassword: '', role: 'pet_owner' },
  });

  const watchRole = watch('role');

  async function onSubmit(data: SignUpFormSchemaData) {
    setLoading(true);
    const { error, needsConfirmation } = await signUp(data.email, data.password, data.name, data.role);
    if (error) {
      Alert.alert('Sign Up Failed', error.message);
    } else if (needsConfirmation) {
      Alert.alert(
        'Check Your Email',
        'We sent a confirmation link to your email. Please verify it before logging in.',
        [{ text: 'OK', onPress: () => navigation.navigate('Login') }]
      );
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
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
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
              className="w-[225px] h-[225px]"
              resizeMode="contain"
            />
          </View>

          {/* Card */}
          <BlurView
            intensity={50}
            tint="light"
            className="mx-[28px] mt-6 rounded-glass overflow-hidden border border-white/80"
          >
            <View className="px-[22px] pt-[24px] pb-[20px] bg-white/40">
              <Text className="text-[22px] font-bold text-heading leading-[34px] mb-5">
                Let{"'"}s get you and your fur baby started
              </Text>

              {/* Name */}
              <Text className="text-[13px] font-medium text-heading mb-1.5">Your Name</Text>
              <Controller
                control={control}
                name="name"
                render={({ field: { onChange, onBlur, value } }) => (
                  <TextInput
                    className="bg-input-bg rounded-btn px-4 h-[46px] text-sm italic text-dark mb-3 shadow-sm"
                    placeholder="What should we call you?"
                    placeholderTextColor="#AA865D"
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    maxLength={50}
                    accessibilityLabel="Your name"
                  />
                )}
              />
              {errors.name && <Text className="text-red-500 text-xs mb-1 -mt-2 px-1">{errors.name.message}</Text>}

              {/* Email */}
              <Text className="text-[13px] font-medium text-heading mb-1.5">Email Address</Text>
              <Controller
                control={control}
                name="email"
                render={({ field: { onChange, onBlur, value } }) => (
                  <TextInput
                    className="bg-input-bg rounded-btn px-4 h-[46px] text-sm italic text-dark mb-3 shadow-sm"
                    placeholder="We'll only use this for important updates."
                    placeholderTextColor="#AA865D"
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    maxLength={100}
                    accessibilityLabel="Email address"
                  />
                )}
              />
              {errors.email && <Text className="text-red-500 text-xs mb-1 -mt-2 px-1">{errors.email.message}</Text>}

              {/* Password */}
              <Text className="text-[13px] font-medium text-heading mb-1.5">Create a Password</Text>
              <View className="relative mb-3">
                <Controller
                  control={control}
                  name="password"
                  render={({ field: { onChange, onBlur, value } }) => (
                    <TextInput
                      className="bg-input-bg rounded-btn px-4 h-[46px] text-sm italic text-dark pr-12 shadow-sm"
                      placeholder="Something secure, but easy to remember."
                      placeholderTextColor="#AA865D"
                      value={value}
                      onChangeText={onChange}
                      onBlur={onBlur}
                      secureTextEntry={!showPassword}
                      maxLength={72}
                    />
                  )}
                />
                <TouchableOpacity
                  className="absolute right-3 top-[10px]"
                  onPress={() => setShowPassword(!showPassword)}
                >
                  <Ionicons name={showPassword ? 'eye-off' : 'eye'} size={22} color="#808080" />
                </TouchableOpacity>
              </View>
              {errors.password && <Text className="text-red-500 text-xs mb-1 -mt-2 px-1">{errors.password.message}</Text>}

              {/* Confirm Password */}
              <Text className="text-[13px] font-medium text-heading mb-1.5">Confirm Password</Text>
              <Controller
                control={control}
                name="confirmPassword"
                render={({ field: { onChange, onBlur, value } }) => (
                  <TextInput
                    className="bg-input-bg rounded-btn px-4 h-[46px] text-sm italic text-dark mb-3 shadow-sm"
                    placeholder="Type your password again."
                    placeholderTextColor="#AA865D"
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    secureTextEntry={!showPassword}
                    maxLength={72}
                  />
                )}
              />
              {errors.confirmPassword && <Text className="text-red-500 text-xs mb-1 -mt-2 px-1">{errors.confirmPassword.message}</Text>}

              {/* Role */}
              <Text className="text-[13px] font-medium text-heading mb-2">I am a...</Text>
              <View className="flex-row gap-2 mb-5">
                <TouchableOpacity
                  className={`flex-1 py-3 rounded-btn items-center shadow-sm ${
                    watchRole === 'pet_owner' ? 'bg-primary' : 'bg-input-bg'
                  }`}
                  onPress={() => setValue('role', 'pet_owner')}
                  accessibilityRole="radio"
                  accessibilityState={{ selected: watchRole === 'pet_owner' }}
                  accessibilityLabel="Pet Owner"
                >
                  <Text className={`text-[13px] font-bold ${watchRole === 'pet_owner' ? 'text-white' : 'text-dark'}`}>
                    🐾 Pet Owner
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  className={`flex-1 py-3 rounded-btn items-center shadow-sm ${
                    watchRole === 'veterinarian' ? 'bg-primary' : 'bg-input-bg'
                  }`}
                  onPress={() => setValue('role', 'veterinarian')}
                  accessibilityRole="radio"
                  accessibilityState={{ selected: watchRole === 'veterinarian' }}
                  accessibilityLabel="Veterinarian"
                >
                  <Text className={`text-[13px] font-bold ${watchRole === 'veterinarian' ? 'text-white' : 'text-dark'}`}>
                    🩺 Veterinarian
                  </Text>
                </TouchableOpacity>
              </View>

              {/* Submit */}
              <TouchableOpacity
                className={`bg-primary rounded-btn h-[52px] items-center justify-center border border-primary-border shadow-md ${loading ? 'opacity-60' : ''}`}
                onPress={handleSubmit(onSubmit)}
                disabled={loading}
              >
                <Text className="text-[15px] font-bold text-white">
                  {loading ? 'Creating account...' : 'Join the pack!'}
                </Text>
              </TouchableOpacity>
            </View>
          </BlurView>

          {/* Footer */}
          <View className="flex-row justify-center mt-4 mb-8">
            <Text className="text-sm text-dark">Already a furparent here? </Text>
            <TouchableOpacity onPress={() => navigation.navigate('Login')}>
              <Text className="text-sm font-semibold text-primary">Log in</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}
