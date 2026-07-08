import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

const TIPS = [
  {
    id: '1',
    icon: 'water-outline',
    title: 'Fresh Water Daily',
    body: 'Always ensure your pet has access to clean, fresh water. Change it at least twice a day.',
  },
  {
    id: '2',
    icon: 'fitness-outline',
    title: 'Regular Exercise',
    body: 'Dogs need at least 30 minutes of exercise daily. Cats benefit from 15-20 minutes of play.',
  },
  {
    id: '3',
    icon: 'nutrition-outline',
    title: 'Balanced Diet',
    body: 'Feed age-appropriate food in correct portions. Avoid giving human food, especially chocolate, onions, and grapes.',
  },
  {
    id: '4',
    icon: 'medkit-outline',
    title: 'Regular Checkups',
    body: 'Visit your vet at least once a year for routine checkups. Early detection saves lives.',
  },
  {
    id: '5',
    icon: 'shield-checkmark-outline',
    title: 'Vaccinations',
    body: 'Keep your pet\'s vaccinations up to date. Core vaccines protect against serious diseases.',
  },
  {
    id: '6',
    icon: 'brush-outline',
    title: 'Grooming Routine',
    body: 'Regular brushing prevents matting, reduces shedding, and helps you spot skin issues early.',
  },
  {
    id: '7',
    icon: 'heart-outline',
    title: 'Mental Stimulation',
    body: 'Puzzle toys, training sessions, and social interaction keep your pet mentally healthy.',
  },
  {
    id: '8',
    icon: 'thermometer-outline',
    title: 'Watch for Warning Signs',
    body: 'Loss of appetite, lethargy, excessive thirst, or behavior changes may indicate illness. Consult your vet.',
  },
];

export default function TipsScreen() {
  const navigation = useNavigation();

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
          Pet Care Tips
        </Text>
      </View>

      <ScrollView
        className="flex-1 px-5"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 40 }}
      >
        <Text className="text-sm text-grey mb-4">
          Simple tips to keep your furry friends happy and healthy.
        </Text>

        {TIPS.map((tip) => (
          <View key={tip.id} className="bg-white rounded-card p-4 mb-3 shadow-sm">
            <View className="flex-row items-start">
              <View className="w-10 h-10 rounded-full bg-primary/10 items-center justify-center mr-3 mt-0.5">
                <Ionicons name={tip.icon as keyof typeof Ionicons.glyphMap} size={20} color="#71924F" />
              </View>
              <View className="flex-1">
                <Text className="text-[14px] font-bold text-dark">{tip.title}</Text>
                <Text className="text-[12px] text-grey mt-1.5 leading-[18px]">{tip.body}</Text>
              </View>
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}
