import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RouteProp } from '@react-navigation/native';
import { supabase } from '../../lib/supabase';
import { useAppointments } from '../../hooks/useAppointments';
import type { OwnerStackParamList } from '../../types';

type NavigationProp = NativeStackNavigationProp<OwnerStackParamList>;
type RescheduleRouteProp = RouteProp<OwnerStackParamList, 'Reschedule'>;

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
  const days: { date: string; dayName: string; dayNumber: number; month: string }[] = [];
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const today = new Date();

  for (let i = 1; i < count + 1; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() + i);
    days.push({
      date: d.toISOString().split('T')[0],
      dayName: dayNames[d.getDay()],
      dayNumber: d.getDate(),
      month: monthNames[d.getMonth()],
    });
  }
  return days;
}

function convertTo24Hour(time12: string): string {
  const [time, period] = time12.split(' ');
  const [hours, minutes] = time.split(':').map(Number);
  let h = hours;
  if (period === 'PM' && h !== 12) h += 12;
  if (period === 'AM' && h === 12) h = 0;
  return `${String(h).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:00`;
}

export default function RescheduleScreen() {
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<RescheduleRouteProp>();
  const { appointmentId, vetName } = route.params;

  const { appointments, fetchAppointments } = useAppointments();
  const appointment = appointments.find((a) => a.id === appointmentId);

  const days = useMemo(() => generateDays(14), []);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // Find booked time slots for the selected date
  const bookedSlots = useMemo(() => {
    if (!selectedDate || !appointment) return [];
    return appointments
      .filter(
        (a) =>
          a.date === selectedDate &&
          a.vet_id === appointment.vet_id &&
          a.status !== 'cancelled' &&
          a.id !== appointmentId
      )
      .map((a) => a.time);
  }, [selectedDate, appointments, appointment, appointmentId]);

  function isSlotBooked(slot: string): boolean {
    const time24 = convertTo24Hour(slot);
    return bookedSlots.some((b) => b.startsWith(time24.slice(0, 5)));
  }

  async function handleReschedule() {
    if (!selectedDate || !selectedTime) {
      Alert.alert('Error', 'Please select a new date and time.');
      return;
    }

    const time24 = convertTo24Hour(selectedTime);

    setSubmitting(true);
    try {
      const { error } = await supabase
        .from('appointments')
        .update({ date: selectedDate, time: time24 })
        .eq('id', appointmentId);

      if (error) throw error;

      await fetchAppointments();
      Alert.alert('Rescheduled', `Your appointment has been moved to ${selectedDate} at ${selectedTime}.`, [
        { text: 'OK', onPress: () => navigation.goBack() },
      ]);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to reschedule';
      Alert.alert('Error', message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <View className="flex-1 bg-beige">
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
          Reschedule
        </Text>
      </View>

      <ScrollView className="flex-1 px-5" showsVerticalScrollIndicator={false}>
        {/* Info */}
        <View className="bg-primary/10 rounded-card p-4 mb-6">
          <Text className="text-sm font-medium text-dark">
            Reschedule appointment with <Text className="text-primary font-semibold">{vetName}</Text>
          </Text>
          {appointment && (
            <Text className="text-xs text-grey mt-1">
              Currently: {appointment.date} at {appointment.time}
            </Text>
          )}
        </View>

        {/* Date Picker */}
        <Text className="text-base font-semibold text-heading mb-3">Select New Date</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mb-6">
          {days.map((day) => {
            const isSelected = selectedDate === day.date;
            // Skip Sundays
            if (day.dayName === 'Sun') return null;
            return (
              <TouchableOpacity
                key={day.date}
                onPress={() => {
                  setSelectedDate(day.date);
                  setSelectedTime(null);
                }}
                className={`w-[60px] h-[80px] rounded-card items-center justify-center mr-3 ${
                  isSelected ? 'bg-primary' : 'bg-white border border-gray-200'
                }`}
                activeOpacity={0.7}
              >
                <Text className={`text-xs ${isSelected ? 'text-white/70' : 'text-grey'}`}>
                  {day.dayName}
                </Text>
                <Text className={`text-lg font-bold mt-1 ${isSelected ? 'text-white' : 'text-dark'}`}>
                  {day.dayNumber}
                </Text>
                <Text className={`text-[10px] ${isSelected ? 'text-white/70' : 'text-grey'}`}>
                  {day.month}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {/* Time Slots */}
        {selectedDate && (
          <>
            <Text className="text-base font-semibold text-heading mb-3">Select New Time</Text>
            <View className="flex-row flex-wrap gap-3 mb-6">
              {TIME_SLOTS.map((slot) => {
                const booked = isSlotBooked(slot);
                const isSelected = selectedTime === slot;
                return (
                  <TouchableOpacity
                    key={slot}
                    onPress={() => !booked && setSelectedTime(slot)}
                    disabled={booked}
                    className={`px-4 py-3 rounded-btn ${
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
                      {slot}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </>
        )}

        <View className="h-[120px]" />
      </ScrollView>

      {/* Confirm Button */}
      <View className="absolute bottom-0 left-0 right-0 px-5 pb-8 pt-4 bg-beige">
        <TouchableOpacity
          onPress={handleReschedule}
          disabled={!selectedDate || !selectedTime || submitting}
          className={`h-[52px] rounded-btn items-center justify-center shadow-md ${
            selectedDate && selectedTime ? 'bg-primary' : 'bg-gray-300'
          } ${submitting ? 'opacity-60' : ''}`}
          activeOpacity={0.8}
        >
          {submitting ? (
            <ActivityIndicator color="#FFF" />
          ) : (
            <Text className="text-white text-base font-semibold">Confirm Reschedule</Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
}
