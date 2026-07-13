import React, { useState, useMemo, useEffect, useRef } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  TextInput,
  KeyboardAvoidingView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute, useFocusEffect } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RouteProp } from '@react-navigation/native';
import { usePets } from '../../hooks/usePets';
import { useAppointments } from '../../hooks/useAppointments';
import { useVetWorkingHours } from '../../hooks/useVetWorkingHours';
import { supabase } from '../../lib/supabase';
import { formatOwnerNotes } from '../../lib/notesHelper';
import type { OwnerStackParamList } from '../../types';

type BookingRouteProp = RouteProp<OwnerStackParamList, 'Booking'>;
type NavigationProp = NativeStackNavigationProp<OwnerStackParamList>;

const TIME_SLOTS = [
  '09:00 AM',
  '10:00 AM',
  '11:00 AM',
  '01:00 PM',
  '02:00 PM',
  '03:00 PM',
  '04:00 PM',
];

function generateDays(count: number) {
  const days: { date: string; dayName: string; dayNumber: number; month: string; monthYear: string }[] = [];
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const today = new Date();

  for (let i = 0; i < count; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() + i);
    days.push({
      date: d.toISOString().split('T')[0],
      dayName: dayNames[d.getDay()],
      dayNumber: d.getDate(),
      month: monthNames[d.getMonth()],
      monthYear: d.toLocaleDateString('en-US', { month: 'long', year: 'numeric' }),
    });
  }
  return days;
}

function convertTo24Hour(time12: string): string {
  const [time, modifier] = time12.split(' ');
  const [hoursStr, minutes] = time.split(':');
  let hours = parseInt(hoursStr, 10);
  if (modifier === 'PM' && hours !== 12) hours += 12;
  if (modifier === 'AM' && hours === 12) hours = 0;
  return `${hours.toString().padStart(2, '0')}:${minutes}:00`;
}

export default function BookingScreen() {
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<BookingRouteProp>();
  const { vetId, vetName } = route.params;

  const { pets, fetchPets } = usePets();
  const { bookAppointment } = useAppointments();
  const { hours: vetHours } = useVetWorkingHours(vetId);

  // Refetch pets when screen regains focus (e.g., after adding a pet)
  useFocusEffect(
    React.useCallback(() => {
      fetchPets();
    }, [fetchPets])
  );

  const scheduleDays = useMemo(() => generateDays(14), []);

  const [selectedDate, setSelectedDate] = useState(scheduleDays[0].date);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [selectedPetId, setSelectedPetId] = useState<string | null>(null);
  const [notes, setNotes] = useState('');
  const [booking, setBooking] = useState(false);
  const [bookedSlots, setBookedSlots] = useState<string[]>([]);
  const [slotsError, setSlotsError] = useState(false);
  const bookingCompleteRef = useRef(false);

  // Warn before leaving with unsaved booking selections
  React.useEffect(() => {
    const unsubscribe = navigation.addListener('beforeRemove', (e) => {
      if (!selectedTime || bookingCompleteRef.current) return; // No selection or booking done, allow leave

      e.preventDefault();
      Alert.alert(
        'Discard Booking?',
        'You have an unfinished booking. Are you sure you want to leave?',
        [
          { text: 'Stay', style: 'cancel' },
          { text: 'Leave', style: 'destructive', onPress: () => navigation.dispatch(e.data.action) },
        ]
      );
    });

    return unsubscribe;
  }, [navigation, selectedTime]);

  // Fetch booked slots for the selected date and this vet
  useEffect(() => {
    async function fetchBookedSlots() {
      try {
        setSlotsError(false);
        const { data, error } = await supabase
          .from('appointments')
          .select('time')
          .eq('vet_id', vetId)
          .eq('date', selectedDate)
          .neq('status', 'cancelled');

        if (error) throw error;

        if (data) {
          setBookedSlots(data.map((a: { time: string }) => a.time));
        }
      } catch {
        setSlotsError(true);
      }
    }
    fetchBookedSlots();
  }, [selectedDate, vetId]);

  function isSlotBooked(slot: string): boolean {
    const time24 = convertTo24Hour(slot);
    return bookedSlots.some((b) => b.startsWith(time24.slice(0, 5)));
  }

  function getAvailableSlots(): string[] {
    const dayNames = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'] as const;
    const dayIndex = new Date(selectedDate).getDay();
    const dayName = dayNames[dayIndex];
    const hoursForDay = vetHours[dayName];

    if (!hoursForDay) return []; // Closed

    // Parse "9:00 AM - 4:00 PM" format
    const [startStr, endStr] = hoursForDay.split(' - ');
    const startMinutes = parseTimeToMinutes(startStr);
    const endMinutes = parseTimeToMinutes(endStr);

    return TIME_SLOTS.filter((slot) => {
      const slotMinutes = parseTimeToMinutes(slot);
      return slotMinutes >= startMinutes && slotMinutes < endMinutes;
    });
  }

  function parseTimeToMinutes(time12: string): number {
    const [time, modifier] = time12.split(' ');
    const [hoursStr, minutes] = time.split(':');
    let hours = parseInt(hoursStr, 10);
    if (modifier === 'PM' && hours !== 12) hours += 12;
    if (modifier === 'AM' && hours === 12) hours = 0;
    return hours * 60 + parseInt(minutes, 10);
  }

  const selectedDayData = scheduleDays.find((d) => d.date === selectedDate);

  const handleConfirmBooking = async () => {
    if (!selectedTime) {
      Alert.alert('Select a Time', 'Please choose a time slot for your appointment.');
      return;
    }

    if (pets.length > 0 && !selectedPetId) {
      Alert.alert('Select a Pet', 'Please select which pet this appointment is for.');
      return;
    }

    const time24 = convertTo24Hour(selectedTime);
    const dateFormatted = new Date(selectedDate).toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
    });

    Alert.alert(
      'Confirm Booking',
      `${vetName}\n\n📅 ${dateFormatted}\n🕐 ${selectedTime}${selectedPetId ? '\n🐾 ' + (pets.find((p) => p.id === selectedPetId)?.name || '') : ''}${notes ? '\n📝 ' + notes : ''}`,
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
              notes: notes.trim() ? formatOwnerNotes(notes.trim()) : undefined,
            });
            setBooking(false);

            if (error) {
              Alert.alert('Booking Failed', error.message);
            } else {
              bookingCompleteRef.current = true;
              Alert.alert(
                'Appointment Booked! ✓',
                `Your appointment with ${vetName} has been confirmed.`,
                [{ text: 'Done', onPress: () => navigation.popToTop() }]
              );
            }
          },
        },
      ]
    );
  };

  // Determine if we're showing a month boundary
  const currentMonthLabel = selectedDayData?.monthYear || '';

  return (
    <View className="flex-1 bg-beige">
      <KeyboardAvoidingView
        className="flex-1"
        behavior='padding'
      >
      <ScrollView showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
        {/* Header */}
        <View className="px-5 pt-14 pb-2 flex-row items-center">
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            className="w-10 h-10 rounded-full bg-white items-center justify-center shadow-sm"
            activeOpacity={0.7}
          >
            <Ionicons name="arrow-back" size={22} color="#343434" />
          </TouchableOpacity>
          <Text className="flex-1 text-center text-lg font-semibold text-heading mr-10">
            Book Appointment
          </Text>
        </View>

        {/* Step Progress */}
        <View className="mx-5 mt-3 mb-1 flex-row items-center justify-center">
          <View className="flex-row items-center">
            <View className={`w-7 h-7 rounded-full items-center justify-center ${selectedDate ? 'bg-primary' : 'bg-primary/30'}`}>
              <Text className="text-xs font-bold text-white">1</Text>
            </View>
            <View className={`w-8 h-[2px] ${selectedTime ? 'bg-primary' : 'bg-gray-200'}`} />
            <View className={`w-7 h-7 rounded-full items-center justify-center ${selectedTime ? 'bg-primary' : 'bg-gray-200'}`}>
              <Text className={`text-xs font-bold ${selectedTime ? 'text-white' : 'text-grey'}`}>2</Text>
            </View>
            <View className={`w-8 h-[2px] ${selectedPetId || pets.length === 0 ? 'bg-primary' : 'bg-gray-200'}`} />
            <View className={`w-7 h-7 rounded-full items-center justify-center ${selectedPetId || pets.length === 0 ? 'bg-primary' : 'bg-gray-200'}`}>
              <Text className={`text-xs font-bold ${selectedPetId || pets.length === 0 ? 'text-white' : 'text-grey'}`}>3</Text>
            </View>
            <View className={`w-8 h-[2px] ${selectedTime ? 'bg-primary' : 'bg-gray-200'}`} />
            <View className={`w-7 h-7 rounded-full items-center justify-center ${selectedTime && selectedDate ? 'bg-primary/30' : 'bg-gray-200'}`}>
              <Ionicons name="checkmark" size={14} color={selectedTime && selectedDate ? '#71924F' : '#9BA1A8'} />
            </View>
          </View>
        </View>

        {/* Vet name context */}
        <View className="mx-5 mt-2 mb-4 bg-primary/10 rounded-btn px-4 py-3 flex-row items-center">
          <Ionicons name="medical" size={18} color="#71924F" />
          <Text className="text-sm font-medium text-dark ml-2">{vetName}</Text>
        </View>

        {/* Step 1: Select Date */}
        <View className="mx-5">
          <Text className="text-lg font-semibold text-heading mb-1">Select Date</Text>
          <Text className="text-xs text-grey mb-3">{currentMonthLabel}</Text>

          {/* Date Picker - 14 days */}
          <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mb-2">
            {scheduleDays.map((day, index) => {
              const isSelected = selectedDate === day.date;
              const isToday = index === 0;
              // Sunday indicator
              const isSunday = day.dayName === 'Sun';

              return (
                <TouchableOpacity
                  key={day.date}
                  onPress={() => !isSunday && setSelectedDate(day.date)}
                  disabled={isSunday}
                  accessibilityLabel={`${day.dayName} ${day.month} ${day.dayNumber}${isSunday ? ', clinic closed' : isSelected ? ', selected' : ''}`}
                  className={`w-[56px] h-[72px] rounded-btn items-center justify-center mr-2 ${
                    isSunday
                      ? 'bg-gray-100 opacity-50'
                      : isSelected
                        ? 'bg-primary'
                        : 'bg-white border border-gray-200'
                  }`}
                  activeOpacity={0.7}
                >
                  <Text
                    className={`text-[10px] font-medium ${
                      isSunday
                        ? 'text-grey'
                        : isSelected
                          ? 'text-white/70'
                          : 'text-grey'
                    }`}
                  >
                    {day.dayName}
                  </Text>
                  <Text
                    className={`text-base font-semibold mt-1 ${
                      isSunday
                        ? 'text-grey'
                        : isSelected
                          ? 'text-white'
                          : 'text-dark'
                    }`}
                  >
                    {day.dayNumber}
                  </Text>
                  {isToday && !isSelected && (
                    <View className="w-[4px] h-[4px] rounded-full bg-primary mt-1" />
                  )}
                  {isToday && isSelected && (
                    <View className="w-[4px] h-[4px] rounded-full bg-white mt-1" />
                  )}
                </TouchableOpacity>
              );
            })}
          </ScrollView>
          <Text className="text-xs text-grey mt-2 italic">The clinic is closed on Sundays.</Text>
        </View>

        {/* Step 2: Select Time */}
        <View className="mx-5 mt-5">
          <Text className="text-lg font-semibold text-heading mb-3">Select Time</Text>
          {slotsError ? (
            <View className="items-center py-4">
              <Text className="text-sm text-red-500 mb-2">Could not verify availability. Please try again.</Text>
              <TouchableOpacity
                onPress={() => { setSlotsError(false); setBookedSlots([]); }}
                className="bg-primary px-4 py-2 rounded-btn"
              >
                <Text className="text-white text-sm font-medium">Retry</Text>
              </TouchableOpacity>
            </View>
          ) : (
          <View className="flex-row flex-wrap gap-3">
            {getAvailableSlots().map((time) => {
              const isSelected = selectedTime === time;
              const booked = isSlotBooked(time);
              return (
                <TouchableOpacity
                  key={time}
                  onPress={() => !booked && setSelectedTime(time)}
                  disabled={booked}
                  accessibilityLabel={`${time}${booked ? ', already booked' : isSelected ? ', selected' : ''}`}
                  className={`px-5 py-3 rounded-btn ${
                    booked
                      ? 'bg-gray-100 opacity-50'
                      : isSelected
                        ? 'bg-primary'
                        : 'bg-white border border-gray-200'
                  }`}
                  activeOpacity={0.7}
                >
                  <Text
                    className={`text-sm font-medium ${
                      booked
                        ? 'text-grey line-through'
                        : isSelected
                          ? 'text-white'
                          : 'text-dark'
                    }`}
                  >
                    {time}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
          )}
        </View>

        {/* Step 3: Select Pet */}
        <View className="mx-5 mt-6">
          <Text className="text-lg font-semibold text-heading mb-3">
            Select Pet {pets.length === 0 && '(add a pet first)'}
          </Text>

          {pets.length > 0 ? (
            <View className="flex-row flex-wrap gap-3">
              {pets.map((pet) => {
                const isSelected = selectedPetId === pet.id;
                return (
                  <TouchableOpacity
                    key={pet.id}
                    onPress={() => setSelectedPetId(isSelected ? null : pet.id)}
                    className={`px-4 py-3 rounded-btn flex-row items-center ${
                      isSelected ? 'bg-primary' : 'bg-white border border-gray-200'
                    }`}
                    activeOpacity={0.7}
                  >
                    <Ionicons
                      name="paw"
                      size={16}
                      color={isSelected ? '#FFF' : '#71924F'}
                    />
                    <Text
                      className={`text-sm font-medium ml-2 ${
                        isSelected ? 'text-white' : 'text-dark'
                      }`}
                    >
                      {pet.name}
                    </Text>
                    {pet.species && (
                      <Text
                        className={`text-xs ml-1 ${
                          isSelected ? 'text-white/70' : 'text-grey'
                        }`}
                      >
                        ({pet.species})
                      </Text>
                    )}
                  </TouchableOpacity>
                );
              })}
              {/* Add More Pet button */}
              <TouchableOpacity
                onPress={() => navigation.navigate('AddPet')}
                className="px-4 py-3 rounded-btn flex-row items-center border border-dashed border-primary"
                activeOpacity={0.7}
              >
                <Ionicons name="add" size={16} color="#71924F" />
                <Text className="text-sm font-medium text-primary ml-1">Add Pet</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <TouchableOpacity
              onPress={() => navigation.navigate('AddPet')}
              className="bg-white rounded-btn px-4 py-3 flex-row items-center border border-dashed border-primary"
              activeOpacity={0.7}
            >
              <Ionicons name="add-circle-outline" size={20} color="#71924F" />
              <Text className="text-sm font-medium text-primary ml-2">Add your first pet</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Step 4: Notes (optional) */}
        <View className="mx-5 mt-6">
          <Text className="text-lg font-semibold text-heading mb-3">
            Notes <Text className="text-xs text-grey font-normal">(optional)</Text>
          </Text>
          <TextInput
            className="bg-white rounded-btn px-4 py-3 text-sm text-dark border border-gray-200 min-h-[80px]"
            placeholder="Describe symptoms or reason for visit..."
            placeholderTextColor="#A7A7A7"
            value={notes}
            onChangeText={setNotes}
            multiline
            maxLength={500}
            textAlignVertical="top"
          />
          <Text className="text-[10px] text-grey mt-1 text-right">{notes.length}/500</Text>
        </View>

        {/* Summary */}
        {selectedTime && (
          <View className="mx-5 mt-6 bg-white rounded-card p-4 border border-gray-100">
            <Text className="text-sm font-semibold text-heading mb-2">Booking Summary</Text>
            <View className="flex-row items-center mb-1">
              <Ionicons name="calendar-outline" size={14} color="#808080" />
              <Text className="text-sm text-dark ml-2">
                {new Date(selectedDate).toLocaleDateString('en-US', {
                  weekday: 'short',
                  month: 'short',
                  day: 'numeric',
                })}
              </Text>
            </View>
            <View className="flex-row items-center mb-1">
              <Ionicons name="time-outline" size={14} color="#808080" />
              <Text className="text-sm text-dark ml-2">{selectedTime}</Text>
            </View>
            {selectedPetId && (
              <View className="flex-row items-center">
                <Ionicons name="paw" size={14} color="#808080" />
                <Text className="text-sm text-dark ml-2">
                  {pets.find((p) => p.id === selectedPetId)?.name}
                </Text>
              </View>
            )}
          </View>
        )}

        {/* Bottom spacing */}
        <View className="h-[120px]" />
      </ScrollView>
      </KeyboardAvoidingView>

      {/* Confirm Button */}
      <View className="absolute bottom-0 left-0 right-0 px-5 pb-8 pt-4 bg-beige">
        <TouchableOpacity
          onPress={handleConfirmBooking}
          disabled={booking || !selectedTime}
          className={`h-[52px] rounded-btn items-center justify-center shadow-md ${
            selectedTime ? 'bg-primary' : 'bg-gray-300'
          } ${booking ? 'opacity-60' : ''}`}
          activeOpacity={0.8}
        >
          {booking ? (
            <ActivityIndicator color="#FFF" />
          ) : (
            <Text className="text-white text-base font-semibold">
              {selectedTime ? 'Confirm Booking' : 'Select a time to continue'}
            </Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
}
