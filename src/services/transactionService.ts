import { Transaction, TransactionFilter } from '../types/transaction';
import { mockTransactions } from './mockData';

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const transactionService = {
  async getTransactions(filter?: TransactionFilter, page: number = 1, limit: number = 20): Promise<Transaction[]> {
    await delay(800);
    let filtered = [...mockTransactions];

    if (filter) {
      if (filter.search) {
        const search = filter.search.toLowerCase();
        filtered = filtered.filter(t => 
          t.description.toLowerCase().includes(search) ||
          t.category.toLowerCase().includes(search) ||
          (t.merchant && t.merchant.toLowerCase().includes(search))
        );
      }
      if (filter.category) {
        filtered = filtered.filter(t => t.category === filter.category);
      }
      if (filter.type) {
        filtered = filtered.filter(t => t.type === filter.type);
      }
      if (filter.accountId) {
        filtered = filtered.filter(t => t.accountId === filter.accountId);
      }
      if (filter.amountMin !== undefined) {
        filtered = filtered.filter(t => t.amount >= filter.amountMin!);
      }
      if (filter.amountMax !== undefined) {
        filtered = filtered.filter(t => t.amount <= filter.amountMax!);
      }
    }

    filtered.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    return filtered.slice(0, page * limit);
  },

  async getTransactionDetails(transactionId: string): Promise<Transaction | undefined> {
    await delay(400);
    return mockTransactions.find(t => t.id === transactionId);
  },

  async getTransactionsByAccount(accountId: string): Promise<Transaction[]> {
    await delay(600);
    return mockTransactions
      .filter(t => t.accountId === accountId)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  },
};
