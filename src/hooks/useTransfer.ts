import { useState, useCallback } from 'react';
import { transactionService } from '../services';
import { validateTransferForm } from '../utils/validation';
import type { TransferFormData, TransferValidationError } from '../types';

interface UseTransferReturn {
  isSubmitting: boolean;
  errors: TransferValidationError[];
  success: boolean;
  submitTransfer: (data: TransferFormData, availableBalance: number) => Promise<void>;
  resetForm: () => void;
}

export const useTransfer = (): UseTransferReturn => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<TransferValidationError[]>([]);
  const [success, setSuccess] = useState(false);

  const submitTransfer = useCallback(
    async (data: TransferFormData, availableBalance: number) => {
      // Client-side validation
      const validationErrors = validateTransferForm(data, availableBalance);

      if (validationErrors.length > 0) {
        setErrors(validationErrors);
        return;
      }

      setIsSubmitting(true);
      setErrors([]);
      setSuccess(false);

      try {
        const response = await transactionService.createTransfer(data);

        if (response.data.success) {
          setSuccess(true);
        } else {
          setErrors([
            {
              field: 'amount',
              message: response.data.error || 'Transfer failed',
            },
          ]);
        }
      } catch (err) {
        setErrors([
          {
            field: 'amount',
            message: err instanceof Error ? err.message : 'Transfer failed',
          },
        ]);
      } finally {
        setIsSubmitting(false);
      }
    },
    []
  );

  const resetForm = useCallback(() => {
    setErrors([]);
    setSuccess(false);
  }, []);

  return {
    isSubmitting,
    errors,
    success,
    submitTransfer,
    resetForm,
  };
};