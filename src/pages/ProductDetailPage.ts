import { Page } from '@playwright/test';
import { BasePage } from './common/BasePage';

/**
 * ProductDetailPage - Page Object for individual product detail page
 * Handles viewing and interacting with specific product details
 */
export class ProductDetailPage extends BasePage {
  // Selectors
  private readonly productName = '.inventory_details_name';
  private readonly productDescription = '.inventory_details_desc';
  private readonly productPrice = '.inventory_details_price';
  private readonly productImage = '.inventory_details_img';
  private readonly addToCartButton = 'button[id^="add-to-cart"]';
  private readonly removeButton = 'button[id^="remove"]';
  private readonly backButton = '#back-to-products';
  private readonly cartBadge = '.shopping_cart_badge';

  constructor(page: Page) {
    super(page);
  }

  /**
   * Get product name
   * @returns Product name text
   */
  async getProductName(): Promise<string> {
    return await this.getText(this.productName);
  }

  /**
   * Get product description
   * @returns Product description text
   */
  async getProductDescription(): Promise<string> {
    return await this.getText(this.productDescription);
  }

  /**
   * Get product price
   * @returns Product price as string
   */
  async getProductPrice(): Promise<string> {
    return await this.getText(this.productPrice);
  }

  /**
   * Get product price as number
   * @returns Product price as number
   */
  async getProductPriceAsNumber(): Promise<number> {
    const priceString = await this.getProductPrice();
    return parseFloat(priceString.replace('$', ''));
  }

  /**
   * Add product to cart
   */
  async addToCart(): Promise<void> {
    await this.clickElement(this.addToCartButton);
  }

  /**
   * Remove product from cart
   */
  async removeFromCart(): Promise<void> {
    await this.clickElement(this.removeButton);
  }

  /**
   * Go back to products page
   */
  async goBackToProducts(): Promise<void> {
    await this.clickElement(this.backButton);
  }

  /**
   * Check if Add to Cart button is visible
   * @returns True if button is visible
   */
  async isAddToCartButtonVisible(): Promise<boolean> {
    return await this.isElementVisible(this.addToCartButton);
  }

  /**
   * Check if Remove button is visible
   * @returns True if button is visible
   */
  async isRemoveButtonVisible(): Promise<boolean> {
    return await this.isElementVisible(this.removeButton);
  }

  /**
   * Check if product image is visible
   * @returns True if image is visible
   */
  async isProductImageVisible(): Promise<boolean> {
    return await this.isElementVisible(this.productImage);
  }

  /**
   * Check if back button is visible
   * @returns True if button is visible
   */
  async isBackButtonVisible(): Promise<boolean> {
    return await this.isElementVisible(this.backButton);
  }

  /**
   * Get cart item count from badge
   * @returns Number of items in cart, or 0 if badge not visible
   */
  async getCartItemCount(): Promise<number> {
    if (await this.isElementVisible(this.cartBadge)) {
      const badgeText = await this.getText(this.cartBadge);
      return parseInt(badgeText, 10);
    }
    return 0;
  }

  /**
   * Verify all product details are displayed
   */
  async verifyProductDetailsDisplayed(): Promise<void> {
    await this.expectElementToBeVisible(this.productName);
    await this.expectElementToBeVisible(this.productDescription);
    await this.expectElementToBeVisible(this.productPrice);
    await this.expectElementToBeVisible(this.productImage);
  }

  /**
   * Verify product details match expected values
   * @param expectedName - Expected product name
   * @param expectedPrice - Expected product price
   * @param expectedDescription - Expected product description (optional)
   */
  async verifyProductDetails(
    expectedName: string,
    expectedPrice: string,
    expectedDescription?: string
  ): Promise<void> {
    await this.expectElementToContainText(this.productName, expectedName);
    await this.expectElementToContainText(this.productPrice, expectedPrice);

    if (expectedDescription) {
      await this.expectElementToContainText(this.productDescription, expectedDescription);
    }
  }
}
