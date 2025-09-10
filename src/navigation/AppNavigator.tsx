import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// Import all our screens
import HomeScreen from '../screens/HomeScreen';
import MarketplaceScreen from '../screens/MarketplaceScreen';
import IntroScreen from '../screens/IntroScreen';
import LoginScreen from '../screens/LoginScreen';
import SignUpScreen from '../screens/SignUpScreen'; // Import SignUp
import ProfileScreen from '../screens/ProfileScreen';

// Import our custom header
import { CustomHeader } from '../components/CustomHeader';

const Stack = createNativeStackNavigator();

export function AppNavigator({ isAuthenticated = false }: { isAuthenticated?: boolean }) {
  return (
    <Stack.Navigator
      initialRouteName={isAuthenticated ? 'Home' : 'Intro'}
      key={isAuthenticated ? 'app' : 'auth'}
    >

      {/* Group 1: Screens with NO header */}
      <Stack.Group screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Intro" component={IntroScreen} />
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="SignUp" component={SignUpScreen} />
      </Stack.Group>

      {/* Group 2: Screens WITH the custom header */}
      <Stack.Group
        screenOptions={{
          header: (props) => <CustomHeader {...props} />,
          headerTransparent: true,
        }}
      >
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Marketplace" component={MarketplaceScreen} />
      </Stack.Group>

      {/* Group 3: Screens that are modals with a default header */}
      <Stack.Group screenOptions={{ presentation: 'modal' }}>
        <Stack.Screen 
          name="Profile" 
          component={ProfileScreen} 
          options={{ 
            headerStyle: { backgroundColor: '#26394C' },
            headerTitleStyle: { color: 'white' },
            headerTintColor: 'white',
          }} 
        />
      </Stack.Group>

    </Stack.Navigator>
  );
}