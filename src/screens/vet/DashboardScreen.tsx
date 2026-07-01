import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../context/AuthContext';
import { useVetAppointments } from '../../hooks/useVetAppointments';
import type { Appointment } from '../../types';

export default function DashboardScreen() {
  const { profile } = useAuth();
  const { loading, getTodayAppointments, getStats } = useVetAppointments();

  const stats = getStats();
  const todayCases = getTodayAppointments();

  if (loading) {
    return (
      <View className="flex-1 bg-beige items-center justify-center">
        <ActivityIndicator size="large" color="#71924F" />
      </View>
    );
  }

  return (
    <ScrollView className="flex-1 bg-beige" showsVerticalScrollIndicator={false}>
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
        <Ionicons name="arrow-forward" size={20} color="rgba(255,255,255,0.6)" />
      </View>

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
            <AppointmentCard key={appointment.id} appointment={appointment} />
          ))
        )}
      </View>

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

function AppointmentCard({ appointment }: { appointment: Appointment }) {
  function formatTime(time: string): string {
    const [hoursStr, minutes] = time.split(':');
    let hours = parseInt(hoursStr, 10);
    const ampm = hours >= 12 ? 'PM' : 'AM';
    if (hours > 12) hours -= 12;
    if (hours === 0) hours = 12;
    return `${hours}:${minutes} ${ampm}`;
  }

  return (
    <View className="bg-white rounded-card p-4 mb-3 shadow-sm flex-row items-center">
      {/* Time */}
      <View className="w-[60px] items-center mr-3">
        <Text className="text-xs font-semibold text-primary">
          {formatTime(appointment.time)}
        </Text>
      </View>

      {/* Divider */}
      <View className="w-[2px] h-[40px] bg-primary/30 rounded-full mr-3" />

      {/* Info */}
      <View className="flex-1">
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

      {/* Status */}
      <View className={`px-2 py-1 rounded-full ${
        appointment.status === 'upcoming' ? 'bg-blue-100' : 'bg-yellow-100'
      }`}>
        <Text className={`text-[10px] font-medium capitalize ${
          appointment.status === 'upcoming' ? 'text-blue-700' : 'text-yellow-700'
        }`}>
          {appointment.status.replace('_', ' ')}
        </Text>
      </View>
    </View>
  );
}
