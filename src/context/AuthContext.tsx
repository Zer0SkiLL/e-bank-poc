import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import * as SecureStore from 'expo-secure-store';

interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  avatar?: string;
  phone: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  biometricLogin: () => Promise<boolean>;
  verifyPin: (pin: string) => Promise<boolean>;
  hasPin: boolean;
  setPin: (pin: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const MOCK_USER: User = {
  id: 'usr_001',
  email: 'alex.johnson@email.com',
  firstName: 'Alex',
  lastName: 'Johnson',
  phone: '+1 (555) 123-4567',
  avatar: undefined,
};

const SESSION_KEY = 'auth_session';
const PIN_KEY = 'user_pin';

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasPin, setHasPinState] = useState(false);

  useEffect(() => {
    checkExistingSession();
  }, []);

  const checkExistingSession = async () => {
    try {
      const session = await SecureStore.getItemAsync(SESSION_KEY);
      if (session) {
        setUser(JSON.parse(session));
      }
      const pin = await SecureStore.getItemAsync(PIN_KEY);
      setHasPinState(!!pin);
    } catch (error) {
      // Session check failed
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    if (email && password) {
      setUser(MOCK_USER);
      await SecureStore.setItemAsync(SESSION_KEY, JSON.stringify(MOCK_USER));
      setIsLoading(false);
      return true;
    }
    setIsLoading(false);
    return false;
  };

  const logout = async () => {
    setUser(null);
    await SecureStore.deleteItemAsync(SESSION_KEY);
  };

  const biometricLogin = async (): Promise<boolean> => {
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    setUser(MOCK_USER);
    await SecureStore.setItemAsync(SESSION_KEY, JSON.stringify(MOCK_USER));
    setIsLoading(false);
    return true;
  };

  const verifyPin = async (pin: string): Promise<boolean> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    const storedPin = await SecureStore.getItemAsync(PIN_KEY);
    if (storedPin) return pin === storedPin;
    return pin.length === 6; // Default: any 6-digit PIN
  };

  const setPin = async (pin: string) => {
    await SecureStore.setItemAsync(PIN_KEY, pin);
    setHasPinState(true);
  };

  return (
    <AuthContext.Provider value={{
      user,
      isAuthenticated: !!user,
      isLoading,
      login,
      logout,
      biometricLogin,
      verifyPin,
      hasPin,
      setPin,
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};
