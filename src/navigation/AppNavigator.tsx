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
        OwnerTabs: {
          screens: {
            Home: 'home',
            Calendar: 'calendar',
            Chat: 'chat',
            Profile: 'profile',
          },
        },
        VetDetails: 'vet/:vetId',
        Booking: 'book/:vetId',
        ChatConversation: 'chat/:threadId',
      },
    },
  } as const;

  return (
    <View className="flex-1">
      {!isConnected && <OfflineBanner onRetry={checkConnectivity} />}
      <NavigationContainer linking={linking as any}>
        {!session ? (
          <AuthNavigator />
        ) : role === 'veterinarian' ? (
          <VetNavigator />
        ) : (
          <OwnerNavigator />
        )}
      </NavigationContainer>
    </View>
  );
}
