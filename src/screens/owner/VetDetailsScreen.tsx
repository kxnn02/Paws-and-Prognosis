import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RouteProp } from '@react-navigation/native';
import { mockVets } from '../../data/mockVets';
import { usePets } from '../../hooks/usePets';
import { useAppointments } from '../../hooks/useAppointments';
import type { OwnerStackParamList } from '../../types';

type VetDetailsRouteProp = RouteProp<OwnerStackParamList, 'VetDetails'>;
type NavigationProp = NativeStackNavigationProp<OwnerStackParamList>;

// Generate next 7 days for the date picker
function getNextDays(count: number) {
  const days: { date: string; dayName: string; dayNumber: string; full: string }[] = [];
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const today = new Date();

  for (let i = 0; i < count; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() + i);
    days.push({
      date: d.toISOString().split('T')[0],
      dayName: dayNames[d.getDay()],
      dayNumber: d.getDate().toString().padStart(2, '0'),
      full: d.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
    });
  }
  return days;
}

const TIME_SLOTS = [
  '09:00 AM',
  '10:00 AM',
  '11:00 AM',
  '01:00 PM',
  '02:00 PM',
  '03:00 PM',
  '04:00 PM',
];

const SCHEDULE_DAYS = getNextDays(7);

function convertTo24Hour(time12: string): string {
  const [time, modifier] = time12.split(' ');
  const [hoursStr, minutes] = time.split(':');
  let hours = parseInt(hoursStr, 10);
  if (modifier === 'PM' && hours !== 12) hours += 12;
  if (modifier === 'AM' && hours === 12) hours = 0;
  return `${hours.toString().padStart(2, '0')}:${minutes}:00`;
}

export default function VetDetailsScreen() {
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<VetDetailsRouteProp>();
  const { vetId } = route.params;

  const vet = mockVets.find((v) => v.id === vetId);
  const { pets } = usePets();
  const { bookAppointment } = useAppointments();

  const [selectedDate, setSelectedDate] = useState(SCHEDULE_DAYS[0].date);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [selectedPetId, setSelectedPetId] = useState<string | null>(null);
  const [booking, setBooking] = useState(false);

  if (!vet) {
    return (
      <View className="flex-1 bg-beige items-center justify-center">
        <Text className="text-grey text-base">Vet not found</Text>
      </View>
    );
  }

  const handleBookAppointment = async () => {
    if (!selectedTime) {
      Alert.alert('Select a Time', 'Please choose a time slot for your appointment.');
      return;
    }

    const selectedDay = SCHEDULE_DAYS.find((d) => d.date === selectedDate);

    // Convert 12h to 24h time for database
    const time24 = convertTo24Hour(selectedTime);

    Alert.alert(
      'Confirm Booking',
      `Book appointment with ${vet.name}\n\nDate: ${selectedDay?.full}\nTime: ${selectedTime}${selectedPetId ? '\nPet: ' + (pets.find((p) => p.id === selectedPetId)?.name || '') : ''}`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Confirm',
          onPress: async () => {
            setBooking(true);
            const { error } = await bookAppointment({
              vetId,
              petId: selectedPetId,
              date: selectedDate,
              time: time24,
            });
            setBooking(false);

            if (error) {
              Alert.alert('Booking Failed', error.message);
            } else {
              Alert.alert('Booked!', 'Your appointment has been confirmed.', [
                { text: 'OK', onPress: () => navigation.goBack() },
              ]);
            }
          },
        },
      ]
    );
  };

  return (
    <View className="flex-1 bg-beige">
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header with back button */}
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

        {/* Schedule Section */}
        <View className="mx-5 mt-6">
          <Text className="text-lg font-semibold text-heading mb-3">Schedule</Text>

          {/* Date Picker */}
          <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mb-4">
            {SCHEDULE_DAYS.map((day) => {
              const isSelected = selectedDate === day.date;
              return (
                <TouchableOpacity
                  key={day.date}
                  onPress={() => setSelectedDate(day.date)}
                  className={`w-[60px] h-[76px] rounded-btn items-center justify-center mr-3 ${
                    isSelected ? 'bg-primary' : 'bg-white border border-gray-200'
                  }`}
                  activeOpacity={0.7}
                >
                  <Text
                    className={`text-xs ${isSelected ? 'text-white/70' : 'text-grey'}`}
                  >
                    {day.dayName}
                  </Text>
                  <Text
                    className={`text-lg font-semibold mt-1 ${
                      isSelected ? 'text-white' : 'text-dark'
                    }`}
                  >
                    {day.dayNumber}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>

          {/* Time Slots */}
          <Text className="text-base font-medium text-heading mb-3">Available Time</Text>
          <View className="flex-row flex-wrap gap-3">
            {TIME_SLOTS.map((time) => {
              const isSelected = selectedTime === time;
              return (
                <TouchableOpacity
                  key={time}
                  onPress={() => setSelectedTime(time)}
                  className={`px-4 py-2 rounded-btn ${
                    isSelected ? 'bg-primary' : 'bg-white border border-gray-200'
                  }`}
                  activeOpacity={0.7}
                >
                  <Text
                    className={`text-sm font-medium ${
                      isSelected ? 'text-white' : 'text-dark'
                    }`}
                  >
                    {time}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* Pet Selection */}
        {pets.length > 0 && (
          <View className="mx-5 mt-6">
            <Text className="text-base font-medium text-heading mb-3">Select Pet (optional)</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {pets.map((pet) => {
                const isSelected = selectedPetId === pet.id;
                return (
                  <TouchableOpacity
                    key={pet.id}
                    onPress={() => setSelectedPetId(isSelected ? null : pet.id)}
                    className={`mr-3 px-4 py-2 rounded-btn flex-row items-center ${
                      isSelected ? 'bg-primary' : 'bg-white border border-gray-200'
                    }`}
                    activeOpacity={0.7}
                  >
                    <Ionicons
                      name="paw"
                      size={14}
                      color={isSelected ? '#FFF' : '#71924F'}
                    />
                    <Text
                      className={`text-sm font-medium ml-2 ${
                        isSelected ? 'text-white' : 'text-dark'
                      }`}
                    >
                      {pet.name}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          </View>
        )}

        {/* Bottom spacing */}
        <View className="h-[120px]" />
      </ScrollView>

      {/* Book Appointment Button - Fixed at bottom */}
      <View className="absolute bottom-0 left-0 right-0 px-5 pb-8 pt-4 bg-beige">
        <TouchableOpacity
          onPress={handleBookAppointment}
          disabled={booking}
          className={`bg-primary h-[52px] rounded-btn items-center justify-center shadow-md ${booking ? 'opacity-60' : ''}`}
          activeOpacity={0.8}
        >
          {booking ? (
            <ActivityIndicator color="#FFF" />
          ) : (
            <Text className="text-white text-base font-semibold">Book Appointment</Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
}
