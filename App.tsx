import React, { useEffect, useState } from 'react';
import { View, ActivityIndicator, StyleSheet, AppState } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { AppNavigator } from './src/navigation/AppNavigator';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Toaster } from './src/components/ui/toaster';
import { User, UserProvider, useUser } from './src/context/UserContext';
import { onAuthStateChanged } from 'firebase/auth';
import { auth, getUserDocument } from './src/lib/firebase';
import LinearGradient from 'react-native-linear-gradient';
import * as BackgroundFetch from 'expo-background-fetch';
import * as TaskManager from 'expo-task-manager';
import { Pedometer } from 'expo-sensors';
import AsyncStorage from '@react-native-async-storage/async-storage';
const BACKGROUND_STEP_TASK = 'bolta_background_step_task';
const BG_LAST_RUN_KEY = 'bolta_bg_last_run';
const BG_LAST_ERR_KEY = 'bolta_bg_last_error';

TaskManager.defineTask(BACKGROUND_STEP_TASK, async () => {
  try {
    const now = new Date();
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);
    const result = await Pedometer.getStepCountAsync(startOfDay, now);
    const steps = (result?.steps ?? 0);
    await AsyncStorage.setItem('bolta_daily_step_count', JSON.stringify(steps));
    await AsyncStorage.setItem(BG_LAST_RUN_KEY, now.toISOString());
    console.log('[BG] Step task fired', { steps, at: now.toISOString() });
    return BackgroundFetch.BackgroundFetchResult.NewData;
  } catch (e) {
    console.log('[BG] Step task error', e);
    await AsyncStorage.setItem(BG_LAST_ERR_KEY, String(e));
    return BackgroundFetch.BackgroundFetchResult.Failed;
  }
});

async function registerBackgroundStepTask() {
  try {
    const status = await BackgroundFetch.getStatusAsync();
    if (
      status === BackgroundFetch.BackgroundFetchStatus.Restricted ||
      status === BackgroundFetch.BackgroundFetchStatus.Denied
    ) {
      return;
    }
    await BackgroundFetch.setMinimumIntervalAsync(15 * 60);
    const isRegistered = await TaskManager.isTaskRegisteredAsync(BACKGROUND_STEP_TASK);
    if (!isRegistered) {
      await BackgroundFetch.registerTaskAsync(BACKGROUND_STEP_TASK, {
        minimumInterval: 15 * 60,
        stopOnTerminate: false,
        startOnBoot: true,
      });
    }
  } catch (_e) {
    // ignore
  }
}

async function logBackgroundStatus(label: string) {
  try {
    const status = await BackgroundFetch.getStatusAsync();
    const isRegistered = await TaskManager.isTaskRegisteredAsync(BACKGROUND_STEP_TASK);
    const [lastRun, lastErr] = await Promise.all([
      AsyncStorage.getItem(BG_LAST_RUN_KEY),
      AsyncStorage.getItem(BG_LAST_ERR_KEY),
    ]);
    console.log('[BG] Info', {
      label,
      status,
      isRegistered,
      lastRun,
      lastErr,
    });
  } catch (e) {
    console.log('[BG] Info error', e);
  }
}

const LoadingScreen = () => (
  <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
    <LinearGradient
        colors={['#394242', '#26394C']}
        style={StyleSheet.absoluteFill}
    />
    <ActivityIndicator size="large" color="#ffffff" />
  </View>
);

const AppContent = () => {
  const { login } = useUser();
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        const userProfile = await getUserDocument(firebaseUser.uid);
        if (userProfile) {
          login(userProfile as User);
          setIsAuthenticated(true);
        } else {
          setIsAuthenticated(false);
        }
      } else {
        setIsAuthenticated(false);
      }
      setIsLoading(false);
    });
    return unsubscribe;
  }, []);

  useEffect(() => {
    registerBackgroundStepTask();
    logBackgroundStatus('mount');

    const sub = AppState.addEventListener('change', (state) => {
      if (state === 'active') {
        logBackgroundStatus('resume');
      }
    });
    return () => sub.remove();
  }, []);

  if (isLoading) {
    return <LoadingScreen />;
  }
  
  return <AppNavigator isAuthenticated={isAuthenticated} />;
}

export default function App() {
  return (
    <UserProvider>
      <SafeAreaProvider>
        <NavigationContainer>
          <AppContent />
        </NavigationContainer>
        <Toaster />
      </SafeAreaProvider>
    </UserProvider>
  );
}









// import React, { useEffect, useState } from 'react';
// import { View, Text, StyleSheet, SafeAreaView, Button } from 'react-native';
// import AsyncStorage from '@react-native-async-storage/async-storage';

// const App = () => {
//   const [testResult, setTestResult] = useState('Testing...');
//   const [readResult, setReadResult] = useState<string | null>('Not read yet.');

//   const runTest = async () => {
//     try {
//       console.log('--- RUNNING ASYNCSTORAGE TEST ---');
      
//       // 1. Try to write a value
//       await AsyncStorage.setItem('debug_key', 'it_works!');
//       console.log('setItem successful.');

//       // 2. Try to read the value back immediately
//       const value = await AsyncStorage.getItem('debug_key');
//       console.log('getItem result:', value);
//       setTestResult(value === 'it_works!' ? '✅ Write/Read Test PASSED' : '❌ Write/Read Test FAILED');

//     } catch (e) {
//       // This is the updated block
//       console.error('AsyncStorage test failed with error:', e);
//       if (e instanceof Error) {
//         setTestResult(`❌ Test failed with error: ${e.message}`);
//       } else {
//         setTestResult(`❌ Test failed with an unknown error type.`);
//       }
//     }
//   };
  
//   const readOnDemand = async () => {
//     const value = await AsyncStorage.getItem('debug_key');
//     setReadResult(value);
//   }

//   // Run the test once when the app starts
//   useEffect(() => {
//     runTest();
//   }, []);

//   return (
//     <SafeAreaView style={styles.container}>
//       <Text style={styles.header}>AsyncStorage Debug Test</Text>
//       <Text style={styles.text}>Initial Test Result:</Text>
//       <Text style={styles.result}>{testResult}</Text>
      
//       <View style={styles.divider} />
      
//       <Button title="Attempt to Read Value Again" onPress={readOnDemand} />
//       <Text style={styles.text}>Value read on demand:</Text>
//       <Text style={styles.result}>{String(readResult)}</Text>
      
//       <Text style={styles.instructions}>
//         Close the app completely (swipe away) and reopen it. Then press the button again. If the value is 'null', storage is not persisting.
//       </Text>
//     </SafeAreaView>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     backgroundColor: '#1a1a1a',
//     padding: 20,
//   },
//   header: {
//     fontSize: 24,
//     fontWeight: 'bold',
//     color: 'white',
//     marginBottom: 20,
//   },
//   text: {
//     fontSize: 16,
//     color: '#ccc',
//     marginTop: 15,
//   },
//   result: {
//     fontSize: 18,
//     fontWeight: 'bold',
//     color: '#fff',
//     marginTop: 5,
//   },
//   divider: {
//     height: 1,
//     width: '80%',
//     backgroundColor: '#444',
//     marginVertical: 30,
//   },
//   instructions: {
//     fontSize: 14,
//     color: '#aaa',
//     textAlign: 'center',
//     marginTop: 40,
//   }
// });

// export default App;





// import React, { useEffect, useState } from 'react';
// import { View, ActivityIndicator, StyleSheet } from 'react-native';
// import { NavigationContainer } from '@react-navigation/native';
// import { AppNavigator } from './src/navigation/AppNavigator';
// import { SafeAreaProvider } from 'react-native-safe-area-context';
// import { Toaster } from './src/components/ui/toaster';
// import { User, UserProvider, useUser } from './src/context/UserContext';
// // DELETED: import { onAuthStateChanged } from 'firebase/auth';
// import { auth, getUserDocument } from './src/lib/firebase';
// import LinearGradient from 'react-native-linear-gradient';

// const LoadingScreen = () => (
//   <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
//     <LinearGradient
//         colors={['#394242', '#26394C']}
//         style={StyleSheet.absoluteFill}
//     />
//     <ActivityIndicator size="large" color="#ffffff" />
//   </View>
// );

// const AppContent = () => {
//   const { login } = useUser();
//   const [isLoading, setIsLoading] = useState(true);

//   useEffect(() => {
//     // MODIFIED: The compat API uses a method on the auth object directly
//     const unsubscribe = auth.onAuthStateChanged(async (firebaseUser) => {
//       if (firebaseUser) {
//         const userProfile = await getUserDocument(firebaseUser.uid);
//         if (userProfile) {
//           login(userProfile as User);
//         }
//       }
//       setIsLoading(false);
//     });
//     return unsubscribe;
//   }, []);

//   if (isLoading) {
//     return <LoadingScreen />;
//   }

//   return <AppNavigator />;
// }

// export default function App() {
//   return (
//     <UserProvider>
//       <SafeAreaProvider>
//         <NavigationContainer>
//           <AppContent />
//         </NavigationContainer>
//         <Toaster />
//       </SafeAreaProvider>
//     </UserProvider>
//   );
// }






