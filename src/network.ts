import type { CardNetwork } from './data';

/**
 * Detects the credit card network using advanced BIN ranges.
 * Fully optimized for Edge computing (Zero performance bottleneck).
 */
export function detectNetwork(cardNumber: string): CardNetwork | 'unknown' {
  const sanitized = cardNumber.replace(/\D/g, '');
  
  if (/^4/.test(sanitized)) return 'visa';
  
  // Mastercard: 51-55, 2221-2720
  if (/^(5[1-5]|222[1-9]|22[3-9]\d|2[3-6]\d{2}|27[01]\d|2720)/.test(sanitized)) return 'mastercard';
  
  // Amex: 34, 37
  if (/^3[47]/.test(sanitized)) return 'amex';
  
  // Discover: 6011, 622126-622925, 644-649, 65
  if (/^6(?:011|5|4[4-9]|22(?:12[6-9]|1[3-9][0-9]|[2-8][0-9]{2}|9[01][0-9]|92[0-5]))/.test(sanitized)) return 'discover';
  
  // Diners Club (Carte Blanche & International): 300-305, 36
  if (/^3(?:0[0-5]|6)/.test(sanitized)) return 'diners_club';
  
  // JCB: 3528-3589
  if (/^35(?:2[89]|[3-8]\d)/.test(sanitized)) return 'jcb';
  
  // China UnionPay: 62
  if (/^62/.test(sanitized)) return 'unionpay';
  
  // Maestro: 50, 56-58, 6 (Processed last to avoid overriding Discover/UnionPay)
  if (/^(50|5[6-8]|6)/.test(sanitized)) return 'maestro';

  return 'unknown';
}
