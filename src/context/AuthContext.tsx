import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import * as SecureStore from 'expo-secure-store';

/** Represents an authenticated user in the application */
interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  avatar?: string;
  phone: string;
}

/** Shape of the AuthContext value provided to consuming components */
interface AuthContextType {
  /** The currently authenticated user, or null if not logged in */
  user: User | null;
  /** Whether a user is currently authenticated */
  isAuthenticated: boolean;
  /** Whether the auth state is currently loading (checking session) */
  isLoading: boolean;
  /** Authenticates a user with email and password. Returns true on success. */
  login: (email: string, password: string) => Promise<boolean>;
  /** Signs out the current user and clears the stored session */
  logout: () => Promise<void>;
  /** Authenticates a user using biometric verification */
  biometricLogin: () => Promise<boolean>;
  /** Verifies a 6-digit PIN code against the stored PIN */
  verifyPin: (pin: string) => Promise<boolean>;
  /** Whether the user has set a PIN */
  hasPin: boolean;
  /** Stores a new PIN securely */
  setPin: (pin: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

/** Mock user data used for development and demo purposes */
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

/**
 * AuthProvider manages authentication state, session persistence, and PIN verification.
 * Uses expo-secure-store for secure storage of session tokens and PINs.
 * On mount, it checks for an existing session to restore the user's login state.
 *
 * @param children - Child components that will have access to the auth context.
 */
export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasPin, setHasPinState] = useState(false);

  useEffect(() => {
    checkExistingSession();
  }, []);

  /** Checks SecureStore for an existing session and PIN on app startup */
  const checkExistingSession = async () => {
    try {
      const session = await SecureStore.getItemAsync(SESSION_KEY);
      if (session) {
        setUser(JSON.parse(session));
      }
      const pin = await SecureStore.getItemAsync(PIN_KEY);
      setHasPinState(!!pin);
    } catch (error) {
      // Session check failed - user will see login screen
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Authenticates a user with email and password.
   * Simulates an API call with a 1.5 second delay.
   * @param email - User's email address.
   * @param password - User's password.
   * @returns Promise resolving to true if authentication succeeded.
   */
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

  /**
   * Signs out the current user by clearing state and SecureStore session.
   */
  const logout = async () => {
    setUser(null);
    await SecureStore.deleteItemAsync(SESSION_KEY);
  };

  /**
   * Authenticates using device biometrics.
   * Falls back to setting the mock user on success.
   * @returns Promise resolving to true if biometric authentication succeeded.
   */
  const biometricLogin = async (): Promise<boolean> => {
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    setUser(MOCK_USER);
    await SecureStore.setItemAsync(SESSION_KEY, JSON.stringify(MOCK_USER));
    setIsLoading(false);
    return true;
  };

  /**
   * Verifies a 6-digit PIN against the stored PIN.
   * If no PIN is stored, accepts any 6-digit string.
   * @param pin - The 6-digit PIN to verify.
   * @returns Promise resolving to true if the PIN is valid.
   */
  const verifyPin = async (pin: string): Promise<boolean> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    const storedPin = await SecureStore.getItemAsync(PIN_KEY);
    if (storedPin) return pin === storedPin;
    return pin.length === 6; // Default: any 6-digit PIN
  };

  /**
   * Stores a new PIN securely in expo-secure-store.
   * @param pin - The 6-digit PIN to store.
   */
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

/**
 * Hook to access the authentication context.
 * Must be used within an AuthProvider.
 * @throws Error if used outside of AuthProvider.
 * @returns The AuthContextType value with user state and auth methods.
 */
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};
