import { test, expect } from '@playwright/test';
import { LoginPage } from '../../src/pages/LoginPage';
import { InventoryPage } from '../../src/pages/InventoryPage';
import { ProductDetailPage } from '../../src/pages/ProductDetailPage';
import { validUsers } from '../../src/data/users';
import { products, productNamesAZ, productNamesZA, TOTAL_PRODUCTS_COUNT } from '../../src/data/products';
import { sortOptions } from '../../src/data/products';
import { isSortedAlphabetically, isSortedReverseAlphabetically, parsePriceToNumber, isSortedAscending, isSortedDescending } from '../../src/utils/helpers';

test.describe('Product Browsing Functionality', () => {
  let loginPage: LoginPage;
  let inventoryPage: InventoryPage;
  let productDetailPage: ProductDetailPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    inventoryPage = new InventoryPage(page);
    productDetailPage = new ProductDetailPage(page);

    // Login before each test
    await loginPage.navigateToLoginPage();
    await loginPage.login(validUsers.standard.username, validUsers.standard.password);
    await inventoryPage.verifyOnInventoryPage();
  });

  test('should display all products on inventory page', async () => {
    // Act
    const productCount = await inventoryPage.getProductCount();
    const productNames = await inventoryPage.getProductNames();
    const productPrices = await inventoryPage.getProductPrices();

    // Assert
    expect(productCount).toBe(TOTAL_PRODUCTS_COUNT);
    expect(productNames.length).toBe(TOTAL_PRODUCTS_COUNT);
    expect(productPrices.length).toBe(TOTAL_PRODUCTS_COUNT);

    // Verify each product has required elements
    for (const name of productNames) {
      expect(name.length).toBeGreaterThan(0);
    }

    for (const price of productPrices) {
      expect(price).toContain('$');
    }
  });

  test('should sort products by name A to Z', async () => {
    // Act
    await inventoryPage.sortProductsBy(sortOptions.nameAZ);
    const productNames = await inventoryPage.getProductNames();

    // Assert
    expect(isSortedAlphabetically(productNames)).toBeTruthy();
    expect(productNames).toEqual(productNamesAZ);
  });

  test('should sort products by name Z to A', async () => {
    // Act
    await inventoryPage.sortProductsBy(sortOptions.nameZA);
    const productNames = await inventoryPage.getProductNames();

    // Assert
    expect(isSortedReverseAlphabetically(productNames)).toBeTruthy();
    expect(productNames).toEqual(productNamesZA);
  });

  test('should sort products by price low to high', async () => {
    // Act
    await inventoryPage.sortProductsBy(sortOptions.priceLowHigh);
    const productPriceStrings = await inventoryPage.getProductPrices();

    // Convert prices to numbers
    const productPrices = productPriceStrings.map(price => parsePriceToNumber(price));

    // Assert
    expect(isSortedAscending(productPrices)).toBeTruthy();
  });

  test('should sort products by price high to low', async () => {
    // Act
    await inventoryPage.sortProductsBy(sortOptions.priceHighLow);
    const productPriceStrings = await inventoryPage.getProductPrices();

    // Convert prices to numbers
    const productPrices = productPriceStrings.map(price => parsePriceToNumber(price));

    // Assert
    expect(isSortedDescending(productPrices)).toBeTruthy();
  });

  test('should navigate to product detail page and back', async ({ page }) => {
    // Arrange
    const productToView = products.backpack.name;

    // Act
    await inventoryPage.clickProductByName(productToView);

    // Assert - On product detail page
    await expect(page).toHaveURL(/.*inventory-item/);
    await productDetailPage.verifyProductDetailsDisplayed();

    const productName = await productDetailPage.getProductName();
    expect(productName).toBe(productToView);

    // Act - Go back to inventory
    await productDetailPage.goBackToProducts();

    // Assert - Back on inventory page
    await inventoryPage.verifyOnInventoryPage();
    const productCount = await inventoryPage.getProductCount();
    expect(productCount).toBe(TOTAL_PRODUCTS_COUNT);
  });

  test('should add product to cart from inventory page', async () => {
    // Arrange
    const productToAdd = products.backpack.name;

    // Act
    await inventoryPage.addProductToCartByName(productToAdd);

    // Assert
    const cartCount = await inventoryPage.getCartItemCount();
    expect(cartCount).toBe(1);

    const cartBadgeVisible = await inventoryPage.isCartBadgeVisible();
    expect(cartBadgeVisible).toBeTruthy();
  });

  test('should add multiple products to cart', async () => {
    // Arrange
    const productsToAdd = [
      products.backpack.name,
      products.bikeLight.name,
      products.boltTShirt.name
    ];

    // Act
    for (const productName of productsToAdd) {
      await inventoryPage.addProductToCartByName(productName);
    }

    // Assert
    const cartCount = await inventoryPage.getCartItemCount();
    expect(cartCount).toBe(productsToAdd.length);
  });

  test('should remove product from cart on inventory page', async () => {
    // Arrange
    const productToAdd = products.backpack.name;
    await inventoryPage.addProductToCartByName(productToAdd);

    let cartCount = await inventoryPage.getCartItemCount();
    expect(cartCount).toBe(1);

    // Act
    await inventoryPage.removeProductFromCartByName(productToAdd);

    // Assert
    cartCount = await inventoryPage.getCartItemCount();
    expect(cartCount).toBe(0);

    const cartBadgeVisible = await inventoryPage.isCartBadgeVisible();
    expect(cartBadgeVisible).toBeFalsy();
  });

  test('should navigate to cart page from inventory', async ({ page }) => {
    // Act
    await inventoryPage.clickCartIcon();

    // Assert
    await expect(page).toHaveURL(/.*cart/);
  });

  test('should verify page title is correct', async () => {
    // Act
    const pageTitle = await inventoryPage.getPageTitle();

    // Assert
    expect(pageTitle).toBe('Products');
  });

  test('should verify specific product is displayed', async () => {
    // Arrange
    const productToCheck = products.fleeceJacket.name;

    // Act
    const isDisplayed = await inventoryPage.isProductDisplayed(productToCheck);

    // Assert
    expect(isDisplayed).toBeTruthy();
  });
});
