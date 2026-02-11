import { renderHook, act, waitFor } from '@testing-library/react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { useTransfer } from '../useTransfer';
import { transactionService } from '../../services';
import type { TransferFormData } from '../../types';

vi.mock('../../services', () => ({
  transactionService: {
    createTransfer: vi.fn(),
  },
}));

describe('useTransfer', () => {
  const validFormData: TransferFormData = {
    recipientName: 'John Doe',
    recipientAccount: 'NL91ABNA0417164300',
    amount: 100,
    description: 'Test transfer',
    category: 'OTHER',
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should initialize with correct default state', () => {
    const { result } = renderHook(() => useTransfer());

    expect(result.current.isSubmitting).toBe(false);
    expect(result.current.errors).toEqual([]);
    expect(result.current.success).toBe(false);
  });

  it('should validate form data before submitting', async () => {
    const { result } = renderHook(() => useTransfer());

    const invalidData: TransferFormData = {
      ...validFormData,
      amount: 0, // Invalid amount
    };

    await act(async () => {
      await result.current.submitTransfer(invalidData, 1000);
    });

    expect(result.current.errors.length).toBeGreaterThan(0);
    expect(result.current.errors.some(e => e.field === 'amount')).toBe(true);
    expect(result.current.success).toBe(false);
  });

  it('should submit valid transfer successfully', async () => {
    vi.mocked(transactionService.createTransfer).mockResolvedValue({
      data: { success: true, transactionId: 'txn-123' },
      status: 201,
    });

    const { result } = renderHook(() => useTransfer());

    await act(async () => {
      await result.current.submitTransfer(validFormData, 1000);
    });

    await waitFor(() => {
      expect(result.current.success).toBe(true);
    });

    expect(result.current.errors).toEqual([]);
    expect(result.current.isSubmitting).toBe(false);
  });

  it('should handle insufficient funds', async () => {
    const { result } = renderHook(() => useTransfer());

    await act(async () => {
      await result.current.submitTransfer(validFormData, 50); // Balance less than amount
    });

    expect(result.current.errors.some(e => e.message.includes('Insufficient funds'))).toBe(true);
    expect(result.current.success).toBe(false);
  });

  it('should handle server error', async () => {
    vi.mocked(transactionService.createTransfer).mockResolvedValue({
      data: { success: false, error: 'Server error' },
      status: 500,
    });

    const { result } = renderHook(() => useTransfer());

    await act(async () => {
      await result.current.submitTransfer(validFormData, 1000);
    });

    await waitFor(() => {
      expect(result.current.errors.length).toBeGreaterThan(0);
    });

    expect(result.current.success).toBe(false);
  });

  it('should reset form state', async () => {
    vi.mocked(transactionService.createTransfer).mockResolvedValue({
      data: { success: true, transactionId: 'txn-123' },
      status: 201,
    });

    const { result } = renderHook(() => useTransfer());

    await act(async () => {
      await result.current.submitTransfer(validFormData, 1000);
    });

    await waitFor(() => {
      expect(result.current.success).toBe(true);
    });

    act(() => {
      result.current.resetForm();
    });

    expect(result.current.success).toBe(false);
    expect(result.current.errors).toEqual([]);
  });
});