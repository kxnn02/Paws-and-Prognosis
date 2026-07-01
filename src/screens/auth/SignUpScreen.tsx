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
import type { AuthStackParamList, UserRole } from '../../types';

interface Props {
  navigation: NativeStackNavigationProp<AuthStackParamList, 'SignUp'>;
}

export default function SignUpScreen({ navigation }: Props) {
  const { signUp } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
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
    const { error, needsConfirmation } = await signUp(email, password, name, role);
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
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
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

          {/* Card */}
          <BlurView
            intensity={50}
            tint="light"
            className="mx-[28px] mt-6 rounded-glass overflow-hidden border border-white/80"
          >
            <View className="px-[22px] pt-[24px] pb-[20px] bg-white/40">
              <Text className="text-[24px] font-bold text-heading leading-[34px] mb-5">
                Let's get you and your fur baby started
              </Text>

              {/* Name */}
              <Text className="text-sm text-dark mb-1">Your Name</Text>
              <TextInput
                className="bg-input-bg rounded-btn px-4 h-[42px] text-sm italic text-dark mb-3 shadow-sm"
                placeholder="What should we call you?"
                placeholderTextColor="#AA865D"
                value={name}
                onChangeText={setName}
              />

              {/* Email */}
              <Text className="text-sm text-dark mb-1">Email Address</Text>
              <TextInput
                className="bg-input-bg rounded-btn px-4 h-[42px] text-sm italic text-dark mb-3 shadow-sm"
                placeholder="We'll only use this for important updates."
                placeholderTextColor="#AA865D"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
              />

              {/* Password */}
              <Text className="text-sm text-dark mb-1">Create a Password</Text>
              <View className="relative mb-3">
                <TextInput
                  className="bg-input-bg rounded-btn px-4 h-[42px] text-sm italic text-dark pr-12 shadow-sm"
                  placeholder="Something secure, but easy to remember."
                  placeholderTextColor="#AA865D"
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry={!showPassword}
                />
                <TouchableOpacity
                  className="absolute right-3 top-[10px]"
                  onPress={() => setShowPassword(!showPassword)}
                >
                  <Ionicons name={showPassword ? 'eye-off' : 'eye'} size={22} color="#808080" />
                </TouchableOpacity>
              </View>

              {/* Role */}
              <Text className="text-sm text-dark mb-2">I am a...</Text>
              <View className="flex-row gap-2 mb-5">
                <TouchableOpacity
                  className={`flex-1 py-3 rounded-btn items-center shadow-sm ${
                    role === 'pet_owner' ? 'bg-primary' : 'bg-input-bg'
                  }`}
                  onPress={() => setRole('pet_owner')}
                >
                  <Text className={`text-sm font-semibold ${role === 'pet_owner' ? 'text-white' : 'text-dark'}`}>
                    🐾 Pet Owner
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  className={`flex-1 py-3 rounded-btn items-center shadow-sm ${
                    role === 'veterinarian' ? 'bg-primary' : 'bg-input-bg'
                  }`}
                  onPress={() => setRole('veterinarian')}
                >
                  <Text className={`text-sm font-semibold ${role === 'veterinarian' ? 'text-white' : 'text-dark'}`}>
                    🩺 Veterinarian
                  </Text>
                </TouchableOpacity>
              </View>

              {/* Submit */}
              <TouchableOpacity
                className={`bg-primary rounded-btn h-[52px] items-center justify-center border border-primary-border shadow-md ${loading ? 'opacity-60' : ''}`}
                onPress={handleSignUp}
                disabled={loading}
              >
                <Text className="text-sm font-semibold text-white">
                  {loading ? 'Creating account...' : 'Join the pack!'}
                </Text>
              </TouchableOpacity>
            </View>
          </BlurView>

          {/* Footer */}
          <View className="flex-row justify-center mt-4 mb-8">
            <Text className="text-sm text-dark">Already a furparent here? </Text>
            <TouchableOpacity onPress={() => navigation.navigate('Login')}>
              <Text className="text-sm font-semibold text-dark">Log in</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}
