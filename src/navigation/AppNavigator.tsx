import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { useAuth } from '../context/AuthContext';
import { useSessionMonitor } from '../hooks/useSessionMonitor';
import AuthNavigator from './AuthNavigator';
import OwnerNavigator from './OwnerNavigator';
import VetNavigator from './VetNavigator';
import SplashScreen from '../screens/auth/SplashScreen';

export default function AppNavigator() {
  const { session, role, loading } = useAuth();

  // Monitor session expiry for authenticated users
  useSessionMonitor();

  if (loading) {
    return <SplashScreen />;
  }

  return (
    <NavigationContainer>
      {!session ? (
        <AuthNavigator />
      ) : role === 'veterinarian' ? (
        <VetNavigator />
      ) : (
        <OwnerNavigator />
      )}
    </NavigationContainer>
  );
}
