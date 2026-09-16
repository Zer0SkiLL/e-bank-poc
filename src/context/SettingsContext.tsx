import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { StorageService } from '../services/storageService';

export interface NotificationSettings {
  pushEnabled: boolean;
  emailEnabled: boolean;
  inAppEnabled: boolean;
}

export interface SecuritySettings {
  biometricEnabled: boolean;
  pinEnabled: boolean;
  autoLockTimeout: number; // minutes, 0 = disabled
}

export interface DisplaySettings {
  themePreference: 'light' | 'dark' | 'system';
  fontSize: 'small' | 'medium' | 'large';
  currencyFormat: string; // ISO 4217 currency code
}

export interface AppSettings {
  language: string;
  hapticFeedback: boolean;
}

export interface AllSettings {
  notifications: NotificationSettings;
  security: SecuritySettings;
  display: DisplaySettings;
  app: AppSettings;
}

export interface SettingsContextValue {
  settings: AllSettings;
  updateNotificationSettings: (updates: Partial<NotificationSettings>) => void;
  updateSecuritySettings: (updates: Partial<SecuritySettings>) => void;
  updateDisplaySettings: (updates: Partial<DisplaySettings>) => void;
  updateAppSettings: (updates: Partial<AppSettings>) => void;
  resetSettings: () => void;
  isLoading: boolean;
}

const SettingsContext = createContext<SettingsContextValue | null>(null);

const STORAGE_KEY = 'app_settings';

const DEFAULT_SETTINGS: AllSettings = {
  notifications: {
    pushEnabled: true,
    emailEnabled: true,
    inAppEnabled: true,
  },
  security: {
    biometricEnabled: false,
    pinEnabled: false,
    autoLockTimeout: 5,
  },
  display: {
    themePreference: 'system',
    fontSize: 'medium',
    currencyFormat: 'USD',
  },
  app: {
    language: 'en',
    hapticFeedback: true,
  },
};

export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = useState<AllSettings>(DEFAULT_SETTINGS);
  const [isLoading, setIsLoading] = useState(true);

  // Load settings on mount
  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const stored = await StorageService.getSecureItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored) as Partial<AllSettings>;
        setSettings((prev) => deepMerge(prev, parsed));
      }
    } catch {
      // Use defaults on error
    } finally {
      setIsLoading(false);
    }
  };

  const persistSettings = async (updated: AllSettings) => {
    try {
      await StorageService.setSecureItem(STORAGE_KEY, JSON.stringify(updated));
    } catch {
      // Silently fail persistence - settings still work in memory
    }
  };

  const updateNotificationSettings = useCallback(
    (updates: Partial<NotificationSettings>) => {
      setSettings((prev) => {
        const updated = {
          ...prev,
          notifications: { ...prev.notifications, ...updates },
        };
        persistSettings(updated);
        return updated;
      });
    },
    []
  );

  const updateSecuritySettings = useCallback(
    (updates: Partial<SecuritySettings>) => {
      setSettings((prev) => {
        const updated = {
          ...prev,
          security: { ...prev.security, ...updates },
        };
        persistSettings(updated);
        return updated;
      });
    },
    []
  );

  const updateDisplaySettings = useCallback(
    (updates: Partial<DisplaySettings>) => {
      setSettings((prev) => {
        const updated = {
          ...prev,
          display: { ...prev.display, ...updates },
        };
        persistSettings(updated);
        return updated;
      });
    },
    []
  );

  const updateAppSettings = useCallback(
    (updates: Partial<AppSettings>) => {
      setSettings((prev) => {
        const updated = {
          ...prev,
          app: { ...prev.app, ...updates },
        };
        persistSettings(updated);
        return updated;
      });
    },
    []
  );

  const resetSettings = useCallback(() => {
    setSettings(DEFAULT_SETTINGS);
    persistSettings(DEFAULT_SETTINGS);
  }, []);

  const value: SettingsContextValue = {
    settings,
    updateNotificationSettings,
    updateSecuritySettings,
    updateDisplaySettings,
    updateAppSettings,
    resetSettings,
    isLoading,
  };

  return (
    <SettingsContext.Provider value={value}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings(): SettingsContextValue {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
}

// Deep merge utility for settings
function deepMerge<T extends Record<string, unknown>>(target: T, source: Partial<T>): T {
  const result = { ...target };
  for (const key in source) {
    if (
      source[key] &&
      typeof source[key] === 'object' &&
      !Array.isArray(source[key]) &&
      target[key] &&
      typeof target[key] === 'object'
    ) {
      (result as Record<string, unknown>)[key] = deepMerge(
        target[key] as Record<string, unknown>,
        source[key] as Record<string, unknown>
      );
    } else if (source[key] !== undefined) {
      result[key] = source[key] as T[Extract<keyof T, string>];
    }
  }
  return result;
}
