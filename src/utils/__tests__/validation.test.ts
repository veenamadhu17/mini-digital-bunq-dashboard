import { describe, it, expect } from 'vitest';
import { isValidIBAN, validateTransferForm } from '../validation';
import { TransactionCategory } from '../../types';

describe('isValidIBAN', () => {
  it('should validate correct IBAN formats', () => {
    expect(isValidIBAN('NL91ABNA0417164300')).toBe(true);
    expect(isValidIBAN('DE89370400440532013000')).toBe(true);
  });

  it('should reject invalid IBAN formats', () => {
    expect(isValidIBAN('INVALID')).toBe(false);
    expect(isValidIBAN('NL91')).toBe(false);
    expect(isValidIBAN('')).toBe(false);
  });

  it('should handle IBANs with spaces', () => {
    expect(isValidIBAN('NL91 ABNA 0417 1643 00')).toBe(true);
  });
});

describe('validateTransferForm', () => {
  const validFormData = {
    recipientName: 'John Doe',
    recipientAccount: 'NL91ABNA0417164300',
    amount: 100,
    description: 'Test payment',
    category: TransactionCategory.OTHER,
  };

  it('should return no errors for valid form data', () => {
    const errors = validateTransferForm(validFormData, 1000);
    expect(errors).toHaveLength(0);
  });

  it('should validate insufficient funds', () => {
    const errors = validateTransferForm(validFormData, 50);
    expect(errors).toHaveLength(1);
    expect(errors[0].field).toBe('amount');
    expect(errors[0].message).toBe('Insufficient funds');
  });

  it('should validate amount exceeds limit', () => {
    const formData = { ...validFormData, amount: 15000 };
    const errors = validateTransferForm(formData, 20000);
    expect(errors).toHaveLength(1);
    expect(errors[0].message).toBe('Transfer limit is €10,000');
  });

  it('should validate empty recipient name', () => {
    const formData = { ...validFormData, recipientName: '' };
    const errors = validateTransferForm(formData, 1000);
    expect(errors.some(e => e.field === 'recipientName')).toBe(true);
  });

  it('should validate invalid IBAN', () => {
    const formData = { ...validFormData, recipientAccount: 'INVALID' };
    const errors = validateTransferForm(formData, 1000);
    expect(errors.some(e => e.field === 'recipientAccount')).toBe(true);
  });
});