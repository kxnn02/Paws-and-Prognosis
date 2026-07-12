import React from 'react';
import { View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { useAuth } from '../context/AuthContext';
import { useSessionMonitor } from '../hooks/useSessionMonitor';
import { useNetworkStatus } from '../hooks/useNetworkStatus';
import AuthNavigator from './AuthNavigator';
import OwnerNavigator from './OwnerNavigator';
import VetNavigator from './VetNavigator';
import SplashScreen from '../screens/auth/SplashScreen';
import OfflineBanner from '../components/OfflineBanner';

export default function AppNavigator() {
  const { session, role, loading } = useAuth();
  const { isConnected, checkConnectivity } = useNetworkStatus();

  // Monitor session expiry for authenticated users
  useSessionMonitor();

  if (loading) {
    return <SplashScreen />;
  }

  const linking = {
    prefixes: ['pawsandprognosis://', 'https://pawsandprognosis.app'],
    config: {
      screens: {
        // Auth stack screens
        Login: 'login',
        SignUp: 'signup',
        ForgotPassword: 'reset-password',
        // Owner stack screens
        OwnerTabs: {
          screens: {
            Home: 'home',
            Calendar: 'calendar',
            Chat: 'chat',
            Profile: 'profile',
          },
        },
        VetDetails: 'vet/:vetId',
        Booking: 'book/:vetId/:vetName',
        ChatConversation: 'conversation/:threadId/:participantName',
        Rating: 'rate/:appointmentId/:vetId/:vetName',
        Reschedule: 'reschedule/:appointmentId/:vetName',
        EditProfile: 'edit-profile',
        MyPets: 'pets',
        // Vet stack screens
        VetTabs: {
          screens: {
            Dashboard: 'dashboard',
            Appointments: 'appointments',
            VetChat: 'vet-chat',
            VetAccount: 'vet-account',
          },
        },
        VetChatConversation: 'vet-conversation/:threadId/:participantName',
      },
    },
  } as const;

  return (
    <View className="flex-1">
      {!isConnected && <OfflineBanner onRetry={checkConnectivity} />}
      <NavigationContainer linking={linking as any}>
        {!session ? (
          <AuthNavigator />
        ) : !role ? (
          <SplashScreen />
        ) : role === 'veterinarian' ? (
          <VetNavigator />
        ) : (
          <OwnerNavigator />
        )}
      </NavigationContainer>
    </View>
  );
}
