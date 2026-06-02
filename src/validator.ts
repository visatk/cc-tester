import { validateLuhn } from './luhn';
import { detectNetwork } from './network';

export interface CardValidationResult {
  isValid: boolean;
  isLuhnValid: boolean;
  isNetworkSupported: boolean;
  isLengthValid: boolean;
  isNotExpired: boolean;
  network: string;
  errors: string[];
}

export function validateCardStrict(
  number: string, 
  expMonth?: string | number, 
  expYear?: string | number
): CardValidationResult {
  const sanitizedNumber = number.replace(/\D/g, '');
  const network = detectNetwork(sanitizedNumber);
  const errors: string[] = [];

  const isLuhnValid = validateLuhn(sanitizedNumber);
  if (!isLuhnValid) errors.push('Mathematical validation (Luhn) failed.');

  const isNetworkSupported = network !== 'unknown';
  if (!isNetworkSupported) errors.push('Unsupported or unknown card network.');

  let isLengthValid = false;
  if (isNetworkSupported) {
    const len = sanitizedNumber.length;
    if (network === 'amex' && len === 15) isLengthValid = true;
    else if (network === 'diners_club' && len === 14) isLengthValid = true;
    else if ((network === 'visa' || network === 'mastercard' || network === 'discover' || network === 'jcb') && len === 16) isLengthValid = true;
    else if (network === 'unionpay' || network === 'maestro') isLengthValid = len >= 12 && len <= 19;
    
    if (!isLengthValid) errors.push(`Invalid length (${len}) for network ${network}.`);
  }

  let isNotExpired = true;
  if (expMonth && expYear) {
    const month = parseInt(expMonth.toString(), 10);
    const year = parseInt(expYear.toString().slice(-2), 10);
    
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth() + 1;
    const currentYearShort = parseInt(currentDate.getFullYear().toString().slice(-2), 10);

    if (month < 1 || month > 12) {
      isNotExpired = false;
      errors.push('Expiration month must be between 01 and 12.');
    } else if (year < currentYearShort || (year === currentYearShort && month < currentMonth)) {
      isNotExpired = false;
      errors.push('The card has expired (Dead card).');
    }
  }

  const isValid = isLuhnValid && isNetworkSupported && isLengthValid && isNotExpired;

  return {
    isValid,
    isLuhnValid,
    isNetworkSupported,
    isLengthValid,
    isNotExpired,
    network,
    errors
  };
}
