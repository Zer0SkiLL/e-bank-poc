// === Design System Types ===
export type {
  ColorScale,
  ColorPalette,
  TypographyToken,
  TypographyScale,
  SpacingScale,
  BorderRadiusScale,
  PlatformShadow,
  ShadowScale,
  Breakpoints,
  ZIndex,
  Animation,
  ComponentVariant,
  ComponentVariants,
  DesignTokens,
} from '../types/design-system';

export type {
  Theme,
  ThemeColors,
  ThemeContextValue,
  ColorScheme,
  ThemePreference,
  UseThemeReturn,
} from '../types/theme';

export type {
  BaseComponentProps,
  ButtonProps,
  ButtonVariant,
  ButtonSize,
  CardProps,
  CardVariant,
  InputProps,
  InputVariant,
  IconProps,
  BadgeProps,
  BadgeVariant,
  AvatarProps,
  DividerProps,
  EnhancedTouchableOpacityProps,
} from '../types/components';

// === Theme Instances ===
export { lightTheme } from '../theme/lightTheme';
export { darkTheme } from '../theme/darkTheme';

// === Design Tokens ===
export { Colors, Typography, Spacing, BorderRadius, Shadows } from '../constants';
export { semanticTokens, componentTokens } from '../constants/designSystem';

// === Hooks ===
export { useTypedTheme, createThemedStyles } from '../hooks/useTypedTheme';

// === Contexts ===
export { NotificationProvider, useNotification } from '../context/NotificationContext';
export type {
  NotificationType,
  Notification,
  ShowNotificationParams,
  NotificationContextValue,
} from '../context/NotificationContext';

export { SettingsProvider, useSettings } from '../context/SettingsContext';
export type {
  NotificationSettings,
  SecuritySettings,
  DisplaySettings,
  AppSettings,
  AllSettings,
  SettingsContextValue,
} from '../context/SettingsContext';
