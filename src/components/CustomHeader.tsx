import React from 'react';
import { View, Text } from 'react-native';
import { Button } from '@/components/ui/button';
import { User } from 'lucide-react-native';
import LinearGradient from 'react-native-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export function CustomHeader({ navigation, route }: any) {
  const currentRouteName = route.name;
  const insets = useSafeAreaInsets();
  const topPad = Math.max(insets.top, 8);

  return (
    <LinearGradient
        colors={['#26394C', '#394242']}
        style={{ paddingTop: topPad + 8, paddingBottom: 8, paddingHorizontal: 12 }}
    >
        <View className="w-full flex-row items-center justify-between">

          {/* --- LEFT SIDE GROUP --- */}
          <View className="flex-row items-center space-x-4">

            <View className="flex-row items-center bg-login-card p-1 rounded-lg">
              <Button
                size="sm"
                onPress={() => navigation.navigate('Home')}
                className={currentRouteName === 'Home' ? 'bg-button-primary' : 'bg-transparent'}
              >
                <Text className="text-white">მთავარი</Text>
              </Button>
              <Button
                size="sm"
                onPress={() => navigation.navigate('Marketplace')}
                className={currentRouteName === 'Marketplace' ? 'bg-button-primary' : 'bg-transparent'}
              >
                <Text className="text-white">ჯილდოები</Text>
              </Button>
            </View>
          </View>

          {/* --- RIGHT SIDE GROUP --- */}
          <View className="flex-row items-center space-x-2">
            <Button
              onPress={() => navigation.navigate('Profile')}
              className="flex-row items-center bg-login-card p-2 rounded-md space-x-2"
            >
              <User className="h-4 w-4 text-gray-400" />
            </Button>
          </View>

        </View>
    </LinearGradient>
  );
}