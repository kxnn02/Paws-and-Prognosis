import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  Alert,
  RefreshControl,
} from 'react-native';
import { Calendar } from 'react-native-calendars';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useAppointments } from '../../hooks/useAppointments';
import { useRatings } from '../../hooks/useRatings';
import type { Appointment, OwnerStackParamList } from '../../types';

type NavigationProp = NativeStackNavigationProp<OwnerStackParamList>;

export default function CalendarScreen() {
  const navigation = useNavigation<NavigationProp>();
  const { appointments, loading, getMarkedDates, getAppointmentsForDate, cancelAppointment, fetchAppointments } =
    useAppointments();
  const { hasRated } = useRatings();

  const today = new Date().toISOString().split('T')[0];
  const [selectedDate, setSelectedDate] = useState(today);
  const [refreshing, setRefreshing] = useState(false);

  // Refresh data when screen gains focus (e.g., after booking)
  useFocusEffect(
    React.useCallback(() => {
      fetchAppointments();
    }, [fetchAppointments])
  );

  async function onRefresh() {
    setRefreshing(true);
    await fetchAppointments();
    setRefreshing(false);
  }

  function handleCancel(appointmentId: string) {
    Alert.alert(
      'Cancel Appointment',
      'Are you sure you want to cancel this appointment?',
      [
        { text: 'No', style: 'cancel' },
        {
          text: 'Yes, Cancel',
          style: 'destructive',
          onPress: () => cancelAppointment(appointmentId),
        },
      ]
    );
  }

  const markedDates = getMarkedDates();
  const dayAppointments = getAppointmentsForDate(selectedDate);

  // Merge selected date styling with appointment dots
  const calendarMarks = {
    ...markedDates,
    [selectedDate]: {
      ...markedDates[selectedDate],
      selected: true,
      selectedColor: '#71924F',
    },
  };

  function formatTime(time: string): string {
    // Convert 24h "HH:MM:SS" to 12h format
    const [hoursStr, minutes] = time.split(':');
    let hours = parseInt(hoursStr, 10);
    const ampm = hours >= 12 ? 'PM' : 'AM';
    if (hours > 12) hours -= 12;
    if (hours === 0) hours = 12;
    return `${hours}:${minutes} ${ampm}`;
  }

  function getStatusColor(status: string) {
    switch (status) {
      case 'upcoming':
        return 'bg-blue-100 text-blue-700';
      case 'in_progress':
        return 'bg-yellow-100 text-yellow-700';
      case 'completed':
        return 'bg-green-100 text-green-700';
      case 'cancelled':
        return 'bg-red-100 text-red-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  }

  function renderAppointment({ item }: { item: Appointment }) {
    const statusColors = getStatusColor(item.status);
    const [bgColor, textColor] = statusColors.split(' ');

    return (
      <View className="bg-white rounded-card mx-5 mb-3 p-4 shadow-sm">
        <View className="flex-row items-center justify-between mb-2">
          <View className="flex-row items-center">
            <View className="w-8 h-8 rounded-full bg-primary/10 items-center justify-center mr-3">
              <Ionicons name="time-outline" size={16} color="#71924F" />
            </View>
            <Text className="text-base font-semibold text-dark">
              {formatTime(item.time)}
            </Text>
          </View>
          <View className={`px-3 py-1 rounded-full ${bgColor}`}>
            <Text className={`text-xs font-medium capitalize ${textColor}`}>
              {item.status.replace('_', ' ')}
            </Text>
          </View>
        </View>

        {/* Vet info */}
        <View className="ml-11">
          <Text className="text-sm text-dark font-medium">
            {item.vet?.name || 'Veterinarian'}
          </Text>
          {item.vet?.specialty && (
            <Text className="text-xs text-grey mt-1">{item.vet.specialty}</Text>
          )}
          {item.pet && (
            <View className="flex-row items-center mt-2">
              <Ionicons name="paw" size={12} color="#71924F" />
              <Text className="text-xs text-grey ml-1">Pet: {item.pet.name}</Text>
            </View>
          )}
          {item.notes && (
            <Text className="text-xs text-grey mt-1 italic">"{item.notes}"</Text>
          )}
        </View>

        {/* Cancel button for upcoming appointments */}
        {item.status === 'upcoming' && (
          <TouchableOpacity
            onPress={() => handleCancel(item.id)}
            className="mt-3 ml-11"
            activeOpacity={0.7}
          >
            <Text className="text-xs text-red-500 font-medium">Cancel Appointment</Text>
          </TouchableOpacity>
        )}

        {/* Rate button for completed appointments */}
        {item.status === 'completed' && item.vet && !hasRated(item.id) && (
          <TouchableOpacity
            onPress={() =>
              navigation.navigate('Rating', {
                appointmentId: item.id,
                vetId: item.vet_id,
                vetName: item.vet?.name || 'Veterinarian',
              })
            }
            className="mt-3 ml-11 bg-yellow-50 self-start px-3 py-1.5 rounded-btn flex-row items-center"
            activeOpacity={0.7}
          >
            <Ionicons name="star-outline" size={14} color="#F59E0B" />
            <Text className="text-xs font-medium text-yellow-700 ml-1">Rate this visit</Text>
          </TouchableOpacity>
        )}

        {/* Already rated indicator */}
        {item.status === 'completed' && hasRated(item.id) && (
          <View className="mt-3 ml-11 flex-row items-center">
            <Ionicons name="checkmark-circle" size={14} color="#10B981" />
            <Text className="text-xs text-green-700 ml-1">Rated</Text>
          </View>
        )}
      </View>
    );
  }

  function renderEmpty() {
    return (
      <View className="items-center pt-10 px-10">
        <Ionicons name="calendar-outline" size={40} color="#9BA1A8" />
        <Text className="text-sm text-grey text-center mt-3">
          No appointments on this date
        </Text>
      </View>
    );
  }

  if (loading) {
    return (
      <View className="flex-1 bg-beige items-center justify-center">
        <ActivityIndicator size="large" color="#71924F" />
      </View>
    );
  }

  return (
    <View className="flex-1 bg-beige">
      {/* Header */}
      <View className="px-5 pt-14 pb-2">
        <Text className="text-2xl font-bold text-heading">Calendar</Text>
      </View>

      {/* Calendar */}
      <Calendar
        current={selectedDate}
        onDayPress={(day: { dateString: string }) => setSelectedDate(day.dateString)}
        markedDates={calendarMarks}
        theme={{
          backgroundColor: '#FEF9F4',
          calendarBackground: '#FEF9F4',
          textSectionTitleColor: '#808080',
          selectedDayBackgroundColor: '#71924F',
          selectedDayTextColor: '#FFFFFF',
          todayTextColor: '#71924F',
          dayTextColor: '#343434',
          textDisabledColor: '#D1D5DB',
          dotColor: '#71924F',
          selectedDotColor: '#FFFFFF',
          arrowColor: '#71924F',
          monthTextColor: '#544864',
          textMonthFontWeight: '600',
          textDayFontSize: 14,
          textMonthFontSize: 16,
          textDayHeaderFontSize: 12,
        }}
        style={{ marginHorizontal: 12 }}
      />

      {/* Appointments for selected date */}
      <View className="flex-1 mt-4">
        <View className="px-5 mb-3 flex-row items-center justify-between">
          <Text className="text-base font-semibold text-heading">
            {selectedDate === today ? "Today's Appointments" : 'Appointments'}
          </Text>
          <Text className="text-xs text-grey">
            {dayAppointments.length} {dayAppointments.length === 1 ? 'appointment' : 'appointments'}
          </Text>
        </View>

        <FlatList
          data={dayAppointments}
          keyExtractor={(item) => item.id}
          renderItem={renderAppointment}
          ListEmptyComponent={renderEmpty}
          contentContainerStyle={{ paddingBottom: 100 }}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#71924F" />
          }
        />
      </View>
    </View>
  );
}
