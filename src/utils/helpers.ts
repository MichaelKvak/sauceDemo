/**
 * Utility helper functions for test automation
 */

/**
 * Generate a random string
 * @param length - Length of the random string
 * @returns Random string
 */
export function generateRandomString(length: number = 10): string {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
}

/**
 * Generate a random number within a range
 * @param min - Minimum value (inclusive)
 * @param max - Maximum value (inclusive)
 * @returns Random number
 */
export function generateRandomNumber(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * Generate a random email address
 * @param domain - Email domain (default: example.com)
 * @returns Random email address
 */
export function generateRandomEmail(domain: string = 'example.com'): string {
  const randomString = generateRandomString(10).toLowerCase();
  return `${randomString}@${domain}`;
}

/**
 * Parse price string and convert to number
 * @param priceString - Price string (e.g., "$29.99")
 * @returns Price as number
 */
export function parsePriceToNumber(priceString: string): number {
  return parseFloat(priceString.replace('$', '').trim());
}

/**
 * Format number as currency
 * @param amount - Amount to format
 * @returns Formatted currency string
 */
export function formatCurrency(amount: number): string {
  return `$${amount.toFixed(2)}`;
}

/**
 * Wait for a specific amount of time
 * @param ms - Milliseconds to wait
 * @returns Promise that resolves after the specified time
 */
export function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Check if array is sorted in ascending order
 * @param arr - Array to check
 * @returns True if sorted in ascending order
 */
export function isSortedAscending(arr: number[]): boolean {
  for (let i = 0; i < arr.length - 1; i++) {
    if (arr[i] > arr[i + 1]) {
      return false;
    }
  }
  return true;
}

/**
 * Check if array is sorted in descending order
 * @param arr - Array to check
 * @returns True if sorted in descending order
 */
export function isSortedDescending(arr: number[]): boolean {
  for (let i = 0; i < arr.length - 1; i++) {
    if (arr[i] < arr[i + 1]) {
      return false;
    }
  }
  return true;
}

/**
 * Check if string array is sorted alphabetically (A-Z)
 * @param arr - Array to check
 * @returns True if sorted alphabetically
 */
export function isSortedAlphabetically(arr: string[]): boolean {
  for (let i = 0; i < arr.length - 1; i++) {
    if (arr[i].toLowerCase() > arr[i + 1].toLowerCase()) {
      return false;
    }
  }
  return true;
}

/**
 * Check if string array is sorted reverse alphabetically (Z-A)
 * @param arr - Array to check
 * @returns True if sorted reverse alphabetically
 */
export function isSortedReverseAlphabetically(arr: string[]): boolean {
  for (let i = 0; i < arr.length - 1; i++) {
    if (arr[i].toLowerCase() < arr[i + 1].toLowerCase()) {
      return false;
    }
  }
  return true;
}

/**
 * Get current timestamp in readable format
 * @returns Formatted timestamp string
 */
export function getTimestamp(): string {
  const now = new Date();
  return now.toISOString().replace(/[:.]/g, '-');
}

/**
 * Generate a unique test ID
 * @param prefix - Optional prefix for the ID
 * @returns Unique test ID
 */
export function generateTestId(prefix: string = 'test'): string {
  return `${prefix}-${Date.now()}-${generateRandomString(5)}`;
}

/**
 * Calculate percentage
 * @param value - Value to calculate percentage from
 * @param total - Total value
 * @returns Percentage value
 */
export function calculatePercentage(value: number, total: number): number {
  if (total === 0) return 0;
  return (value / total) * 100;
}

/**
 * Retry a function until it succeeds or max attempts is reached
 * @param fn - Function to retry
 * @param maxAttempts - Maximum number of attempts
 * @param delay - Delay between attempts in milliseconds
 * @returns Result of the function
 */
export async function retry<T>(
  fn: () => Promise<T>,
  maxAttempts: number = 3,
  delay: number = 1000
): Promise<T> {
  let lastError: Error | undefined;

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error as Error;
      if (attempt < maxAttempts) {
        await sleep(delay);
      }
    }
  }

  throw lastError || new Error('Retry failed');
}

/**
 * Convert string to slug format (lowercase with hyphens)
 * @param str - String to convert
 * @returns Slug formatted string
 */
export function toSlug(str: string): string {
  return str
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}
