import { describe, it, expect, beforeEach } from 'vitest';
import { analyticsService } from '../analyticsService';
import { transactionService } from '../transactionService';

describe('analyticsService', () => {
  beforeEach(() => {
    localStorage.clear();
    // Reset to default mock data
    transactionService.resetTransactions();
  });

  describe('getSpendingInsights', () => {
    it('should return spending insights', async () => {
      const insights = await analyticsService.getSpendingInsights();
      
      expect(insights).toBeDefined();
      expect(insights.totalIncome).toBeGreaterThan(0);
      expect(insights.totalExpenses).toBeGreaterThan(0);
      expect(insights.netBalance).toBeDefined();
      expect(insights.byCategory).toBeInstanceOf(Array);
      expect(insights.monthlyTrend).toBeInstanceOf(Array);
      expect(insights.topExpenseCategory).toBeDefined();
      expect(insights.averageTransactionAmount).toBeGreaterThan(0);
    });

    it('should calculate net balance correctly', async () => {
      const insights = await analyticsService.getSpendingInsights();
      const expectedNet = insights.totalIncome - insights.totalExpenses;
      expect(insights.netBalance).toBeCloseTo(expectedNet, 2);
    });

    it('should have spending by category sorted by amount descending', async () => {
      const insights = await analyticsService.getSpendingInsights();
      
      for (let i = 1; i < insights.byCategory.length; i++) {
        expect(insights.byCategory[i].amount).toBeLessThanOrEqual(
          insights.byCategory[i - 1].amount
        );
      }
    });

    it('should calculate percentages correctly', async () => {
      const insights = await analyticsService.getSpendingInsights();
      const totalPercentage = insights.byCategory.reduce(
        (sum, cat) => sum + cat.percentage,
        0
      );
      
      // Should be close to 100% (with floating point tolerance)
      expect(totalPercentage).toBeCloseTo(100, 0);
    });

    it('should include transaction counts in categories', async () => {
      const insights = await analyticsService.getSpendingInsights();
      
      insights.byCategory.forEach((category) => {
        expect(category.transactionCount).toBeGreaterThan(0);
      });
    });
  });

  describe('calculateTotalIncome', () => {
    it('should only count incoming transactions', async () => {
      const transactions = transactionService.getStoredTransactions();
      const income = analyticsService.calculateTotalIncome(transactions);
      
      const manualIncome = transactions
        .filter((t) => t.type === 'INCOMING')
        .reduce((sum, t) => sum + t.amount, 0);
      
      expect(income).toBe(manualIncome);
    });
  });

  describe('calculateTotalExpenses', () => {
    it('should only count outgoing transactions', async () => {
      const transactions = transactionService.getStoredTransactions();
      const expenses = analyticsService.calculateTotalExpenses(transactions);
      
      const manualExpenses = transactions
        .filter((t) => t.type === 'OUTGOING')
        .reduce((sum, t) => sum + t.amount, 0);
      
      expect(expenses).toBe(manualExpenses);
    });
  });

  describe('calculateMonthlyTrend', () => {
    it('should return data sorted by month', async () => {
      const transactions = transactionService.getStoredTransactions();
      const trend = analyticsService.calculateMonthlyTrend(transactions);
      
      for (let i = 1; i < trend.length; i++) {
        expect(trend[i].month >= trend[i - 1].month).toBe(true);
      }
    });

    it('should calculate net correctly for each month', async () => {
      const transactions = transactionService.getStoredTransactions();
      const trend = analyticsService.calculateMonthlyTrend(transactions);
      
      trend.forEach((month) => {
        expect(month.net).toBe(month.income - month.expenses);
      });
    });
  });

  describe('getTopExpenseCategory', () => {
    it('should return the category with highest spending', async () => {
      const transactions = transactionService.getStoredTransactions();
      const byCategory = analyticsService.calculateSpendingByCategory(transactions);
      const topCategory = analyticsService.getTopExpenseCategory(byCategory);
      
      if (byCategory.length > 0) {
        expect(topCategory).toBe(byCategory[0].category);
      } else {
        expect(topCategory).toBe('OTHER');
      }
    });

    it('should return OTHER when no categories exist', () => {
      const topCategory = analyticsService.getTopExpenseCategory([]);
      expect(topCategory).toBe('OTHER');
    });
  });

  describe('calculateAverageTransaction', () => {
    it('should calculate correct average', async () => {
      const transactions = transactionService.getStoredTransactions();
      const average = analyticsService.calculateAverageTransaction(transactions);
      
      const total = transactions.reduce((sum, t) => sum + t.amount, 0);
      const expectedAverage = total / transactions.length;
      
      expect(average).toBeCloseTo(expectedAverage, 2);
    });

    it('should return 0 for empty transaction list', () => {
      const average = analyticsService.calculateAverageTransaction([]);
      expect(average).toBe(0);
    });
  });
});