import { test, expect } from '@playwright/test';
import { LoginPage } from '../../src/pages/LoginPage';
import { InventoryPage } from '../../src/pages/InventoryPage';
import { CartPage } from '../../src/pages/CartPage';
import { CheckoutStepOnePage } from '../../src/pages/CheckoutStepOnePage';
import { CheckoutStepTwoPage } from '../../src/pages/CheckoutStepTwoPage';
import { CheckoutCompletePage } from '../../src/pages/CheckoutCompletePage';
import { validUsers } from '../../src/data/users';
import { products } from '../../src/data/products';
import { validCheckoutInfo, invalidCheckoutInfo } from '../../src/data/checkout';
import { ERROR_MESSAGES, SUCCESS_MESSAGES } from '../../src/utils/constants';

test.describe('Checkout Process', () => {
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

    // Login and add product to cart before each test
    await loginPage.navigateToLoginPage();
    await loginPage.login(validUsers.standard.username, validUsers.standard.password);
    await inventoryPage.addProductToCartByName(products.backpack.name);
    await inventoryPage.clickCartIcon();
    await cartPage.verifyOnCartPage();
  });

  test('should complete checkout with valid information', async ({ page }) => {
    // Act - Proceed to checkout
    await cartPage.proceedToCheckout();
    await checkoutStepOne.verifyOnCheckoutStepOne();

    // Fill checkout information
    await checkoutStepOne.fillCheckoutInformation(validCheckoutInfo);
    await checkoutStepOne.clickContinue();

    // Verify step two
    await checkoutStepTwo.verifyOnCheckoutStepTwo();
    const itemCount = await checkoutStepTwo.getCartItemCount();
    expect(itemCount).toBeGreaterThan(0);

    // Verify totals are displayed
    const itemTotal = await checkoutStepTwo.getItemTotal();
    const tax = await checkoutStepTwo.getTax();
    const total = await checkoutStepTwo.getTotal();

    expect(itemTotal).toContain('$');
    expect(tax).toContain('$');
    expect(total).toContain('$');

    // Verify total calculation
    const isTotalCorrect = await checkoutStepTwo.verifyTotalCalculation();
    expect(isTotalCorrect).toBeTruthy();

    // Finish checkout
    await checkoutStepTwo.clickFinish();

    // Assert - Order complete
    await checkoutComplete.verifyOnCheckoutComplete();
    await expect(page).toHaveURL(/.*checkout-complete/);

    const completeHeader = await checkoutComplete.getCompleteHeader();
    expect(completeHeader).toContain('Thank you');

    const isComplete = await checkoutComplete.isOrderComplete();
    expect(isComplete).toBeTruthy();
  });

  test('should show error when first name is missing', async () => {
    // Arrange
    await cartPage.proceedToCheckout();
    await checkoutStepOne.verifyOnCheckoutStepOne();

    // Act
    await checkoutStepOne.fillCheckoutInformation(invalidCheckoutInfo.missingFirstName);
    await checkoutStepOne.clickContinue();

    // Assert
    const isErrorVisible = await checkoutStepOne.isErrorMessageVisible();
    expect(isErrorVisible).toBeTruthy();

    const errorMessage = await checkoutStepOne.getErrorMessage();
    expect(errorMessage).toBe(ERROR_MESSAGES.firstNameRequired);
  });

  test('should show error when last name is missing', async () => {
    // Arrange
    await cartPage.proceedToCheckout();
    await checkoutStepOne.verifyOnCheckoutStepOne();

    // Act
    await checkoutStepOne.fillCheckoutInformation(invalidCheckoutInfo.missingLastName);
    await checkoutStepOne.clickContinue();

    // Assert
    const isErrorVisible = await checkoutStepOne.isErrorMessageVisible();
    expect(isErrorVisible).toBeTruthy();

    const errorMessage = await checkoutStepOne.getErrorMessage();
    expect(errorMessage).toBe(ERROR_MESSAGES.lastNameRequired);
  });

  test('should show error when postal code is missing', async () => {
    // Arrange
    await cartPage.proceedToCheckout();
    await checkoutStepOne.verifyOnCheckoutStepOne();

    // Act
    await checkoutStepOne.fillCheckoutInformation(invalidCheckoutInfo.missingPostalCode);
    await checkoutStepOne.clickContinue();

    // Assert
    const isErrorVisible = await checkoutStepOne.isErrorMessageVisible();
    expect(isErrorVisible).toBeTruthy();

    const errorMessage = await checkoutStepOne.getErrorMessage();
    expect(errorMessage).toBe(ERROR_MESSAGES.postalCodeRequired);
  });

  test('should cancel checkout and return to cart', async ({ page }) => {
    // Arrange
    await cartPage.proceedToCheckout();
    await checkoutStepOne.verifyOnCheckoutStepOne();

    // Act
    await checkoutStepOne.clickCancel();

    // Assert
    await expect(page).toHaveURL(/.*cart/);
    await cartPage.verifyOnCartPage();

    const cartItemCount = await cartPage.getCartItemCount();
    expect(cartItemCount).toBeGreaterThan(0);
  });

  test('should display correct item information in checkout overview', async () => {
    // Arrange
    const productAdded = products.backpack;

    // Act
    await cartPage.proceedToCheckout();
    await checkoutStepOne.completeStepOne(validCheckoutInfo);
    await checkoutStepTwo.verifyOnCheckoutStepTwo();

    // Assert
    const cartItemNames = await checkoutStepTwo.getCartItemNames();
    expect(cartItemNames).toContain(productAdded.name);

    const isProductInOrder = await checkoutStepTwo.isProductInOrder(productAdded.name);
    expect(isProductInOrder).toBeTruthy();
  });

  test('should cancel from checkout overview and return to inventory', async ({ page }) => {
    // Arrange
    await cartPage.proceedToCheckout();
    await checkoutStepOne.completeStepOne(validCheckoutInfo);
    await checkoutStepTwo.verifyOnCheckoutStepTwo();

    // Act
    await checkoutStepTwo.clickCancel();

    // Assert
    await expect(page).toHaveURL(/.*inventory/);
    await inventoryPage.verifyOnInventoryPage();
  });

  test('should return to home after order completion', async ({ page }) => {
    // Arrange - Complete full checkout
    await cartPage.proceedToCheckout();
    await checkoutStepOne.completeStepOne(validCheckoutInfo);
    await checkoutStepTwo.clickFinish();
    await checkoutComplete.verifyOnCheckoutComplete();

    // Act
    await checkoutComplete.goBackHome();

    // Assert
    await expect(page).toHaveURL(/.*inventory/);
    await inventoryPage.verifyOnInventoryPage();
  });

  test('should verify checkout step one page title', async () => {
    // Arrange
    await cartPage.proceedToCheckout();

    // Act
    const pageTitle = await checkoutStepOne.getPageTitle();

    // Assert
    expect(pageTitle).toBe('Checkout: Your Information');
  });

  test('should verify checkout step two page title', async () => {
    // Arrange
    await cartPage.proceedToCheckout();
    await checkoutStepOne.completeStepOne(validCheckoutInfo);

    // Act
    const pageTitle = await checkoutStepTwo.getPageTitle();

    // Assert
    expect(pageTitle).toBe('Checkout: Overview');
  });

  test('should verify payment and shipping info are displayed', async () => {
    // Arrange
    await cartPage.proceedToCheckout();
    await checkoutStepOne.completeStepOne(validCheckoutInfo);

    // Act
    const paymentInfo = await checkoutStepTwo.getPaymentInfo();
    const shippingInfo = await checkoutStepTwo.getShippingInfo();

    // Assert
    expect(paymentInfo.length).toBeGreaterThan(0);
    expect(shippingInfo.length).toBeGreaterThan(0);
  });

  test('should complete checkout with multiple items', async () => {
    // Arrange - Add more items
    await cartPage.continueShopping();
    await inventoryPage.addProductToCartByName(products.bikeLight.name);
    await inventoryPage.addProductToCartByName(products.boltTShirt.name);
    await inventoryPage.clickCartIcon();

    const initialCartCount = await cartPage.getCartItemCount();
    expect(initialCartCount).toBe(3);

    // Act - Complete checkout
    await cartPage.proceedToCheckout();
    await checkoutStepOne.completeStepOne(validCheckoutInfo);
    await checkoutStepTwo.verifyOnCheckoutStepTwo();

    const checkoutItemCount = await checkoutStepTwo.getCartItemCount();
    expect(checkoutItemCount).toBe(3);

    await checkoutStepTwo.clickFinish();

    // Assert
    await checkoutComplete.verifyOnCheckoutComplete();
    const completeHeader = await checkoutComplete.getCompleteHeader();
    expect(completeHeader).toContain('Thank you');
  });
});
