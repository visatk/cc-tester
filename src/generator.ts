import { STRIPE_TEST_CARDS, type CardNetwork, type TestScenario, type CardInfo } from './data';
import { detectNetwork } from './network';
import { EXTENDED_BINS, getRandomBinFromNetwork } from './bin-ranges';

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
 */
function getSecureRandomDigit(): string {
  if (typeof crypto !== 'undefined' && crypto.getRandomValues) {
    const array = new Uint8Array(1);
    do {
      crypto.getRandomValues(array);
    } while (array[0] >= 250); 
    return (array[0] % 10).toString();
  }
  return Math.floor(Math.random() * 10).toString();
}

/**
 * Dynamically generates a mathematically valid (Live-ready) credit card.
 * @param input - A specific BIN ('400115'), a network ('visa'), or 'random' for any card.
 */
export function generateRandomCard(input: string = 'random'): CardInfo {
  let prefix = '';
  const cleanInput = input.toLowerCase().trim();

  // 1. If 'random', pick a completely random network from our real BIN database
  if (cleanInput === 'random') {
    const networks = Object.keys(EXTENDED_BINS);
    const randomNetwork = networks[Math.floor(Math.random() * networks.length)];
    prefix = getRandomBinFromNetwork(randomNetwork);
  } 
  // 2. If it's a known network name (e.g., 'mastercard'), pick a real BIN for that network
  else if (EXTENDED_BINS[cleanInput]) {
    prefix = getRandomBinFromNetwork(cleanInput);
  } 
  // 3. Otherwise, assume the user provided a custom numerical BIN (e.g., '601120')
  else {
    prefix = cleanInput.replace(/\D/g, '');
  }
  
  if (!prefix) throw new Error('[cc-tester] Invalid prefix or network provided.');

  const network = detectNetwork(prefix);
  let targetLength = 16;
  if (network === 'amex') targetLength = 15;
  if (network === 'diners_club') targetLength = 14;

  let partialNumber = prefix;
  while (partialNumber.length < targetLength - 1) {
    partialNumber += getSecureRandomDigit();
  }

  // Append Luhn digit for mathematical perfection
  const number = partialNumber + calculateLuhnCheckDigit(partialNumber);

  // Secure CVC generation
  const cvcLength = network === 'amex' ? 4 : 3;
  let cvc = '';
  for(let i = 0; i < cvcLength; i++) cvc += getSecureRandomDigit();

  // Always generate a FUTURE Expiration Date (making it "Live" plausible)
  const currentYear = new Date().getFullYear();
  const expMonth = (parseInt(getSecureRandomDigit(), 10) % 12 + 1).toString().padStart(2, '0');
  const expYear = (currentYear + (parseInt(getSecureRandomDigit(), 10) % 5) + 1).toString();

  return { number, cvc, expMonth, expYear };
}
