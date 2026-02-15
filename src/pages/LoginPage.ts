import { Page } from '@playwright/test';
import { BasePage } from './common/BasePage';
import { URLS } from '../utils/constants';

/**
 * LoginPage - Page Object for the login page
 * Handles all interactions with the login functionality
 */
export class LoginPage extends BasePage {
  // Selectors
  private readonly usernameInput = '#user-name';
  private readonly passwordInput = '#password';
  private readonly loginButton = '#login-button';
  private readonly errorMessage = '[data-test="error"]';
  private readonly errorButton = '.error-button';
  private readonly loginLogo = '.login_logo';

  constructor(page: Page) {
    super(page);
  }

  /**
   * Navigate to the login page
   */
  async navigateToLoginPage(): Promise<void> {
    await this.goto(URLS.login);
    await this.waitForPageLoad();
  }

  /**
   * Enter username in the username field
   * @param username - Username to enter
   */
  async enterUsername(username: string): Promise<void> {
    await this.fillInput(this.usernameInput, username);
  }

  /**
   * Enter password in the password field
   * @param password - Password to enter
   */
  async enterPassword(password: string): Promise<void> {
    await this.fillInput(this.passwordInput, password);
  }

  /**
   * Click the login button
   */
  async clickLoginButton(): Promise<void> {
    await this.clickElement(this.loginButton);
  }

  /**
   * Perform complete login action
   * @param username - Username to login with
   * @param password - Password to login with
   */
  async login(username: string, password: string): Promise<void> {
    await this.enterUsername(username);
    await this.enterPassword(password);
    await this.clickLoginButton();
  }

  /**
   * Get the error message text
   * @returns Error message text or empty string
   */
  async getErrorMessage(): Promise<string> {
    if (await this.isElementVisible(this.errorMessage)) {
      return await this.getText(this.errorMessage);
    }
    return '';
  }

  /**
   * Check if error message is displayed
   * @returns True if error message is visible
   */
  async isErrorMessageVisible(): Promise<boolean> {
    return await this.isElementVisible(this.errorMessage);
  }

  /**
   * Click the error message close button
   */
  async closeErrorMessage(): Promise<void> {
    if (await this.isElementVisible(this.errorButton)) {
      await this.clickElement(this.errorButton);
    }
  }

  /**
   * Check if login logo is visible
   * @returns True if login logo is visible
   */
  async isLoginLogoVisible(): Promise<boolean> {
    return await this.isElementVisible(this.loginLogo);
  }

  /**
   * Clear the username field
   */
  async clearUsername(): Promise<void> {
    await this.clearInput(this.usernameInput);
  }

  /**
   * Clear the password field
   */
  async clearPassword(): Promise<void> {
    await this.clearInput(this.passwordInput);
  }

  /**
   * Clear both username and password fields
   */
  async clearLoginForm(): Promise<void> {
    await this.clearUsername();
    await this.clearPassword();
  }

  /**
   * Get the placeholder text for username input
   * @returns Placeholder text
   */
  async getUsernamePlaceholder(): Promise<string | null> {
    return await this.getAttribute(this.usernameInput, 'placeholder');
  }

  /**
   * Get the placeholder text for password input
   * @returns Placeholder text
   */
  async getPasswordPlaceholder(): Promise<string | null> {
    return await this.getAttribute(this.passwordInput, 'placeholder');
  }

  /**
   * Check if login button is enabled
   * @returns True if login button is enabled
   */
  async isLoginButtonEnabled(): Promise<boolean> {
    return await this.isElementEnabled(this.loginButton);
  }

  /**
   * Verify user is on login page
   */
  async verifyOnLoginPage(): Promise<void> {
    await this.expectUrlToBe(URLS.login);
    await this.expectElementToBeVisible(this.loginLogo);
    await this.expectElementToBeVisible(this.loginButton);
  }
}
