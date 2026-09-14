import { Colors, Typography, Spacing, BorderRadius, Shadows } from '../constants';

export const lightTheme = {
  colors: Colors.light,
  typography: Typography,
  spacing: Spacing,
  borderRadius: BorderRadius,
  shadows: Shadows,
  isDark: false,
} as const;

export type Theme = typeof lightTheme;
