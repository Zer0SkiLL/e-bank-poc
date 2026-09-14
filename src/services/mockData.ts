import { Account, BalanceHistory } from '../types/account';
import { Transaction, TransactionCategory } from '../types/transaction';
import { Recipient } from '../types/payment';

export const mockAccounts: Account[] = [
  {
    id: 'acc_001',
    name: 'Main Checking',
    type: 'checking',
    number: '****4521',
    balance: 12458.67,
    availableBalance: 12458.67,
    currency: 'USD',
    isActive: true,
    color: '#6C63FF',
    icon: 'wallet',
    createdAt: '2021-03-15',
  },
  {
    id: 'acc_002',
    name: 'Premium Savings',
    type: 'savings',
    number: '****7832',
    balance: 45230.15,
    availableBalance: 45230.15,
    currency: 'USD',
    isActive: true,
    color: '#00C9A7',
    icon: 'piggy-bank',
    createdAt: '2021-06-20',
  },
  {
    id: 'acc_003',
    name: 'Travel Credit Card',
    type: 'credit',
    number: '****9103',
    balance: -2340.50,
    availableBalance: 7659.50,
    currency: 'USD',
    isActive: true,
    color: '#F59E0B',
    icon: 'credit-card',
    createdAt: '2022-01-10',
  },
  {
    id: 'acc_004',
    name: 'Investment Portfolio',
    type: 'investment',
    number: '****5567',
    balance: 28945.80,
    availableBalance: 28945.80,
    currency: 'USD',
    isActive: true,
    color: '#8B5CF6',
    icon: 'trending-up',
    createdAt: '2022-08-05',
  },
];

export const mockRecipients: Recipient[] = [
  { id: 'rec_001', name: 'Sarah Chen', email: 'sarah.chen@email.com', phone: '+1 555-234-5678', isFavorite: true, avatar: undefined },
  { id: 'rec_002', name: 'Marcus Williams', email: 'marcus.w@email.com', phone: '+1 555-345-6789', isFavorite: true, avatar: undefined },
  { id: 'rec_003', name: 'Emma Rodriguez', email: 'emma.r@email.com', phone: '+1 555-456-7890', isFavorite: false, avatar: undefined },
  { id: 'rec_004', name: "James O'Brien", email: 'james.ob@email.com', phone: '+1 555-567-8901', isFavorite: false, avatar: undefined },
  { id: 'rec_005', name: 'Priya Patel', email: 'priya.p@email.com', phone: '+1 555-678-9012', isFavorite: true, avatar: undefined },
  { id: 'rec_006', name: 'David Kim', email: 'david.kim@email.com', phone: '+1 555-789-0123', isFavorite: false, avatar: undefined },
  { id: 'rec_007', name: 'Lisa Thompson', email: 'lisa.t@email.com', phone: '+1 555-890-1234', isFavorite: false, avatar: undefined },
  { id: 'rec_008', name: 'Ahmed Hassan', email: 'ahmed.h@email.com', phone: '+1 555-901-2345', isFavorite: false, avatar: undefined },
  { id: 'rec_009', name: 'Rachel Green', email: 'rachel.g@email.com', phone: '+1 555-012-3456', isFavorite: true, avatar: undefined },
  { id: 'rec_010', name: 'Michael Brown', email: 'michael.b@email.com', phone: '+1 555-123-4567', isFavorite: false, avatar: undefined },
];

// Helper to generate dates relative to today
const d = (daysAgo: number, hours: number = 12) => {
  const date = new Date();
  date.setDate(date.getDate() - daysAgo);
  date.setHours(hours, Math.floor(Math.random() * 60), 0, 0);
  return {
    date: date.toISOString().split('T')[0],
    time: date.toTimeString().split(' ')[0].substring(0, 5),
  };
};

export const mockTransactions: Transaction[] = [
  // Today
  { id: 'txn_001', accountId: 'acc_001', type: 'debit', amount: 4.75, currency: 'USD', description: 'Starbucks Coffee', category: 'coffee', status: 'completed', ...d(0, 8), reference: 'REF-001', merchant: 'Starbucks' },
  { id: 'txn_002', accountId: 'acc_001', type: 'credit', amount: 3200.00, currency: 'USD', description: 'Salary Deposit', category: 'salary', status: 'completed', ...d(0, 6), reference: 'REF-002', counterparty: { name: 'TechCorp Inc.' } },
  { id: 'txn_003', accountId: 'acc_003', type: 'debit', amount: 89.99, currency: 'USD', description: 'Amazon Purchase', category: 'shopping', status: 'completed', ...d(0, 14), reference: 'REF-003', merchant: 'Amazon' },

  // Yesterday
  { id: 'txn_004', accountId: 'acc_001', type: 'debit', amount: 42.50, currency: 'USD', description: 'Uber Ride', category: 'transport', status: 'completed', ...d(1, 19), reference: 'REF-004', merchant: 'Uber' },
  { id: 'txn_005', accountId: 'acc_001', type: 'debit', amount: 67.30, currency: 'USD', description: 'Whole Foods Market', category: 'groceries', status: 'completed', ...d(1, 17), reference: 'REF-005', merchant: 'Whole Foods' },
  { id: 'txn_006', accountId: 'acc_003', type: 'debit', amount: 15.99, currency: 'USD', description: 'Netflix Subscription', category: 'subscription', status: 'completed', ...d(1, 10), reference: 'REF-006', merchant: 'Netflix' },

  // 2-3 days ago
  { id: 'txn_007', accountId: 'acc_001', type: 'debit', amount: 125.00, currency: 'USD', description: 'Electric Bill Payment', category: 'utilities', status: 'completed', ...d(2, 11), reference: 'REF-007', merchant: 'City Power Co.' },
  { id: 'txn_008', accountId: 'acc_001', type: 'credit', amount: 500.00, currency: 'USD', description: 'Transfer to Savings', category: 'transfer', status: 'completed', ...d(2, 15), reference: 'REF-008', counterparty: { name: 'Premium Savings ****7832' } },
  { id: 'txn_009', accountId: 'acc_003', type: 'debit', amount: 35.00, currency: 'USD', description: 'Spotify Premium', category: 'subscription', status: 'completed', ...d(3, 9), reference: 'REF-009', merchant: 'Spotify' },
  { id: 'txn_010', accountId: 'acc_001', type: 'debit', amount: 22.40, currency: 'USD', description: 'Chipotle Lunch', category: 'food', status: 'completed', ...d(3, 13), reference: 'REF-010', merchant: 'Chipotle' },
  { id: 'txn_011', accountId: 'acc_003', type: 'debit', amount: 156.78, currency: 'USD', description: 'Nike Running Shoes', category: 'shopping', status: 'completed', ...d(3, 16), reference: 'REF-011', merchant: 'Nike Store' },

  // This week (4-7 days ago)
  { id: 'txn_012', accountId: 'acc_001', type: 'debit', amount: 12.99, currency: 'USD', description: 'Movie Theater', category: 'entertainment', status: 'completed', ...d(4, 20), reference: 'REF-012', merchant: 'AMC Cinemas' },
  { id: 'txn_013', accountId: 'acc_001', type: 'credit', amount: 150.00, currency: 'USD', description: 'Cashback Reward', category: 'other', status: 'completed', ...d(4, 10), reference: 'REF-013' },
  { id: 'txn_014', accountId: 'acc_003', type: 'debit', amount: 890.00, currency: 'USD', description: 'Flight to New York', category: 'travel', status: 'completed', ...d(5, 14), reference: 'REF-014', merchant: 'Delta Airlines' },
  { id: 'txn_015', accountId: 'acc_001', type: 'debit', amount: 55.00, currency: 'USD', description: 'Gym Membership', category: 'fitness', status: 'completed', ...d(5, 8), reference: 'REF-015', merchant: 'FitLife Gym' },
  { id: 'txn_016', accountId: 'acc_001', type: 'debit', amount: 34.20, currency: 'USD', description: 'Gas Station', category: 'transport', status: 'completed', ...d(6, 18), reference: 'REF-016', merchant: 'Shell' },
  { id: 'txn_017', accountId: 'acc_003', type: 'debit', amount: 199.99, currency: 'USD', description: 'iPad Case from Apple', category: 'shopping', status: 'completed', ...d(7, 12), reference: 'REF-017', merchant: 'Apple Store' },
  { id: 'txn_018', accountId: 'acc_001', type: 'debit', amount: 28.50, currency: 'USD', description: 'Pharmacy Purchase', category: 'health', status: 'completed', ...d(7, 15), reference: 'REF-018', merchant: 'CVS Pharmacy' },

  // Last 2 weeks
  { id: 'txn_019', accountId: 'acc_001', type: 'credit', amount: 200.00, currency: 'USD', description: 'Venmo from Marcus', category: 'transfer', status: 'completed', ...d(8, 19), reference: 'REF-019', counterparty: { name: 'Marcus Williams' } },
  { id: 'txn_020', accountId: 'acc_003', type: 'debit', amount: 45.60, currency: 'USD', description: 'DoorDash Order', category: 'food', status: 'completed', ...d(9, 20), reference: 'REF-020', merchant: 'DoorDash' },
  { id: 'txn_021', accountId: 'acc_001', type: 'debit', amount: 85.00, currency: 'USD', description: 'Internet Bill', category: 'utilities', status: 'completed', ...d(10, 10), reference: 'REF-021', merchant: 'Comcast' },
  { id: 'txn_022', accountId: 'acc_001', type: 'debit', amount: 15.40, currency: 'USD', description: 'Parking Garage', category: 'transport', status: 'completed', ...d(10, 14), reference: 'REF-022', merchant: 'City Parking' },
  { id: 'txn_023', accountId: 'acc_003', type: 'debit', amount: 299.00, currency: 'USD', description: 'Best Buy Electronics', category: 'shopping', status: 'completed', ...d(11, 16), reference: 'REF-023', merchant: 'Best Buy' },
  { id: 'txn_024', accountId: 'acc_001', type: 'debit', amount: 8.99, currency: 'USD', description: 'Kindle Book', category: 'education', status: 'completed', ...d(12, 21), reference: 'REF-024', merchant: 'Amazon Kindle' },
  { id: 'txn_025', accountId: 'acc_001', type: 'credit', amount: 500.00, currency: 'USD', description: 'Transfer from Savings', category: 'transfer', status: 'completed', ...d(13, 9), reference: 'REF-025', counterparty: { name: 'Premium Savings ****7832' } },
  { id: 'txn_026', accountId: 'acc_003', type: 'debit', amount: 65.00, currency: 'USD', description: 'Uber Eats Dinner', category: 'food', status: 'completed', ...d(14, 20), reference: 'REF-026', merchant: 'Uber Eats' },

  // Last month
  { id: 'txn_027', accountId: 'acc_001', type: 'credit', amount: 3200.00, currency: 'USD', description: 'Salary Deposit', category: 'salary', status: 'completed', ...d(15, 6), reference: 'REF-027', counterparty: { name: 'TechCorp Inc.' } },
  { id: 'txn_028', accountId: 'acc_001', type: 'debit', amount: 1800.00, currency: 'USD', description: 'Rent Payment', category: 'bills', status: 'completed', ...d(16, 9), reference: 'REF-028', merchant: 'Apartment Complex' },
  { id: 'txn_029', accountId: 'acc_003', type: 'debit', amount: 120.00, currency: 'USD', description: 'Target Shopping', category: 'shopping', status: 'completed', ...d(17, 14), reference: 'REF-029', merchant: 'Target' },
  { id: 'txn_030', accountId: 'acc_001', type: 'debit', amount: 42.00, currency: 'USD', description: 'Doctor Visit Copay', category: 'health', status: 'completed', ...d(18, 11), reference: 'REF-030', merchant: 'City Medical' },
  { id: 'txn_031', accountId: 'acc_003', type: 'debit', amount: 75.50, currency: 'USD', description: 'Concert Tickets', category: 'entertainment', status: 'completed', ...d(19, 18), reference: 'REF-031', merchant: 'Ticketmaster' },
  { id: 'txn_032', accountId: 'acc_001', type: 'debit', amount: 28.90, currency: 'USD', description: "Trader Joe's", category: 'groceries', status: 'completed', ...d(20, 17), reference: 'REF-032', merchant: "Trader Joe's" },
  { id: 'txn_033', accountId: 'acc_001', type: 'debit', amount: 95.00, currency: 'USD', description: 'Car Insurance', category: 'bills', status: 'completed', ...d(21, 10), reference: 'REF-033', merchant: 'Geico' },
  { id: 'txn_034', accountId: 'acc_003', type: 'debit', amount: 18.50, currency: 'USD', description: 'Lyft Ride', category: 'transport', status: 'completed', ...d(22, 22), reference: 'REF-034', merchant: 'Lyft' },
  { id: 'txn_035', accountId: 'acc_001', type: 'debit', amount: 5.25, currency: 'USD', description: 'Morning Coffee', category: 'coffee', status: 'completed', ...d(23, 7), reference: 'REF-035', merchant: "Dunkin' Donuts" },
  { id: 'txn_036', accountId: 'acc_001', type: 'credit', amount: 350.00, currency: 'USD', description: 'Freelance Payment', category: 'salary', status: 'completed', ...d(24, 14), reference: 'REF-036', counterparty: { name: 'Client Corp' } },
  { id: 'txn_037', accountId: 'acc_003', type: 'debit', amount: 499.00, currency: 'USD', description: 'Samsung Galaxy Buds', category: 'shopping', status: 'completed', ...d(25, 12), reference: 'REF-037', merchant: 'Samsung' },
  { id: 'txn_038', accountId: 'acc_001', type: 'debit', amount: 125.00, currency: 'USD', description: 'Electric Bill', category: 'utilities', status: 'completed', ...d(26, 10), reference: 'REF-038', merchant: 'City Power Co.' },
  { id: 'txn_039', accountId: 'acc_001', type: 'debit', amount: 32.00, currency: 'USD', description: 'Sushi Restaurant', category: 'food', status: 'completed', ...d(27, 19), reference: 'REF-039', merchant: 'Sakura Sushi' },
  { id: 'txn_040', accountId: 'acc_003', type: 'debit', amount: 450.00, currency: 'USD', description: 'Hotel Booking', category: 'travel', status: 'completed', ...d(28, 15), reference: 'REF-040', merchant: 'Marriott Hotels' },

  // 2+ months ago
  { id: 'txn_041', accountId: 'acc_001', type: 'credit', amount: 3200.00, currency: 'USD', description: 'Salary Deposit', category: 'salary', status: 'completed', ...d(30, 6), reference: 'REF-041', counterparty: { name: 'TechCorp Inc.' } },
  { id: 'txn_042', accountId: 'acc_001', type: 'debit', amount: 1800.00, currency: 'USD', description: 'Rent Payment', category: 'bills', status: 'completed', ...d(31, 9), reference: 'REF-042', merchant: 'Apartment Complex' },
  { id: 'txn_043', accountId: 'acc_003', type: 'debit', amount: 78.00, currency: 'USD', description: 'Home Depot', category: 'shopping', status: 'completed', ...d(33, 13), reference: 'REF-043', merchant: 'Home Depot' },
  { id: 'txn_044', accountId: 'acc_001', type: 'debit', amount: 55.00, currency: 'USD', description: 'Gym Membership', category: 'fitness', status: 'completed', ...d(35, 8), reference: 'REF-044', merchant: 'FitLife Gym' },
  { id: 'txn_045', accountId: 'acc_001', type: 'debit', amount: 23.50, currency: 'USD', description: 'Movie Night', category: 'entertainment', status: 'completed', ...d(37, 20), reference: 'REF-045', merchant: 'Regal Cinemas' },
  { id: 'txn_046', accountId: 'acc_003', type: 'debit', amount: 340.00, currency: 'USD', description: 'Flight to Chicago', category: 'travel', status: 'completed', ...d(39, 11), reference: 'REF-046', merchant: 'United Airlines' },
  { id: 'txn_047', accountId: 'acc_001', type: 'credit', amount: 250.00, currency: 'USD', description: 'Refund - Insurance', category: 'other', status: 'completed', ...d(40, 10), reference: 'REF-047' },
  { id: 'txn_048', accountId: 'acc_001', type: 'debit', amount: 85.00, currency: 'USD', description: 'Internet Bill', category: 'utilities', status: 'completed', ...d(41, 10), reference: 'REF-048', merchant: 'Comcast' },
  { id: 'txn_049', accountId: 'acc_003', type: 'debit', amount: 19.99, currency: 'USD', description: 'Udemy Course', category: 'education', status: 'completed', ...d(43, 16), reference: 'REF-049', merchant: 'Udemy' },
  { id: 'txn_050', accountId: 'acc_001', type: 'debit', amount: 45.00, currency: 'USD', description: 'Grocery Store', category: 'groceries', status: 'completed', ...d(44, 17), reference: 'REF-050', merchant: 'Kroger' },
  { id: 'txn_051', accountId: 'acc_001', type: 'debit', amount: 8.50, currency: 'USD', description: 'Parking Meter', category: 'transport', status: 'completed', ...d(45, 12), reference: 'REF-051', merchant: 'City Parking' },
  { id: 'txn_052', accountId: 'acc_003', type: 'debit', amount: 156.00, currency: 'USD', description: 'Zara Clothing', category: 'shopping', status: 'completed', ...d(47, 15), reference: 'REF-052', merchant: 'Zara' },
  { id: 'txn_053', accountId: 'acc_001', type: 'credit', amount: 3200.00, currency: 'USD', description: 'Salary Deposit', category: 'salary', status: 'completed', ...d(45, 6), reference: 'REF-053', counterparty: { name: 'TechCorp Inc.' } },
  { id: 'txn_054', accountId: 'acc_001', type: 'debit', amount: 1800.00, currency: 'USD', description: 'Rent Payment', category: 'bills', status: 'completed', ...d(46, 9), reference: 'REF-054', merchant: 'Apartment Complex' },
  { id: 'txn_055', accountId: 'acc_001', type: 'debit', amount: 125.00, currency: 'USD', description: 'Electric Bill', category: 'utilities', status: 'completed', ...d(56, 10), reference: 'REF-055', merchant: 'City Power Co.' },
  { id: 'txn_056', accountId: 'acc_003', type: 'debit', amount: 67.00, currency: 'USD', description: 'Barnes & Noble', category: 'education', status: 'completed', ...d(58, 14), reference: 'REF-056', merchant: 'Barnes & Noble' },
  { id: 'txn_057', accountId: 'acc_001', type: 'debit', amount: 95.00, currency: 'USD', description: 'Car Insurance', category: 'bills', status: 'completed', ...d(60, 10), reference: 'REF-057', merchant: 'Geico' },
  { id: 'txn_058', accountId: 'acc_003', type: 'debit', amount: 42.00, currency: 'USD', description: 'Pizza Delivery', category: 'food', status: 'completed', ...d(62, 20), reference: 'REF-058', merchant: 'Dominos' },
  { id: 'txn_059', accountId: 'acc_001', type: 'debit', amount: 55.00, currency: 'USD', description: 'Gym Membership', category: 'fitness', status: 'completed', ...d(65, 8), reference: 'REF-059', merchant: 'FitLife Gym' },
  { id: 'txn_060', accountId: 'acc_001', type: 'credit', amount: 3200.00, currency: 'USD', description: 'Salary Deposit', category: 'salary', status: 'completed', ...d(75, 6), reference: 'REF-060', counterparty: { name: 'TechCorp Inc.' } },
];

export const mockBalanceHistory: BalanceHistory[] = [
  { date: '2024-07-01', balance: 10200 },
  { date: '2024-07-15', balance: 11500 },
  { date: '2024-08-01', balance: 10800 },
  { date: '2024-08-15', balance: 12100 },
  { date: '2024-09-01', balance: 11400 },
  { date: '2024-09-15', balance: 12458.67 },
];
