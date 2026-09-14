export type AccountType = 'checking' | 'savings' | 'credit' | 'investment';
export type Currency = 'USD' | 'EUR' | 'GBP';

export interface Account {
  id: string;
  name: string;
  type: AccountType;
  number: string; // masked account number
  balance: number;
  availableBalance: number;
  currency: Currency;
  isActive: boolean;
  color?: string;
  icon?: string;
  createdAt: string;
}

export interface BalanceHistory {
  date: string;
  balance: number;
}
