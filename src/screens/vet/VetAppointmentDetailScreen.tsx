import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  Modal,
  TextInput,
  KeyboardAvoidingView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RouteProp } from '@react-navigation/native';
import { useVetAppointments } from '../../hooks/useVetAppointments';
import { parseNotes } from '../../lib/notesHelper';
import type { VetStackParamList } from '../../types';

type NavigationProp = NativeStackNavigationProp<VetStackParamList>;
type ScreenRouteProp = RouteProp<VetStackParamList, 'VetAppointmentDetail'>;

export default function VetAppointmentDetailScreen() {
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<ScreenRouteProp>();
  const { appointmentId } = route.params;

  const { appointments, loading, updateAppointmentStatus, addNotes } = useVetAppointments();

  const [notesModal, setNotesModal] = useState(false);
  const [notesInput, setNotesInput] = useState('');

  const appointment = appointments.find((a) => a.id === appointmentId);

  if (loading) {
    return (
      <View className="flex-1 bg-beige items-center justify-center">
        <ActivityIndicator size="large" color="#71924F" />
      </View>
    );
  }

  if (!appointment) {
    return (
      <View className="flex-1 bg-beige items-center justify-center px-5">
        <Ionicons name="alert-circle-outline" size={48} color="#9BA1A8" />
        <Text className="text-sm text-grey mt-3 text-center">Appointment not found.</Text>
        <TouchableOpacity onPress={() => navigation.goBack()} className="mt-4">
          <Text className="text-sm font-medium text-primary">Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const owner = appointment.owner as unknown as { name: string; phone?: string; email?: string } | undefined;
  const pet = appointment.pet;
  const notes = parseNotes(appointment.notes);

  function formatTime(time: string): string {
    const [hoursStr, minutes] = time.split(':');
    let hours = parseInt(hoursStr, 10);
    const ampm = hours >= 12 ? 'PM' : 'AM';
    if (hours > 12) hours -= 12;
    if (hours === 0) hours = 12;
    return `${hours}:${minutes} ${ampm}`;
  }

  function formatDate(dateStr: string): string {
    return new Date(dateStr).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  }

  function getStatusColor() {
    switch (appointment!.status) {
      case 'upcoming': return { bg: 'bg-blue-100', text: 'text-blue-700' };
      case 'in_progress': return { bg: 'bg-yellow-100', text: 'text-yellow-700' };
      case 'completed': return { bg: 'bg-green-100', text: 'text-green-700' };
      case 'cancelled': return { bg: 'bg-red-100', text: 'text-red-700' };
      default: return { bg: 'bg-gray-100', text: 'text-gray-700' };
    }
  }

  function handleStatusChange(newStatus: string) {
    const label = newStatus === 'in_progress' ? 'Start' : newStatus === 'completed' ? 'Complete' : 'Cancel';
    Alert.alert(
      `${label} Appointment`,
      `Mark this appointment as "${newStatus.replace('_', ' ')}"?`,
      [
        { text: 'No', style: 'cancel' },
        {
          text: 'Yes',
          onPress: async () => {
            const { error } = await updateAppointmentStatus(appointment!.id, newStatus);
            if (error) Alert.alert('Error', error.message);
          },
        },
      ]
    );
  }

  function handleMessage() {
    navigation.navigate('VetChatConversation', {
      threadId: appointment!.owner_id,
      participantName: owner?.name || 'Patient',
    });
  }

  function handleOpenNotes() {
    setNotesInput(notes.vet);
    setNotesModal(true);
  }

  async function handleSaveNotes() {
    if (notesInput.trim()) {
      const { error } = await addNotes(appointment!.id, notesInput.trim());
      if (error) Alert.alert('Error', error.message);
    }
    setNotesModal(false);
    setNotesInput('');
  }

  const statusColor = getStatusColor();

  return (
    <View className="flex-1 bg-beige">
      {/* Header */}
      <View className="px-5 pt-14 pb-4 flex-row items-center bg-white shadow-sm">
        <TouchableOpacity onPress={() => navigation.goBack()} className="mr-3" activeOpacity={0.7}>
          <Ionicons name="arrow-back" size={24} color="#544864" />
        </TouchableOpacity>
        <Text className="text-lg font-bold text-heading flex-1">Appointment Details</Text>
        <View className={`px-3 py-1 rounded-full ${statusColor.bg}`}>
          <Text className={`text-xs font-medium capitalize ${statusColor.text}`}>
            {appointment.status.replace('_', ' ')}
          </Text>
        </View>
      </View>

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* Appointment Info */}
        <View className="mx-5 mt-4 bg-white rounded-card p-4 shadow-sm">
          <View className="flex-row items-center mb-3">
            <View className="w-10 h-10 rounded-full bg-primary/10 items-center justify-center mr-3">
              <Ionicons name="calendar" size={20} color="#71924F" />
            </View>
            <View>
              <Text className="text-base font-semibold text-dark">{formatDate(appointment.date)}</Text>
              <Text className="text-sm text-grey">{formatTime(appointment.time)}</Text>
            </View>
          </View>
        </View>

        {/* Patient (Owner) Info */}
        <View className="mx-5 mt-3 bg-white rounded-card p-4 shadow-sm">
          <Text className="text-sm font-bold text-heading mb-3">Patient Owner</Text>
          <View className="flex-row items-center mb-2">
            <Ionicons name="person-outline" size={16} color="#808080" />
            <Text className="text-sm text-dark ml-2">{owner?.name || 'Unknown'}</Text>
          </View>
          {owner?.phone && (
            <View className="flex-row items-center mb-2">
              <Ionicons name="call-outline" size={16} color="#808080" />
              <Text className="text-sm text-grey ml-2">{owner.phone}</Text>
            </View>
          )}
          {owner?.email && (
            <View className="flex-row items-center">
              <Ionicons name="mail-outline" size={16} color="#808080" />
              <Text className="text-sm text-grey ml-2">{owner.email}</Text>
            </View>
          )}
        </View>

        {/* Pet Info */}
        {pet && (
          <View className="mx-5 mt-3 bg-white rounded-card p-4 shadow-sm">
            <Text className="text-sm font-bold text-heading mb-3">Pet Information</Text>
            <View className="flex-row items-center mb-2">
              <Ionicons name="paw" size={16} color="#71924F" />
              <Text className="text-sm font-medium text-dark ml-2">{pet.name}</Text>
            </View>
            <View className="flex-row flex-wrap gap-y-2 ml-6">
              <View className="w-1/2">
                <Text className="text-xs text-grey">Species</Text>
                <Text className="text-sm text-dark">{pet.species}</Text>
              </View>
              <View className="w-1/2">
                <Text className="text-xs text-grey">Breed</Text>
                <Text className="text-sm text-dark">{pet.breed}</Text>
              </View>
              {pet.age && (
                <View className="w-1/2">
                  <Text className="text-xs text-grey">Age</Text>
                  <Text className="text-sm text-dark">{pet.age}</Text>
                </View>
              )}
              {pet.weight && (
                <View className="w-1/2">
                  <Text className="text-xs text-grey">Weight</Text>
                  <Text className="text-sm text-dark">{pet.weight}</Text>
                </View>
              )}
            </View>
          </View>
        )}

        {/* Notes Section */}
        <View className="mx-5 mt-3 bg-white rounded-card p-4 shadow-sm">
          <Text className="text-sm font-bold text-heading mb-3">Notes</Text>
          {notes.owner ? (
            <View className="mb-3">
              <Text className="text-xs font-medium text-grey mb-1">Owner&apos;s Reason</Text>
              <Text className="text-sm text-dark bg-input-bg rounded-btn px-3 py-2">{notes.owner}</Text>
            </View>
          ) : (
            <View className="mb-3">
              <Text className="text-xs text-grey italic">No reason provided by owner</Text>
            </View>
          )}
          {notes.vet ? (
            <View>
              <Text className="text-xs font-medium text-primary mb-1">Vet Notes</Text>
              <Text className="text-sm text-dark bg-primary/5 rounded-btn px-3 py-2">{notes.vet}</Text>
            </View>
          ) : (
            <View>
              <Text className="text-xs text-grey italic">No vet notes yet</Text>
            </View>
          )}
        </View>

        {/* Action Buttons */}
        <View className="mx-5 mt-4 mb-6 gap-3">
          {appointment.status === 'upcoming' && (
            <TouchableOpacity
              onPress={() => handleStatusChange('in_progress')}
              className="h-[48px] bg-primary rounded-btn items-center justify-center flex-row"
              activeOpacity={0.8}
            >
              <Ionicons name="play-circle-outline" size={20} color="#FFF" />
              <Text className="text-white font-semibold text-sm ml-2">Start Appointment</Text>
            </TouchableOpacity>
          )}
          {appointment.status === 'in_progress' && (
            <TouchableOpacity
              onPress={() => handleStatusChange('completed')}
              className="h-[48px] bg-green-600 rounded-btn items-center justify-center flex-row"
              activeOpacity={0.8}
            >
              <Ionicons name="checkmark-circle-outline" size={20} color="#FFF" />
              <Text className="text-white font-semibold text-sm ml-2">Mark Complete</Text>
            </TouchableOpacity>
          )}
          <TouchableOpacity
            onPress={handleMessage}
            className="h-[48px] bg-white rounded-btn items-center justify-center flex-row border border-gray-200"
            activeOpacity={0.7}
          >
            <Ionicons name="chatbubble-outline" size={18} color="#343434" />
            <Text className="text-dark font-semibold text-sm ml-2">Message Owner</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={handleOpenNotes}
            className="h-[48px] bg-white rounded-btn items-center justify-center flex-row border border-gray-200"
            activeOpacity={0.7}
          >
            <Ionicons name="create-outline" size={18} color="#343434" />
            <Text className="text-dark font-semibold text-sm ml-2">
              {notes.vet ? 'Edit Notes' : 'Add Notes'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Bottom spacing for tab bar */}
        <View className="h-[100px]" />
      </ScrollView>

      {/* Notes Modal */}
      <Modal
        visible={notesModal}
        transparent
        animationType="slide"
        onRequestClose={() => setNotesModal(false)}
      >
        <KeyboardAvoidingView
          className="flex-1"
          behavior='padding'
        >
          <TouchableOpacity
            className="flex-1 bg-black/40"
            activeOpacity={1}
            onPress={() => setNotesModal(false)}
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
                onPress={() => setNotesModal(false)}
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
