import { Page } from '@playwright/test';
import { BasePage } from './common/BasePage';
import { URLS } from '../utils/constants';

/**
 * CheckoutStepTwoPage - Page Object for checkout step two (overview)
 * Handles order review and confirmation
 */
export class CheckoutStepTwoPage extends BasePage {
  // Selectors
  private readonly pageTitle = '.title';
  private readonly cartItems = '.cart_item';
  private readonly cartItemName = '.inventory_item_name';
  private readonly cartItemPrice = '.inventory_item_price';
  private readonly cartQuantity = '.cart_quantity';
  private readonly itemTotal = '.summary_subtotal_label';
  private readonly tax = '.summary_tax_label';
  private readonly total = '.summary_total_label';
  private readonly finishButton = '#finish';
  private readonly cancelButton = '#cancel';
  private readonly paymentInfo = '.summary_value_label:nth-of-type(1)';
  private readonly shippingInfo = '.summary_value_label:nth-of-type(2)';

  constructor(page: Page) {
    super(page);
  }

  /**
   * Navigate to checkout step two page
   */
  async navigateToCheckoutStepTwo(): Promise<void> {
    await this.goto(URLS.checkoutStepTwo);
    await this.waitForPageLoad();
  }

  /**
   * Get number of items in cart
   * @returns Number of cart items
   */
  async getCartItemCount(): Promise<number> {
    return await this.getElementCount(this.cartItems);
  }

  /**
   * Get all cart item names
   * @returns Array of product names
   */
  async getCartItemNames(): Promise<string[]> {
    return await this.getAllText(this.cartItemName);
  }

  /**
   * Get all cart item prices
   * @returns Array of prices as strings
   */
  async getCartItemPrices(): Promise<string[]> {
    return await this.getAllText(this.cartItemPrice);
  }

  /**
   * Get item total (subtotal before tax)
   * @returns Item total as string
   */
  async getItemTotal(): Promise<string> {
    const text = await this.getText(this.itemTotal);
    // Extract price from "Item total: $XX.XX"
    return text.replace('Item total: ', '').trim();
  }

  /**
   * Get tax amount
   * @returns Tax as string
   */
  async getTax(): Promise<string> {
    const text = await this.getText(this.tax);
    // Extract price from "Tax: $X.XX"
    return text.replace('Tax: ', '').trim();
  }

  /**
   * Get total amount (item total + tax)
   * @returns Total as string
   */
  async getTotal(): Promise<string> {
    const text = await this.getText(this.total);
    // Extract price from "Total: $XX.XX"
    return text.replace('Total: ', '').trim();
  }

  /**
   * Get item total as number
   * @returns Item total as number
   */
  async getItemTotalAsNumber(): Promise<number> {
    const totalString = await this.getItemTotal();
    return parseFloat(totalString.replace('$', ''));
  }

  /**
   * Get tax as number
   * @returns Tax as number
   */
  async getTaxAsNumber(): Promise<number> {
    const taxString = await this.getTax();
    return parseFloat(taxString.replace('$', ''));
  }

  /**
   * Get total as number
   * @returns Total as number
   */
  async getTotalAsNumber(): Promise<number> {
    const totalString = await this.getTotal();
    return parseFloat(totalString.replace('$', ''));
  }

  /**
   * Click finish button to complete order
   */
  async clickFinish(): Promise<void> {
    await this.clickElement(this.finishButton);
  }

  /**
   * Click cancel button to return to inventory
   */
  async clickCancel(): Promise<void> {
    await this.clickElement(this.cancelButton);
  }

  /**
   * Get payment information
   * @returns Payment info text
   */
  async getPaymentInfo(): Promise<string> {
    return await this.getText(this.paymentInfo);
  }

  /**
   * Get shipping information
   * @returns Shipping info text
   */
  async getShippingInfo(): Promise<string> {
    return await this.getText(this.shippingInfo);
  }

  /**
   * Get page title
   * @returns Page title text
   */
  async getPageTitle(): Promise<string> {
    return await this.getText(this.pageTitle);
  }

  /**
   * Check if a specific product is in the order
   * @param productName - Name of the product
   * @returns True if product is in order
   */
  async isProductInOrder(productName: string): Promise<boolean> {
    const itemNames = await this.getCartItemNames();
    return itemNames.includes(productName);
  }

  /**
   * Check if finish button is visible
   * @returns True if button is visible
   */
  async isFinishButtonVisible(): Promise<boolean> {
    return await this.isElementVisible(this.finishButton);
  }

  /**
   * Check if cancel button is visible
   * @returns True if button is visible
   */
  async isCancelButtonVisible(): Promise<boolean> {
    return await this.isElementVisible(this.cancelButton);
  }

  /**
   * Verify the total calculation is correct
   * @returns True if total = item total + tax
   */
  async verifyTotalCalculation(): Promise<boolean> {
    const itemTotal = await this.getItemTotalAsNumber();
    const tax = await this.getTaxAsNumber();
    const total = await this.getTotalAsNumber();

    const expectedTotal = itemTotal + tax;
    // Allow small floating point difference
    return Math.abs(total - expectedTotal) < 0.01;
  }

  /**
   * Verify user is on checkout step two page
   */
  async verifyOnCheckoutStepTwo(): Promise<void> {
    await this.expectUrlToContain('checkout-step-two');
    await this.expectElementToBeVisible(this.finishButton);
    await this.expectElementToBeVisible(this.itemTotal);
  }
}
