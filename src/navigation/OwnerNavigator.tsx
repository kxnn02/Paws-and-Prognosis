import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import HomeScreen from '../screens/owner/HomeScreen';
import CalendarScreen from '../screens/owner/CalendarScreen';
import ChatListScreen from '../screens/owner/ChatListScreen';
import ProfileScreen from '../screens/owner/ProfileScreen';
import VetDetailsScreen from '../screens/owner/VetDetailsScreen';
import BookingScreen from '../screens/owner/BookingScreen';
import MyPetsScreen from '../screens/owner/MyPetsScreen';
import AddPetScreen from '../screens/owner/AddPetScreen';
import EditPetScreen from '../screens/owner/EditPetScreen';
import PetProfileScreen from '../screens/owner/PetProfileScreen';
import ChatConversationScreen from '../screens/owner/ChatConversationScreen';
import RatingScreen from '../screens/owner/RatingScreen';
import RescheduleScreen from '../screens/owner/RescheduleScreen';
import EditProfileScreen from '../screens/shared/EditProfileScreen';
import TipsScreen from '../screens/owner/TipsScreen';
import ChatTabIcon from '../components/ChatTabIcon';
import { Colors } from '../lib/constants';
import type { OwnerTabParamList, OwnerStackParamList } from '../types';

const Tab = createBottomTabNavigator<OwnerTabParamList>();
const Stack = createNativeStackNavigator<OwnerStackParamList>();

function OwnerTabs() {
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
          if (route.name === 'Chat') {
            return <ChatTabIcon color={color} size={size} />;
          }
          let iconName: keyof typeof Ionicons.glyphMap = 'home-outline';
          if (route.name === 'Calendar') iconName = 'calendar-outline';
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

export default function OwnerNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="OwnerTabs" component={OwnerTabs} />
      <Stack.Screen name="VetDetails" component={VetDetailsScreen} />
      <Stack.Screen name="Booking" component={BookingScreen} />
      <Stack.Screen name="MyPets" component={MyPetsScreen} />
      <Stack.Screen name="AddPet" component={AddPetScreen} />
      <Stack.Screen name="EditPet" component={EditPetScreen} />
      <Stack.Screen name="PetProfile" component={PetProfileScreen} />
      <Stack.Screen name="ChatConversation" component={ChatConversationScreen} />
      <Stack.Screen name="Rating" component={RatingScreen} />
      <Stack.Screen name="Reschedule" component={RescheduleScreen} />
      <Stack.Screen name="EditProfile" component={EditProfileScreen} />
      <Stack.Screen name="TipsScreen" component={TipsScreen} />
    </Stack.Navigator>
  );
}
