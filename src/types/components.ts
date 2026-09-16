import type { StyleProp, ViewStyle, TextStyle } from 'react-native';
import type { ReactNode } from 'react';

export interface BaseComponentProps {
  style?: StyleProp<ViewStyle>;
  testID?: string;
  accessible?: boolean;
  accessibilityLabel?: string;
  accessibilityHint?: string;
  accessibilityRole?: string;
  accessibilityState?: {
    disabled?: boolean;
    selected?: boolean;
    checked?: boolean | 'mixed';
    busy?: boolean;
    expanded?: boolean;
  };
}

export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
export type ButtonSize = 'sm' | 'md' | 'lg';

export interface ButtonProps extends BaseComponentProps {
  title: string;
  onPress: () => void;
  variant?: ButtonVariant;
  size?: ButtonSize;
  disabled?: boolean;
  loading?: boolean;
  icon?: string;
  iconPosition?: 'left' | 'right';
  fullWidth?: boolean;
}

export type CardVariant = 'elevated' | 'outlined' | 'filled';

export interface CardProps extends BaseComponentProps {
  variant?: CardVariant;
  padding?: number;
  margin?: number;
  onPress?: () => void;
  children: ReactNode;
}

export type InputVariant = 'outlined' | 'filled' | 'underlined';

export interface InputProps extends BaseComponentProps {
  label?: string;
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  variant?: InputVariant;
  secureTextEntry?: boolean;
  keyboardType?: 'default' | 'email-address' | 'numeric' | 'phone-pad';
  autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
  editable?: boolean;
  multiline?: boolean;
  numberOfLines?: number;
  maxLength?: number;
  error?: string;
  helperText?: string;
  leftIcon?: string;
  rightIcon?: string;
  onRightIconPress?: () => void;
}

export interface IconProps extends BaseComponentProps {
  name: string;
  size?: number;
  color?: string;
  family?: 'material' | 'ionicons' | 'fontawesome';
}

export type BadgeVariant = 'success' | 'warning' | 'error' | 'info' | 'neutral';

export interface BadgeProps extends BaseComponentProps {
  label: string;
  variant?: BadgeVariant;
  size?: 'sm' | 'md' | 'lg';
  dot?: boolean;
}

export interface AvatarProps extends BaseComponentProps {
  uri?: string;
  initials?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  fallbackIcon?: string;
}

export interface DividerProps extends BaseComponentProps {
  color?: string;
  thickness?: number;
  margin?: number;
  orientation?: 'horizontal' | 'vertical';
}

export interface EnhancedTouchableOpacityProps extends BaseComponentProps {
  onPress?: () => void;
  onLongPress?: () => void;
  disabled?: boolean;
  hitSlop?: { top: number; bottom: number; left: number; right: number };
  delayPressIn?: number;
  delayPressOut?: number;
  activeOpacity?: number;
  children: ReactNode;
}
