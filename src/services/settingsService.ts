import { User } from '../types/user';

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

const mockProfile: User = {
  id: 'usr_001',
  email: 'alex.johnson@email.com',
  firstName: 'Alex',
  lastName: 'Johnson',
  phone: '+1 (555) 123-4567',
  avatar: undefined,
};

export const settingsService = {
  async getProfile(): Promise<User> {
    await delay(500);
    return { ...mockProfile };
  },

  async updateProfile(updates: Partial<User>): Promise<User> {
    await delay(1000);
    return { ...mockProfile, ...updates };
  },
};
