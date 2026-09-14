import { Transaction } from '../types';

export const groupByDate = (transactions: Transaction[]): Record<string, Transaction[]> => {
  const groups: Record<string, Transaction[]> = {};
  for (const txn of transactions) {
    const date = txn.date;
    if (!groups[date]) groups[date] = [];
    groups[date].push(txn);
  }
  return groups;
};

export const sleep = (ms: number): Promise<void> => new Promise(resolve => setTimeout(resolve, ms));

export const generateId = (): string => {
  return `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};
