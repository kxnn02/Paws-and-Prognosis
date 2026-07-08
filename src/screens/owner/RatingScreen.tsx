import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RouteProp } from '@react-navigation/native';
import { useRatings } from '../../hooks/useRatings';
import type { OwnerStackParamList } from '../../types';

type RatingRouteProp = RouteProp<OwnerStackParamList, 'Rating'>;
type NavigationProp = NativeStackNavigationProp<OwnerStackParamList>;

export default function RatingScreen() {
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<RatingRouteProp>();
  const { appointmentId, vetId, vetName } = route.params;

  const { submitRating } = useRatings();
  const [score, setScore] = useState(0);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit() {
    if (score === 0) {
      Alert.alert('Select a Rating', 'Please tap a star to rate your experience.');
      return;
    }

    setSubmitting(true);
    const { error } = await submitRating({ appointmentId, vetId, score });
    setSubmitting(false);

    if (error) {
      Alert.alert('Error', error.message);
    } else {
      Alert.alert('Thank You!', 'Your rating has been submitted.', [
        { text: 'Done', onPress: () => navigation.goBack() },
      ]);
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
          Rate Your Visit
        </Text>
      </View>

      {/* Content */}
      <View className="flex-1 items-center justify-center px-8">
        {/* Vet name */}
        <View className="w-[80px] h-[80px] rounded-full bg-primary/20 items-center justify-center mb-4">
          <Ionicons name="medical" size={36} color="#71924F" />
        </View>
        <Text className="text-lg font-bold text-heading text-center">{vetName}</Text>
        <Text className="text-sm text-grey mt-2 text-center">
          How was your experience?
        </Text>

        {/* Stars */}
        <View className="flex-row mt-8 gap-3">
          {[1, 2, 3, 4, 5].map((star) => (
            <TouchableOpacity
              key={star}
              onPress={() => setScore(star)}
              activeOpacity={0.7}
            >
              <Ionicons
                name={star <= score ? 'star' : 'star-outline'}
                size={44}
                color={star <= score ? '#F59E0B' : '#D1D5DB'}
              />
            </TouchableOpacity>
          ))}
        </View>

        {/* Score label */}
        <Text className="text-sm text-grey mt-4">
          {score === 0 && 'Tap a star to rate'}
          {score === 1 && 'Poor'}
          {score === 2 && 'Fair'}
          {score === 3 && 'Good'}
          {score === 4 && 'Very Good'}
          {score === 5 && 'Excellent'}
        </Text>
      </View>

      {/* Submit Button */}
      <View className="px-5 pb-8">
        <TouchableOpacity
          onPress={handleSubmit}
          disabled={submitting || score === 0}
          className={`h-[52px] rounded-btn items-center justify-center shadow-md ${
            score > 0 ? 'bg-primary' : 'bg-gray-300'
          } ${submitting ? 'opacity-60' : ''}`}
          activeOpacity={0.8}
        >
          {submitting ? (
            <ActivityIndicator color="#FFF" />
          ) : (
            <Text className="text-white text-base font-semibold">Submit Rating</Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
}
