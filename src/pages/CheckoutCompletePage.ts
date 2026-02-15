import { Page } from '@playwright/test';
import { BasePage } from './common/BasePage';
import { URLS } from '../utils/constants';

/**
 * CheckoutCompletePage - Page Object for checkout complete (confirmation)
 * Handles order completion and confirmation display
 */
export class CheckoutCompletePage extends BasePage {
  // Selectors
  private readonly pageTitle = '.title';
  private readonly completeHeader = '.complete-header';
  private readonly completeText = '.complete-text';
  private readonly backHomeButton = '#back-to-products';
  private readonly ponyExpressImage = '.pony_express';

  constructor(page: Page) {
    super(page);
  }

  /**
   * Navigate to checkout complete page
   */
  async navigateToCheckoutComplete(): Promise<void> {
    await this.goto(URLS.checkoutComplete);
    await this.waitForPageLoad();
  }

  /**
   * Get the completion header text
   * @returns Header text (e.g., "Thank you for your order!")
   */
  async getCompleteHeader(): Promise<string> {
    return await this.getText(this.completeHeader);
  }

  /**
   * Get the completion message text
   * @returns Completion message text
   */
  async getCompleteText(): Promise<string> {
    return await this.getText(this.completeText);
  }

  /**
   * Click back to home button
   */
  async goBackHome(): Promise<void> {
    await this.clickElement(this.backHomeButton);
  }

  /**
   * Click back to products button (same as goBackHome)
   */
  async clickBackToProducts(): Promise<void> {
    await this.goBackHome();
  }

  /**
   * Get page title
   * @returns Page title text
   */
  async getPageTitle(): Promise<string> {
    return await this.getText(this.pageTitle);
  }

  /**
   * Check if order is complete (confirmation displayed)
   * @returns True if complete header is visible
   */
  async isOrderComplete(): Promise<boolean> {
    return await this.isElementVisible(this.completeHeader);
  }

  /**
   * Check if pony express image is visible
   * @returns True if image is visible
   */
  async isPonyExpressImageVisible(): Promise<boolean> {
    return await this.isElementVisible(this.ponyExpressImage);
  }

  /**
   * Check if back home button is visible
   * @returns True if button is visible
   */
  async isBackHomeButtonVisible(): Promise<boolean> {
    return await this.isElementVisible(this.backHomeButton);
  }

  /**
   * Verify order completion with expected messages
   * @param expectedHeader - Expected header text
   * @param expectedText - Expected confirmation text
   */
  async verifyOrderCompletion(expectedHeader?: string, expectedText?: string): Promise<void> {
    await this.expectElementToBeVisible(this.completeHeader);
    await this.expectElementToBeVisible(this.completeText);

    if (expectedHeader) {
      await this.expectElementToContainText(this.completeHeader, expectedHeader);
    }

    if (expectedText) {
      await this.expectElementToContainText(this.completeText, expectedText);
    }
  }

  /**
   * Verify user is on checkout complete page
   */
  async verifyOnCheckoutComplete(): Promise<void> {
    await this.expectUrlToContain('checkout-complete');
    await this.expectElementToBeVisible(this.completeHeader);
    await this.expectElementToBeVisible(this.backHomeButton);
  }

  /**
   * Complete the post-order flow by going back home
   */
  async completePostOrderFlow(): Promise<void> {
    await this.verifyOrderCompletion();
    await this.goBackHome();
  }
}
