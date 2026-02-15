import { User } from '../types';

/**
 * Valid users who can successfully log in
 */
export const validUsers = {
  standard: {
    username: 'standard_user',
    password: 'secret_sauce',
    type: 'standard' as const,
    description: 'Standard user with full access to the application',
  },
  performance: {
    username: 'performance_glitch_user',
    password: 'secret_sauce',
    type: 'performance' as const,
    description: 'User experiencing performance glitches during navigation',
  },
  problem: {
    username: 'problem_user',
    password: 'secret_sauce',
    type: 'problem' as const,
    description: 'User experiencing various issues with the application',
  },
  visual: {
    username: 'visual_user',
    password: 'secret_sauce',
    type: 'visual' as const,
    description: 'User for visual testing purposes',
  },
};

/**
 * Invalid users who cannot log in
 */
export const invalidUsers = {
  locked: {
    username: 'locked_out_user',
    password: 'secret_sauce',
    type: 'locked' as const,
    description: 'User who has been locked out of the system',
  },
  invalid: {
    username: 'invalid_user',
    password: 'invalid_password',
    type: 'error' as const,
    description: 'Non-existent user with invalid credentials',
  },
  emptyUsername: {
    username: '',
    password: 'secret_sauce',
    type: 'error' as const,
    description: 'Empty username test case',
  },
  emptyPassword: {
    username: 'standard_user',
    password: '',
    type: 'error' as const,
    description: 'Empty password test case',
  },
  emptyBoth: {
    username: '',
    password: '',
    type: 'error' as const,
    description: 'Both username and password empty',
  },
};

/**
 * Combined user test data
 */
export const testUsers = { ...validUsers, ...invalidUsers };

/**
 * Default user for quick testing
 */
export const defaultUser = validUsers.standard;

/**
 * Get a valid user by type
 * @param type - User type
 * @returns User object
 */
export function getValidUser(type: 'standard' | 'performance' | 'problem' | 'visual' = 'standard'): User {
  return validUsers[type];
}

/**
 * Get an invalid user by type
 * @param type - Invalid user type
 * @returns User object
 */
export function getInvalidUser(
  type: 'locked' | 'invalid' | 'emptyUsername' | 'emptyPassword' | 'emptyBoth' = 'invalid'
): User {
  return invalidUsers[type];
}
