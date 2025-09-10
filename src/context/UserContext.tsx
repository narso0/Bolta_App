import React, { createContext, useState, useContext, ReactNode } from 'react';

// The User interface now includes all the data we store in Firestore
export interface User {
  name: string | null;
  email: string | null;
  createdAt?: { seconds: number; nanoseconds: number }; // Firebase timestamp
  totalSteps?: number;
  coins?: number;
  coinsSpent?: number;
}

interface UserContextType {
  user: User | null;
  login: (userData: User) => void;
  logout: () => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);

  const login = (userData: User) => {
    setUser(userData);
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <UserContext.Provider value={{ user, login, logout }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};