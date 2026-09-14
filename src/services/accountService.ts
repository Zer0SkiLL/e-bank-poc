import { Account, BalanceHistory } from '../types/account';
import { mockAccounts, mockBalanceHistory } from './mockData';

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

/**
 * Account service providing mock API calls for bank account data.
 * Returns account lists, individual account details, and balance history.
 */
export const accountService = {
  /**
   * Retrieves all mock bank accounts.
   * @returns Promise resolving to an array of Account objects.
   */
  async getAccounts(): Promise<Account[]> {
    await delay(800);
    return [...mockAccounts];
  },

  /**
   * Retrieves details for a specific account by ID.
   * @param accountId - The unique identifier of the account.
   * @returns Promise resolving to the matching Account, or undefined if not found.
   */
  async getAccountDetails(accountId: string): Promise<Account | undefined> {
    await delay(500);
    return mockAccounts.find(a => a.id === accountId);
  },

  /**
   * Retrieves balance history data for chart display.
   * @param accountId - The account ID to fetch history for.
   * @returns Promise resolving to an array of BalanceHistory entries.
   */
  async getBalanceHistory(accountId: string): Promise<BalanceHistory[]> {
    await delay(600);
    return [...mockBalanceHistory];
  },

  /**
   * Calculates the total balance across all mock accounts.
   * @returns The sum of all account balances.
   */
  getTotalBalance(): number {
    return mockAccounts.reduce((sum, acc) => sum + acc.balance, 0);
  },
};
