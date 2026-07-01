import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { Calendar } from 'react-native-calendars';
import { Ionicons } from '@expo/vector-icons';
import { useVetAppointments } from '../../hooks/useVetAppointments';
import type { Appointment } from '../../types';

export default function VetAppointmentsScreen() {
  const {
    loading,
    getMarkedDates,
    getAppointmentsForDate,
    updateAppointmentStatus,
  } = useVetAppointments();

  const today = new Date().toISOString().split('T')[0];
  const [selectedDate, setSelectedDate] = useState(today);

  const markedDates = getMarkedDates();
  const dayAppointments = getAppointmentsForDate(selectedDate);

  const calendarMarks = {
    ...markedDates,
    [selectedDate]: {
      ...markedDates[selectedDate],
      selected: true,
      selectedColor: '#71924F',
    },
  };

  function formatTime(time: string): string {
    const [hoursStr, minutes] = time.split(':');
    let hours = parseInt(hoursStr, 10);
    const ampm = hours >= 12 ? 'PM' : 'AM';
    if (hours > 12) hours -= 12;
    if (hours === 0) hours = 12;
    return `${hours}:${minutes} ${ampm}`;
  }

  function handleStatusChange(appointment: Appointment, newStatus: string) {
    const label = newStatus === 'in_progress' ? 'Start' : newStatus === 'completed' ? 'Complete' : 'Cancel';
    Alert.alert(
      `${label} Appointment`,
      `Mark this appointment as "${newStatus.replace('_', ' ')}"?`,
      [
        { text: 'No', style: 'cancel' },
        {
          text: 'Yes',
          onPress: async () => {
            const { error } = await updateAppointmentStatus(appointment.id, newStatus);
            if (error) Alert.alert('Error', error.message);
          },
        },
      ]
    );
  }

  function renderAppointment({ item }: { item: Appointment }) {
    return (
      <View className="bg-white rounded-card mx-5 mb-3 p-4 shadow-sm">
        {/* Top row: time + status */}
        <View className="flex-row items-center justify-between mb-2">
          <View className="flex-row items-center">
            <Ionicons name="time-outline" size={16} color="#71924F" />
            <Text className="text-sm font-semibold text-dark ml-2">
              {formatTime(item.time)}
            </Text>
          </View>
          <View className={`px-3 py-1 rounded-full ${getStatusBg(item.status)}`}>
            <Text className={`text-xs font-medium capitalize ${getStatusText(item.status)}`}>
              {item.status.replace('_', ' ')}
            </Text>
          </View>
        </View>

        {/* Patient info */}
        <View className="ml-6">
          <Text className="text-sm text-dark font-medium">
            {(item.owner as unknown as { name: string })?.name || 'Pet Owner'}
          </Text>
          {item.pet && (
            <View className="flex-row items-center mt-1">
              <Ionicons name="paw" size={12} color="#808080" />
              <Text className="text-xs text-grey ml-1">
                {item.pet.name} ({item.pet.species} • {item.pet.breed})
              </Text>
            </View>
          )}
          {item.notes && (
            <Text className="text-xs text-grey mt-1 italic">Note: {item.notes}</Text>
          )}
        </View>

        {/* Action buttons */}
        {item.status === 'upcoming' && (
          <View className="flex-row gap-2 mt-3 ml-6">
            <TouchableOpacity
              onPress={() => handleStatusChange(item, 'in_progress')}
              className="bg-primary/10 px-3 py-1.5 rounded-btn"
              activeOpacity={0.7}
            >
              <Text className="text-xs font-medium text-primary">Start</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => handleStatusChange(item, 'cancelled')}
              className="bg-red-50 px-3 py-1.5 rounded-btn"
              activeOpacity={0.7}
            >
              <Text className="text-xs font-medium text-red-500">Cancel</Text>
            </TouchableOpacity>
          </View>
        )}
        {item.status === 'in_progress' && (
          <View className="flex-row gap-2 mt-3 ml-6">
            <TouchableOpacity
              onPress={() => handleStatusChange(item, 'completed')}
              className="bg-green-50 px-3 py-1.5 rounded-btn"
              activeOpacity={0.7}
            >
              <Text className="text-xs font-medium text-green-700">Mark Complete</Text>
            </TouchableOpacity>
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
        <Text className="text-2xl font-bold text-heading">Appointments</Text>
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

      {/* Day appointments */}
      <View className="flex-1 mt-4">
        <View className="px-5 mb-3 flex-row items-center justify-between">
          <Text className="text-base font-semibold text-heading">
            {selectedDate === today ? "Today's Schedule" : 'Schedule'}
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
        />
      </View>
    </View>
  );
}

function getStatusBg(status: string) {
  switch (status) {
    case 'upcoming': return 'bg-blue-100';
    case 'in_progress': return 'bg-yellow-100';
    case 'completed': return 'bg-green-100';
    case 'cancelled': return 'bg-red-100';
    default: return 'bg-gray-100';
  }
}

function getStatusText(status: string) {
  switch (status) {
    case 'upcoming': return 'text-blue-700';
    case 'in_progress': return 'text-yellow-700';
    case 'completed': return 'text-green-700';
    case 'cancelled': return 'text-red-700';
    default: return 'text-gray-700';
  }
}
