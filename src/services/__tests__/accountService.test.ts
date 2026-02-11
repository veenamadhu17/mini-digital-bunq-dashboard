import { describe, it, expect, beforeEach } from 'vitest';
import { accountService } from '../accountService';

describe('accountService', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  describe('getAccount', () => {
    it('should return account data', async () => {
      const response = await accountService.getAccount();
      
      expect(response.status).toBe(200);
      expect(response.data).toBeDefined();
      expect(response.data.id).toBeDefined();
      expect(response.data.accountNumber).toBeDefined();
      expect(response.data.balance).toBeGreaterThan(0);
      expect(response.data.currency).toBe('EUR');
    });

    it('should return default balance when no custom balance is set', async () => {
      const response = await accountService.getAccount();
      expect(response.data.balance).toBe(5847.32); // Default mock balance
    });

    it('should return custom balance from localStorage', async () => {
      const customBalance = 1000;
      await accountService.updateBalance(customBalance);
      
      const response = await accountService.getAccount();
      expect(response.data.balance).toBe(customBalance);
    });
  });

  describe('updateBalance', () => {
    it('should update balance in localStorage', async () => {
      const newBalance = 2500.50;
      await accountService.updateBalance(newBalance);
      
      const stored = localStorage.getItem('bunq_account_balance');
      expect(stored).toBe(newBalance.toString());
    });

    it('should persist balance across getAccount calls', async () => {
      await accountService.updateBalance(3000);
      
      const response1 = await accountService.getAccount();
      const response2 = await accountService.getAccount();
      
      expect(response1.data.balance).toBe(3000);
      expect(response2.data.balance).toBe(3000);
    });
  });

  describe('getCurrentBalance', () => {
    it('should return default balance when nothing stored', () => {
      const balance = accountService.getCurrentBalance();
      expect(balance).toBe(5847.32);
    });

    it('should return stored balance', async () => {
      await accountService.updateBalance(4500);
      const balance = accountService.getCurrentBalance();
      expect(balance).toBe(4500);
    });

    it('should handle decimal values correctly', async () => {
      await accountService.updateBalance(1234.56);
      const balance = accountService.getCurrentBalance();
      expect(balance).toBe(1234.56);
    });
  });
});