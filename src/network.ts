import type { CardNetwork } from './data';

export function detectNetwork(cardNumber: string): CardNetwork | 'unknown' {
  const sanitized = cardNumber.replace(/\D/g, '');
  
  if (/^4/.test(sanitized)) return 'visa';
  if (/^5[1-5]/.test(sanitized)) return 'mastercard';
  if (/^3[47]/.test(sanitized)) return 'amex';
  if (/^6(?:011|5)/.test(sanitized)) return 'discover';
  
  return 'unknown';
}
