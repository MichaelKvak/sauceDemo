import { Page } from '@playwright/test';
import { BasePage } from './common/BasePage';
import { URLS } from '../utils/constants';
import { SortOption } from '../types';

/**
 * InventoryPage - Page Object for the products/inventory page
 * Handles all interactions with the product listing functionality
 */
export class InventoryPage extends BasePage {
  // Selectors
  private readonly pageTitle = '.title';
  private readonly productContainer = '.inventory_list';
  private readonly productItems = '.inventory_item';
  private readonly productName = '.inventory_item_name';
  private readonly productDescription = '.inventory_item_desc';
  private readonly productPrice = '.inventory_item_price';
  private readonly productImage = '.inventory_item_img';
  private readonly addToCartButton = 'button[id^="add-to-cart"]';
  private readonly removeButton = 'button[id^="remove"]';
  private readonly cartBadge = '.shopping_cart_badge';
  private readonly cartIcon = '.shopping_cart_link';
  private readonly sortDropdown = '.product_sort_container';
  private readonly menuButton = '#react-burger-menu-btn';
  private readonly menuCloseButton = '#react-burger-cross-btn';
  private readonly logoutLink = '#logout_sidebar_link';
  private readonly allItemsLink = '#inventory_sidebar_link';
  private readonly aboutLink = '#about_sidebar_link';
  private readonly resetAppStateLink = '#reset_sidebar_link';

  constructor(page: Page) {
    super(page);
  }

  /**
   * Navigate to inventory page
   */
  async navigateToInventoryPage(): Promise<void> {
    await this.goto(URLS.inventory);
    await this.waitForPageLoad();
  }

  /**
   * Get the total number of products displayed
   * @returns Number of products
   */
  async getProductCount(): Promise<number> {
    return await this.getElementCount(this.productItems);
  }

  /**
   * Get all product names
   * @returns Array of product names
   */
  async getProductNames(): Promise<string[]> {
    return await this.getAllText(this.productName);
  }

  /**
   * Get all product prices as strings
   * @returns Array of price strings
   */
  async getProductPrices(): Promise<string[]> {
    return await this.getAllText(this.productPrice);
  }

  /**
   * Get all product descriptions
   * @returns Array of product descriptions
   */
  async getProductDescriptions(): Promise<string[]> {
    return await this.getAllText(this.productDescription);
  }

  /**
   * Add a product to cart by its name
   * @param productName - Name of the product to add
   */
  async addProductToCartByName(productName: string): Promise<void> {
    const products = await this.page.locator(this.productItems).all();

    for (const product of products) {
      const name = await product.locator(this.productName).textContent();
      if (name?.trim() === productName) {
        await product.locator('button[id^="add-to-cart"]').click();
        return;
      }
    }

    throw new Error(`Product "${productName}" not found`);
  }

  /**
   * Add a product to cart by its index (0-based)
   * @param index - Index of the product
   */
  async addProductToCartByIndex(index: number): Promise<void> {
    const products = await this.page.locator(this.productItems).all();
    if (index >= 0 && index < products.length) {
      await products[index].locator('button[id^="add-to-cart"]').click();
    } else {
      throw new Error(`Product index ${index} is out of range`);
    }
  }

  /**
   * Remove a product from cart by its name
   * @param productName - Name of the product to remove
   */
  async removeProductFromCartByName(productName: string): Promise<void> {
    const products = await this.page.locator(this.productItems).all();

    for (const product of products) {
      const name = await product.locator(this.productName).textContent();
      if (name?.trim() === productName) {
        await product.locator('button[id^="remove"]').click();
        return;
      }
    }

    throw new Error(`Product "${productName}" not found for removal`);
  }

  /**
   * Get the cart item count from the badge
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
   * Sort products by a specific option
   * @param option - Sort option (az, za, lohi, hilo)
   */
  async sortProductsBy(option: SortOption): Promise<void> {
    await this.selectDropdown(this.sortDropdown, option);
    await this.waitForTimeout(500); // Wait for sorting to complete
  }

  /**
   * Get the current sort option value
   * @returns Current sort option
   */
  async getCurrentSortOption(): Promise<string | null> {
    return await this.getAttribute(this.sortDropdown, 'value');
  }

  /**
   * Click on a product by name to view details
   * @param productName - Name of the product
   */
  async clickProductByName(productName: string): Promise<void> {
    const products = await this.page.locator(this.productItems).all();

    for (const product of products) {
      const name = await product.locator(this.productName).textContent();
      if (name?.trim() === productName) {
        await product.locator(this.productName).click();
        return;
      }
    }

    throw new Error(`Product "${productName}" not found to click`);
  }

  /**
   * Click on a product image by product name
   * @param productName - Name of the product
   */
  async clickProductImageByName(productName: string): Promise<void> {
    const products = await this.page.locator(this.productItems).all();

    for (const product of products) {
      const name = await product.locator(this.productName).textContent();
      if (name?.trim() === productName) {
        await product.locator('img').click();
        return;
      }
    }

    throw new Error(`Product image for "${productName}" not found`);
  }

  /**
   * Open the hamburger menu
   */
  async openMenu(): Promise<void> {
    await this.clickElement(this.menuButton);
    await this.waitForElementToBeVisible(this.logoutLink);
  }

  /**
   * Close the hamburger menu
   */
  async closeMenu(): Promise<void> {
    await this.clickElement(this.menuCloseButton);
    await this.waitForElementToBeHidden(this.logoutLink);
  }

  /**
   * Logout from the application
   */
  async logout(): Promise<void> {
    await this.openMenu();
    await this.clickElement(this.logoutLink);
  }

  /**
   * Reset app state via menu
   */
  async resetAppState(): Promise<void> {
    await this.openMenu();
    await this.clickElement(this.resetAppStateLink);
    await this.closeMenu();
  }

  /**
   * Click on About link in menu
   */
  async clickAboutLink(): Promise<void> {
    await this.openMenu();
    await this.clickElement(this.aboutLink);
  }

  /**
   * Click on the cart icon to navigate to cart
   */
  async clickCartIcon(): Promise<void> {
    await this.clickElement(this.cartIcon);
  }

  /**
   * Check if cart badge is visible
   * @returns True if cart badge is visible
   */
  async isCartBadgeVisible(): Promise<boolean> {
    return await this.isElementVisible(this.cartBadge);
  }

  /**
   * Get page title text
   * @returns Page title
   */
  async getPageTitle(): Promise<string> {
    return await this.getText(this.pageTitle);
  }

  /**
   * Check if a specific product is displayed
   * @param productName - Name of the product
   * @returns True if product is visible
   */
  async isProductDisplayed(productName: string): Promise<boolean> {
    const names = await this.getProductNames();
    return names.includes(productName);
  }

  /**
   * Verify user is on inventory page
   */
  async verifyOnInventoryPage(): Promise<void> {
    await this.expectUrlToContain('inventory');
    await this.expectElementToBeVisible(this.productContainer);
  }
}
