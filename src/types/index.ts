// User & Auth
export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  createdAt: Date;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

// Acccount & Balance
export interface Account {
  id: string;
  userId: string;
  accountNumber: string; // IBAN format
  balance: number;
  currency: Currency;
  accountType: AccountType;
  createdAt: Date;
}

export const Currency = {
  EUR: 'EUR',
  USD: 'USD',
  GBP: 'GBP',
} as const;

export type Currency = (typeof Currency)[keyof typeof Currency];

export const AccountType = {
  CHECKING: 'CHECKING',
  SAVINGS: 'SAVINGS',
} as const;

export type AccountType = (typeof AccountType)[keyof typeof AccountType];

// Transactions
export const TransactionType = {
  INCOMING: 'INCOMING',
  OUTGOING: 'OUTGOING',
} as const;

export type TransactionType = (typeof TransactionType)[keyof typeof TransactionType];

export const TransactionCategory = {
  GROCERIES: 'GROCERIES',
  TRANSPORT: 'TRANSPORT',
  ENTERTAINMENT: 'ENTERTAINMENT',
  UTILITIES: 'UTILITIES',
  SALARY: 'SALARY',
  RENT: 'RENT',
  SHOPPING: 'SHOPPING',
  HEALTHCARE: 'HEALTHCARE',
  OTHER: 'OTHER',
} as const;

export type TransactionCategory = (typeof TransactionCategory)[keyof typeof TransactionCategory];

export const TransactionStatus = {
  PENDING: 'PENDING',
  COMPLETED: 'COMPLETED',
  FAILED: 'FAILED',
} as const;

export type TransactionStatus = (typeof TransactionStatus)[keyof typeof TransactionStatus];

// Filtering & Sorting
export interface TransactionFilters {
  search?: string;
  type?: TransactionType;
  category?: TransactionCategory;
  dateFrom?: Date;
  dateTo?: Date;
  minAmount?: number;
  maxAmount?: number;
}

export type TransactionSortField = 'date' | 'amount' | 'counterpartyName';
export type SortDirection = 'asc' | 'desc';

export interface TransactionSort {
  field: TransactionSortField;
  direction: SortDirection;
}

// Money Transfer
export interface TransferFormData {
  recipientName: string;
  recipientAccount: string; // IBAN
  amount: number;
  description: string;
  category: TransactionCategory;
}

export interface TransferValidationError {
  field: keyof TransferFormData;
  message: string;
}

export interface TransferResult {
  success: boolean;
  transactionId?: string;
  error?: string;
}

// Analytics
export interface SpendingByCategory {
  category: TransactionCategory;
  amount: number;
  percentage: number;
  transactionCount: number;
}

export interface MonthlySpending {
  month: string; // 'YYYY-MM' format
  income: number;
  expenses: number;
  net: number;
}

export interface SpendingInsights {
  totalIncome: number;
  totalExpenses: number;
  netBalance: number;
  byCategory: SpendingByCategory[];
  monthlyTrend: MonthlySpending[];
  topExpenseCategory: TransactionCategory;
  averageTransactionAmount: number;
}

// UI State
export type Theme = 'light' | 'dark';

export interface AppSettings {
  theme: Theme;
  currency: Currency;
  language: string;
}

// API Response types
export interface ApiResponse<T> {
  data: T;
  status: number;
  message?: string;
}

export interface ApiError {
  message: string;
  code: string;
  details?: Record<string, unknown>;
}