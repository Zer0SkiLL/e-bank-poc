import * as SecureStore from 'expo-secure-store';

const SERVICE_NAME = 'com.ebank.app';

export const StorageService = {
  async setSecureItem(key: string, value: string): Promise<boolean> {
    try {
      await SecureStore.setItemAsync(`${SERVICE_NAME}.${key}`, value);
      return true;
    } catch {
      return false;
    }
  },

  async getSecureItem(key: string): Promise<string | null> {
    try {
      return await SecureStore.getItemAsync(`${SERVICE_NAME}.${key}`);
    } catch {
      return null;
    }
  },

  async removeSecureItem(key: string): Promise<boolean> {
    try {
      await SecureStore.deleteItemAsync(`${SERVICE_NAME}.${key}`);
      return true;
    } catch {
      return false;
    }
  },

  async clearAll(): Promise<void> {
    try {
      // expo-secure-store doesn't have a clearAll, so we remove known keys
      await SecureStore.deleteItemAsync(`${SERVICE_NAME}.auth_token`);
      await SecureStore.deleteItemAsync(`${SERVICE_NAME}.user_pin`);
      await SecureStore.deleteItemAsync(`${SERVICE_NAME}.refresh_token`);
      await SecureStore.deleteItemAsync('auth_session');
      await SecureStore.deleteItemAsync('user_pin');
    } catch {
      // Best effort
    }
  },
};
