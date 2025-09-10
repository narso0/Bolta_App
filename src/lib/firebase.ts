import { initializeApp, getApps, getApp } from 'firebase/app';
import { initializeAuth, getReactNativePersistence, getAuth, User } from 'firebase/auth';
import type { Auth } from 'firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getFirestore, doc, setDoc, getDoc, updateDoc, serverTimestamp } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
  authDomain: "boltaaa.firebaseapp.com",
  projectId: "boltaaa",
  storageBucket: "boltaaa.firebasestorage.app",
  messagingSenderId: "196578511481",
  appId: "1:196578511481:web:b7c12c2462db05563f62a8",
  measurementId: "G-R7LWXHJ5ZE"
};

const app = getApps().length ? getApp() : initializeApp(firebaseConfig);

let auth: Auth;
try {
  auth = initializeAuth(app, {
    persistence: getReactNativePersistence(AsyncStorage),
  });
} catch (_error) {
  // If Auth was already initialized (e.g., during Fast Refresh), fall back to the existing instance
  auth = getAuth(app);
}
const db = getFirestore(app);

// The 'user' type is now more specific to handle both Auth and custom data
export const createUserDocument = async (user: User & { displayName?: string | null }) => {
  if (!user) return;
  const userRef = doc(db, "users", user.uid); 
  const snapshot = await getDoc(userRef);

  if (!snapshot.exists()) {
    const { displayName, email } = user;
    const createdAt = new Date();

    try {
      await setDoc(userRef, {
        name: displayName,
        email,
        createdAt,
        totalSteps: 0,
        coins: 0,
        coinsSpent: 0,
      });
    } catch (error) {
      console.error("Error creating user document: ", error);
    }
  }
  return userRef;
};

export const updateUserStats = async (uid: string, stats: { totalSteps: number; coins: number }) => {
    if (!uid) return;
    try {
        const userRef = doc(db, "users", uid);
        await updateDoc(userRef, {
            totalSteps: stats.totalSteps,
            coins: stats.coins,
            lastUpdated: serverTimestamp(),
        });
    } catch (error) {
        console.error("Error updating user stats:", error);
    }
};

export const getUserDocument = async (uid: string) => {
  if (!uid) return null;
  try {
    const userRef = doc(db, "users", uid);
    const snapshot = await getDoc(userRef);
    return snapshot.exists() ? snapshot.data() : null;
  } catch (error) {
    console.error("Error fetching user document: ", error);
    return null;
  }
};

export { auth, db };

