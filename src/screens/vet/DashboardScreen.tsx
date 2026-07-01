import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useAuth } from '../../context/AuthContext';
import { useVetAppointments } from '../../hooks/useVetAppointments';
import { useReminders } from '../../hooks/useReminders';
import type { Appointment, VetStackParamList } from '../../types';

type NavigationProp = NativeStackNavigationProp<VetStackParamList>;

export default function DashboardScreen() {
  const { profile } = useAuth();
  const navigation = useNavigation<NavigationProp>();
  const {
    loading,
    getTodayAppointments,
    getUpcomingAppointments,
    getStats,
    fetchAppointments,
    updateAppointmentStatus,
  } = useVetAppointments();

  const { getUpcoming: getUpcomingReminders, markAsRead } = useReminders();

  const [refreshing, setRefreshing] = React.useState(false);

  const stats = getStats();
  const todayCases = getTodayAppointments();
  const upcomingCases = getUpcomingAppointments().filter(
    (a) => a.date !== new Date().toISOString().split('T')[0]
  ); // Upcoming excluding today
  const upcomingReminders = getUpcomingReminders();

  async function onRefresh() {
    setRefreshing(true);
    await fetchAppointments();
    setRefreshing(false);
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

  if (loading && !refreshing) {
    return (
      <View className="flex-1 bg-beige items-center justify-center">
        <ActivityIndicator size="large" color="#71924F" />
      </View>
    );
  }

  return (
    <ScrollView
      className="flex-1 bg-beige"
      showsVerticalScrollIndicator={false}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#71924F" />
      }
    >
      {/* Header */}
      <View className="px-5 pt-14 pb-2">
        <Text className="text-sm text-grey">Welcome back,</Text>
        <Text className="text-2xl font-bold text-heading">
          {profile?.name || 'Doctor'} 👋
        </Text>
      </View>

      {/* Stats Cards */}
      <View className="px-5 mt-4 flex-row gap-3">
        <StatCard
          icon="today-outline"
          label="Today"
          value={stats.todayCount.toString()}
          color="#71924F"
        />
        <StatCard
          icon="time-outline"
          label="Upcoming"
          value={stats.upcomingCount.toString()}
          color="#F59E0B"
        />
        <StatCard
          icon="checkmark-circle-outline"
          label="Completed"
          value={stats.completedCount.toString()}
          color="#10B981"
        />
      </View>

      {/* Total Patients */}
      <View className="mx-5 mt-4 bg-primary rounded-card p-4 flex-row items-center justify-between">
        <View className="flex-row items-center">
          <View className="w-10 h-10 rounded-full bg-white/20 items-center justify-center mr-3">
            <Ionicons name="people" size={20} color="#FFF" />
          </View>
          <View>
            <Text className="text-white/70 text-xs">Total Patients</Text>
            <Text className="text-white font-bold text-lg">{stats.totalPatients}</Text>
          </View>
        </View>
      </View>

      {/* Reminders */}
      {upcomingReminders.length > 0 && (
        <View className="px-5 mt-6">
          <Text className="text-lg font-semibold text-heading mb-3">Reminders</Text>
          {upcomingReminders.slice(0, 3).map((reminder) => (
            <TouchableOpacity
              key={reminder.id}
              onPress={() => markAsRead(reminder.id)}
              className="bg-white rounded-btn px-4 py-3 mb-2 flex-row items-center shadow-sm border-l-4 border-yellow-400"
              activeOpacity={0.7}
            >
              <View className="w-8 h-8 rounded-full bg-yellow-50 items-center justify-center mr-3">
                <Ionicons
                  name={
                    reminder.type === 'vaccination' ? 'medkit' :
                    reminder.type === 'vaccine_expiry' ? 'alert-circle' : 'thermometer'
                  }
                  size={16}
                  color="#F59E0B"
                />
              </View>
              <View className="flex-1">
                <Text className="text-sm font-medium text-dark">{reminder.title}</Text>
                {reminder.description && (
                  <Text className="text-xs text-grey mt-0.5" numberOfLines={1}>{reminder.description}</Text>
                )}
                <Text className="text-[10px] text-light-grey mt-1">
                  Due: {new Date(reminder.due_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                </Text>
              </View>
              <Ionicons name="close-circle-outline" size={18} color="#9BA1A8" />
            </TouchableOpacity>
          ))}
        </View>
      )}

      {/* Today's Cases */}
      <View className="px-5 mt-6">
        <View className="flex-row items-center justify-between mb-3">
          <Text className="text-lg font-semibold text-heading">Today's Cases</Text>
          <Text className="text-xs text-grey">{todayCases.length} appointments</Text>
        </View>

        {todayCases.length === 0 ? (
          <View className="bg-white rounded-card p-6 items-center">
            <Ionicons name="sunny-outline" size={36} color="#9BA1A8" />
            <Text className="text-sm text-grey mt-3 text-center">
              No appointments scheduled for today.
            </Text>
          </View>
        ) : (
          todayCases.map((appointment) => (
            <DashboardAppointmentCard
              key={appointment.id}
              appointment={appointment}
              onStart={() => handleStatusChange(appointment, 'in_progress')}
              onComplete={() => handleStatusChange(appointment, 'completed')}
              onMessage={() =>
                navigation.navigate('VetChatConversation', {
                  threadId: appointment.owner_id,
                  participantName: (appointment.owner as unknown as { name: string })?.name || 'Patient',
                })
              }
            />
          ))
        )}
      </View>

      {/* Upcoming (next days) */}
      {upcomingCases.length > 0 && (
        <View className="px-5 mt-6">
          <Text className="text-lg font-semibold text-heading mb-3">Coming Up</Text>
          {upcomingCases.slice(0, 3).map((appointment) => (
            <UpcomingCard key={appointment.id} appointment={appointment} />
          ))}
          {upcomingCases.length > 3 && (
            <Text className="text-xs text-grey text-center mt-2">
              +{upcomingCases.length - 3} more in Appointments tab
            </Text>
          )}
        </View>
      )}

      {/* Bottom spacing */}
      <View className="h-[100px]" />
    </ScrollView>
  );
}

function StatCard({ icon, label, value, color }: { icon: string; label: string; value: string; color: string }) {
  return (
    <View className="flex-1 bg-white rounded-card p-4 items-center shadow-sm">
      <View
        className="w-10 h-10 rounded-full items-center justify-center mb-2"
        style={{ backgroundColor: `${color}15` }}
      >
        <Ionicons name={icon as keyof typeof Ionicons.glyphMap} size={20} color={color} />
      </View>
      <Text className="text-xl font-bold text-dark">{value}</Text>
      <Text className="text-xs text-grey mt-1">{label}</Text>
    </View>
  );
}

function DashboardAppointmentCard({
  appointment,
  onStart,
  onComplete,
  onMessage,
}: {
  appointment: Appointment;
  onStart: () => void;
  onComplete: () => void;
  onMessage: () => void;
}) {
  function formatTime(time: string): string {
    const [hoursStr, minutes] = time.split(':');
    let hours = parseInt(hoursStr, 10);
    const ampm = hours >= 12 ? 'PM' : 'AM';
    if (hours > 12) hours -= 12;
    if (hours === 0) hours = 12;
    return `${hours}:${minutes} ${ampm}`;
  }

  return (
    <View className="bg-white rounded-card p-4 mb-3 shadow-sm">
      {/* Top row */}
      <View className="flex-row items-center justify-between mb-2">
        <View className="flex-row items-center">
          <View className="w-8 h-8 rounded-full bg-primary/10 items-center justify-center mr-2">
            <Ionicons name="time-outline" size={14} color="#71924F" />
          </View>
          <Text className="text-sm font-semibold text-dark">
            {formatTime(appointment.time)}
          </Text>
        </View>
        <View className={`px-2 py-1 rounded-full ${
          appointment.status === 'upcoming' ? 'bg-blue-100' :
          appointment.status === 'in_progress' ? 'bg-yellow-100' : 'bg-green-100'
        }`}>
          <Text className={`text-[10px] font-medium capitalize ${
            appointment.status === 'upcoming' ? 'text-blue-700' :
            appointment.status === 'in_progress' ? 'text-yellow-700' : 'text-green-700'
          }`}>
            {appointment.status.replace('_', ' ')}
          </Text>
        </View>
      </View>

      {/* Patient info */}
      <View className="ml-10">
        <Text className="text-sm font-medium text-dark">
          {(appointment.owner as unknown as { name: string })?.name || 'Pet Owner'}
        </Text>
        {appointment.pet && (
          <View className="flex-row items-center mt-1">
            <Ionicons name="paw" size={12} color="#808080" />
            <Text className="text-xs text-grey ml-1">
              {appointment.pet.name} • {appointment.pet.species}
            </Text>
          </View>
        )}
      </View>

      {/* Actions */}
      <View className="flex-row gap-2 mt-3 ml-10">
        {appointment.status === 'upcoming' && (
          <TouchableOpacity
            onPress={onStart}
            className="bg-primary/10 px-3 py-1.5 rounded-btn"
            activeOpacity={0.7}
          >
            <Text className="text-xs font-medium text-primary">Start</Text>
          </TouchableOpacity>
        )}
        {appointment.status === 'in_progress' && (
          <TouchableOpacity
            onPress={onComplete}
            className="bg-green-50 px-3 py-1.5 rounded-btn"
            activeOpacity={0.7}
          >
            <Text className="text-xs font-medium text-green-700">Complete</Text>
          </TouchableOpacity>
        )}
        <TouchableOpacity
          onPress={onMessage}
          className="bg-white px-3 py-1.5 rounded-btn border border-gray-200"
          activeOpacity={0.7}
        >
          <Text className="text-xs font-medium text-dark">Message</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

function UpcomingCard({ appointment }: { appointment: Appointment }) {
  function formatDate(dateStr: string) {
    return new Date(dateStr).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
  }
  function formatTime(time: string): string {
    const [hoursStr, minutes] = time.split(':');
    let hours = parseInt(hoursStr, 10);
    const ampm = hours >= 12 ? 'PM' : 'AM';
    if (hours > 12) hours -= 12;
    if (hours === 0) hours = 12;
    return `${hours}:${minutes} ${ampm}`;
  }

  return (
    <View className="bg-white rounded-btn px-4 py-3 mb-2 flex-row items-center shadow-sm">
      <View className="w-10 h-10 rounded-full bg-primary/10 items-center justify-center mr-3">
        <Ionicons name="calendar-outline" size={16} color="#71924F" />
      </View>
      <View className="flex-1">
        <Text className="text-sm font-medium text-dark">
          {(appointment.owner as unknown as { name: string })?.name || 'Patient'}
        </Text>
        <Text className="text-xs text-grey mt-0.5">
          {formatDate(appointment.date)} at {formatTime(appointment.time)}
        </Text>
      </View>
      {appointment.pet && (
        <Text className="text-xs text-grey">{appointment.pet.name}</Text>
      )}
    </View>
  );
}
