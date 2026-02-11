import type {
  Transaction,
  SpendingInsights,
  SpendingByCategory,
  MonthlySpending,
  TransactionCategory,
} from '../types';
import { transactionService } from './transactionService';

const MOCK_DELAY = 500;
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const analyticsService = {
  /**
   * Get spending insights from transactions
   */
  async getSpendingInsights(): Promise<SpendingInsights> {
    await delay(MOCK_DELAY);

    const transactions = transactionService.getStoredTransactions();

    const income = this.calculateTotalIncome(transactions);
    const expenses = this.calculateTotalExpenses(transactions);
    const byCategory = this.calculateSpendingByCategory(transactions);
    const monthlyTrend = this.calculateMonthlyTrend(transactions);
    const topCategory = this.getTopExpenseCategory(byCategory);
    const avgAmount = this.calculateAverageTransaction(transactions);

    return {
      totalIncome: income,
      totalExpenses: expenses,
      netBalance: income - expenses,
      byCategory,
      monthlyTrend,
      topExpenseCategory: topCategory,
      averageTransactionAmount: avgAmount,
    };
  },

  calculateTotalIncome(transactions: Transaction[]): number {
    return transactions
      .filter((t) => t.type === 'INCOMING')
      .reduce((sum, t) => sum + t.amount, 0);
  },

  calculateTotalExpenses(transactions: Transaction[]): number {
    return transactions
      .filter((t) => t.type === 'OUTGOING')
      .reduce((sum, t) => sum + t.amount, 0);
  },

  calculateSpendingByCategory(transactions: Transaction[]): SpendingByCategory[] {
    const expenseTransactions = transactions.filter((t) => t.type === 'OUTGOING');
    const totalExpenses = expenseTransactions.reduce((sum, t) => sum + t.amount, 0);

    const categoryMap = new Map<TransactionCategory, SpendingByCategory>();

    expenseTransactions.forEach((transaction) => {
      const existing = categoryMap.get(transaction.category);

      if (existing) {
        existing.amount += transaction.amount;
        existing.transactionCount += 1;
      } else {
        categoryMap.set(transaction.category, {
          category: transaction.category,
          amount: transaction.amount,
          percentage: 0, // Will calculate after
          transactionCount: 1,
        });
      }
    });

    // Calculate percentages
    const result = Array.from(categoryMap.values());
    result.forEach((item) => {
      item.percentage = totalExpenses > 0 ? (item.amount / totalExpenses) * 100 : 0;
    });

    // Sort by amount descending
    return result.sort((a, b) => b.amount - a.amount);
  },

  calculateMonthlyTrend(transactions: Transaction[]): MonthlySpending[] {
    const monthMap = new Map<string, MonthlySpending>();

    transactions.forEach((transaction) => {
      const monthKey = `${transaction.date.getFullYear()}-${String(
        transaction.date.getMonth() + 1
      ).padStart(2, '0')}`;

      const existing = monthMap.get(monthKey);

      if (existing) {
        if (transaction.type === 'INCOMING') {
          existing.income += transaction.amount;
        } else {
          existing.expenses += transaction.amount;
        }
        existing.net = existing.income - existing.expenses;
      } else {
        const income = transaction.type === 'INCOMING' ? transaction.amount : 0;
        const expenses = transaction.type === 'OUTGOING' ? transaction.amount : 0;

        monthMap.set(monthKey, {
          month: monthKey,
          income,
          expenses,
          net: income - expenses,
        });
      }
    });

    // Convert to array and sort by month
    return Array.from(monthMap.values()).sort((a, b) => a.month.localeCompare(b.month));
  },

  getTopExpenseCategory(byCategory: SpendingByCategory[]): TransactionCategory {
    if (byCategory.length === 0) return 'OTHER';
    return byCategory[0].category;
  },

  calculateAverageTransaction(transactions: Transaction[]): number {
    if (transactions.length === 0) return 0;
    const total = transactions.reduce((sum, t) => sum + t.amount, 0);
    return total / transactions.length;
  },
};