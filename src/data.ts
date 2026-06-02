export type CardNetwork = 'visa' | 'mastercard' | 'amex' | 'discover';
export type TestScenario = 'success' | 'decline_generic' | 'decline_insufficient_funds' | 'fraud';

export interface CardInfo {
  number: string;
  cvc: string;
  expMonth: string;
  expYear: string;
}

export const STRIPE_TEST_CARDS: Record<CardNetwork, Partial<Record<TestScenario, CardInfo>>> = {
  visa: {
    success: { number: '4242424242424242', cvc: '123', expMonth: '12', expYear: '2030' },
    decline_generic: { number: '4000000000000002', cvc: '123', expMonth: '12', expYear: '2030' },
    decline_insufficient_funds: { number: '4000000000000004', cvc: '123', expMonth: '12', expYear: '2030' }
  },
  mastercard: {
    success: { number: '5555555555554444', cvc: '123', expMonth: '12', expYear: '2030' }
  },
  amex: {
    success: { number: '378282246310005', cvc: '1234', expMonth: '12', expYear: '2030' }
  },
  discover: {}
};
