import { useState, useEffect, useCallback } from 'react';
import { transactionService } from '../services/transactionService';
import { Transaction, TransactionFilter } from '../types';

export const useTransactions = (filter?: TransactionFilter) => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadTransactions = useCallback(async () => {
    try {
      setIsLoading(true);
      const data = await transactionService.getTransactions(filter);
      setTransactions(data);
      setError(null);
    } catch (err) {
      setError('Failed to load transactions');
    } finally {
      setIsLoading(false);
    }
  }, [filter]);

  useEffect(() => {
    loadTransactions();
  }, [loadTransactions]);

  return { transactions, isLoading, error, refresh: loadTransactions };
};
