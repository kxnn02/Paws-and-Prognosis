import { View, Image, ActivityIndicator } from 'react-native';

export default function SplashScreen() {
  return (
    <View className="flex-1 bg-beige justify-center items-center">
      <Image
        source={require('../../../assets/logo-transparent.png')}
        className="w-[350px] h-[350px]"
        resizeMode="contain"
      />
      <ActivityIndicator size="large" color="#71924F" className="mt-6" />
    </View>
  );
}
