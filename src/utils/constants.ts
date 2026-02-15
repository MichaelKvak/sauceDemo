/**
 * Application URLs
 */
export const URLS = {
  base: 'https://www.saucedemo.com',
  login: 'https://www.saucedemo.com/',
  inventory: 'https://www.saucedemo.com/inventory.html',
  cart: 'https://www.saucedemo.com/cart.html',
  checkoutStepOne: 'https://www.saucedemo.com/checkout-step-one.html',
  checkoutStepTwo: 'https://www.saucedemo.com/checkout-step-two.html',
  checkoutComplete: 'https://www.saucedemo.com/checkout-complete.html',
};

/**
 * Timeout configurations (milliseconds)
 */
export const TIMEOUTS = {
  short: 5000,
  medium: 10000,
  long: 30000,
  extraLong: 60000,
};

/**
 * Error messages displayed by the application
 */
export const ERROR_MESSAGES = {
  loginRequired: 'Epic sadface: Username is required',
  passwordRequired: 'Epic sadface: Password is required',
  invalidCredentials: 'Epic sadface: Username and password do not match any user in this service',
  lockedOut: 'Epic sadface: Sorry, this user has been locked out.',
  firstNameRequired: 'Error: First Name is required',
  lastNameRequired: 'Error: Last Name is required',
  postalCodeRequired: 'Error: Postal Code is required',
};

/**
 * Success messages displayed by the application
 */
export const SUCCESS_MESSAGES = {
  orderComplete: 'Thank you for your order!',
  orderCompleteHeader: 'Thank you for your order!',
  orderDispatchMessage: 'Your order has been dispatched, and will arrive just as fast as the pony can get there!',
};

/**
 * Sort options for products
 */
export const SORT_OPTIONS = {
  nameAZ: 'az',
  nameZA: 'za',
  priceLowHigh: 'lohi',
  priceHighLow: 'hilo',
};

/**
 * Menu items
 */
export const MENU_ITEMS = {
  allItems: 'All Items',
  about: 'About',
  logout: 'Logout',
  resetAppState: 'Reset App State',
};

/**
 * Button text constants
 */
export const BUTTONS = {
  addToCart: 'Add to cart',
  remove: 'Remove',
  checkout: 'Checkout',
  continue: 'Continue',
  continueShopping: 'Continue Shopping',
  finish: 'Finish',
  cancel: 'Cancel',
  backToProducts: 'Back to products',
  backHome: 'Back Home',
  login: 'Login',
};

/**
 * CSS selector patterns
 */
export const SELECTORS = {
  button: 'button',
  link: 'a',
  input: 'input',
  select: 'select',
  error: '.error-message-container',
  badge: '.shopping_cart_badge',
};
