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

/**
 * Settings service providing mock API calls for user profile management.
 * Supports retrieving and updating user profile information.
 */
export const settingsService = {
  /**
   * Retrieves the current user's profile information.
   * @returns Promise resolving to a User object with the current profile data.
   */
  async getProfile(): Promise<User> {
    await delay(500);
    return { ...mockProfile };
  },

  /**
   * Updates the user's profile with the provided fields.
   * @param updates - Partial User object containing fields to update.
   * @returns Promise resolving to the updated User object.
   */
  async updateProfile(updates: Partial<User>): Promise<User> {
    await delay(1000);
    return { ...mockProfile, ...updates };
  },
};
