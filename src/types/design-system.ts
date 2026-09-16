export interface ColorScale {
  50: string;
  100: string;
  200: string;
  300: string;
  400: string;
  500: string;
  600: string;
  700: string;
  800: string;
  900: string;
}

export interface ColorPalette {
  primary: ColorScale;
  secondary: ColorScale;
  neutral: ColorScale;
  semantic: {
    success: ColorScale;
    warning: ColorScale;
    error: ColorScale;
    info: ColorScale;
  };
}

export interface TypographyToken {
  fontFamily: string;
  fontSize: number;
  fontWeight: string;
  lineHeight: number;
  letterSpacing: number;
}

export interface TypographyScale {
  displayLarge: TypographyToken;
  displayMedium: TypographyToken;
  displaySmall: TypographyToken;
  headlineLarge: TypographyToken;
  headlineMedium: TypographyToken;
  headlineSmall: TypographyToken;
  titleLarge: TypographyToken;
  titleMedium: TypographyToken;
  titleSmall: TypographyToken;
  bodyLarge: TypographyToken;
  bodyMedium: TypographyToken;
  bodySmall: TypographyToken;
  labelLarge: TypographyToken;
  labelMedium: TypographyToken;
  labelSmall: TypographyToken;
}

export interface SpacingScale {
  none: number;
  xs: number;
  sm: number;
  md: number;
  lg: number;
  xl: number;
  '2xl': number;
  '3xl': number;
  '4xl': number;
  '5xl': number;
}

export interface BorderRadiusScale {
  none: number;
  sm: number;
  md: number;
  lg: number;
  xl: number;
  '2xl': number;
  full: number;
}

export interface PlatformShadow {
  shadowColor: string;
  shadowOffset: { width: number; height: number };
  shadowOpacity: number;
  shadowRadius: number;
  elevation: number;
}

export interface ShadowScale {
  sm: PlatformShadow;
  md: PlatformShadow;
  lg: PlatformShadow;
}

export interface Breakpoints {
  xs: number;
  sm: number;
  md: number;
  lg: number;
  xl: number;
}

export interface ZIndex {
  hide: number;
  base: number;
  dropdown: number;
  sticky: number;
  overlay: number;
  modal: number;
  popover: number;
  toast: number;
  tooltip: number;
}

export interface Animation {
  duration: {
    instant: number;
    fast: number;
    normal: number;
    slow: number;
  };
  easing: {
    ease: string;
    easeIn: string;
    easeOut: string;
    easeInOut: string;
    linear: string;
  };
}

export interface ComponentVariant<T extends string = string> {
  base: string;
  variants: Record<T, {
    container?: Record<string, unknown>;
    label?: Record<string, unknown>;
  }>;
  sizes: {
    sm: Record<string, unknown>;
    md: Record<string, unknown>;
    lg: Record<string, unknown>;
  };
}

export interface ComponentVariants {
  button: ComponentVariant<'primary' | 'secondary' | 'outline' | 'ghost' | 'danger'>;
  input: ComponentVariant<'outlined' | 'filled' | 'underlined'>;
  card: ComponentVariant<'elevated' | 'outlined' | 'filled'>;
  badge: ComponentVariant<'success' | 'warning' | 'error' | 'info' | 'neutral'>;
}

export interface DesignTokens {
  colors: ColorPalette;
  typography: TypographyScale;
  spacing: SpacingScale;
  borderRadius: BorderRadiusScale;
  shadows: ShadowScale;
  breakpoints: Breakpoints;
  zIndex: ZIndex;
  animation: Animation;
  components: ComponentVariants;
}
