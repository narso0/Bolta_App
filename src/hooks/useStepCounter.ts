import { useState, useEffect, useRef } from 'react';
import { AppState } from 'react-native';
import { Pedometer } from 'expo-sensors';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useUser } from '../context/UserContext';
import { updateUserStats } from '../lib/firebase';
import { auth } from '../lib/firebase'; // <-- THIS IS THE FIX
// Google Fit integration removed to avoid crashes; pedometer-only logic retained

const STEPS_STORAGE_KEY = 'bolta_daily_step_count';
const STEPS_DATE_KEY = 'bolta_daily_date';

const formatDate = (date: Date) => date.toISOString().slice(0, 10); // YYYY-MM-DD

export const useStepCounter = () => {
  const { user } = useUser();
  const [isPedometerAvailable, setIsPedometerAvailable] = useState('checking');
  const [stepCount, setStepCount] = useState(0);
  const [initialized, setInitialized] = useState(false);

  // Baselines for combining persisted total with live session increments
  const sessionBaseStepsRef = useRef(0);
  const sessionResultOffsetRef = useRef(0);
  const currentDateRef = useRef<string>('');

  useEffect(() => {
    const initializeDailySteps = async () => {
      try {
        const todayStr = formatDate(new Date());
        currentDateRef.current = todayStr;

        const [[, savedStepsString], [, savedDateString]] = await AsyncStorage.multiGet([
          STEPS_STORAGE_KEY,
          STEPS_DATE_KEY,
        ]);

        let persistedSteps = 0;
        if (savedStepsString) {
          persistedSteps = Number(JSON.parse(savedStepsString)) || 0;
        }

        const savedDate = savedDateString || todayStr;

        // Reset if the saved date is not today
        if (savedDate !== todayStr) {
          persistedSteps = 0;
          await AsyncStorage.multiSet([
            [STEPS_STORAGE_KEY, JSON.stringify(0)],
            [STEPS_DATE_KEY, todayStr],
          ]);
        }

        // Try to get the device-reported steps since start of day for better accuracy
        let initialSteps = persistedSteps;
        try {
          const available = await Pedometer.isAvailableAsync();
          if (available) {
            const startOfDay = new Date();
            startOfDay.setHours(0, 0, 0, 0);
            const { steps } = await Pedometer.getStepCountAsync(startOfDay, new Date());
            if (typeof steps === 'number' && steps >= 0) {
              initialSteps = Math.max(persistedSteps, steps);
            }
          }
        } catch (err) {
          // If getStepCountAsync isn't available, fall back to persisted value
        }

        setStepCount(initialSteps);
        sessionBaseStepsRef.current = initialSteps; // base for this session
        sessionResultOffsetRef.current = 0; // watch starts at 0
        await AsyncStorage.multiSet([
          [STEPS_STORAGE_KEY, JSON.stringify(initialSteps)],
          [STEPS_DATE_KEY, todayStr],
        ]);
      } catch (e) {
        console.error('Failed to initialize steps from storage', e);
      } finally {
        setInitialized(true);
      }
    };
    initializeDailySteps();
  }, []);

  useEffect(() => {
    if (!initialized) return;

    let subscription: Pedometer.Subscription | null = null;
    const subscribe = async () => {
      const isAvailable = await Pedometer.isAvailableAsync();
      setIsPedometerAvailable(String(isAvailable));

      if (isAvailable) {
        const permission = await Pedometer.requestPermissionsAsync();
        if (permission.granted) {
          // Start a new session baseline based on the initialized value
          sessionResultOffsetRef.current = 0; // watch starts at 0

          subscription = Pedometer.watchStepCount(async (result) => {
            try {
              const now = new Date();
              const todayStr = formatDate(now);

              // Handle day change while app is open
              if (currentDateRef.current !== todayStr) {
                currentDateRef.current = todayStr;
                sessionBaseStepsRef.current = 0;
                sessionResultOffsetRef.current = result.steps; // re-baseline against ongoing session
                await AsyncStorage.multiSet([
                  [STEPS_DATE_KEY, todayStr],
                  [STEPS_STORAGE_KEY, JSON.stringify(0)],
                ]);
                setStepCount(0);
                return;
              }

              const sessionSteps = Math.max(0, result.steps - sessionResultOffsetRef.current);
              const total = sessionBaseStepsRef.current + sessionSteps;

              setStepCount(total);
              await AsyncStorage.setItem(STEPS_STORAGE_KEY, JSON.stringify(total));

              if (user) {
                const coins = Math.floor(total / 1000);
                const uid = auth.currentUser?.uid;
                if (uid) {
                  updateUserStats(uid, { totalSteps: total, coins });
                }
              }
            } catch (e) {
              console.error('Failed during step update', e);
            }
          });
        }
      }
    };
    subscribe();
    return () => {
      subscription?.remove();
    };
  }, [initialized, user]);

  // Refresh from device on returning to foreground so steps accrued while closed are reflected
  useEffect(() => {
    const handleAppStateChange = async (state: string) => {
      if (state !== 'active') return;
      try {
        const now = new Date();
        const todayStr = formatDate(now);

        if (currentDateRef.current !== todayStr) {
          currentDateRef.current = todayStr;
          sessionBaseStepsRef.current = 0;
          sessionResultOffsetRef.current = 0;
          await AsyncStorage.multiSet([
            [STEPS_DATE_KEY, todayStr],
            [STEPS_STORAGE_KEY, JSON.stringify(0)],
          ]);
          setStepCount(0);
          return;
        }

        // Load the last saved steps (e.g., from background fetch), then prefer the max
        const savedStr = await AsyncStorage.getItem(STEPS_STORAGE_KEY);
        const savedSteps = savedStr ? Number(JSON.parse(savedStr)) || 0 : 0;

        let pedometerSteps: number | null = null;
        const available = await Pedometer.isAvailableAsync();
        if (available) {
          const startOfDay = new Date();
          startOfDay.setHours(0, 0, 0, 0);
          const { steps } = await Pedometer.getStepCountAsync(startOfDay, now);
          pedometerSteps = typeof steps === 'number' && steps >= 0 ? steps : null;
        }

        const total = Math.max(savedSteps, pedometerSteps ?? 0, stepCount);

        sessionBaseStepsRef.current = total;
        sessionResultOffsetRef.current = 0;
        setStepCount(total);
        await AsyncStorage.setItem(STEPS_STORAGE_KEY, JSON.stringify(total));

        if (user) {
          const coins = Math.floor(total / 1000);
          const uid = auth.currentUser?.uid;
          if (uid) {
            updateUserStats(uid, { totalSteps: total, coins });
          }
        }
      } catch (e) {
        // No-op: keep previous count
      }
    };

    const sub = AppState.addEventListener('change', handleAppStateChange);
    return () => sub.remove();
  }, [initialized, user, stepCount]);
  
  return { stepCount, isPedometerAvailable };
};