import { NavigatorScreenParams } from '@react-navigation/native';
import { Transaction, TransactionFilter } from './transaction';
import { Account } from './account';
import { Recipient } from './payment';

export type AuthStackParamList = {
  Login: undefined;
  PinEntry: undefined;
};

export type MainTabParamList = {
  Home: NavigatorScreenParams<DashboardStackParamList>;
  Accounts: NavigatorScreenParams<AccountsStackParamList>;
  Payments: NavigatorScreenParams<PaymentsStackParamList>;
  Transactions: NavigatorScreenParams<TransactionsStackParamList>;
  Settings: NavigatorScreenParams<SettingsStackParamList>;
};

export type DashboardStackParamList = {
  Dashboard: undefined;
};

export type AccountsStackParamList = {
  AccountList: undefined;
  AccountDetails: { account: Account };
};

export type TransactionsStackParamList = {
  TransactionList: { filter?: TransactionFilter; accountId?: string } | undefined;
  TransactionDetail: { transaction: Transaction };
};

export type PaymentsStackParamList = {
  SendMoney: undefined;
  PaymentConfirmation: {
    fromAccountId: string;
    recipientId: string;
    amount: number;
    note?: string;
  };
  PaymentSuccess: {
    transactionId: string;
    amount: number;
    recipientName: string;
    date: string;
  };
  PaymentFailed: {
    message: string;
  };
};

export type SettingsStackParamList = {
  SettingsMain: undefined;
};
