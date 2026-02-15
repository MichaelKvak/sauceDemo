import { Page } from '@playwright/test';
import { BasePage } from './common/BasePage';
import { URLS } from '../utils/constants';

/**
 * CartPage - Page Object for the shopping cart page
 * Handles all interactions with the shopping cart functionality
 */
export class CartPage extends BasePage {
  // Selectors
  private readonly pageTitle = '.title';
  private readonly cartItems = '.cart_item';
  private readonly cartItemName = '.inventory_item_name';
  private readonly cartItemDescription = '.inventory_item_desc';
  private readonly cartItemPrice = '.inventory_item_price';
  private readonly cartQuantity = '.cart_quantity';
  private readonly removeButton = 'button[id^="remove"]';
  private readonly continueShoppingButton = '#continue-shopping';
  private readonly checkoutButton = '#checkout';
  private readonly cartBadge = '.shopping_cart_badge';

  constructor(page: Page) {
    super(page);
  }

  /**
   * Navigate to cart page
   */
  async navigateToCartPage(): Promise<void> {
    await this.goto(URLS.cart);
    await this.waitForPageLoad();
  }

  /**
   * Get the number of items in the cart
   * @returns Number of cart items
   */
  async getCartItemCount(): Promise<number> {
    return await this.getElementCount(this.cartItems);
  }

  /**
   * Get all cart item names
   * @returns Array of product names in cart
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
   * Get all cart item descriptions
   * @returns Array of product descriptions
   */
  async getCartItemDescriptions(): Promise<string[]> {
    return await this.getAllText(this.cartItemDescription);
  }

  /**
   * Remove an item from cart by product name
   * @param productName - Name of the product to remove
   */
  async removeItemByName(productName: string): Promise<void> {
    const items = await this.page.locator(this.cartItems).all();

    for (const item of items) {
      const name = await item.locator(this.cartItemName).textContent();
      if (name?.trim() === productName) {
        await item.locator('button[id^="remove"]').click();
        return;
      }
    }

    throw new Error(`Product "${productName}" not found in cart for removal`);
  }

  /**
   * Remove an item from cart by index
   * @param index - Index of the item (0-based)
   */
  async removeItemByIndex(index: number): Promise<void> {
    const items = await this.page.locator(this.cartItems).all();
    if (index >= 0 && index < items.length) {
      await items[index].locator('button[id^="remove"]').click();
    } else {
      throw new Error(`Cart item index ${index} is out of range`);
    }
  }

  /**
   * Remove all items from cart
   */
  async removeAllItems(): Promise<void> {
    let itemCount = await this.getCartItemCount();

    while (itemCount > 0) {
      await this.removeItemByIndex(0);
      await this.waitForTimeout(300); // Wait for removal animation
      itemCount = await this.getCartItemCount();
    }
  }

  /**
   * Click continue shopping button
   */
  async continueShopping(): Promise<void> {
    await this.clickElement(this.continueShoppingButton);
  }

  /**
   * Click checkout button to proceed to checkout
   */
  async proceedToCheckout(): Promise<void> {
    await this.clickElement(this.checkoutButton);
  }

  /**
   * Check if cart is empty
   * @returns True if cart has no items
   */
  async isCartEmpty(): Promise<boolean> {
    const count = await this.getCartItemCount();
    return count === 0;
  }

  /**
   * Check if a specific product is in the cart
   * @param productName - Name of the product
   * @returns True if product is in cart
   */
  async isProductInCart(productName: string): Promise<boolean> {
    const itemNames = await this.getCartItemNames();
    return itemNames.includes(productName);
  }

  /**
   * Get page title
   * @returns Page title text
   */
  async getPageTitle(): Promise<string> {
    return await this.getText(this.pageTitle);
  }

  /**
   * Get quantity for a specific cart item
   * @param productName - Name of the product
   * @returns Quantity as number
   */
  async getItemQuantity(productName: string): Promise<number> {
    const items = await this.page.locator(this.cartItems).all();

    for (const item of items) {
      const name = await item.locator(this.cartItemName).textContent();
      if (name?.trim() === productName) {
        const quantityText = await item.locator(this.cartQuantity).textContent();
        return parseInt(quantityText?.trim() || '0', 10);
      }
    }

    return 0;
  }

  /**
   * Check if continue shopping button is visible
   * @returns True if button is visible
   */
  async isContinueShoppingButtonVisible(): Promise<boolean> {
    return await this.isElementVisible(this.continueShoppingButton);
  }

  /**
   * Check if checkout button is visible
   * @returns True if button is visible
   */
  async isCheckoutButtonVisible(): Promise<boolean> {
    return await this.isElementVisible(this.checkoutButton);
  }

  /**
   * Check if checkout button is enabled
   * @returns True if button is enabled
   */
  async isCheckoutButtonEnabled(): Promise<boolean> {
    return await this.isElementEnabled(this.checkoutButton);
  }

  /**
   * Verify user is on cart page
   */
  async verifyOnCartPage(): Promise<void> {
    await this.expectUrlToContain('cart');
    await this.expectElementToBeVisible(this.checkoutButton);
    await this.expectElementToBeVisible(this.continueShoppingButton);
  }
}
