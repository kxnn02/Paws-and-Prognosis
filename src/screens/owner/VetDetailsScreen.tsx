import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  Modal,
  Linking,
  Alert,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RouteProp } from '@react-navigation/native';
import { useVets } from '../../hooks/useVets';
import { useFavoriteVets } from '../../hooks/useFavoriteVets';
import { useVetWorkingHours } from '../../hooks/useVetWorkingHours';
import { CLINIC_CONTACT } from '../../lib/constants';
import type { OwnerStackParamList } from '../../types';

type VetDetailsRouteProp = RouteProp<OwnerStackParamList, 'VetDetails'>;
type NavigationProp = NativeStackNavigationProp<OwnerStackParamList>;

export default function VetDetailsScreen() {
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<VetDetailsRouteProp>();
  const { vetId } = route.params;

  const { vets: supabaseVets, loading, fetchVets } = useVets();
  const vet = supabaseVets.find((v) => v.id === vetId);
  const { isFavorite, toggleFavorite } = useFavoriteVets();
  const { hours } = useVetWorkingHours(vetId);

  const [showContact, setShowContact] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  async function onRefresh() {
    setRefreshing(true);
    await fetchVets();
    setRefreshing(false);
  }

  if (loading) {
    return (
      <View className="flex-1 bg-beige items-center justify-center">
        <ActivityIndicator size="large" color="#71924F" />
      </View>
    );
  }

  if (!vet) {
    return (
      <View className="flex-1 bg-beige items-center justify-center px-8">
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          className="absolute top-14 left-5 w-10 h-10 rounded-full bg-white items-center justify-center shadow-sm"
          activeOpacity={0.7}
        >
          <Ionicons name="arrow-back" size={22} color="#343434" />
        </TouchableOpacity>
        <Ionicons name="alert-circle-outline" size={48} color="#9BA1A8" />
        <Text className="text-grey text-base mt-3">Vet not found</Text>
      </View>
    );
  }

  async function openLink(url: string, fallbackMsg: string) {
    try {
      const supported = await Linking.canOpenURL(url);
      if (supported) {
        await Linking.openURL(url);
      } else {
        Alert.alert('Not Available', fallbackMsg);
      }
    } catch {
      Alert.alert('Error', 'Could not open the link.');
    }
    setShowContact(false);
  }

  return (
    <View className="flex-1 bg-beige">
      <ScrollView showsVerticalScrollIndicator={false} refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#71924F" />}>
        {/* Header */}
        <View className="px-5 pt-14 pb-4 flex-row items-center">
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            className="w-10 h-10 rounded-full bg-white items-center justify-center shadow-sm"
            activeOpacity={0.7}
            accessibilityLabel="Go back"
            accessibilityRole="button"
          >
            <Ionicons name="arrow-back" size={22} color="#343434" />
          </TouchableOpacity>
          <Text className="flex-1 text-center text-lg font-semibold text-heading">
            Vet Details
          </Text>
          <TouchableOpacity
            onPress={() => toggleFavorite(vetId)}
            className="w-10 h-10 rounded-full bg-white items-center justify-center shadow-sm"
            activeOpacity={0.7}
            accessibilityLabel={isFavorite(vetId) ? 'Remove from favorites' : 'Add to favorites'}
            accessibilityRole="button"
          >
            <Ionicons
              name={isFavorite(vetId) ? 'heart' : 'heart-outline'}
              size={22}
              color={isFavorite(vetId) ? '#EF4444' : '#343434'}
            />
          </TouchableOpacity>
        </View>

        {/* Vet Profile Card */}
        <View className="mx-5 bg-primary rounded-card p-5 items-center">
          {vet.image_url ? (
            <Image
              source={{ uri: vet.image_url }}
              className="w-[120px] h-[120px] rounded-full border-[3px] border-primary-border"
            />
          ) : (
            <View className="w-[120px] h-[120px] rounded-full border-[3px] border-primary-border bg-white/20 items-center justify-center">
              <Ionicons name="medical" size={48} color="#FFFFFF" />
            </View>
          )}
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
              <View className="flex-row items-center">
                <Ionicons name="medkit" size={14} color="#7BBD38" />
                <Text className="text-white font-bold text-base ml-1">{vet.specialty?.split(' ')[0] || 'General'}</Text>
              </View>
              <Text className="text-white/60 text-xs mt-1">Specialty</Text>
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
            {(['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'] as const).map((day) => {
              const label = day.charAt(0).toUpperCase() + day.slice(1);
              const value = hours[day];
              return (
                <View key={day} className="flex-row justify-between mb-2">
                  <Text className="text-sm text-dark">{label}</Text>
                  <Text className={`text-sm font-medium ${value ? 'text-primary' : 'text-red-400'}`}>
                    {value || 'Closed'}
                  </Text>
                </View>
              );
            })}
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
            onPress={() => setShowContact(true)}
            className="flex-1 bg-white rounded-btn h-[48px] flex-row items-center justify-center border border-gray-200"
            activeOpacity={0.7}
          >
            <Ionicons name="call-outline" size={18} color="#71924F" />
            <Text className="text-sm font-medium text-dark ml-2">Contact</Text>
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

      {/* Contact Clinic Modal */}
      <Modal
        visible={showContact}
        transparent
        animationType="slide"
        onRequestClose={() => setShowContact(false)}
      >
        <TouchableOpacity
          className="flex-1 bg-black/40"
          activeOpacity={1}
          onPress={() => setShowContact(false)}
        />
        <View className="bg-white rounded-t-[24px] px-5 pt-6 pb-10">
          <View className="items-center mb-4">
            <View className="w-10 h-1 rounded-full bg-gray-300 mb-4" />
            <Text className="text-lg font-semibold text-heading">Contact Clinic</Text>
            <Text className="text-xs text-grey mt-1">
              Calls are handled by the clinic assistant
            </Text>
          </View>

          {/* Phone */}
          <TouchableOpacity
            onPress={() => openLink(`tel:${CLINIC_CONTACT.phone}`, 'Phone dialer not available.')}
            className="bg-white rounded-btn px-4 h-[56px] flex-row items-center mb-3 border border-gray-200"
            activeOpacity={0.7}
          >
            <View className="w-10 h-10 rounded-full bg-blue-50 items-center justify-center mr-3">
              <Ionicons name="call" size={20} color="#3B82F6" />
            </View>
            <View className="flex-1">
              <Text className="text-sm font-medium text-dark">Phone Call</Text>
              <Text className="text-xs text-grey">{CLINIC_CONTACT.phone}</Text>
            </View>
            <Ionicons name="open-outline" size={16} color="#9BA1A8" />
          </TouchableOpacity>

          {/* Viber */}
          <TouchableOpacity
            onPress={() =>
              openLink(
                `viber://chat?number=${CLINIC_CONTACT.viber.replace('+', '%2B')}`,
                'Viber is not installed on this device.'
              )
            }
            className="bg-white rounded-btn px-4 h-[56px] flex-row items-center mb-3 border border-gray-200"
            activeOpacity={0.7}
          >
            <View className="w-10 h-10 rounded-full bg-purple-50 items-center justify-center mr-3">
              <Ionicons name="chatbubbles" size={20} color="#7C3AED" />
            </View>
            <View className="flex-1">
              <Text className="text-sm font-medium text-dark">Viber</Text>
              <Text className="text-xs text-grey">Chat with clinic assistant</Text>
            </View>
            <Ionicons name="open-outline" size={16} color="#9BA1A8" />
          </TouchableOpacity>

          {/* Messenger */}
          <TouchableOpacity
            onPress={() =>
              openLink(
                `fb-messenger://user-thread/${CLINIC_CONTACT.messenger}`,
                'Messenger is not installed. Try searching for the clinic on Facebook.'
              )
            }
            className="bg-white rounded-btn px-4 h-[56px] flex-row items-center mb-3 border border-gray-200"
            activeOpacity={0.7}
          >
            <View className="w-10 h-10 rounded-full bg-blue-50 items-center justify-center mr-3">
              <Ionicons name="logo-facebook" size={20} color="#1877F2" />
            </View>
            <View className="flex-1">
              <Text className="text-sm font-medium text-dark">Messenger</Text>
              <Text className="text-xs text-grey">Message via Facebook</Text>
            </View>
            <Ionicons name="open-outline" size={16} color="#9BA1A8" />
          </TouchableOpacity>

          {/* Cancel */}
          <TouchableOpacity
            onPress={() => setShowContact(false)}
            className="mt-2 h-[44px] items-center justify-center"
            activeOpacity={0.7}
          >
            <Text className="text-sm font-medium text-grey">Cancel</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </View>
  );
}
