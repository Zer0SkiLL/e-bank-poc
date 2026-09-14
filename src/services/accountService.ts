import { Account, BalanceHistory } from '../types/account';
import { mockAccounts, mockBalanceHistory } from './mockData';

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const accountService = {
  async getAccounts(): Promise<Account[]> {
    await delay(800);
    return [...mockAccounts];
  },

  async getAccountDetails(accountId: string): Promise<Account | undefined> {
    await delay(500);
    return mockAccounts.find(a => a.id === accountId);
  },

  async getBalanceHistory(accountId: string): Promise<BalanceHistory[]> {
    await delay(600);
    return [...mockBalanceHistory];
  },

  getTotalBalance(): number {
    return mockAccounts.reduce((sum, acc) => sum + acc.balance, 0);
  },
};
