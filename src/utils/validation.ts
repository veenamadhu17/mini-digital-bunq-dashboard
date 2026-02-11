import type { TransferFormData, TransferValidationError } from '../types';

// IBAN validation - simpler version
export const isValidIBAN = (iban: string): boolean => {
  const ibanRegex = /^[A-Z]{2}[0-9]{2}[A-Z0-9]{1,30}$/;
  return ibanRegex.test(iban.replace(/\s/g, ''));
};

export const validateTransferForm = (
  data: TransferFormData,
  availableBalance: number
): TransferValidationError[] => {
  const errors: TransferValidationError[] = [];

  // Recipient name validation
  if (!data.recipientName.trim()) {
    errors.push({
      field: 'recipientName',
      message: 'Recipient name is required',
    });
  } else if (data.recipientName.trim().length < 2) {
    errors.push({
      field: 'recipientName',
      message: 'Recipient name must be at least 2 characters',
    });
  }

  // IBAN validation
  if (!data.recipientAccount.trim()) {
    errors.push({
      field: 'recipientAccount',
      message: 'Recipient account (IBAN) is required',
    });
  } else if (!isValidIBAN(data.recipientAccount)) {
    errors.push({
      field: 'recipientAccount',
      message: 'Invalid IBAN format',
    });
  }

  // Amount validation
  if (data.amount <= 0) {
    errors.push({
      field: 'amount',
      message: 'Amount must be greater than 0',
    });
  } else if (data.amount > availableBalance) {
    errors.push({
      field: 'amount',
      message: 'Insufficient funds',
    });
  } else if (data.amount > 10000) {
    errors.push({
      field: 'amount',
      message: 'Transfer limit is €10,000',
    });
  }

  // Description validation
  if (!data.description.trim()) {
    errors.push({
      field: 'description',
      message: 'Description is required',
    });
  } else if (data.description.trim().length > 140) {
    errors.push({
      field: 'description',
      message: 'Description must be 140 characters or less',
    });
  }

  return errors;
};