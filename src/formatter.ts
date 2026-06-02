import { detectNetwork } from './network';

/**
 * Formats a raw credit card number into a human-readable spaced format.
 * Automatically handles Amex (4-6-5) and standard (4-4-4-4) spacing.
 */
export function formatCardNumber(cardNumber: string): string {
  const sanitized = cardNumber.replace(/\D/g, '');
  const network = detectNetwork(sanitized);

  if (network === 'amex') {
    // Amex format: XXXX XXXXXX XXXXX
    const match = sanitized.match(/^(\d{0,4})(\d{0,6})(\d{0,5})$/);
    if (match) {
      return [match[1], match[2], match[3]].filter(Boolean).join(' ');
    }
  }

  // Default format: XXXX XXXX XXXX XXXX
  const match = sanitized.match(/^(\d{0,4})(\d{0,4})(\d{0,4})(\d{0,4})(\d{0,3})$/);
  if (match) {
    return [match[1], match[2], match[3], match[4], match[5]].filter(Boolean).join(' ');
  }

  return sanitized;
}
