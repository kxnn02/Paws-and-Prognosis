import React, { useEffect, useRef } from 'react';
import { View, Image, ActivityIndicator, Animated } from 'react-native';

export default function SplashScreen() {
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(opacity, {
      toValue: 1,
      duration: 600,
      useNativeDriver: true,
    }).start();
  }, [opacity]);

  return (
    <View className="flex-1 bg-beige justify-center items-center">
      <Animated.View style={{ opacity }}>
        <Image
          source={require('../../../assets/logo-transparent.png')}
          className="w-[350px] h-[350px]"
          resizeMode="contain"
        />
      </Animated.View>
      <ActivityIndicator size="large" color="#71924F" className="mt-6" />
    </View>
  );
}
