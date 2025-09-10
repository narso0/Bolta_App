import React, { useEffect } from 'react';
import { View, Image, StyleSheet } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withTiming, runOnJS } from 'react-native-reanimated';
import LinearGradient from 'react-native-linear-gradient';

export default function AnimatedSplashScreen({ onAnimationFinish }: { onAnimationFinish: () => void }) {
  const scale = useSharedValue(0.8);
  const opacity = useSharedValue(0);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      opacity: opacity.value,
      transform: [{ scale: scale.value }],
    };
  });

  useEffect(() => {
    opacity.value = withTiming(1, { duration: 1200 });
    scale.value = withTiming(1, { duration: 1200 }, (finished) => {
      if (finished) {
        runOnJS(onAnimationFinish)(); 
      }
    });
  }, []);

  return (
    <View style={{ flex: 1 }}>
        <LinearGradient colors={['#394242', '#26394C']} style={StyleSheet.absoluteFill} />
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
            <Animated.View style={animatedStyle}>
                <Image 
                    source={require('../../assets/images/bolta.png')} 
                    style={{ width: 120, height: 120 }} 
                    resizeMode="contain"
                />
            </Animated.View>
        </View>
    </View>
  );
}