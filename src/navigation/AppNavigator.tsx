import React from 'react';
import { View, Alert } from 'react-native';
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
  const { session, role, loading, signOut, refreshProfile } = useAuth();
  const { isConnected, checkConnectivity } = useNetworkStatus();

  // Monitor session expiry for authenticated users
  useSessionMonitor();

  // Timeout for stuck-on-splash: if session exists but role is null for 10s, offer retry/logout
  React.useEffect(() => {
    if (!session || role || loading) return;

    const timeout = setTimeout(() => {
      Alert.alert(
        'Loading Issue',
        'We\'re having trouble loading your profile. Would you like to retry or log out?',
        [
          { text: 'Retry', onPress: () => refreshProfile() },
          { text: 'Log Out', style: 'destructive', onPress: () => signOut() },
        ]
      );
    }, 10000);

    return () => clearTimeout(timeout);
  }, [session, role, loading, refreshProfile, signOut]);

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
