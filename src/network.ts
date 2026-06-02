import type { CardNetwork } from './data';

/**
 * Detects the credit card network using advanced BIN ranges.
 * Fully optimized for Edge computing (Zero performance bottleneck).
 */
export function detectNetwork(cardNumber: string): CardNetwork | 'unknown' {
  const sanitized = cardNumber.replace(/\D/g, '');
  
  if (/^4/.test(sanitized)) return 'visa';
  if (/^(5[1-5]|222[1-9]|22[3-9]\d|2[3-6]\d{2}|27[01]\d|2720)/.test(sanitized)) return 'mastercard';
  if (/^3[47]/.test(sanitized)) return 'amex';
  if (/^6(?:011|5|4[4-9]|22(?:12[6-9]|1[3-9][0-9]|[2-8][0-9]{2}|9[01][0-9]|92[0-5]))/.test(sanitized)) return 'discover';
  if (/^3(?:0[0-5]|6)/.test(sanitized)) return 'diners_club';
  if (/^35(?:2[89]|[3-8]\d)/.test(sanitized)) return 'jcb';
  if (/^62/.test(sanitized)) return 'unionpay';
  if (/^(50|5[6-8]|6)/.test(sanitized)) return 'maestro';

  return 'unknown';
}
