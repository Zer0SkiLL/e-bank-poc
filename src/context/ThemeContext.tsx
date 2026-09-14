import React, { createContext, useState, useContext, ReactNode } from 'react';
import { useColorScheme } from 'react-native';
import { Colors, ColorScheme } from '../constants';

/** Shape of the ThemeContext value provided to consuming components */
interface ThemeContextType {
  /** Whether the current resolved theme is dark mode */
  isDark: boolean;
  /** The active color palette (light or dark variant) */
  colors: typeof Colors.light;
  /** Toggles between light and dark theme (resolves system preference when in system mode) */
  toggleTheme: () => void;
  /** Sets the color scheme preference to light, dark, or system */
  setColorScheme: (scheme: 'light' | 'dark' | 'system') => void;
  /** The current color scheme preference */
  colorSchemePreference: 'light' | 'dark' | 'system';
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

/**
 * ThemeProvider manages the application's color scheme state.
 * Supports light, dark, and system-follow modes.
 * Uses React's useColorScheme to detect the system preference when in 'system' mode.
 *
 * @param children - Child components that will have access to the theme context.
 */
export const ThemeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const systemColorScheme = useColorScheme();
  const [colorSchemePreference, setColorSchemePreference] = useState<'light' | 'dark' | 'system'>('system');

  const isDark = colorSchemePreference === 'system'
    ? systemColorScheme === 'dark'
    : colorSchemePreference === 'dark';

  const colors = isDark ? Colors.dark : Colors.light;

  const toggleTheme = () => {
    setColorSchemePreference(prev => {
      if (prev === 'light') return 'dark';
      if (prev === 'dark') return 'light';
      return systemColorScheme === 'dark' ? 'light' : 'dark';
    });
  };

  const setColorScheme = (scheme: 'light' | 'dark' | 'system') => {
    setColorSchemePreference(scheme);
  };

  return (
    <ThemeContext.Provider value={{ isDark, colors, toggleTheme, setColorScheme, colorSchemePreference }}>
      {children}
    </ThemeContext.Provider>
  );
};

/**
 * Hook to access the theme context.
 * Must be used within a ThemeProvider.
 * @throws Error if used outside of ThemeProvider.
 * @returns The ThemeContextType value with isDark, colors, toggleTheme, and setColorScheme.
 */
export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (!context) throw new Error('useTheme must be used within ThemeProvider');
  return context;
};
