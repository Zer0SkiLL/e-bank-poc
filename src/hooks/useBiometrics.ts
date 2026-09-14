import { useState, useEffect } from 'react';
import { authService } from '../services/authService';

export const useBiometrics = () => {
  const [isAvailable, setIsAvailable] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkBiometrics = async () => {
      try {
        const available = await authService.biometricAvailable();
        setIsAvailable(available);
      } catch {
        setIsAvailable(false);
      } finally {
        setIsLoading(false);
      }
    };
    checkBiometrics();
  }, []);

  const authenticate = async (): Promise<boolean> => {
    return authService.authenticateWithBiometrics();
  };

  return { isAvailable, isLoading, authenticate };
};
