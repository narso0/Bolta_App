import React, { useState } from 'react';
import { View, Text, ScrollView, Pressable, TextInput, KeyboardAvoidingView, Platform, Alert } from 'react-native';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Mail, Lock, Eye, EyeOff, ChevronLeft, User as UserIcon } from 'lucide-react-native';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth, createUserDocument } from '@/lib/firebase';
import { useUser } from '@/context/UserContext';
import { CommonActions } from '@react-navigation/native';

export default function SignUpScreen({ navigation }: any) {
  const { login } = useUser();
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);
  
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState({ name: '', email: '', password: '', confirmPassword: '' });

  const validate = () => {
    let isValid = true;
    const newErrors = { name: '', email: '', password: '', confirmPassword: '' };

    if (!name.trim()) {
      newErrors.name = 'Please enter your name';
      isValid = false;
    }
    if (!email || !/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Enter a valid email address';
      isValid = false;
    }
    if (!password || password.length < 8) {
      newErrors.password = 'The password must be at least 8 characters long';
      isValid = false;
    }
    if (password !== confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSignUp = async () => {
    if (validate()) {
      try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const { user } = userCredential;
        
        // This is a custom property we add before saving to the database
        const userWithDisplayName = { ...user, displayName: name };
        await createUserDocument(userWithDisplayName);
        
        login({ name: name, email: user.email });

        navigation.dispatch(
          CommonActions.reset({
            index: 0,
            routes: [{ name: 'Home' }],
          })
        );
      } catch (error: any) {
        console.error("Sign up error:", error);
        if (error.code === 'auth/email-already-in-use') {
          Alert.alert("Sign Up Failed", "This email address is already in use.");
        } else {
          Alert.alert("Sign Up Failed", error.message);
        }
      }
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1 }}
    >
      <ScrollView className="flex-1 bg-login-background" contentContainerStyle={{ flexGrow: 1 }}>
        <View className="flex-1 justify-center items-center p-4">
          <Pressable onPress={() => navigation.goBack()} className="absolute top-16 left-4 z-10 p-2">
            <ChevronLeft className="h-8 w-8 text-white" />
          </Pressable>
          <Card className="w-full max-w-sm bg-login-card border-0 p-4 rounded-xl">
            <CardHeader className="items-center p-2">
              <Text className="text-2xl font-bold text-white">Create an Account</Text>
              <Text className="text-gray-400">Get started with Bolta</Text>
            </CardHeader>
            <CardContent className="space-y-4 pt-6">
              <View className="space-y-2">
                <Label className="text-white">Full Name</Label>
                <View className={`flex-row items-center h-12 w-full rounded-md border bg-input-background px-3 ${errors.name ? 'border-red-500' : 'border-input-border'}`}>
                  <UserIcon className="h-4 w-4 text-gray-400" />
                  <TextInput placeholder="Enter your full name" placeholderTextColor="#9ca3af" className="flex-1 text-white ml-2 text-base" value={name} onChangeText={setName} />
                </View>
                {errors.name ? <Text className="text-red-500 text-xs mt-1">{errors.name}</Text> : null}
              </View>
              <View className="space-y-2">
                <Label className="text-white">Email</Label>
                <View className={`flex-row items-center h-12 w-full rounded-md border bg-input-background px-3 ${errors.email ? 'border-red-500' : 'border-input-border'}`}>
                  <Mail className="h-4 w-4 text-gray-400" />
                  <TextInput placeholder="Enter your email" placeholderTextColor="#9ca3af" className="flex-1 text-white ml-2 text-base" keyboardType="email-address" autoCapitalize="none" value={email} onChangeText={setEmail} />
                </View>
                {errors.email ? <Text className="text-red-500 text-xs mt-1">{errors.email}</Text> : null}
              </View>
              <View className="space-y-2">
                <Label className="text-white">Password</Label>
                <View className={`flex-row items-center h-12 w-full rounded-md border bg-input-background px-3 ${errors.password ? 'border-red-500' : 'border-input-border'}`}>
                  <Lock className="h-4 w-4 text-gray-400" />
                  <TextInput placeholder="Enter your password" placeholderTextColor="#9ca3af" className="flex-1 text-white ml-2 text-base" secureTextEntry={!passwordVisible} value={password} onChangeText={setPassword} />
                  <Pressable onPress={() => setPasswordVisible(!passwordVisible)}>
                    {passwordVisible ? <EyeOff className="h-4 w-4 text-gray-400" /> : <Eye className="h-4 w-4 text-gray-400" />}
                  </Pressable>
                </View>
                {errors.password ? <Text className="text-red-500 text-xs mt-1">{errors.password}</Text> : null}
              </View>
              <View className="space-y-2">
                <Label className="text-white">Confirm Password</Label>
                <View className={`flex-row items-center h-12 w-full rounded-md border bg-input-background px-3 ${errors.confirmPassword ? 'border-red-500' : 'border-input-border'}`}>
                  <Lock className="h-4 w-4 text-gray-400" />
                  <TextInput placeholder="Confirm your password" placeholderTextColor="#9ca3af" className="flex-1 text-white ml-2 text-base" secureTextEntry={!confirmPasswordVisible} value={confirmPassword} onChangeText={setConfirmPassword} />
                  <Pressable onPress={() => setConfirmPasswordVisible(!confirmPasswordVisible)}>
                    {confirmPasswordVisible ? <EyeOff className="h-4 w-4 text-gray-400" /> : <Eye className="h-4 w-4 text-gray-400" />}
                  </Pressable>
                </View>
                {errors.confirmPassword ? <Text className="text-red-500 text-xs mt-1">{errors.confirmPassword}</Text> : null}
              </View>
              <Button size="lg" onPress={handleSignUp} className="bg-button-primary rounded-md">
                <Text className="font-bold text-white">Sign Up</Text>
              </Button>
              <Pressable onPress={() => navigation.navigate('Login')} className="mt-4">
                <Text className="text-center text-sm text-gray-400">
                  Already have an account? <Text className="text-primary font-bold">Sign in</Text>
                </Text>
              </Pressable>
            </CardContent>
          </Card>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
