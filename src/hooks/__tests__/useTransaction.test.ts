import { renderHook, waitFor } from '@testing-library/react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { useAccount } from '../useAccount';
import { accountService } from '../../services';

vi.mock('../../services', () => ({
  accountService: {
    getAccount: vi.fn(),
  },
}));

describe('useAccount', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should fetch account on mount', async () => {
    const mockAccount = {
      id: 'acc-1',
      userId: 'user-1',
      accountNumber: 'NL91VBANK0417164300',
      balance: 5000,
      currency: 'EUR' as const,
      accountType: 'CHECKING' as const,
      createdAt: new Date(),
    };

    vi.mocked(accountService.getAccount).mockResolvedValue({
      data: mockAccount,
      status: 200,
    });

    const { result } = renderHook(() => useAccount());

    expect(result.current.isLoading).toBe(true);

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.account).toEqual(mockAccount);
    expect(result.current.error).toBeNull();
  });

  it('should handle fetch error', async () => {
    vi.mocked(accountService.getAccount).mockRejectedValue(
      new Error('Failed to fetch account')
    );

    const { result } = renderHook(() => useAccount());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.account).toBeNull();
    expect(result.current.error).toBe('Failed to fetch account');
  });

  it('should refetch account when refetch is called', async () => {
    const mockAccount = {
      id: 'acc-1',
      userId: 'user-1',
      accountNumber: 'NL91VBANK0417164300',
      balance: 5000,
      currency: 'EUR' as const,
      accountType: 'CHECKING' as const,
      createdAt: new Date(),
    };

    vi.mocked(accountService.getAccount).mockResolvedValue({
      data: mockAccount,
      status: 200,
    });

    const { result } = renderHook(() => useAccount());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    // Change mock data
    const updatedAccount = { ...mockAccount, balance: 6000 };
    vi.mocked(accountService.getAccount).mockResolvedValue({
      data: updatedAccount,
      status: 200,
    });

    // Refetch
    await waitFor(async () => {
      await result.current.refetch();
    });

    await waitFor(() => {
      expect(result.current.account?.balance).toBe(6000);
    });
  });
});