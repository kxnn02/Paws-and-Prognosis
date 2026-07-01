import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import DashboardScreen from '../screens/vet/DashboardScreen';
import VetAppointmentsScreen from '../screens/vet/VetAppointmentsScreen';
import VetChatListScreen from '../screens/vet/VetChatListScreen';
import VetAccountScreen from '../screens/vet/VetAccountScreen';
import VetChatConversationScreen from '../screens/vet/VetChatConversationScreen';
import { Colors } from '../lib/constants';
import type { VetTabParamList, VetStackParamList } from '../types';

const Tab = createBottomTabNavigator<VetTabParamList>();
const Stack = createNativeStackNavigator<VetStackParamList>();

function VetTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: Colors.primary,
        tabBarInactiveTintColor: Colors.navInactive,
        tabBarStyle: {
          backgroundColor: '#FFFFFF',
          borderTopWidth: 0,
          elevation: 8,
          height: 80,
          paddingBottom: 16,
          paddingTop: 8,
        },
        tabBarIcon: ({ color, size }) => {
          let iconName: keyof typeof Ionicons.glyphMap = 'grid-outline';
          if (route.name === 'Dashboard') iconName = 'grid-outline';
          else if (route.name === 'Appointments') iconName = 'calendar-outline';
          else if (route.name === 'VetChat') iconName = 'chatbubble-outline';
          else if (route.name === 'VetAccount') iconName = 'person-outline';
          return <Ionicons name={iconName} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Dashboard" component={DashboardScreen} />
      <Tab.Screen name="Appointments" component={VetAppointmentsScreen} />
      <Tab.Screen name="VetChat" component={VetChatListScreen} options={{ title: 'Chat' }} />
      <Tab.Screen name="VetAccount" component={VetAccountScreen} options={{ title: 'Account' }} />
    </Tab.Navigator>
  );
}

export default function VetNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="VetTabs" component={VetTabs} />
      <Stack.Screen name="VetChatConversation" component={VetChatConversationScreen} />
    </Stack.Navigator>
  );
}
