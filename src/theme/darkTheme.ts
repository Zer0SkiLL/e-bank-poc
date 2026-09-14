import { Colors, Typography, Spacing, BorderRadius, Shadows } from '../constants';

export const darkTheme = {
  colors: Colors.dark,
  typography: Typography,
  spacing: Spacing,
  borderRadius: BorderRadius,
  shadows: Shadows,
  isDark: true,
} as const;

export type DarkTheme = typeof darkTheme;
