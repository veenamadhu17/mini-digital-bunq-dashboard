import type {
  Transaction,
  TransactionFilters,
  TransactionSort,
  ApiResponse,
  TransferFormData,
  TransferResult,
} from '../types';
import { MOCK_TRANSACTIONS, MOCK_ACCOUNT, generateMockTransactions } from './mockData';
import { accountService } from './accountService';

const TRANSACTIONS_STORAGE_KEY = 'bunq_transactions';
const MOCK_DELAY = 700;

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Initialize with mock data or generate large dataset for performance testing
const USE_LARGE_DATASET = false; // Set to true to test with 1000+ transactions
const LARGE_DATASET_SIZE = 1000;

export const transactionService = {
  /**
   * Get all transactions with optional filtering and sorting
   */
  async getTransactions(
    filters?: TransactionFilters,
    sort?: TransactionSort
  ): Promise<ApiResponse<Transaction[]>> {
    await delay(MOCK_DELAY);

    let transactions = this.getStoredTransactions();

    // Apply filters
    if (filters) {
      transactions = this.filterTransactions(transactions, filters);
    }

    // Apply sorting
    if (sort) {
      transactions = this.sortTransactions(transactions, sort);
    }

    return {
      data: transactions,
      status: 200,
    };
  },

  /**
   * Create a new transaction (money transfer)
   */
  async createTransfer(transferData: TransferFormData): Promise<ApiResponse<TransferResult>> {
    await delay(1200); // Longer delay for transfers

    const currentBalance = accountService.getCurrentBalance();

    // Validation (double-check on server side)
    if (transferData.amount > currentBalance) {
      return {
        data: {
          success: false,
          error: 'Insufficient funds',
        },
        status: 400,
      };
    }

    // Create new transaction
    const newTransaction: Transaction = {
      id: `txn-${Date.now()}`,
      accountId: MOCK_ACCOUNT.id,
      amount: transferData.amount,
      currency: 'EUR',
      type: 'OUTGOING',
      category: transferData.category,
      counterpartyName: transferData.recipientName,
      counterpartyAccount: transferData.recipientAccount,
      description: transferData.description,
      date: new Date(),
      status: 'COMPLETED',
    };

    // Add to stored transactions
    const transactions = this.getStoredTransactions();
    transactions.unshift(newTransaction); // Add to beginning
    localStorage.setItem(TRANSACTIONS_STORAGE_KEY, JSON.stringify(transactions));

    // Update balance
    const newBalance = currentBalance - transferData.amount;
    await accountService.updateBalance(newBalance);

    return {
      data: {
        success: true,
        transactionId: newTransaction.id,
      },
      status: 201,
      message: 'Transfer successful',
    };
  },

  /**
   * Get stored transactions or initialize with mock data
   */
  getStoredTransactions(): Transaction[] {
    const stored = localStorage.getItem(TRANSACTIONS_STORAGE_KEY);
    
    if (stored) {
      // Parse and convert date strings back to Date objects
      const parsed = JSON.parse(stored);
      return parsed.map((t: Transaction) => ({
        ...t,
        date: new Date(t.date),
      }));
    }

    // Initialize with mock data
    const initialData = USE_LARGE_DATASET
      ? generateMockTransactions(LARGE_DATASET_SIZE)
      : MOCK_TRANSACTIONS;
    
    localStorage.setItem(TRANSACTIONS_STORAGE_KEY, JSON.stringify(initialData));
    return initialData;
  },

  /**
   * Filter transactions based on criteria
   */
  filterTransactions(
    transactions: Transaction[],
    filters: TransactionFilters
  ): Transaction[] {
    return transactions.filter((transaction) => {
      // Search filter (counterparty name or description)
      if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        const matchesSearch =
          transaction.counterpartyName.toLowerCase().includes(searchLower) ||
          transaction.description.toLowerCase().includes(searchLower);
        if (!matchesSearch) {
          return false;
        }
      }

      // Type filter
      if (filters.type && transaction.type !== filters.type) {
        return false;
      }

      // Category filter
      if (filters.category && transaction.category !== filters.category) {
        return false;
      }

      // Date range filter
      if (filters.dateFrom && transaction.date < filters.dateFrom) {
        return false;
      }
      if (filters.dateTo && transaction.date > filters.dateTo) {
        return false;
      }

      // Amount range filter
      if (filters.minAmount !== undefined && transaction.amount < filters.minAmount) {
        return false;
      }
      if (filters.maxAmount !== undefined && transaction.amount > filters.maxAmount) {
        return false;
      }

      return true;
    });
  },

  /**
   * Sort transactions
   */
  sortTransactions(transactions: Transaction[], sort: TransactionSort): Transaction[] {
    const sorted = [...transactions];

    sorted.sort((a, b) => {
      let comparison = 0;

      switch (sort.field) {
        case 'date':
          comparison = a.date.getTime() - b.date.getTime();
          break;
        case 'amount':
          comparison = a.amount - b.amount;
          break;
        case 'counterpartyName':
          comparison = a.counterpartyName.localeCompare(b.counterpartyName);
          break;
      }

      return sort.direction === 'asc' ? comparison : -comparison;
    });

    return sorted;
  },

  /**
   * Reset to initial mock data (useful for testing)
   */
  resetTransactions(): void {
    localStorage.removeItem(TRANSACTIONS_STORAGE_KEY);
    localStorage.removeItem('bunq_account_balance');
  },
};