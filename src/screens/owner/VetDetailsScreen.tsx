import React from 'react';
import {
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RouteProp } from '@react-navigation/native';
import { mockVets } from '../../data/mockVets';
import type { OwnerStackParamList } from '../../types';

type VetDetailsRouteProp = RouteProp<OwnerStackParamList, 'VetDetails'>;
type NavigationProp = NativeStackNavigationProp<OwnerStackParamList>;

export default function VetDetailsScreen() {
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<VetDetailsRouteProp>();
  const { vetId } = route.params;

  const vet = mockVets.find((v) => v.id === vetId);

  if (!vet) {
    return (
      <View className="flex-1 bg-beige items-center justify-center">
        <Text className="text-grey text-base">Vet not found</Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-beige">
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View className="px-5 pt-14 pb-4 flex-row items-center">
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            className="w-10 h-10 rounded-full bg-white items-center justify-center shadow-sm"
            activeOpacity={0.7}
          >
            <Ionicons name="arrow-back" size={22} color="#343434" />
          </TouchableOpacity>
          <Text className="flex-1 text-center text-lg font-semibold text-heading mr-10">
            Vet Details
          </Text>
        </View>

        {/* Vet Profile Card */}
        <View className="mx-5 bg-primary rounded-card p-5 items-center">
          <Image
            source={{ uri: vet.image_url || '' }}
            className="w-[120px] h-[120px] rounded-full border-[3px] border-primary-border"
          />
          <Text className="text-white text-xl font-bold mt-3">{vet.name}</Text>
          <Text className="text-white/70 text-sm mt-1">{vet.specialty}</Text>

          {/* Stats Row */}
          <View className="flex-row mt-4 gap-6">
            <View className="items-center">
              <View className="flex-row items-center">
                <Ionicons name="star" size={16} color="#7BBD38" />
                <Text className="text-white font-bold text-base ml-1">{vet.rating}</Text>
              </View>
              <Text className="text-white/60 text-xs mt-1">Rating</Text>
            </View>
            <View className="items-center">
              <Text className="text-white font-bold text-base">50+</Text>
              <Text className="text-white/60 text-xs mt-1">Patients</Text>
            </View>
            <View className="items-center">
              <Text className="text-white font-bold text-base">8 yrs</Text>
              <Text className="text-white/60 text-xs mt-1">Experience</Text>
            </View>
          </View>
        </View>

        {/* About Section */}
        <View className="mx-5 mt-6">
          <Text className="text-lg font-semibold text-heading mb-2">About</Text>
          <Text className="text-sm text-grey leading-5">
            {vet.bio || 'No bio available.'}
          </Text>
        </View>

        {/* Working Hours */}
        <View className="mx-5 mt-6">
          <Text className="text-lg font-semibold text-heading mb-3">Working Hours</Text>
          <View className="bg-white rounded-card p-4">
            <View className="flex-row justify-between mb-2">
              <Text className="text-sm text-dark">Monday - Friday</Text>
              <Text className="text-sm font-medium text-primary">9:00 AM - 4:00 PM</Text>
            </View>
            <View className="flex-row justify-between mb-2">
              <Text className="text-sm text-dark">Saturday</Text>
              <Text className="text-sm font-medium text-primary">9:00 AM - 12:00 PM</Text>
            </View>
            <View className="flex-row justify-between">
              <Text className="text-sm text-dark">Sunday</Text>
              <Text className="text-sm font-medium text-grey">Closed</Text>
            </View>
          </View>
        </View>

        {/* Contact Actions */}
        <View className="mx-5 mt-6 flex-row gap-3">
          <TouchableOpacity
            onPress={() =>
              navigation.navigate('ChatConversation', {
                threadId: vet.user_id,
                participantName: vet.name,
              })
            }
            className="flex-1 bg-white rounded-btn h-[48px] flex-row items-center justify-center border border-gray-200"
            activeOpacity={0.7}
          >
            <Ionicons name="chatbubble-outline" size={18} color="#71924F" />
            <Text className="text-sm font-medium text-dark ml-2">Message</Text>
          </TouchableOpacity>
          <TouchableOpacity
            className="flex-1 bg-white rounded-btn h-[48px] flex-row items-center justify-center border border-gray-200"
            activeOpacity={0.7}
          >
            <Ionicons name="call-outline" size={18} color="#71924F" />
            <Text className="text-sm font-medium text-dark ml-2">Call</Text>
          </TouchableOpacity>
        </View>

        {/* Bottom spacing */}
        <View className="h-[120px]" />
      </ScrollView>

      {/* Book Appointment CTA */}
      <View className="absolute bottom-0 left-0 right-0 px-5 pb-8 pt-4 bg-beige">
        <TouchableOpacity
          onPress={() => navigation.navigate('Booking', { vetId: vet.id, vetName: vet.name })}
          className="bg-primary h-[52px] rounded-btn items-center justify-center shadow-md"
          activeOpacity={0.8}
        >
          <Text className="text-white text-base font-semibold">Book Appointment</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
