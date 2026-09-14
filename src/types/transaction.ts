export type TransactionType = 'credit' | 'debit';
export type TransactionStatus = 'completed' | 'pending' | 'failed' | 'cancelled';
export type TransactionCategory = 
  | 'food' | 'transport' | 'shopping' | 'entertainment'
  | 'bills' | 'salary' | 'transfer' | 'health'
  | 'education' | 'groceries' | 'coffee' | 'fitness'
  | 'travel' | 'utilities' | 'subscription' | 'other';

export interface Transaction {
  id: string;
  accountId: string;
  type: TransactionType;
  amount: number;
  currency: string;
  description: string;
  category: TransactionCategory;
  status: TransactionStatus;
  date: string;
  time: string;
  reference: string;
  merchant?: string;
  notes?: string;
  counterparty?: {
    name: string;
    avatar?: string;
    accountNumber?: string;
  };
}

export interface TransactionFilter {
  search?: string;
  category?: TransactionCategory;
  type?: TransactionType;
  dateFrom?: string;
  dateTo?: string;
  amountMin?: number;
  amountMax?: number;
  accountId?: string;
}
