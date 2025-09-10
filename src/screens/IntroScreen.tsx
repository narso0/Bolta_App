import React from 'react';
import { View, Text, ScrollView, Image, StyleSheet, TextProps } from 'react-native';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Footprints, Coins, Gift, TrendingUp } from 'lucide-react-native';
import MaskedView from '@react-native-community/masked-view';
import LinearGradient from 'react-native-linear-gradient';

// Helper component for the gradient text effect
interface GradientTextProps extends TextProps {
  colors: string[];
}
const GradientText = ({ colors, ...rest }: GradientTextProps) => {
  return (
    <MaskedView maskElement={<Text {...rest} />}>
      <LinearGradient
        colors={colors}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
      >
        {/* The Text component below is used to give the gradient the correct size */}
        <Text {...rest} style={[rest.style, { opacity: 0 }]} />
      </LinearGradient>
    </MaskedView>
  );
};

const features = [
  {
    icon: Footprints,
    title: 'ნაბიჯების მონიტორინგი',
    description: 'ავტომატურად დაითვლი ყოველდღიურ ნაბიჯებს ტელეფონის მეშვეობით.',
  },
  {
    icon: Coins,
    title: 'დააგროვე ბოლთაქოინები',
    description: 'ყოველ 1,000 ნაბიჯზე მიიღებ 1 ბოლთაქოინს.',
  },
  {
    icon: Gift,
    title: 'ქოინების გაცვლა',
    description: 'გადაცვალე ბოლთაქოინები ჯილდოებსა და ფასდაკლებებზე.',
  },
  {
    icon: TrendingUp,
    title: 'იყავი მოტივირებული',
    description: 'ყოველდღიური გამოწვევები და სტატისტიკა პროგრესის სანახავად.',
  },
];

export default function IntroScreen({ navigation }: any) {
  return (
    <View style={{ flex: 1 }}>
      {/* 1. The Background Gradient */}
      <LinearGradient
        colors={['#394242', '#26394C']} // From your new colors
        style={StyleSheet.absoluteFill}
      />
      <ScrollView>
        {/* Top Section */}
        <View className="items-center justify-center px-4 py-24">
          <View
            className="w-16 h-16 rounded-full items-center justify-center mb-4"
            style={{ backgroundColor: 'rgba(255, 255, 255, 0.1)' }}
          >
            <Image
              source={require('../../assets/images/bolta.png')}
              className="w-12 h-12"
              resizeMode="contain"
            />
          </View>

          <Text className="text-5xl font-bold text-white">ბოლთა</Text>

          {/* 2. The Gradient Text */}
          <GradientText
            colors={['#7e8694', '#E3B532']} // From your new colors
            className="text-4xl font-bold text-center mt-8 mb-4 px-8" // Increased size and padding
          >
            გადაცვალეთ ნაბიჯები ჯანსაღ ჯილდოებში
          </GradientText>

          <Text className="text-lg text-gray-400 text-center mb-8">
            იარე ყოველდღიურად, დააგროვე ბოლთაქოინები და გადაცვალე ისინი ექსკლუზიურ ფასდაკლებებში.
          </Text>

          <Button
            size="lg"
            onPress={() => navigation.navigate('Login')} // Updated to navigate
            className="bg-white rounded-full"
          >
            <Text className="text-lg font-bold" style={{ color: '#2A3447' }}>
              დაიწყე ახლავე
            </Text>
          </Button>
        </View>

        {/* "How it works" Section */}
        <View className="bg-transparent py-16">
          <View className="px-4">
            <Text className="text-3xl font-bold text-center text-white mb-4">
              როგორ მუშაობს ბოლთა?
            </Text>
            <Text className="text-lg text-center text-gray-400 mb-12">
              დაიწყე მონიტორინგი, დააგროვე ქოინები და მიიღე ჯილდოები.
            </Text>
            <View className="flex-col space-y-4">
              {features.map((feature, index) => {
                const Icon = feature.icon;
                return (
                  <Card
                    key={index}
                    style={{ backgroundColor: 'rgba(37, 76, 115, 0.5)', borderWidth: 0 }}
                    className="border-0"
                  >
                    <CardContent className="p-6 flex-row items-center space-x-4">
                      <View className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center">
                        <Icon className="h-6 w-6 text-white" />
                      </View>
                      <View className="flex-1">
                        <Text className="text-lg font-semibold text-white">{feature.title}</Text>
                        <Text className="text-gray-400 mt-1">{feature.description}</Text>
                      </View>
                    </CardContent>
                  </Card>
                );
              })}
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}