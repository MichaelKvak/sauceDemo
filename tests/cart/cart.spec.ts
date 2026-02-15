import { test, expect } from '@playwright/test';
import { LoginPage } from '../../src/pages/LoginPage';
import { InventoryPage } from '../../src/pages/InventoryPage';
import { CartPage } from '../../src/pages/CartPage';
import { ProductDetailPage } from '../../src/pages/ProductDetailPage';
import { validUsers } from '../../src/data/users';
import { products } from '../../src/data/products';

test.describe('Shopping Cart Operations', () => {
  let loginPage: LoginPage;
  let inventoryPage: InventoryPage;
  let cartPage: CartPage;
  let productDetailPage: ProductDetailPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    inventoryPage = new InventoryPage(page);
    cartPage = new CartPage(page);
    productDetailPage = new ProductDetailPage(page);

    // Login before each test
    await loginPage.navigateToLoginPage();
    await loginPage.login(validUsers.standard.username, validUsers.standard.password);
    await inventoryPage.verifyOnInventoryPage();
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

    await inventoryPage.clickCartIcon();

    // Assert
    await cartPage.verifyOnCartPage();
    const cartItemCount = await cartPage.getCartItemCount();
    expect(cartItemCount).toBe(productsToAdd.length);

    const cartItemNames = await cartPage.getCartItemNames();
    for (const productName of productsToAdd) {
      expect(cartItemNames).toContain(productName);
    }
  });

  test('should remove product from cart', async () => {
    // Arrange
    const productsToAdd = [products.backpack.name, products.bikeLight.name];

    for (const productName of productsToAdd) {
      await inventoryPage.addProductToCartByName(productName);
    }

    await inventoryPage.clickCartIcon();
    await cartPage.verifyOnCartPage();

    // Act
    await cartPage.removeItemByName(products.backpack.name);

    // Assert
    const cartItemCount = await cartPage.getCartItemCount();
    expect(cartItemCount).toBe(1);

    const cartItemNames = await cartPage.getCartItemNames();
    expect(cartItemNames).not.toContain(products.backpack.name);
    expect(cartItemNames).toContain(products.bikeLight.name);
  });

  test('should continue shopping from cart page', async ({ page }) => {
    // Arrange
    await inventoryPage.addProductToCartByName(products.backpack.name);
    await inventoryPage.clickCartIcon();
    await cartPage.verifyOnCartPage();

    // Act
    await cartPage.continueShopping();

    // Assert
    await expect(page).toHaveURL(/.*inventory/);
    await inventoryPage.verifyOnInventoryPage();
  });

  test('should display empty cart when all items are removed', async () => {
    // Arrange
    await inventoryPage.addProductToCartByName(products.backpack.name);
    await inventoryPage.clickCartIcon();
    await cartPage.verifyOnCartPage();

    // Act
    await cartPage.removeItemByName(products.backpack.name);

    // Assert
    const isEmpty = await cartPage.isCartEmpty();
    expect(isEmpty).toBeTruthy();

    const cartItemCount = await cartPage.getCartItemCount();
    expect(cartItemCount).toBe(0);
  });

  test('should maintain cart items across pages', async () => {
    // Arrange
    const productsToAdd = [products.backpack.name, products.bikeLight.name];

    // Act - Add products from inventory
    for (const productName of productsToAdd) {
      await inventoryPage.addProductToCartByName(productName);
    }

    // Navigate to product detail page
    await inventoryPage.clickProductByName(products.boltTShirt.name);
    await productDetailPage.verifyProductDetailsDisplayed();

    // Go back to inventory
    await productDetailPage.goBackToProducts();
    await inventoryPage.verifyOnInventoryPage();

    // Navigate to cart
    await inventoryPage.clickCartIcon();

    // Assert
    await cartPage.verifyOnCartPage();
    const cartItemCount = await cartPage.getCartItemCount();
    expect(cartItemCount).toBe(productsToAdd.length);

    const cartItemNames = await cartPage.getCartItemNames();
    for (const productName of productsToAdd) {
      expect(cartItemNames).toContain(productName);
    }
  });

  test('should verify cart item prices are displayed correctly', async () => {
    // Arrange
    const productToAdd = products.backpack;

    // Act
    await inventoryPage.addProductToCartByName(productToAdd.name);
    await inventoryPage.clickCartIcon();

    // Assert
    const cartItemPrices = await cartPage.getCartItemPrices();
    expect(cartItemPrices.length).toBeGreaterThan(0);
    expect(cartItemPrices[0]).toContain('$');
    expect(cartItemPrices[0]).toContain(productToAdd.price.toString());
  });

  test('should verify checkout button is visible and enabled', async () => {
    // Arrange
    await inventoryPage.addProductToCartByName(products.backpack.name);
    await inventoryPage.clickCartIcon();

    // Assert
    const checkoutButtonVisible = await cartPage.isCheckoutButtonVisible();
    expect(checkoutButtonVisible).toBeTruthy();

    const checkoutButtonEnabled = await cartPage.isCheckoutButtonEnabled();
    expect(checkoutButtonEnabled).toBeTruthy();
  });

  test('should verify continue shopping button is visible', async () => {
    // Arrange
    await inventoryPage.clickCartIcon();

    // Assert
    const continueShoppingVisible = await cartPage.isContinueShoppingButtonVisible();
    expect(continueShoppingVisible).toBeTruthy();
  });

  test('should verify cart page title', async () => {
    // Arrange
    await inventoryPage.clickCartIcon();

    // Act
    const pageTitle = await cartPage.getPageTitle();

    // Assert
    expect(pageTitle).toBe('Your Cart');
  });

  test('should check if specific product is in cart', async () => {
    // Arrange
    const productToAdd = products.fleeceJacket.name;
    await inventoryPage.addProductToCartByName(productToAdd);
    await inventoryPage.clickCartIcon();

    // Act
    const isInCart = await cartPage.isProductInCart(productToAdd);

    // Assert
    expect(isInCart).toBeTruthy();
  });

  test('should remove all items from cart', async () => {
    // Arrange
    const productsToAdd = [
      products.backpack.name,
      products.bikeLight.name,
      products.boltTShirt.name
    ];

    for (const productName of productsToAdd) {
      await inventoryPage.addProductToCartByName(productName);
    }

    await inventoryPage.clickCartIcon();

    // Act
    await cartPage.removeAllItems();

    // Assert
    const isEmpty = await cartPage.isCartEmpty();
    expect(isEmpty).toBeTruthy();

    const cartItemCount = await cartPage.getCartItemCount();
    expect(cartItemCount).toBe(0);
  });
});
