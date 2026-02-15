import { test, expect } from '@playwright/test';
import { LoginPage } from '../../src/pages/LoginPage';
import { InventoryPage } from '../../src/pages/InventoryPage';
import { validUsers, invalidUsers } from '../../src/data/users';
import { ERROR_MESSAGES } from '../../src/utils/constants';

test.describe('Login Functionality', () => {
  let loginPage: LoginPage;
  let inventoryPage: InventoryPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    inventoryPage = new InventoryPage(page);
    await loginPage.navigateToLoginPage();
  });

  test('should login successfully with valid standard user credentials', async ({ page }) => {
    // Arrange
    const user = validUsers.standard;

    // Act
    await loginPage.login(user.username, user.password);

    // Assert
    await expect(page).toHaveURL(/.*inventory/);
    await inventoryPage.verifyOnInventoryPage();
    const pageTitle = await inventoryPage.getPageTitle();
    expect(pageTitle).toBe('Products');
  });

  test('should login successfully with performance glitch user', async ({ page }) => {
    // Arrange
    const user = validUsers.performance;

    // Act
    await loginPage.login(user.username, user.password);

    // Assert
    await expect(page).toHaveURL(/.*inventory/);
    await inventoryPage.verifyOnInventoryPage();
  });

  test('should show error message with invalid credentials', async () => {
    // Arrange
    const user = invalidUsers.invalid;

    // Act
    await loginPage.login(user.username, user.password);

    // Assert
    const errorVisible = await loginPage.isErrorMessageVisible();
    expect(errorVisible).toBeTruthy();

    const errorMessage = await loginPage.getErrorMessage();
    expect(errorMessage).toContain('Epic sadface');
    expect(errorMessage).toContain('do not match');
  });

  test('should show error message for locked out user', async () => {
    // Arrange
    const user = invalidUsers.locked;

    // Act
    await loginPage.login(user.username, user.password);

    // Assert
    const errorVisible = await loginPage.isErrorMessageVisible();
    expect(errorVisible).toBeTruthy();

    const errorMessage = await loginPage.getErrorMessage();
    expect(errorMessage).toBe(ERROR_MESSAGES.lockedOut);
  });

  test('should show error when username is empty', async () => {
    // Arrange
    const user = invalidUsers.emptyUsername;

    // Act
    await loginPage.enterPassword(user.password);
    await loginPage.clickLoginButton();

    // Assert
    const errorVisible = await loginPage.isErrorMessageVisible();
    expect(errorVisible).toBeTruthy();

    const errorMessage = await loginPage.getErrorMessage();
    expect(errorMessage).toBe(ERROR_MESSAGES.loginRequired);
  });

  test('should show error when password is empty', async () => {
    // Arrange
    const user = invalidUsers.emptyPassword;

    // Act
    await loginPage.enterUsername(user.username);
    await loginPage.clickLoginButton();

    // Assert
    const errorVisible = await loginPage.isErrorMessageVisible();
    expect(errorVisible).toBeTruthy();

    const errorMessage = await loginPage.getErrorMessage();
    expect(errorMessage).toBe(ERROR_MESSAGES.passwordRequired);
  });

  test('should show error when both username and password are empty', async () => {
    // Act
    await loginPage.clickLoginButton();

    // Assert
    const errorVisible = await loginPage.isErrorMessageVisible();
    expect(errorVisible).toBeTruthy();

    const errorMessage = await loginPage.getErrorMessage();
    expect(errorMessage).toBe(ERROR_MESSAGES.loginRequired);
  });

  test('should be able to close error message', async () => {
    // Arrange
    const user = invalidUsers.invalid;

    // Act
    await loginPage.login(user.username, user.password);
    const errorVisibleBefore = await loginPage.isErrorMessageVisible();
    expect(errorVisibleBefore).toBeTruthy();

    await loginPage.closeErrorMessage();

    // Assert
    const errorVisibleAfter = await loginPage.isErrorMessageVisible();
    expect(errorVisibleAfter).toBeFalsy();
  });

  test('should display login page elements correctly', async () => {
    // Assert
    const logoVisible = await loginPage.isLoginLogoVisible();
    expect(logoVisible).toBeTruthy();

    const loginButtonEnabled = await loginPage.isLoginButtonEnabled();
    expect(loginButtonEnabled).toBeTruthy();

    await loginPage.verifyOnLoginPage();
  });

  test('should be able to clear login form fields', async () => {
    // Act
    await loginPage.enterUsername('testuser');
    await loginPage.enterPassword('testpass');
    await loginPage.clearLoginForm();

    // Assert - Fields should be empty (can be verified by attempting login)
    await loginPage.clickLoginButton();
    const errorMessage = await loginPage.getErrorMessage();
    expect(errorMessage).toBe(ERROR_MESSAGES.loginRequired);
  });
});
