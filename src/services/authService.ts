import * as SecureStore from 'expo-secure-store';
import * as LocalAuthentication from 'expo-local-authentication';

/**
 * Authentication service handling biometric login and secure credential storage.
 * Uses expo-local-authentication for biometric verification and expo-secure-store
 * for secure token persistence.
 */
export const authService = {
  /**
   * Checks whether the device supports biometric authentication
   * and whether the user has enrolled biometrics.
   * @returns Promise resolving to true if biometrics are available and enrolled.
   */
  async biometricAvailable(): Promise<boolean> {
    try {
      const hasHardware = await LocalAuthentication.hasHardwareAsync();
      const isEnrolled = await LocalAuthentication.isEnrolledAsync();
      return hasHardware && isEnrolled;
    } catch {
      return false;
    }
  },

  /**
   * Triggers the native biometric authentication prompt.
   * @returns Promise resolving to true if the user successfully authenticated.
   */
  async authenticateWithBiometrics(): Promise<boolean> {
    try {
      const result = await LocalAuthentication.authenticateAsync({
        promptMessage: 'Authenticate to continue',
        cancelLabel: 'Cancel',
        disableDeviceFallback: false,
      });
      return result.success;
    } catch {
      return false;
    }
  },
};
