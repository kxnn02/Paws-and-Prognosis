import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import HomeScreen from '../screens/owner/HomeScreen';
import CalendarScreen from '../screens/owner/CalendarScreen';
import ChatListScreen from '../screens/owner/ChatListScreen';
import ProfileScreen from '../screens/owner/ProfileScreen';
import { Colors } from '../lib/constants';
import type { OwnerTabParamList } from '../types';

const Tab = createBottomTabNavigator<OwnerTabParamList>();

export default function OwnerNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: Colors.primary,
        tabBarInactiveTintColor: Colors.textLight,
        tabBarStyle: {
          backgroundColor: '#FFFFFF',
          borderTopWidth: 0,
          elevation: 8,
          height: 80,
          paddingBottom: 16,
          paddingTop: 8,
        },
        tabBarIcon: ({ color, size }) => {
          let iconName: keyof typeof Ionicons.glyphMap = 'home-outline';
          if (route.name === 'Home') iconName = 'home-outline';
          else if (route.name === 'Calendar') iconName = 'calendar-outline';
          else if (route.name === 'Chat') iconName = 'chatbubble-outline';
          else if (route.name === 'Profile') iconName = 'person-outline';
          return <Ionicons name={iconName} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Calendar" component={CalendarScreen} />
      <Tab.Screen name="Chat" component={ChatListScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}
