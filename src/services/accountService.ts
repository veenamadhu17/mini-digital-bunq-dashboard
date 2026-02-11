import type { Account, ApiResponse } from '../types';
import { MOCK_ACCOUNT } from './mockData';

const BALANCE_STORAGE_KEY = 'bunq_account_balance';
const MOCK_DELAY = 600;

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const accountService = {
  /**
   * Get account details
   */
  async getAccount(): Promise<ApiResponse<Account>> {
    await delay(MOCK_DELAY);

    // Check if we have a custom balance in localStorage
    const storedBalance = localStorage.getItem(BALANCE_STORAGE_KEY);
    const balance = storedBalance ? parseFloat(storedBalance) : MOCK_ACCOUNT.balance;

    return {
      data: {
        ...MOCK_ACCOUNT,
        balance,
      },
      status: 200,
    };
  },

  /**
   * Update account balance (used after transfers)
   */
  async updateBalance(newBalance: number): Promise<void> {
    await delay(300);
    localStorage.setItem(BALANCE_STORAGE_KEY, newBalance.toString());
  },

  /**
   * Get current balance
   */
  getCurrentBalance(): number {
    const stored = localStorage.getItem(BALANCE_STORAGE_KEY);
    return stored ? parseFloat(stored) : MOCK_ACCOUNT.balance;
  },
};