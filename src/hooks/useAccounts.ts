import { useState, useEffect, useCallback } from 'react';
import { accountService } from '../services/accountService';
import { Account } from '../types';

export const useAccounts = () => {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadAccounts = useCallback(async () => {
    try {
      setIsLoading(true);
      const data = await accountService.getAccounts();
      setAccounts(data);
      setError(null);
    } catch (err) {
      setError('Failed to load accounts');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadAccounts();
  }, [loadAccounts]);

  const totalBalance = accounts.reduce((sum, acc) => sum + acc.balance, 0);

  return { accounts, totalBalance, isLoading, error, refresh: loadAccounts };
};
