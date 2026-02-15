import { test, expect } from '@playwright/test';
import { LoginPage } from '../../src/pages/LoginPage';
import { InventoryPage } from '../../src/pages/InventoryPage';
import { CartPage } from '../../src/pages/CartPage';
import { CheckoutStepOnePage } from '../../src/pages/CheckoutStepOnePage';
import { CheckoutStepTwoPage } from '../../src/pages/CheckoutStepTwoPage';
import { CheckoutCompletePage } from '../../src/pages/CheckoutCompletePage';
import { validUsers } from '../../src/data/users';
import { products } from '../../src/data/products';
import { validCheckoutInfo } from '../../src/data/checkout';
import { URLS } from '../../src/utils/constants';

test.describe('End-to-End User Journeys', () => {
  let loginPage: LoginPage;
  let inventoryPage: InventoryPage;
  let cartPage: CartPage;
  let checkoutStepOne: CheckoutStepOnePage;
  let checkoutStepTwo: CheckoutStepTwoPage;
  let checkoutComplete: CheckoutCompletePage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    inventoryPage = new InventoryPage(page);
    cartPage = new CartPage(page);
    checkoutStepOne = new CheckoutStepOnePage(page);
    checkoutStepTwo = new CheckoutStepTwoPage(page);
    checkoutComplete = new CheckoutCompletePage(page);
  });

  test('should logout successfully', async ({ page }) => {
    // Arrange - Login first
    await loginPage.navigateToLoginPage();
    await loginPage.login(validUsers.standard.username, validUsers.standard.password);
    await inventoryPage.verifyOnInventoryPage();

    // Act
    await inventoryPage.logout();

    // Assert
    await expect(page).toHaveURL(URLS.login);
    await loginPage.verifyOnLoginPage();

    // Verify cannot access inventory without login
    await page.goto(URLS.inventory);
    await expect(page).toHaveURL(URLS.login);
  });

  test('should complete full user journey from login to checkout', async ({ page }) => {
    // Step 1: Login
    await loginPage.navigateToLoginPage();
    await loginPage.login(validUsers.standard.username, validUsers.standard.password);
    await inventoryPage.verifyOnInventoryPage();

    // Step 2: Browse products and add to cart
    const productsToAdd = [products.backpack.name, products.bikeLight.name];

    for (const productName of productsToAdd) {
      await inventoryPage.addProductToCartByName(productName);
    }

    const cartBadgeCount = await inventoryPage.getCartItemCount();
    expect(cartBadgeCount).toBe(productsToAdd.length);

    // Step 3: View cart
    await inventoryPage.clickCartIcon();
    await cartPage.verifyOnCartPage();

    const cartItemCount = await cartPage.getCartItemCount();
    expect(cartItemCount).toBe(productsToAdd.length);

    // Step 4: Proceed to checkout
    await cartPage.proceedToCheckout();
    await checkoutStepOne.verifyOnCheckoutStepOne();

    // Step 5: Fill checkout information
    await checkoutStepOne.fillCheckoutInformation(validCheckoutInfo);
    await checkoutStepOne.clickContinue();

    // Step 6: Review order
    await checkoutStepTwo.verifyOnCheckoutStepTwo();
    const orderItemCount = await checkoutStepTwo.getCartItemCount();
    expect(orderItemCount).toBe(productsToAdd.length);

    // Verify total calculation
    const isTotalCorrect = await checkoutStepTwo.verifyTotalCalculation();
    expect(isTotalCorrect).toBeTruthy();

    // Step 7: Complete purchase
    await checkoutStepTwo.clickFinish();

    // Step 8: Verify order confirmation
    await checkoutComplete.verifyOnCheckoutComplete();
    const isComplete = await checkoutComplete.isOrderComplete();
    expect(isComplete).toBeTruthy();

    const completeHeader = await checkoutComplete.getCompleteHeader();
    expect(completeHeader).toContain('Thank you');

    // Step 9: Return to inventory
    await checkoutComplete.goBackHome();
    await inventoryPage.verifyOnInventoryPage();

    // Step 10: Logout
    await inventoryPage.logout();
    await expect(page).toHaveURL(URLS.login);
  });

  test('should reset app state and clear cart', async () => {
    // Arrange - Login and add products
    await loginPage.navigateToLoginPage();
    await loginPage.login(validUsers.standard.username, validUsers.standard.password);

    await inventoryPage.addProductToCartByName(products.backpack.name);
    await inventoryPage.addProductToCartByName(products.bikeLight.name);

    let cartCount = await inventoryPage.getCartItemCount();
    expect(cartCount).toBe(2);

    // Act - Reset app state
    await inventoryPage.resetAppState();

    // Assert - Cart should be cleared
    cartCount = await inventoryPage.getCartItemCount();
    expect(cartCount).toBe(0);

    const cartBadgeVisible = await inventoryPage.isCartBadgeVisible();
    expect(cartBadgeVisible).toBeFalsy();
  });

  test('should navigate using browser back button', async ({ page }) => {
    // Arrange - Login
    await loginPage.navigateToLoginPage();
    await loginPage.login(validUsers.standard.username, validUsers.standard.password);
    await inventoryPage.verifyOnInventoryPage();

    // Navigate to cart
    await inventoryPage.clickCartIcon();
    await cartPage.verifyOnCartPage();

    // Act - Use browser back button
    await page.goBack();

    // Assert - Should be back on inventory page
    await inventoryPage.verifyOnInventoryPage();

    // Navigate forward
    await page.goForward();
    await cartPage.verifyOnCartPage();
  });

  test('should prevent unauthorized access to protected pages', async ({ page }) => {
    // Act - Try to access inventory without login
    await page.goto(URLS.inventory);

    // Assert - Should redirect to login
    await expect(page).toHaveURL(URLS.login);

    // Try to access cart without login
    await page.goto(URLS.cart);
    await expect(page).toHaveURL(URLS.login);

    // Try to access checkout without login
    await page.goto(URLS.checkoutStepOne);
    await expect(page).toHaveURL(URLS.login);

    // Now login
    await loginPage.login(validUsers.standard.username, validUsers.standard.password);
    await expect(page).toHaveURL(/.*inventory/);

    // After login, should be able to access protected pages
    await page.goto(URLS.cart);
    await expect(page).toHaveURL(URLS.cart);
  });

  test('should maintain session across page reloads', async ({ page }) => {
    // Arrange - Login and add items
    await loginPage.navigateToLoginPage();
    await loginPage.login(validUsers.standard.username, validUsers.standard.password);
    await inventoryPage.addProductToCartByName(products.backpack.name);

    const cartCountBefore = await inventoryPage.getCartItemCount();
    expect(cartCountBefore).toBe(1);

    // Act - Reload page
    await page.reload();

    // Assert - Should still be logged in with items in cart
    await inventoryPage.verifyOnInventoryPage();
    const cartCountAfter = await inventoryPage.getCartItemCount();
    expect(cartCountAfter).toBe(1);
  });

  test('should handle multiple product additions and removals', async () => {
    // Arrange - Login
    await loginPage.navigateToLoginPage();
    await loginPage.login(validUsers.standard.username, validUsers.standard.password);

    // Act - Add multiple products
    await inventoryPage.addProductToCartByName(products.backpack.name);
    await inventoryPage.addProductToCartByName(products.bikeLight.name);
    await inventoryPage.addProductToCartByName(products.boltTShirt.name);

    let cartCount = await inventoryPage.getCartItemCount();
    expect(cartCount).toBe(3);

    // Remove one product
    await inventoryPage.removeProductFromCartByName(products.bikeLight.name);
    cartCount = await inventoryPage.getCartItemCount();
    expect(cartCount).toBe(2);

    // Add another product
    await inventoryPage.addProductToCartByName(products.fleeceJacket.name);
    cartCount = await inventoryPage.getCartItemCount();
    expect(cartCount).toBe(3);

    // Verify in cart
    await inventoryPage.clickCartIcon();
    const cartItemCount = await cartPage.getCartItemCount();
    expect(cartItemCount).toBe(3);

    const cartItemNames = await cartPage.getCartItemNames();
    expect(cartItemNames).toContain(products.backpack.name);
    expect(cartItemNames).not.toContain(products.bikeLight.name);
    expect(cartItemNames).toContain(products.boltTShirt.name);
    expect(cartItemNames).toContain(products.fleeceJacket.name);
  });

  test('should navigate through all pages in correct order', async ({ page }) => {
    // Step 1: Login page
    await loginPage.navigateToLoginPage();
    await loginPage.verifyOnLoginPage();

    // Step 2: Login and go to inventory
    await loginPage.login(validUsers.standard.username, validUsers.standard.password);
    await inventoryPage.verifyOnInventoryPage();

    // Step 3: Add item and go to cart
    await inventoryPage.addProductToCartByName(products.backpack.name);
    await inventoryPage.clickCartIcon();
    await cartPage.verifyOnCartPage();

    // Step 4: Proceed to checkout step one
    await cartPage.proceedToCheckout();
    await checkoutStepOne.verifyOnCheckoutStepOne();

    // Step 5: Fill info and go to checkout step two
    await checkoutStepOne.completeStepOne(validCheckoutInfo);
    await checkoutStepTwo.verifyOnCheckoutStepTwo();

    // Step 6: Complete order
    await checkoutStepTwo.clickFinish();
    await checkoutComplete.verifyOnCheckoutComplete();

    // Step 7: Go back to inventory
    await checkoutComplete.goBackHome();
    await inventoryPage.verifyOnInventoryPage();

    // All page transitions successful
    expect(true).toBeTruthy();
  });

  test('should verify menu functionality', async () => {
    // Arrange - Login
    await loginPage.navigateToLoginPage();
    await loginPage.login(validUsers.standard.username, validUsers.standard.password);

    // Act - Open menu
    await inventoryPage.openMenu();

    // Assert - Menu should be visible (logout link is visible)
    await inventoryPage.waitForElementToBeVisible('#logout_sidebar_link');

    // Close menu
    await inventoryPage.closeMenu();
  });

  test('should handle empty cart checkout attempt gracefully', async ({ page }) => {
    // Arrange - Login
    await loginPage.navigateToLoginPage();
    await loginPage.login(validUsers.standard.username, validUsers.standard.password);

    // Act - Go directly to cart without adding items
    await inventoryPage.clickCartIcon();

    // Assert - Cart should be empty
    const isEmpty = await cartPage.isCartEmpty();
    expect(isEmpty).toBeTruthy();

    // Checkout button should still be visible
    const checkoutButtonVisible = await cartPage.isCheckoutButtonVisible();
    expect(checkoutButtonVisible).toBeTruthy();

    // Can proceed to checkout even with empty cart (SauceDemo allows this)
    await cartPage.proceedToCheckout();
    await expect(page).toHaveURL(/.*checkout-step-one/);
  });
});
