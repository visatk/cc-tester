import { STRIPE_TEST_CARDS, type CardNetwork, type TestScenario, type CardInfo } from './data';
import { detectNetwork } from './network';

export function getTestCard(network: CardNetwork = 'visa', scenario: TestScenario = 'success'): CardInfo {
  const card = STRIPE_TEST_CARDS[network]?.[scenario];
  if (!card) throw new Error(`[cc-tester] Test scenario '${scenario}' is not currently supported for network '${network}'.`);
  return card;
}

function calculateLuhnCheckDigit(partialCard: string): string {
  let sum = 0;
  let shouldDouble = true;
  for (let i = partialCard.length - 1; i >= 0; i--) {
    let digit = parseInt(partialCard.charAt(i), 10);
    if (shouldDouble) {
      digit *= 2;
      if (digit > 9) digit -= 9;
    }
    sum += digit;
    shouldDouble = !shouldDouble;
  }
  return ((10 - (sum % 10)) % 10).toString();
}

/**
 * Generates a truly random digit using Web Crypto API.
 * Eliminates Modulo Bias for cryptographic fairness.
 */
function getSecureRandomDigit(): string {
  if (typeof crypto !== 'undefined' && crypto.getRandomValues) {
    const array = new Uint8Array(1);
    do {
      crypto.getRandomValues(array);
    } while (array[0] >= 250); // 250 is the max multiple of 10 under 256
    return (array[0] % 10).toString();
  }
  // Fallback for older non-edge environments
  return Math.floor(Math.random() * 10).toString();
}

export function generateRandomCard(prefixOrNetwork: string): CardInfo {
  const defaultPrefixes: Record<string, string> = {
    visa: '4', mastercard: '51', amex: '37', discover: '6011',
    diners_club: '300', jcb: '3528', unionpay: '62', maestro: '5018'
  };

  const cleanInput = prefixOrNetwork.toLowerCase().trim();
  const prefix = defaultPrefixes[cleanInput] || prefixOrNetwork.replace(/\D/g, '');
  
  if (!prefix) throw new Error('[cc-tester] Invalid prefix or network provided.');

  const network = detectNetwork(prefix);
  let targetLength = 16;
  if (network === 'amex') targetLength = 15;
  if (network === 'diners_club') targetLength = 14;

  let partialNumber = prefix;
  while (partialNumber.length < targetLength - 1) {
    partialNumber += getSecureRandomDigit();
  }

  const number = partialNumber + calculateLuhnCheckDigit(partialNumber);

  // Secure CVC generation
  const cvcLength = network === 'amex' ? 4 : 3;
  let cvc = '';
  for(let i=0; i<cvcLength; i++) cvc += getSecureRandomDigit();

  const currentYear = new Date().getFullYear();
  const expMonth = (parseInt(getSecureRandomDigit(), 10) % 12 + 1).toString().padStart(2, '0');
  const expYear = (currentYear + (parseInt(getSecureRandomDigit(), 10) % 5) + 1).toString();

  return { number, cvc, expMonth, expYear };
}
