import { Page } from '@playwright/test';
import { BasePage } from './common/BasePage';
import { URLS } from '../utils/constants';
import { CheckoutInfo } from '../types';

/**
 * CheckoutStepOnePage - Page Object for checkout step one (information)
 * Handles customer information input during checkout
 */
export class CheckoutStepOnePage extends BasePage {
  // Selectors
  private readonly pageTitle = '.title';
  private readonly firstNameInput = '#first-name';
  private readonly lastNameInput = '#last-name';
  private readonly postalCodeInput = '#postal-code';
  private readonly continueButton = '#continue';
  private readonly cancelButton = '#cancel';
  private readonly errorMessage = '[data-test="error"]';
  private readonly errorButton = '.error-button';

  constructor(page: Page) {
    super(page);
  }

  /**
   * Navigate to checkout step one page
   */
  async navigateToCheckoutStepOne(): Promise<void> {
    await this.goto(URLS.checkoutStepOne);
    await this.waitForPageLoad();
  }

  /**
   * Enter first name
   * @param firstName - First name to enter
   */
  async enterFirstName(firstName: string): Promise<void> {
    await this.fillInput(this.firstNameInput, firstName);
  }

  /**
   * Enter last name
   * @param lastName - Last name to enter
   */
  async enterLastName(lastName: string): Promise<void> {
    await this.fillInput(this.lastNameInput, lastName);
  }

  /**
   * Enter postal code
   * @param postalCode - Postal code to enter
   */
  async enterPostalCode(postalCode: string): Promise<void> {
    await this.fillInput(this.postalCodeInput, postalCode);
  }

  /**
   * Fill all checkout information fields
   * @param info - Checkout information object
   */
  async fillCheckoutInformation(info: CheckoutInfo): Promise<void> {
    await this.enterFirstName(info.firstName);
    await this.enterLastName(info.lastName);
    await this.enterPostalCode(info.postalCode);
  }

  /**
   * Fill checkout information with individual parameters
   * @param firstName - First name
   * @param lastName - Last name
   * @param postalCode - Postal code
   */
  async fillCheckoutForm(firstName: string, lastName: string, postalCode: string): Promise<void> {
    await this.enterFirstName(firstName);
    await this.enterLastName(lastName);
    await this.enterPostalCode(postalCode);
  }

  /**
   * Click continue button to proceed to step two
   */
  async clickContinue(): Promise<void> {
    await this.clickElement(this.continueButton);
  }

  /**
   * Click cancel button to return to cart
   */
  async clickCancel(): Promise<void> {
    await this.clickElement(this.cancelButton);
  }

  /**
   * Complete checkout step one with information
   * @param info - Checkout information
   */
  async completeStepOne(info: CheckoutInfo): Promise<void> {
    await this.fillCheckoutInformation(info);
    await this.clickContinue();
  }

  /**
   * Get error message text
   * @returns Error message or empty string
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
   * Close error message
   */
  async closeErrorMessage(): Promise<void> {
    if (await this.isElementVisible(this.errorButton)) {
      await this.clickElement(this.errorButton);
    }
  }

  /**
   * Get page title
   * @returns Page title text
   */
  async getPageTitle(): Promise<string> {
    return await this.getText(this.pageTitle);
  }

  /**
   * Clear first name field
   */
  async clearFirstName(): Promise<void> {
    await this.clearInput(this.firstNameInput);
  }

  /**
   * Clear last name field
   */
  async clearLastName(): Promise<void> {
    await this.clearInput(this.lastNameInput);
  }

  /**
   * Clear postal code field
   */
  async clearPostalCode(): Promise<void> {
    await this.clearInput(this.postalCodeInput);
  }

  /**
   * Clear all checkout form fields
   */
  async clearCheckoutForm(): Promise<void> {
    await this.clearFirstName();
    await this.clearLastName();
    await this.clearPostalCode();
  }

  /**
   * Get first name input value
   * @returns First name value
   */
  async getFirstName(): Promise<string> {
    return await this.getInputValue(this.firstNameInput);
  }

  /**
   * Get last name input value
   * @returns Last name value
   */
  async getLastName(): Promise<string> {
    return await this.getInputValue(this.lastNameInput);
  }

  /**
   * Get postal code input value
   * @returns Postal code value
   */
  async getPostalCode(): Promise<string> {
    return await this.getInputValue(this.postalCodeInput);
  }

  /**
   * Check if continue button is enabled
   * @returns True if button is enabled
   */
  async isContinueButtonEnabled(): Promise<boolean> {
    return await this.isElementEnabled(this.continueButton);
  }

  /**
   * Check if cancel button is visible
   * @returns True if button is visible
   */
  async isCancelButtonVisible(): Promise<boolean> {
    return await this.isElementVisible(this.cancelButton);
  }

  /**
   * Verify user is on checkout step one page
   */
  async verifyOnCheckoutStepOne(): Promise<void> {
    await this.expectUrlToContain('checkout-step-one');
    await this.expectElementToBeVisible(this.firstNameInput);
    await this.expectElementToBeVisible(this.continueButton);
  }
}
