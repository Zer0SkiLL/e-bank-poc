import { StyleSheet } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { lightTheme } from '../theme/lightTheme';
import { darkTheme } from '../theme/darkTheme';
import type { Theme } from '../types/theme';

/**
 * Typed theme hook that provides the full Theme object with all design tokens.
 * Wraps the existing ThemeContext's useTheme and merges in typography, spacing, etc.
 */
export function useTypedTheme(): Theme {
  const { isDark } = useTheme();
  const baseTheme = isDark ? darkTheme : lightTheme;

  return {
    ...baseTheme,
    isDark,
  } as Theme;
}

/**
 * Helper to create static (non-themed) styles.
 * Takes a plain StyleSheet object — no hook needed, safe to use anywhere.
 *
 * @example
 * const styles = createStaticStyles({
 *   container: { padding: 16, margin: 8 },
 * });
 */
export function createStaticStyles<T extends Record<string, unknown>>(
  styles: T,
): T {
  return StyleSheet.create(styles) as T;
}

/**
 * Helper to create type-safe themed styles.
 * Takes a function that receives the full Theme and returns a styles object.
 * Always calls useTypedTheme() unconditionally (no conditional hook invocation).
 *
 * Must be called inside a React component or custom hook.
 *
 * @example
 * const styles = createThemedStyles((theme) => ({
 *   container: { backgroundColor: theme.colors.background },
 * }));
 */
export function createThemedStyles<T extends Record<string, unknown>>(
  styles: (theme: Theme) => T,
): T {
  const theme = useTypedTheme();
  return StyleSheet.create(styles(theme)) as T;
}

/**
 * Convenience helper — alias for createThemedStyles.
 * Use this in components for cleaner call sites.
 *
 * @example
 * const styles = themedStyles((theme) => ({
 *   container: { backgroundColor: theme.colors.background },
 * }));
 */
export const themedStyles = createThemedStyles;
