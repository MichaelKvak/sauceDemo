/**
 * TypeScript type definitions for the test framework
 */

/**
 * User types supported by the application
 */
export type UserType = 'standard' | 'locked' | 'problem' | 'performance' | 'error' | 'visual';

/**
 * User interface
 */
export interface User {
  username: string;
  password: string;
  type: UserType;
  description: string;
}

/**
 * Product interface
 */
export interface Product {
  id?: string;
  name: string;
  price: number;
  description: string;
  imagePath?: string;
}

/**
 * Checkout information interface
 */
export interface CheckoutInfo {
  firstName: string;
  lastName: string;
  postalCode: string;
}

/**
 * Cart item interface
 */
export interface CartItem {
  name: string;
  price: number;
  quantity: number;
}

/**
 * Order summary interface
 */
export interface OrderSummary {
  itemTotal: number;
  tax: number;
  total: number;
}

/**
 * Sort option types
 */
export type SortOption = 'az' | 'za' | 'lohi' | 'hilo';

/**
 * Sort option interface
 */
export interface SortOptions {
  nameAZ: 'az';
  nameZA: 'za';
  priceLowHigh: 'lohi';
  priceHighLow: 'hilo';
}

/**
 * Test data configuration interface
 */
export interface TestDataConfig {
  users: {
    valid: User[];
    invalid: User[];
  };
  products: Product[];
  checkoutInfo: CheckoutInfo[];
}

/**
 * Environment configuration interface
 */
export interface EnvironmentConfig {
  baseUrl: string;
  headless: boolean;
  browser: string;
  timeout: number;
}

/**
 * Menu item types
 */
export type MenuItem = 'All Items' | 'About' | 'Logout' | 'Reset App State';

/**
 * Page URL type
 */
export type PageUrl =
  | 'login'
  | 'inventory'
  | 'cart'
  | 'checkout-step-one'
  | 'checkout-step-two'
  | 'checkout-complete';
