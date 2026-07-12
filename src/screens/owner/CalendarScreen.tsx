import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  SectionList,
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
import { parseNotes } from '../../lib/notesHelper';
import { calendarTheme } from '../../lib/calendarTheme';
import type { Appointment, OwnerStackParamList } from '../../types';

type NavigationProp = NativeStackNavigationProp<OwnerStackParamList>;

type ViewMode = 'calendar' | 'byStatus';

export default function CalendarScreen() {
  const navigation = useNavigation<NavigationProp>();
  const { appointments, loading, error, getMarkedDates, getAppointmentsForDate, cancelAppointment, fetchAppointments } =
    useAppointments();
  const { hasRated, fetchRatings } = useRatings();

  const today = new Date().toISOString().split('T')[0];
  const [selectedDate, setSelectedDate] = useState(today);
  const [refreshing, setRefreshing] = useState(false);
  const [viewMode, setViewMode] = useState<ViewMode>('calendar');

  const statusSections = useMemo(() => {
    const dueToday = appointments.filter(
      (a) => a.date === today && a.status !== 'cancelled'
    );
    const upcoming = appointments
      .filter((a) => a.date > today && a.status !== 'cancelled')
      .sort((a, b) => a.date.localeCompare(b.date) || a.time.localeCompare(b.time));
    const past = appointments
      .filter(
        (a) =>
          (a.date < today || a.status === 'completed') &&
          a.status !== 'cancelled' &&
          a.date !== today
      )
      .sort((a, b) => b.date.localeCompare(a.date) || b.time.localeCompare(a.time));

    return [
      { title: 'Due Today', data: dueToday },
      { title: 'Upcoming', data: upcoming },
      { title: 'Past', data: past },
    ];
  }, [appointments, today]);

  // Refresh data when screen gains focus (e.g., after booking or rating)
  useFocusEffect(
    React.useCallback(() => {
      fetchAppointments();
      fetchRatings();
    }, [fetchAppointments, fetchRatings])
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
          {(() => {
            const notes = parseNotes(item.notes);
            return (
              <>
                {notes.owner ? (
                  <Text className="text-xs text-grey mt-1 italic">{`"${notes.owner}"`}</Text>
                ) : null}
                {notes.vet ? (
                  <View className="mt-2 bg-green-50 rounded-btn px-3 py-2">
                    <Text className="text-[10px] text-green-700 font-medium mb-0.5">Vet{"'"}s Notes:</Text>
                    <Text className="text-xs text-dark">{notes.vet}</Text>
                  </View>
                ) : null}
              </>
            );
          })()}
        </View>

        {/* Cancel/Reschedule buttons for upcoming appointments */}
        {item.status === 'upcoming' && (
          <View className="flex-row flex-wrap gap-2 mt-3 ml-11">
            <TouchableOpacity
              onPress={() =>
                navigation.navigate('Reschedule', {
                  appointmentId: item.id,
                  vetName: item.vet?.name || 'Veterinarian',
                })
              }
              className="bg-primary/10 px-3 py-1.5 rounded-btn"
              activeOpacity={0.7}
            >
              <Text className="text-xs font-medium text-primary">Reschedule</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => handleCancel(item.id)}
              className="bg-red-50 px-3 py-1.5 rounded-btn"
              activeOpacity={0.7}
            >
              <Text className="text-xs font-medium text-red-500">Cancel</Text>
            </TouchableOpacity>
            {item.vet && (
              <TouchableOpacity
                onPress={() =>
                  navigation.navigate('ChatConversation', {
                    threadId: item.vet!.user_id,
                    participantName: item.vet!.name,
                  })
                }
                className="bg-primary/10 px-3 py-1.5 rounded-btn"
                activeOpacity={0.7}
              >
                <Text className="text-xs font-medium text-primary">Message Vet</Text>
              </TouchableOpacity>
            )}
          </View>
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

  if (error) {
    return (
      <View className="flex-1 bg-beige items-center justify-center px-8">
        <Ionicons name="cloud-offline-outline" size={48} color="#9BA1A8" />
        <Text className="text-base font-medium text-heading mt-4">Something went wrong</Text>
        <Text className="text-sm text-grey text-center mt-2">{error}</Text>
        <TouchableOpacity
          onPress={fetchAppointments}
          className="mt-6 bg-primary px-6 py-3 rounded-btn"
          activeOpacity={0.8}
        >
          <Text className="text-sm font-medium text-white">Try Again</Text>
        </TouchableOpacity>
      </View>
    );
  }

  function renderSectionHeader({ section }: { section: { title: string; data: Appointment[] } }) {
    return (
      <View className="flex-row items-center px-5 pt-4 pb-2">
        <Text className="text-[15px] font-semibold text-heading">{section.title}</Text>
        <View className="ml-2 bg-primary/10 px-2 py-0.5 rounded-full">
          <Text className="text-xs font-medium text-primary">{section.data.length}</Text>
        </View>
      </View>
    );
  }

  function renderSectionEmpty() {
    return (
      <Text className="text-xs italic text-grey px-5 pb-2">No appointments</Text>
    );
  }

  return (
    <View className="flex-1 bg-beige">
      {/* Header */}
      <View className="px-5 pt-14 pb-2">
        <Text className="text-[22px] font-bold text-heading">Calendar</Text>
      </View>

      {/* View Toggle */}
      <View className="flex-row px-5 mb-3 gap-2">
        <TouchableOpacity
          onPress={() => setViewMode('calendar')}
          className={`px-4 py-2 rounded-btn ${viewMode === 'calendar' ? 'bg-primary' : 'bg-white border border-gray-200'}`}
          activeOpacity={0.7}
        >
          <Text className={`text-sm font-medium ${viewMode === 'calendar' ? 'text-white' : 'text-dark'}`}>
            Calendar
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => setViewMode('byStatus')}
          className={`px-4 py-2 rounded-btn ${viewMode === 'byStatus' ? 'bg-primary' : 'bg-white border border-gray-200'}`}
          activeOpacity={0.7}
        >
          <Text className={`text-sm font-medium ${viewMode === 'byStatus' ? 'text-white' : 'text-dark'}`}>
            By Status
          </Text>
        </TouchableOpacity>
      </View>

      {viewMode === 'calendar' ? (
        <>
          {/* Calendar */}
          <Calendar
            current={today}
            key={selectedDate.slice(0, 7)}
            onDayPress={(day: { dateString: string }) => setSelectedDate(day.dateString)}
            markedDates={calendarMarks}
            theme={calendarTheme}
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
        </>
      ) : (
        <SectionList
          sections={statusSections}
          keyExtractor={(item) => item.id}
          renderItem={renderAppointment}
          renderSectionHeader={renderSectionHeader}
          renderSectionFooter={({ section }) =>
            section.data.length === 0 ? renderSectionEmpty() : null
          }
          contentContainerStyle={{ paddingBottom: 100 }}
          showsVerticalScrollIndicator={false}
          stickySectionHeadersEnabled={false}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#71924F" />
          }
        />
      )}
    </View>
  );
}
