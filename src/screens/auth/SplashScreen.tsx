import { View, Text, ActivityIndicator } from 'react-native';

export default function SplashScreen() {
  return (
    <View className="flex-1 bg-beige justify-center items-center">
      <View className="flex-row items-baseline mb-1">
        <Text className="text-4xl font-bold text-[#7A5C4F]">Paws</Text>
        <Text className="text-4xl font-bold text-heading"> & </Text>
        <Text className="text-4xl font-bold text-primary">Prognosis</Text>
      </View>
      <Text className="text-base text-heading mb-8">Veterinary Clinic</Text>
      <ActivityIndicator size="large" color="#71924F" />
    </View>
  );
}
