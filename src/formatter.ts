import { detectNetwork } from './network';

/**
 * Formats a raw credit card number into a human-readable spaced format.
 * Intelligently handles Amex (4-6-5), Diners Club (4-6-4) and standard spacing.
 */
export function formatCardNumber(cardNumber: string): string {
  const sanitized = cardNumber.replace(/\D/g, '');
  const network = detectNetwork(sanitized);

  if (network === 'amex') {
    // Amex format: 4-6-5
    const match = sanitized.match(/^(\d{0,4})(\d{0,6})(\d{0,5})$/);
    if (match) return [match[1], match[2], match[3]].filter(Boolean).join(' ');
  }

  if (network === 'diners_club') {
    // Diners Club format: 4-6-4
    const match = sanitized.match(/^(\d{0,4})(\d{0,6})(\d{0,4})$/);
    if (match) return [match[1], match[2], match[3]].filter(Boolean).join(' ');
  }

  // Default standard format: 4-4-4-4 (up to 19 digits for some networks)
  const match = sanitized.match(/^(\d{0,4})(\d{0,4})(\d{0,4})(\d{0,4})(\d{0,3})$/);
  if (match) {
    return [match[1], match[2], match[3], match[4], match[5]].filter(Boolean).join(' ');
  }

  return sanitized;
}
