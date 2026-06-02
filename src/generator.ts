import { STRIPE_TEST_CARDS, type CardNetwork, type TestScenario, type CardInfo } from './data';

/**
 * Retrieves a mock credit card for testing payment gateways.
 * @param network - The card network (e.g., 'visa', 'mastercard')
 * @param scenario - The testing scenario (default: 'success')
 */
export function getTestCard(network: CardNetwork = 'visa', scenario: TestScenario = 'success'): CardInfo {
  const card = STRIPE_TEST_CARDS[network]?.[scenario];
  
  if (!card) {
    throw new Error(`[cc-tester] Test scenario '${scenario}' is not currently supported for network '${network}'.`);
  }

  return card;
}
