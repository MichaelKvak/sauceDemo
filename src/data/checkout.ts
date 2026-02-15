import { CheckoutInfo } from '../types';

/**
 * Valid checkout information for successful transactions
 */
export const validCheckoutInfo: CheckoutInfo = {
  firstName: 'John',
  lastName: 'Doe',
  postalCode: '12345',
};

/**
 * Alternative valid checkout information
 */
export const checkoutTestData: CheckoutInfo[] = [
  {
    firstName: 'Jane',
    lastName: 'Smith',
    postalCode: '90210',
  },
  {
    firstName: 'Bob',
    lastName: 'Johnson',
    postalCode: '54321',
  },
  {
    firstName: 'Alice',
    lastName: 'Williams',
    postalCode: '67890',
  },
  {
    firstName: 'Test',
    lastName: 'User',
    postalCode: '11111',
  },
];

/**
 * Invalid checkout information for negative testing
 */
export const invalidCheckoutInfo = {
  missingFirstName: {
    firstName: '',
    lastName: 'Doe',
    postalCode: '12345',
  },
  missingLastName: {
    firstName: 'John',
    lastName: '',
    postalCode: '12345',
  },
  missingPostalCode: {
    firstName: 'John',
    lastName: 'Doe',
    postalCode: '',
  },
  allFieldsEmpty: {
    firstName: '',
    lastName: '',
    postalCode: '',
  },
  onlyFirstName: {
    firstName: 'John',
    lastName: '',
    postalCode: '',
  },
  onlyLastName: {
    firstName: '',
    lastName: 'Doe',
    postalCode: '',
  },
  onlyPostalCode: {
    firstName: '',
    lastName: '',
    postalCode: '12345',
  },
};

/**
 * Default checkout information for quick tests
 */
export const defaultCheckoutInfo = validCheckoutInfo;

/**
 * Get random valid checkout information
 * @returns Random checkout info object
 */
export function getRandomCheckoutInfo(): CheckoutInfo {
  const randomIndex = Math.floor(Math.random() * checkoutTestData.length);
  return checkoutTestData[randomIndex];
}

/**
 * Get checkout information with specific missing field
 * @param missingField - Field to leave empty ('firstName', 'lastName', or 'postalCode')
 * @returns Checkout info with specified field missing
 */
export function getCheckoutInfoWithMissingField(
  missingField: 'firstName' | 'lastName' | 'postalCode'
): CheckoutInfo {
  switch (missingField) {
    case 'firstName':
      return invalidCheckoutInfo.missingFirstName;
    case 'lastName':
      return invalidCheckoutInfo.missingLastName;
    case 'postalCode':
      return invalidCheckoutInfo.missingPostalCode;
    default:
      return invalidCheckoutInfo.allFieldsEmpty;
  }
}
