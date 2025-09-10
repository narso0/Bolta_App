import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { CommonActions } from '@react-navigation/native';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { Edit, Calendar, Footprints, Coins, Trophy, Zap, Mountain } from 'lucide-react-native';
import LinearGradient from 'react-native-linear-gradient';
import { useUser } from '../context/UserContext';

const getInitials = (name: string | null | undefined): string => {
  if (!name) return '';
  const names = name.split(' ');
  const firstNameInitial = names[0] ? names[0][0] : '';
  const lastNameInitial = names.length > 1 && names[names.length - 1] ? names[names.length - 1][0] : '';
  return `${firstNameInitial}${lastNameInitial}`.toUpperCase();
};

const achievements = [
    { title: 'პირველი ნაბიჯები', description: 'გაიარე პირველი 1,000 ნაბიჯი' },
    { title: 'ქოინების შემგროვებელი', description: 'დააგროვე 5 ბოლთაქოინი' },
    { title: 'მიზნის გამანადგურებელი', description: 'მიაღწიე დღის მიზანს' },
];

export default function ProfileScreen({ navigation }: any) {
  const insets = useSafeAreaInsets();
  const { user, logout } = useUser();

  const handleLogout = () => {
    logout();
    navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [{ name: 'Intro' }],
      })
    );
  };
  
  if (!user) {
    return null; // or a loading indicator
  }
  
  const joinDate = user.createdAt ? new Date(user.createdAt.seconds * 1000).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }) : 'Unknown';

  const stats = [
    { value: (user.totalSteps || 0).toLocaleString(), label: 'ჯამური ნაბიჯი', icon: Footprints },
    { value: (user.coins || 0).toLocaleString(), label: 'დაგროვებული ქოინები', icon: Coins },
    { value: (user.coinsSpent || 0).toLocaleString(), label: 'დახარჯული ქოინები', icon: Zap },
    { value: `${((user.totalSteps || 0) * 0.000762).toFixed(2)} km`, label: 'გავლილი მანძილი', icon: Mountain },
  ];

  return (
    <View style={{ flex: 1 }}>
      <LinearGradient colors={['#394242', '#26394C']} style={StyleSheet.absoluteFill} />
      <ScrollView 
        contentContainerStyle={{ 
          paddingTop: insets.top - 15, 
          paddingBottom: insets.bottom + 32, 
          paddingHorizontal: 16,
        }}
      >
        <View className="flex-row items-center justify-between mb-8">
            <View className="flex-row items-center space-x-4">
                <Avatar className="h-16 w-16">
                    <AvatarFallback className="bg-logo-background">
                        <Text className="text-xl text-white">{getInitials(user.name)}</Text>
                    </AvatarFallback>
                </Avatar>
                <View>
                    <Text className="text-2xl font-bold text-white">{user.name}</Text>
                    <Text className="text-gray-400">{user.email}</Text>
                    <View className="flex-row items-center mt-1 space-x-1">
                        <Calendar className="h-3 w-3 text-gray-400" />
                        <Text className="text-xs text-gray-400">შემოგვიერთდა {joinDate}</Text>
                    </View>
                </View>
            </View>
            <Button variant="outline" className="border-input-border flex-row justify-center">
                <Edit className="h-4 w-4 text-gray-400"/>
            </Button>
        </View>
        <View className="flex-col space-y-4 mb-6">
            {stats.map((stat, index) => {
                const Icon = stat.icon;
                return (
                    <Card key={index} className="bg-login-card border-0 rounded-xl">
                       <CardContent className="p-4 flex-row items-center">
                            <Icon className="h-6 w-6 text-primary mr-4" />
                            <Text className="text-base text-gray-400 flex-1">{stat.label}</Text>
                            <Text className="text-lg font-bold text-white">{stat.value}</Text>
                       </CardContent>
                    </Card>
                );
            })}
        </View>
        <Card className="bg-login-card border-0">
            <CardHeader>
                <CardTitle className="text-white">მიღწევები</CardTitle>
            </CardHeader>
            <CardContent className="px-2">
                {achievements.map((item, index) => (
                    <React.Fragment key={item.title}>
                        <View className="flex-row items-center p-4">
                            <Trophy className="h-6 w-6 text-yellow-400 mr-4" />
                            <View className="flex-1">
                                <Text className="text-white font-semibold">{item.title}</Text>
                                <Text className="text-gray-400 text-xs mt-1">{item.description}</Text>
                            </View>
                        </View>
                        {index < achievements.length - 1 && <Separator className="bg-input-border" />}
                    </React.Fragment>
                ))}
            </CardContent>
        </Card>
        <View className="mt-8 space-y-4">
            <Button onPress={() => navigation.goBack()} className="bg-button-primary">
                <Text className="text-white font-bold">დახურვა</Text>
            </Button>
            <Button onPress={handleLogout} variant="outline" className="border-red-500">
                <Text className="text-red-500 font-bold">გამოსვლა</Text>
            </Button>
        </View>
      </ScrollView>
    </View>
  );
}
