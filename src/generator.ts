import { STRIPE_TEST_CARDS, type CardNetwork, type TestScenario, type CardInfo } from './data';
import { detectNetwork } from './network';

export function getTestCard(network: CardNetwork = 'visa', scenario: TestScenario = 'success'): CardInfo {
  const card = STRIPE_TEST_CARDS[network]?.[scenario];
  
  if (!card) {
    throw new Error(`[cc-tester] Test scenario '${scenario}' is not currently supported for network '${network}'.`);
  }

  return card;
}

/**
 * Calculates the valid Luhn check digit for a given partial card number.
 */
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
 * Dynamically generates a mathematically valid random credit card.
 * @param prefixOrNetwork - A network name ('visa', 'amex') or a specific BIN prefix ('4242', '601120').
 */
export function generateRandomCard(prefixOrNetwork: string): CardInfo {
  // Map standard network names to default prefixes
  const defaultPrefixes: Record<string, string> = {
    visa: '4',
    mastercard: '51',
    amex: '37',
    discover: '6011',
    diners_club: '300',
    jcb: '3528',
    unionpay: '62',
    maestro: '5018'
  };

  const cleanInput = prefixOrNetwork.toLowerCase().trim();
  const prefix = defaultPrefixes[cleanInput] || prefixOrNetwork.replace(/\D/g, '');
  
  if (!prefix) {
    throw new Error('[cc-tester] Invalid prefix or network provided for generation.');
  }

  const network = detectNetwork(prefix);

  // Determine target length based on network
  let targetLength = 16;
  if (network === 'amex') targetLength = 15;
  if (network === 'diners_club') targetLength = 14;

  // Generate random digits up to (targetLength - 1)
  let partialNumber = prefix;
  while (partialNumber.length < targetLength - 1) {
    partialNumber += Math.floor(Math.random() * 10).toString();
  }

  // Append the mathematically correct Luhn check digit
  const number = partialNumber + calculateLuhnCheckDigit(partialNumber);

  // Generate secure CVC (4 digits for Amex, 3 for others)
  const cvcLength = network === 'amex' ? 4 : 3;
  const cvc = Math.floor(Math.random() * Math.pow(10, cvcLength))
    .toString()
    .padStart(cvcLength, '0');

  // Generate valid Expiry (Random month, and year between now and +5 years)
  const currentYear = new Date().getFullYear();
  const expMonth = Math.floor(Math.random() * 12 + 1).toString().padStart(2, '0');
  const expYear = (currentYear + Math.floor(Math.random() * 5) + 1).toString();

  return { number, cvc, expMonth, expYear };
}
