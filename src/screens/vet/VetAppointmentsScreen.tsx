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
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useVetAppointments } from '../../hooks/useVetAppointments';
import type { Appointment, VetStackParamList } from '../../types';

type NavigationProp = NativeStackNavigationProp<VetStackParamList>;

type FilterTab = 'all' | 'upcoming' | 'in_progress' | 'completed';

const FILTER_TABS: { key: FilterTab; label: string }[] = [
  { key: 'all', label: 'All' },
  { key: 'upcoming', label: 'Upcoming' },
  { key: 'in_progress', label: 'In Progress' },
  { key: 'completed', label: 'Done' },
];

export default function VetAppointmentsScreen() {
  const navigation = useNavigation<NavigationProp>();
  const {
    loading,
    getMarkedDates,
    getAppointmentsForDate,
    updateAppointmentStatus,
    addNotes,
    fetchAppointments,
  } = useVetAppointments();

  const today = new Date().toISOString().split('T')[0];
  const [selectedDate, setSelectedDate] = useState(today);
  const [activeFilter, setActiveFilter] = useState<FilterTab>('all');
  const [refreshing, setRefreshing] = useState(false);

  const markedDates = getMarkedDates();
  const allDayAppointments = getAppointmentsForDate(selectedDate);

  // Apply filter
  const dayAppointments = activeFilter === 'all'
    ? allDayAppointments
    : allDayAppointments.filter((a) => a.status === activeFilter);

  const calendarMarks = {
    ...markedDates,
    [selectedDate]: {
      ...markedDates[selectedDate],
      selected: true,
      selectedColor: '#71924F',
    },
  };

  async function onRefresh() {
    setRefreshing(true);
    await fetchAppointments();
    setRefreshing(false);
  }

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

  function handleAddNotes(appointment: Appointment) {
    Alert.prompt(
      'Add Notes',
      'Add diagnosis, prescription, or follow-up notes:',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Save',
          onPress: async (text?: string) => {
            if (text?.trim()) {
              const { error } = await addNotes(appointment.id, text.trim());
              if (error) Alert.alert('Error', error.message);
            }
          },
        },
      ],
      'plain-text',
      appointment.notes || ''
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
        <View className="flex-row gap-2 mt-3 ml-6">
          {item.status === 'upcoming' && (
            <>
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
            </>
          )}
          {item.status === 'in_progress' && (
            <TouchableOpacity
              onPress={() => handleStatusChange(item, 'completed')}
              className="bg-green-50 px-3 py-1.5 rounded-btn"
              activeOpacity={0.7}
            >
              <Text className="text-xs font-medium text-green-700">Mark Complete</Text>
            </TouchableOpacity>
          )}
          <TouchableOpacity
            onPress={() =>
              navigation.navigate('VetChatConversation', {
                threadId: item.owner_id,
                participantName: (item.owner as unknown as { name: string })?.name || 'Patient',
              })
            }
            className="bg-white px-3 py-1.5 rounded-btn border border-gray-200"
            activeOpacity={0.7}
          >
            <Text className="text-xs font-medium text-dark">Message</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => handleAddNotes(item)}
            className="bg-white px-3 py-1.5 rounded-btn border border-gray-200"
            activeOpacity={0.7}
          >
            <Text className="text-xs font-medium text-dark">
              {item.notes ? 'Edit Notes' : 'Add Notes'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  function renderEmpty() {
    return (
      <View className="items-center pt-10 px-10">
        <Ionicons name="calendar-outline" size={40} color="#9BA1A8" />
        <Text className="text-sm text-grey text-center mt-3">
          {activeFilter === 'all'
            ? 'No appointments on this date'
            : `No ${activeFilter.replace('_', ' ')} appointments`}
        </Text>
      </View>
    );
  }

  if (loading && !refreshing) {
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

      {/* Filter Tabs */}
      <View className="flex-row px-5 mt-3 mb-2 gap-2">
        {FILTER_TABS.map((tab) => (
          <TouchableOpacity
            key={tab.key}
            onPress={() => setActiveFilter(tab.key)}
            className={`px-3 py-1.5 rounded-btn ${
              activeFilter === tab.key ? 'bg-primary' : 'bg-white border border-gray-200'
            }`}
            activeOpacity={0.7}
          >
            <Text className={`text-xs font-medium ${
              activeFilter === tab.key ? 'text-white' : 'text-dark'
            }`}>
              {tab.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Day appointments */}
      <View className="flex-1">
        <View className="px-5 mb-2 flex-row items-center justify-between">
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
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#71924F" />
          }
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
