import * as dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

/**
 * Environment configuration object
 * Centralizes access to environment variables with fallback defaults
 */
export const ENV = {
  /**
   * Base URL for the application under test
   */
  BASE_URL: process.env.BASE_URL || 'https://www.saucedemo.com',

  /**
   * Test user credentials
   */
  USERS: {
    STANDARD: {
      username: process.env.STANDARD_USER || 'standard_user',
      password: process.env.DEFAULT_PASSWORD || 'secret_sauce',
    },
    PERFORMANCE: {
      username: process.env.PERFORMANCE_USER || 'performance_glitch_user',
      password: process.env.DEFAULT_PASSWORD || 'secret_sauce',
    },
    PROBLEM: {
      username: process.env.PROBLEM_USER || 'problem_user',
      password: process.env.DEFAULT_PASSWORD || 'secret_sauce',
    },
    LOCKED: {
      username: process.env.LOCKED_USER || 'locked_out_user',
      password: process.env.DEFAULT_PASSWORD || 'secret_sauce',
    },
  },

  /**
   * Test execution configuration
   */
  TEST_CONFIG: {
    headless: process.env.HEADLESS === 'true',
    browser: process.env.BROWSER || 'chromium',
    slowMo: parseInt(process.env.SLOW_MO || '0'),
    workers: parseInt(process.env.WORKERS || '4'),
    retries: parseInt(process.env.RETRIES || '1'),
    screenshotOnFailure: process.env.SCREENSHOT_ON_FAILURE !== 'false',
    videoOnFailure: process.env.VIDEO_ON_FAILURE !== 'false',
  },

  /**
   * Timeout configurations in milliseconds
   */
  TIMEOUTS: {
    default: parseInt(process.env.DEFAULT_TIMEOUT || '30000'),
    navigation: parseInt(process.env.NAVIGATION_TIMEOUT || '30000'),
    action: parseInt(process.env.ACTION_TIMEOUT || '10000'),
  },
};
