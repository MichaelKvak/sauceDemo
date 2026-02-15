import { Page, Locator, expect } from '@playwright/test';

/**
 * BasePage - Abstract base class for all page objects
 * Provides common functionality for page navigation, element interactions, waits, and assertions
 */
export abstract class BasePage {
  protected readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  // ================== NAVIGATION METHODS ==================

  /**
   * Navigate to a specific URL
   * @param url - The URL to navigate to
   */
  async goto(url: string): Promise<void> {
    await this.page.goto(url, { waitUntil: 'domcontentloaded' });
  }

  /**
   * Get the current page URL
   * @returns Current URL as string
   */
  async getCurrentUrl(): Promise<string> {
    return this.page.url();
  }

  /**
   * Get the page title
   * @returns Page title as string
   */
  async getPageTitle(): Promise<string> {
    return await this.page.title();
  }

  /**
   * Reload the current page
   */
  async reload(): Promise<void> {
    await this.page.reload({ waitUntil: 'domcontentloaded' });
  }

  /**
   * Navigate back in browser history
   */
  async goBack(): Promise<void> {
    await this.page.goBack({ waitUntil: 'domcontentloaded' });
  }

  // ================== ELEMENT INTERACTION METHODS ==================

  /**
   * Click on an element
   * @param selector - CSS selector or locator string
   */
  async clickElement(selector: string): Promise<void> {
    await this.page.locator(selector).click();
  }

  /**
   * Fill an input field with text
   * @param selector - CSS selector for the input element
   * @param text - Text to fill into the input
   */
  async fillInput(selector: string, text: string): Promise<void> {
    await this.page.locator(selector).fill(text);
  }

  /**
   * Select an option from a dropdown
   * @param selector - CSS selector for the select element
   * @param value - Value to select
   */
  async selectDropdown(selector: string, value: string): Promise<void> {
    await this.page.locator(selector).selectOption(value);
  }

  /**
   * Get text content of an element
   * @param selector - CSS selector for the element
   * @returns Text content of the element
   */
  async getText(selector: string): Promise<string> {
    const text = await this.page.locator(selector).textContent();
    return text?.trim() || '';
  }

  /**
   * Get the value attribute of an input element
   * @param selector - CSS selector for the input element
   * @returns Value of the input element
   */
  async getInputValue(selector: string): Promise<string> {
    return await this.page.locator(selector).inputValue();
  }

  /**
   * Get all text contents from multiple elements
   * @param selector - CSS selector for the elements
   * @returns Array of text contents
   */
  async getAllText(selector: string): Promise<string[]> {
    const elements = await this.page.locator(selector).all();
    const texts: string[] = [];
    for (const element of elements) {
      const text = await element.textContent();
      texts.push(text?.trim() || '');
    }
    return texts;
  }

  /**
   * Get the count of elements matching the selector
   * @param selector - CSS selector for the elements
   * @returns Number of elements found
   */
  async getElementCount(selector: string): Promise<number> {
    return await this.page.locator(selector).count();
  }

  /**
   * Get attribute value of an element
   * @param selector - CSS selector for the element
   * @param attributeName - Name of the attribute
   * @returns Attribute value or null
   */
  async getAttribute(selector: string, attributeName: string): Promise<string | null> {
    return await this.page.locator(selector).getAttribute(attributeName);
  }

  /**
   * Clear an input field
   * @param selector - CSS selector for the input element
   */
  async clearInput(selector: string): Promise<void> {
    await this.page.locator(selector).clear();
  }

  /**
   * Double click on an element
   * @param selector - CSS selector for the element
   */
  async doubleClickElement(selector: string): Promise<void> {
    await this.page.locator(selector).dblclick();
  }

  /**
   * Right click on an element
   * @param selector - CSS selector for the element
   */
  async rightClickElement(selector: string): Promise<void> {
    await this.page.locator(selector).click({ button: 'right' });
  }

  /**
   * Hover over an element
   * @param selector - CSS selector for the element
   */
  async hoverElement(selector: string): Promise<void> {
    await this.page.locator(selector).hover();
  }

  // ================== WAIT METHODS ==================

  /**
   * Wait for an element to be present in the DOM
   * @param selector - CSS selector for the element
   * @param timeout - Optional timeout in milliseconds
   */
  async waitForElement(selector: string, timeout: number = 30000): Promise<void> {
    await this.page.locator(selector).waitFor({ state: 'attached', timeout });
  }

  /**
   * Wait for an element to be visible
   * @param selector - CSS selector for the element
   * @param timeout - Optional timeout in milliseconds
   */
  async waitForElementToBeVisible(selector: string, timeout: number = 30000): Promise<void> {
    await this.page.locator(selector).waitFor({ state: 'visible', timeout });
  }

  /**
   * Wait for an element to be hidden
   * @param selector - CSS selector for the element
   * @param timeout - Optional timeout in milliseconds
   */
  async waitForElementToBeHidden(selector: string, timeout: number = 30000): Promise<void> {
    await this.page.locator(selector).waitFor({ state: 'hidden', timeout });
  }

  /**
   * Wait for navigation to complete
   */
  async waitForNavigation(): Promise<void> {
    await this.page.waitForLoadState('domcontentloaded');
  }

  /**
   * Wait for a specific amount of time
   * @param ms - Milliseconds to wait
   */
  async waitForTimeout(ms: number): Promise<void> {
    await this.page.waitForTimeout(ms);
  }

  /**
   * Wait for the page to be fully loaded
   */
  async waitForPageLoad(): Promise<void> {
    await this.page.waitForLoadState('load');
  }

  /**
   * Wait for network to be idle
   */
  async waitForNetworkIdle(): Promise<void> {
    await this.page.waitForLoadState('networkidle');
  }

  // ================== STATE CHECK METHODS ==================

  /**
   * Check if an element is visible
   * @param selector - CSS selector for the element
   * @returns True if element is visible, false otherwise
   */
  async isElementVisible(selector: string): Promise<boolean> {
    try {
      return await this.page.locator(selector).isVisible();
    } catch {
      return false;
    }
  }

  /**
   * Check if an element is enabled
   * @param selector - CSS selector for the element
   * @returns True if element is enabled, false otherwise
   */
  async isElementEnabled(selector: string): Promise<boolean> {
    try {
      return await this.page.locator(selector).isEnabled();
    } catch {
      return false;
    }
  }

  /**
   * Check if an element is disabled
   * @param selector - CSS selector for the element
   * @returns True if element is disabled, false otherwise
   */
  async isElementDisabled(selector: string): Promise<boolean> {
    try {
      return await this.page.locator(selector).isDisabled();
    } catch {
      return false;
    }
  }

  /**
   * Check if a checkbox or radio button is checked
   * @param selector - CSS selector for the element
   * @returns True if element is checked, false otherwise
   */
  async isElementChecked(selector: string): Promise<boolean> {
    try {
      return await this.page.locator(selector).isChecked();
    } catch {
      return false;
    }
  }

  /**
   * Check if an element exists in the DOM
   * @param selector - CSS selector for the element
   * @returns True if element exists, false otherwise
   */
  async isElementPresent(selector: string): Promise<boolean> {
    const count = await this.page.locator(selector).count();
    return count > 0;
  }

  // ================== ASSERTION METHODS ==================

  /**
   * Assert that an element is visible
   * @param selector - CSS selector for the element
   */
  async expectElementToBeVisible(selector: string): Promise<void> {
    await expect(this.page.locator(selector)).toBeVisible();
  }

  /**
   * Assert that an element is hidden
   * @param selector - CSS selector for the element
   */
  async expectElementToBeHidden(selector: string): Promise<void> {
    await expect(this.page.locator(selector)).toBeHidden();
  }

  /**
   * Assert that an element contains specific text
   * @param selector - CSS selector for the element
   * @param text - Expected text content
   */
  async expectElementToContainText(selector: string, text: string): Promise<void> {
    await expect(this.page.locator(selector)).toContainText(text);
  }

  /**
   * Assert that an element has exact text
   * @param selector - CSS selector for the element
   * @param text - Expected exact text content
   */
  async expectElementToHaveText(selector: string, text: string): Promise<void> {
    await expect(this.page.locator(selector)).toHaveText(text);
  }

  /**
   * Assert that URL contains a specific string
   * @param urlPart - String that should be in the URL
   */
  async expectUrlToContain(urlPart: string): Promise<void> {
    await expect(this.page).toHaveURL(new RegExp(urlPart));
  }

  /**
   * Assert that URL matches exactly
   * @param url - Expected exact URL
   */
  async expectUrlToBe(url: string): Promise<void> {
    await expect(this.page).toHaveURL(url);
  }

  /**
   * Assert that page title contains specific text
   * @param titlePart - String that should be in the title
   */
  async expectTitleToContain(titlePart: string): Promise<void> {
    await expect(this.page).toHaveTitle(new RegExp(titlePart));
  }

  /**
   * Assert that an element is enabled
   * @param selector - CSS selector for the element
   */
  async expectElementToBeEnabled(selector: string): Promise<void> {
    await expect(this.page.locator(selector)).toBeEnabled();
  }

  /**
   * Assert that an element is disabled
   * @param selector - CSS selector for the element
   */
  async expectElementToBeDisabled(selector: string): Promise<void> {
    await expect(this.page.locator(selector)).toBeDisabled();
  }

  /**
   * Assert that element count matches expected value
   * @param selector - CSS selector for the elements
   * @param count - Expected number of elements
   */
  async expectElementCountToBe(selector: string, count: number): Promise<void> {
    await expect(this.page.locator(selector)).toHaveCount(count);
  }

  // ================== UTILITY METHODS ==================

  /**
   * Take a screenshot
   * @param name - Name for the screenshot file
   */
  async takeScreenshot(name: string): Promise<void> {
    await this.page.screenshot({ path: `screenshots/${name}.png`, fullPage: true });
  }

  /**
   * Scroll to an element
   * @param selector - CSS selector for the element
   */
  async scrollToElement(selector: string): Promise<void> {
    await this.page.locator(selector).scrollIntoViewIfNeeded();
  }

  /**
   * Press a key
   * @param key - Key to press (e.g., 'Enter', 'Escape')
   */
  async pressKey(key: string): Promise<void> {
    await this.page.keyboard.press(key);
  }

  /**
   * Type text character by character
   * @param selector - CSS selector for the element
   * @param text - Text to type
   * @param delay - Optional delay between key presses in milliseconds
   */
  async typeText(selector: string, text: string, delay: number = 0): Promise<void> {
    await this.page.locator(selector).pressSequentially(text, { delay });
  }

  /**
   * Get the locator for an element (useful for chaining Playwright methods)
   * @param selector - CSS selector for the element
   * @returns Playwright Locator
   */
  protected getLocator(selector: string): Locator {
    return this.page.locator(selector);
  }

  /**
   * Execute JavaScript in the page context
   * @param script - JavaScript code to execute
   * @param args - Optional arguments to pass to the script
   */
  async executeScript<T>(script: string, ...args: any[]): Promise<T> {
    return await this.page.evaluate(script, ...args);
  }

  /**
   * Focus on an element
   * @param selector - CSS selector for the element
   */
  async focusElement(selector: string): Promise<void> {
    await this.page.locator(selector).focus();
  }
}
