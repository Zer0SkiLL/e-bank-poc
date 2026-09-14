import React, { createContext, useState, useContext, ReactNode } from 'react';
import { useColorScheme } from 'react-native';
import { Colors, ColorScheme } from '../constants';

interface ThemeContextType {
  isDark: boolean;
  colors: typeof Colors.light;
  toggleTheme: () => void;
  setColorScheme: (scheme: 'light' | 'dark' | 'system') => void;
  colorSchemePreference: 'light' | 'dark' | 'system';
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

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

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (!context) throw new Error('useTheme must be used within ThemeProvider');
  return context;
};
