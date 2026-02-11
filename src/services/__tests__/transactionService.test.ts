import { describe, it, expect, beforeEach } from 'vitest';
import { transactionService } from '../transactionService';
import type { TransactionFilters, TransactionSort } from '../../types';

describe('transactionService', () => {
  beforeEach(() => {
    // Clear localStorage before each test
    localStorage.clear();
  });

  it('should return transactions', async () => {
    const response = await transactionService.getTransactions();
    expect(response.status).toBe(200);
    expect(response.data.length).toBeGreaterThan(0);
  });

  it('should filter transactions by search term', async () => {
    const filters: TransactionFilters = {
      search: 'salary',
    };

    const response = await transactionService.getTransactions(filters);
    expect(response.data.every(t => 
      t.description.toLowerCase().includes('salary') ||
      t.counterpartyName.toLowerCase().includes('salary')
    )).toBe(true);
  });

  it('should filter transactions by type', async () => {
    const filters: TransactionFilters = {
      type: 'INCOMING',
    };

    const response = await transactionService.getTransactions(filters);
    expect(response.data.every(t => t.type === 'INCOMING')).toBe(true);
  });

  it('should sort transactions by date ascending', async () => {
    const sort: TransactionSort = {
      field: 'date',
      direction: 'asc',
    };

    const response = await transactionService.getTransactions(undefined, sort);
    const dates = response.data.map(t => t.date.getTime());
    
    for (let i = 1; i < dates.length; i++) {
      expect(dates[i]).toBeGreaterThanOrEqual(dates[i - 1]);
    }
  });

  it('should sort transactions by amount descending', async () => {
    const sort: TransactionSort = {
      field: 'amount',
      direction: 'desc',
    };

    const response = await transactionService.getTransactions(undefined, sort);
    const amounts = response.data.map(t => t.amount);
    
    for (let i = 1; i < amounts.length; i++) {
      expect(amounts[i]).toBeLessThanOrEqual(amounts[i - 1]);
    }
  });
});