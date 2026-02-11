import type {
  User,
  Account,
  Transaction,
  Currency,
  AccountType,
  TransactionType,
  TransactionCategory,
  TransactionStatus,
} from '../types';

// Mock User Data

export const MOCK_USER: User = {
  id: 'user-001',
  email: 'demo@vbank.com',
  name: 'Jane Doe',
  avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alex',
  createdAt: new Date('2023-01-15'),
};

// Mock Account Data

export const MOCK_ACCOUNT: Account = {
  id: 'acc-001',
  userId: MOCK_USER.id,
  accountNumber: 'NL91VBANK0417164300',
  balance: 5847.32,
  currency: 'EUR' as Currency,
  accountType: 'CHECKING' as AccountType,
  createdAt: new Date('2023-01-15'),
};

// Mock Transaction Data

const createMockTransaction = (
  id: string,
  daysAgo: number,
  amount: number,
  type: TransactionType,
  category: TransactionCategory,
  counterpartyName: string,
  description: string
): Transaction => ({
  id,
  accountId: MOCK_ACCOUNT.id,
  amount: Math.abs(amount),
  currency: 'EUR' as Currency,
  type,
  category,
  counterpartyName,
  description,
  date: new Date(Date.now() - daysAgo * 24 * 60 * 60 * 1000),
  status: 'COMPLETED' as TransactionStatus,
  counterpartyAccount: type === 'INCOMING' ? 'NL89INGB0001234567' : 'NL12RABO0987654321',
});

export const MOCK_TRANSACTIONS: Transaction[] = [
  // This month
  createMockTransaction(
    'txn-001',
    1,
    2500,
    'INCOMING' as TransactionType,
    'SALARY' as TransactionCategory,
    'bunq',
    'Monthly salary'
  ),
  createMockTransaction(
    'txn-002',
    2,
    89.99,
    'OUTGOING' as TransactionType,
    'GROCERIES' as TransactionCategory,
    'Albert Heijn',
    'Weekly groceries'
  ),
  createMockTransaction(
    'txn-003',
    3,
    12.50,
    'OUTGOING' as TransactionType,
    'TRANSPORT' as TransactionCategory,
    'NS Dutch Railways',
    'Train ticket Amsterdam-Utrecht'
  ),
  createMockTransaction(
    'txn-004',
    5,
    1200,
    'OUTGOING' as TransactionType,
    'RENT' as TransactionCategory,
    'MVGM Properties',
    'Monthly rent'
  ),
  createMockTransaction(
    'txn-005',
    6,
    45.00,
    'OUTGOING' as TransactionType,
    'UTILITIES' as TransactionCategory,
    'Eneco',
    'Electricity bill'
  ),
  createMockTransaction(
    'txn-006',
    7,
    156.75,
    'OUTGOING' as TransactionType,
    'SHOPPING' as TransactionCategory,
    'Bol.com',
    'Electronics and books'
  ),
  createMockTransaction(
    'txn-007',
    8,
    23.50,
    'OUTGOING' as TransactionType,
    'ENTERTAINMENT' as TransactionCategory,
    'Pathé Cinemas',
    'Movie tickets'
  ),
  createMockTransaction(
    'txn-008',
    10,
    67.40,
    'OUTGOING' as TransactionType,
    'GROCERIES' as TransactionCategory,
    'Jumbo Supermarkt',
    'Grocery shopping'
  ),
  
  // Last month
  createMockTransaction(
    'txn-009',
    32,
    2500,
    'INCOMING' as TransactionType,
    'SALARY' as TransactionCategory,
    'bunq',
    'Monthly salary'
  ),
  createMockTransaction(
    'txn-010',
    35,
    1200,
    'OUTGOING' as TransactionType,
    'RENT' as TransactionCategory,
    'MVGM Properties',
    'Monthly rent'
  ),
  createMockTransaction(
    'txn-011',
    36,
    125.00,
    'OUTGOING' as TransactionType,
    'HEALTHCARE' as TransactionCategory,
    'Zilveren Kruis',
    'Health insurance'
  ),
  createMockTransaction(
    'txn-012',
    38,
    89.00,
    'OUTGOING' as TransactionType,
    'UTILITIES' as TransactionCategory,
    'Ziggo',
    'Internet and mobile'
  ),
  createMockTransaction(
    'txn-013',
    40,
    250.00,
    'OUTGOING' as TransactionType,
    'SHOPPING' as TransactionCategory,
    'IKEA',
    'Furniture'
  ),
  createMockTransaction(
    'txn-014',
    42,
    78.90,
    'OUTGOING' as TransactionType,
    'GROCERIES' as TransactionCategory,
    'Albert Heijn',
    'Weekly groceries'
  ),
  createMockTransaction(
    'txn-015',
    45,
    35.00,
    'OUTGOING' as TransactionType,
    'ENTERTAINMENT' as TransactionCategory,
    'Spotify',
    'Music subscription'
  ),
  
  // Two months ago
  createMockTransaction(
    'txn-016',
    62,
    2500,
    'INCOMING' as TransactionType,
    'SALARY' as TransactionCategory,
    'bunq',
    'Monthly salary'
  ),
  createMockTransaction(
    'txn-017',
    65,
    1200,
    'OUTGOING' as TransactionType,
    'RENT' as TransactionCategory,
    'MVGM Properties',
    'Monthly rent'
  ),
  createMockTransaction(
    'txn-018',
    68,
    450.00,
    'OUTGOING' as TransactionType,
    'SHOPPING' as TransactionCategory,
    'Coolblue',
    'Laptop accessories'
  ),
  createMockTransaction(
    'txn-019',
    70,
    92.30,
    'OUTGOING' as TransactionType,
    'GROCERIES' as TransactionCategory,
    'Jumbo Supermarkt',
    'Grocery shopping'
  ),
  createMockTransaction(
    'txn-020',
    72,
    15.00,
    'OUTGOING' as TransactionType,
    'TRANSPORT' as TransactionCategory,
    'NS Dutch Railways',
    'Train ticket'
  ),
];

// Generate more transactions

export const generateMockTransactions = (count: number): Transaction[] => {
  const transactions: Transaction[] = [...MOCK_TRANSACTIONS];
  const categories = Object.values({
    GROCERIES: 'GROCERIES',
    TRANSPORT: 'TRANSPORT',
    ENTERTAINMENT: 'ENTERTAINMENT',
    UTILITIES: 'UTILITIES',
    SHOPPING: 'SHOPPING',
  });
  
  const merchants = [
    'Albert Heijn',
    'Jumbo',
    'NS Railways',
    'Spotify',
    'Netflix',
    'Bol.com',
    'Coolblue',
    'IKEA',
  ];

  for (let i = transactions.length; i < count; i++) {
    const daysAgo = Math.floor(Math.random() * 365);
    const amount = Math.random() * 200 + 5;
    const category = categories[Math.floor(Math.random() * categories.length)] as TransactionCategory;
    const merchant = merchants[Math.floor(Math.random() * merchants.length)];

    transactions.push(
      createMockTransaction(
        `txn-${String(i + 1).padStart(3, '0')}`,
        daysAgo,
        amount,
        'OUTGOING' as TransactionType,
        category,
        merchant,
        `Payment to ${merchant}`
      )
    );
  }

  return transactions;
};