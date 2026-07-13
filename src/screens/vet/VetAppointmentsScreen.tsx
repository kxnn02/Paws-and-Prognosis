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
  Modal,
  TextInput,
  KeyboardAvoidingView,
} from 'react-native';
import { Calendar } from 'react-native-calendars';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useVetAppointments } from '../../hooks/useVetAppointments';
import { parseNotes } from '../../lib/notesHelper';
import { calendarTheme } from '../../lib/calendarTheme';
import type { Appointment, VetStackParamList } from '../../types';

type NavigationProp = NativeStackNavigationProp<VetStackParamList>;

type FilterTab = 'all' | 'upcoming' | 'in_progress' | 'completed';
type ViewMode = 'calendar' | 'byStatus';

const FILTER_TABS: { key: FilterTab; label: string }[] = [
  { key: 'all', label: 'All' },
  { key: 'upcoming', label: 'Upcoming' },
  { key: 'in_progress', label: 'In Progress' },
  { key: 'completed', label: 'Done' },
];

export default function VetAppointmentsScreen() {
  const navigation = useNavigation<NavigationProp>();
  const {
    appointments,
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
  const [viewMode, setViewMode] = useState<ViewMode>('calendar');
  const [refreshing, setRefreshing] = useState(false);
  const [notesModal, setNotesModal] = useState<{ visible: boolean; appointmentId: string; currentNotes: string }>({
    visible: false,
    appointmentId: '',
    currentNotes: '',
  });
  const [notesInput, setNotesInput] = useState('');

  const statusSections = useMemo(() => {
    const dueToday = appointments.filter(
      (a) => a.date === today && a.status !== 'cancelled'
    );
    const upcoming = appointments
      .filter((a) => a.date > today && a.status !== 'cancelled')
      .sort((a, b) => a.date.localeCompare(b.date) || a.time.localeCompare(b.time));
    const completed = appointments
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
      { title: 'Completed', data: completed },
    ];
  }, [appointments, today]);

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
    const parsed = parseNotes(appointment.notes);
    setNotesInput(parsed.vet);
    setNotesModal({ visible: true, appointmentId: appointment.id, currentNotes: appointment.notes || '' });
  }

  async function handleSaveNotes() {
    if (notesInput.trim()) {
      const { error } = await addNotes(notesModal.appointmentId, notesInput.trim());
      if (error) Alert.alert('Error', error.message);
    }
    setNotesModal({ visible: false, appointmentId: '', currentNotes: '' });
    setNotesInput('');
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
          {(item.owner as unknown as { email?: string })?.email && (
            <Text className="text-[10px] text-grey mt-0.5">
              {(item.owner as unknown as { email: string }).email}
            </Text>
          )}
          {item.pet && (
            <View className="flex-row items-center mt-1">
              <Ionicons name="paw" size={12} color="#808080" />
              <Text className="text-xs text-grey ml-1">
                {item.pet.name} ({item.pet.species} • {item.pet.breed})
              </Text>
            </View>
          )}
          {(() => {
            const notes = parseNotes(item.notes);
            return (
              <>
                {notes.owner ? (
                  <Text className="text-xs text-grey mt-1 italic">Reason: {notes.owner}</Text>
                ) : null}
                {notes.vet ? (
                  <Text className="text-xs text-primary mt-1 font-medium">Dx: {notes.vet}</Text>
                ) : null}
              </>
            );
          })()}
        </View>

        {/* Action buttons */}
        <View className="flex-row gap-2 mt-3 ml-6">
          {item.status === 'upcoming' && (
            <>
              <TouchableOpacity
                onPress={() => handleStatusChange(item, 'in_progress')}
                className="bg-primary/10 px-4 py-2 rounded-btn"
                activeOpacity={0.7}
              >
                <Text className="text-xs font-medium text-primary">Start</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => handleStatusChange(item, 'cancelled')}
                className="bg-red-50 px-4 py-2 rounded-btn"
                activeOpacity={0.7}
              >
                <Text className="text-xs font-medium text-red-500">Cancel</Text>
              </TouchableOpacity>
            </>
          )}
          {item.status === 'in_progress' && (
            <TouchableOpacity
              onPress={() => handleStatusChange(item, 'completed')}
              className="bg-green-50 px-4 py-2 rounded-btn"
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
            className="bg-white px-4 py-2 rounded-btn border border-gray-200"
            activeOpacity={0.7}
          >
            <Text className="text-xs font-medium text-dark">Message</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => handleAddNotes(item)}
            className="bg-white px-4 py-2 rounded-btn border border-gray-200"
            activeOpacity={0.7}
          >
            <Text className="text-xs font-medium text-dark">
              {parseNotes(item.notes).vet ? 'Edit Notes' : 'Add Notes'}
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
        <Text className="text-2xl font-bold text-heading">Appointments</Text>
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
            current={selectedDate}
            onDayPress={(day: { dateString: string }) => setSelectedDate(day.dateString)}
            markedDates={calendarMarks}
            theme={calendarTheme}
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

      {/* Notes Modal */}
      <Modal
        visible={notesModal.visible}
        transparent
        animationType="slide"
        onRequestClose={() => setNotesModal({ visible: false, appointmentId: '', currentNotes: '' })}
      >
        <KeyboardAvoidingView
          className="flex-1"
          behavior='padding'
        >
          <TouchableOpacity
            className="flex-1 bg-black/40"
            activeOpacity={1}
            onPress={() => setNotesModal({ visible: false, appointmentId: '', currentNotes: '' })}
          />
          <View className="bg-white rounded-t-[24px] px-5 pt-6 pb-8">
            <Text className="text-lg font-semibold text-heading mb-1">Appointment Notes</Text>
            <Text className="text-xs text-grey mb-4">Add diagnosis, prescription, or follow-up notes</Text>
            <TextInput
              className="bg-input-bg rounded-btn px-4 py-3 text-sm text-dark min-h-[120px] border border-gray-200"
              placeholder="Enter notes here..."
              placeholderTextColor="#A7A7A7"
              value={notesInput}
              onChangeText={setNotesInput}
              multiline
              textAlignVertical="top"
              maxLength={1000}
              autoFocus
            />
            <Text className="text-[10px] text-grey mt-1 text-right">{notesInput.length}/1000</Text>
            <View className="flex-row gap-3 mt-4">
              <TouchableOpacity
                onPress={() => setNotesModal({ visible: false, appointmentId: '', currentNotes: '' })}
                className="flex-1 h-[44px] rounded-btn border border-gray-200 items-center justify-center"
                activeOpacity={0.7}
              >
                <Text className="text-sm font-medium text-dark">Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={handleSaveNotes}
                className="flex-1 h-[44px] rounded-btn bg-primary items-center justify-center"
                activeOpacity={0.8}
              >
                <Text className="text-sm font-medium text-white">Save Notes</Text>
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>
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
