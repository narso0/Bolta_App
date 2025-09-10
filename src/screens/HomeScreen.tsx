import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useUser } from '../context/UserContext';
import { useStepCounter } from '../hooks/useStepCounter';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CircularProgress } from '@/components/ui/CircularProgress';
import { Coins, Flame } from 'lucide-react-native';
import LinearGradient from 'react-native-linear-gradient';

const dailyGoal = 10000;

const calculateStreak = (weekData: { day: string; steps: number }[]): number => {
  let streak = 0;
  const todayIndex = weekData.length - 1;
  const startIndex = weekData[todayIndex].steps >= dailyGoal ? todayIndex : todayIndex - 1;

  for (let i = startIndex; i >= 0; i--) {
    if (weekData[i].steps >= dailyGoal) {
      streak++;
    } else {
      break;
    }
  }
  return streak;
};

const generateWeekData = (todaySteps: number) => {
  const days = ['ორშ', 'სამ', 'ოთხ', 'ხუთ', 'პარ', 'შაბ', 'კვი'];
  const today = new Date().getDay();
  const todayIndex = today === 0 ? 6 : today - 1;

  return days.map((day, index) => {
    if (index === todayIndex) {
      return { day, steps: todaySteps };
    }
    // Initially, show 0 for all non-today days until we have history
    return { day, steps: 0 };
  });
};

export default function HomeScreen({ navigation }: any) {
  const { user } = useUser();
  const { stepCount } = useStepCounter();
  const coins = Math.floor(stepCount / 1000);
  const progressPercent = Math.min((stepCount / dailyGoal) * 100, 100);
  
  const weekData = generateWeekData(stepCount);
  const streak = calculateStreak(weekData);

  return (
    <View style={{ flex: 1 }}>
      <LinearGradient
        colors={['#394242', '#26394C']}
        style={StyleSheet.absoluteFill}
      />
      <SafeAreaView style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={{ paddingHorizontal: 16, paddingTop: 88, paddingBottom: 32 }}>
          <View className="mb-6">
            <Text className="text-3xl font-bold text-white">გამარჯობა, {user?.name}! 👋</Text>
            <Text className="text-gray-400">განაგრძე სიარული შენი მიზნებისკენ</Text>
          </View>

          <View className="flex-row gap-4 mb-6">
            <Card className="flex-1 bg-yellow-400 border-0">
              <CardContent className="p-4">
                <Text className="text-yellow-900">დღევანდელი ქოინები</Text>
                <View className="flex-row items-center justify-between">
                  <Text className="text-3xl font-bold text-yellow-900">{coins}</Text>
                  <Coins className="h-8 w-8 text-yellow-900 opacity-50" />
                </View>
              </CardContent>
            </Card>
            <Card className="flex-1 bg-green-500 border-0">
              <CardContent className="p-4">
                <Text className="text-green-900">სტრიკი</Text>
                <View className="flex-row items-center justify-between">
                  <Text className="text-3xl font-bold text-green-900">{streak} დღე</Text>
                  <Flame className="h-8 w-8 text-green-900 opacity-50" />
                </View>
              </CardContent>
            </Card>
          </View>

          <Card className="mb-6 bg-login-card border-0 items-center p-6 rounded-2xl">
            <CircularProgress size={180} strokeWidth={15} progressPercent={progressPercent}>
              <Text className="text-4xl font-bold text-white">{stepCount.toLocaleString()}</Text>
              <Text className="text-sm text-gray-400">ნაბიჯი</Text>
            </CircularProgress>
          </Card>

          <Card className="mb-6 bg-login-card border-0">
            <CardHeader className="mb-4">
              <CardTitle className="text-white">ამ კვირის აქტივობა</CardTitle>
            </CardHeader>
            <CardContent className="flex-row justify-between items-end h-32 px-2">
              {weekData.map((dayData) => (
                <View key={dayData.day} className="flex-1 items-center space-y-2 px-1">
                  <View className="w-full h-full bg-input-background rounded-md overflow-hidden justify-end">
                    <View
                      className="bg-green-500"
                      style={{ height: `${Math.min(dayData.steps / dailyGoal, 1) * 100}%` }}
                    />
                  </View>
                  <Text className="text-xs text-gray-400">{dayData.day}</Text>
                </View>
              ))}
            </CardContent>
          </Card>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}
