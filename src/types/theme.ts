import type { DesignTokens, ColorPalette } from './design-system';

export type ColorScheme = 'light' | 'dark' | 'system';

export interface ThemeColors {
  // Core palette groups
  primary: string;
  primaryLight: string;
  primaryDark: string;
  secondary: string;
  secondaryLight: string;
  secondaryDark: string;

  // Neutral
  background: string;
  surface: string;
  card: string;
  border: string;
  inputBackground: string;
  overlay: string;

  // Text
  text: string;
  textSecondary: string;
  textLight: string;

  // Semantic
  success: string;
  successLight: string;
  error: string;
  errorLight: string;
  warning: string;
  warningLight: string;
  info: string;
  infoLight: string;

  // Status bar
  statusBar: 'light-content' | 'dark-content';

  // Tab bar
  tabActive: string;
  tabInactive: string;
  tabBackground: string;
}

export interface Theme extends DesignTokens {
  colors: ThemeColors;
  isDark: boolean;
}

export interface ThemePreference {
  colorScheme: ColorScheme;
  fontSize: 'small' | 'medium' | 'large';
  currencyFormat: string;
  reducedMotion: boolean;
}

export interface ThemeContextValue {
  theme: Theme;
  isDark: boolean;
  colorSchemePreference: ColorScheme;
  toggleTheme: () => void;
  setColorScheme: (scheme: ColorScheme) => void;
  isLoading: boolean;
}

export type UseThemeReturn = ThemeContextValue;
