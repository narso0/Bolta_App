import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Apple, Dumbbell, ShoppingCart, Sparkles } from 'lucide-react-native';
import LinearGradient from 'react-native-linear-gradient';

import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

const categories = [
    { title: 'Healthy Food', titleGeo: 'ჯანსაღი საკვები', description: 'ორგანული რესტორნები, წვენების ბარები, ჯანსაღი კვების გეგმები', icon: Apple, color: 'text-green-500', bgColor: 'bg-green-500/10' },
    { title: 'Fitness & Gyms', titleGeo: 'ფიტნესი და დარბაზები', description: 'სპორტული დარბაზის აბონემენტები, პერსონალური ვარჯიში, ფიტნეს კლასები', icon: Dumbbell, color: 'text-blue-500', bgColor: 'bg-blue-500/10' },
    { title: 'Health Shopping', titleGeo: 'ჯანმრთელობის პროდუქტები', description: 'დანამატები, ორგანული სასურსათო პროდუქტები', icon: ShoppingCart, color: 'text-purple-500', bgColor: 'bg-purple-500/10' },
    { title: 'Wellness & Spa', titleGeo: 'სიჯანსაღე და სპა', description: 'იოგას სტუდიოები, სპა, ველნეს ცენტრები, მედიტაცია', icon: Sparkles, color: 'text-pink-500', bgColor: 'bg-pink-500/10' },
];

export default function MarketplaceScreen() {
    return (
        <View style={{ flex: 1 }}>
            <LinearGradient
                colors={['#394242', '#26394C']}
                style={StyleSheet.absoluteFill}
            />
            <ScrollView contentContainerStyle={{ padding: 16, paddingTop: 128, paddingBottom: 32 }}>
                <View className="items-center mb-8">
                    <Text className="text-3xl font-bold text-white">ჯილდოები</Text>
                    <Text className="text-lg text-gray-400 mt-2 text-center">
                        გადაცვალე შენი ბოლთაქოინები ექსკლუზიურ და ჯანსაღ ფასდაკლებებში
                    </Text>
                </View>

                <View className="flex-col">
                    {categories.map((cat) => {
                        const Icon = cat.icon;
                        return (
                            <View key={cat.title} className="mb-4">
                                <AlertDialog>
                                    <Card className="bg-login-card border-0">
                                        <CardContent className="p-4 flex-row items-center space-x-4">
                                            <View className={`w-16 h-16 ${cat.bgColor} rounded-lg items-center justify-center`}>
                                                <Icon className={cat.color} size={32} />
                                            </View>
                                            <View className="flex-1">
                                                <Text className="text-xl font-bold text-white">{cat.titleGeo}</Text>
                                                <Text className="text-gray-400 mt-1">{cat.description}</Text>
                                                <View className="items-start mt-4">
                                                    <AlertDialogTrigger>
                                                        <Button size="sm" className="bg-button-primary">
                                                            <Text className="text-white font-semibold">დათვალიერება</Text>
                                                        </Button>
                                                    </AlertDialogTrigger>
                                                </View>
                                            </View>
                                        </CardContent>
                                    </Card>

                                    <AlertDialogContent className="bg-login-card border-input-border">
                                        <AlertDialogHeader>
                                            <AlertDialogTitle className="text-white">მალე დაემატება!</AlertDialogTitle>
                                            <AlertDialogDescription className="text-gray-400">
                                                {`${cat.titleGeo}ს მაღაზიები ხელმისაწვდომი იქნება შემდეგ განახლებაში.`}
                                            </AlertDialogDescription>
                                        </AlertDialogHeader>
                                        <AlertDialogFooter>
                                            <AlertDialogCancel>
                                                <Text className="text-white">დახურვა</Text>
                                            </AlertDialogCancel>
                                        </AlertDialogFooter>
                                    </AlertDialogContent>
                                </AlertDialog>
                            </View>
                        );
                    })}
                </View>

                 <Card className="bg-login-card border-0 mt-8">
                    <CardContent className="p-6 items-center">
                        <Text className="text-xl font-bold text-white text-center">მალე დაემატება!</Text>
                        <Text className="text-gray-400 mt-2 text-center">
                            ჩვენ ვაპირებთ თანამშრომლობას ჯანსაღ კვების ობიექტებთან და დარბაზებთან მთელი საქართველოს მასშტაბით.
                        </Text>
                    </CardContent>
                </Card>
            </ScrollView>
        </View>
    );
}