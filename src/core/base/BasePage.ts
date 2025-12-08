import { Page, Locator, expect } from '@playwright/test';

/**
 * BasePage - Abstract base class for all page objects
 * Provides common functionality and utilities for all pages
 */
export abstract class BasePage {
  protected readonly page: Page;
  protected readonly baseURL: string;

  constructor(page: Page) {
    this.page = page;
    this.baseURL = process.env.BASE_URL || 'https://skill-sprig.vercel.app';
  }

  /**
   * Navigate to a specific path
   * @param path - The path to navigate to (relative to baseURL)
   * @param options - Navigation options
   */
  async navigate(path: string = '', options?: { waitUntil?: 'load' | 'domcontentloaded' | 'networkidle' }): Promise<void> {
    const url = path.startsWith('http') ? path : `${this.baseURL}${path}`;
    await this.page.goto(url, { waitUntil: options?.waitUntil || 'domcontentloaded' });
  }

  /**
   * Wait for the page to load completely
   */
  async waitForPageLoad(): Promise<void> {
    await this.page.waitForLoadState('networkidle', { timeout: 30000 });
  }

  /**
   * Get the page title
   */
  async getTitle(): Promise<string> {
    return await this.page.title();
  }

  /**
   * Get the current URL
   */
  async getCurrentUrl(): Promise<string> {
    return this.page.url();
  }

  /**
   * Take a screenshot
   * @param name - Name of the screenshot file
   */
  async takeScreenshot(name: string): Promise<Buffer> {
    return await this.page.screenshot({ path: `screenshots/${name}.png`, fullPage: true });
  }

  /**
   * Wait for an element to be visible
   * @param locator - The locator to wait for
   * @param timeout - Optional timeout in milliseconds
   */
  async waitForVisible(locator: Locator, timeout?: number): Promise<void> {
    await locator.waitFor({ state: 'visible', timeout });
  }

  /**
   * Wait for an element to be hidden
   * @param locator - The locator to wait for
   * @param timeout - Optional timeout in milliseconds
   */
  async waitForHidden(locator: Locator, timeout?: number): Promise<void> {
    await locator.waitFor({ state: 'hidden', timeout });
  }

  /**
   * Click on an element with retry logic
   * @param locator - The locator to click
   */
  async click(locator: Locator): Promise<void> {
    await locator.waitFor({ state: 'visible' });
    await locator.click();
  }

  /**
   * Fill input field with text
   * @param locator - The locator to fill
   * @param text - The text to fill
   */
  async fill(locator: Locator, text: string): Promise<void> {
    await locator.waitFor({ state: 'visible' });
    await locator.fill(text);
  }

  /**
   * Type text into an input field (slower than fill, simulates real typing)
   * @param locator - The locator to type into
   * @param text - The text to type
   * @param delay - Delay between keystrokes in ms
   */
  async type(locator: Locator, text: string, delay: number = 100): Promise<void> {
    await locator.waitFor({ state: 'visible' });
    await locator.pressSequentially(text, { delay });
  }

  /**
   * Select option from dropdown
   * @param locator - The select locator
   * @param value - The value to select
   */
  async selectOption(locator: Locator, value: string | { label?: string; value?: string; index?: number }): Promise<void> {
    await locator.waitFor({ state: 'visible' });
    await locator.selectOption(value);
  }

  /**
   * Get text content of an element
   * @param locator - The locator to get text from
   */
  async getText(locator: Locator): Promise<string> {
    await locator.waitFor({ state: 'visible' });
    return (await locator.textContent()) || '';
  }

  /**
   * Check if element is visible
   * @param locator - The locator to check
   */
  async isVisible(locator: Locator): Promise<boolean> {
    try {
      return await locator.isVisible();
    } catch {
      return false;
    }
  }

  /**
   * Check if element is enabled
   * @param locator - The locator to check
   */
  async isEnabled(locator: Locator): Promise<boolean> {
    return await locator.isEnabled();
  }

  /**
   * Wait for URL to match pattern
   * @param pattern - URL pattern to match
   */
  async waitForURL(pattern: string | RegExp): Promise<void> {
    await this.page.waitForURL(pattern);
  }

  /**
   * Reload the current page
   */
  async reload(): Promise<void> {
    await this.page.reload();
  }

  /**
   * Go back in browser history
   */
  async goBack(): Promise<void> {
    await this.page.goBack();
  }

  /**
   * Scroll to element
   * @param locator - The locator to scroll to
   */
  async scrollToElement(locator: Locator): Promise<void> {
    await locator.scrollIntoViewIfNeeded();
  }

  /**
   * Hover over element
   * @param locator - The locator to hover over
   */
  async hover(locator: Locator): Promise<void> {
    await locator.hover();
  }

  /**
   * Double click on element
   * @param locator - The locator to double click
   */
  async doubleClick(locator: Locator): Promise<void> {
    await locator.dblclick();
  }

  /**
   * Right click on element
   * @param locator - The locator to right click
   */
  async rightClick(locator: Locator): Promise<void> {
    await locator.click({ button: 'right' });
  }

  /**
   * Expect element to be visible with assertion
   * @param locator - The locator to check
   */
  async expectToBeVisible(locator: Locator): Promise<void> {
    await expect(locator).toBeVisible();
  }

  /**
   * Expect element to have text
   * @param locator - The locator to check
   * @param text - Expected text
   */
  async expectToHaveText(locator: Locator, text: string | RegExp): Promise<void> {
    await expect(locator).toHaveText(text);
  }

  /**
   * Expect element to contain text
   * @param locator - The locator to check
   * @param text - Expected text to contain
   */
  async expectToContainText(locator: Locator, text: string | RegExp): Promise<void> {
    await expect(locator).toContainText(text);
  }

  /**
   * Wait for network to be idle
   */
  async waitForNetworkIdle(): Promise<void> {
    await this.page.waitForLoadState('networkidle');
  }

  /**
   * Execute JavaScript in browser context
   * @param script - JavaScript code to execute
   * @param args - Arguments to pass to the script
   */
  async evaluate<R, Args extends unknown[]>(script: (args: Args) => R, ...args: Args): Promise<R> {
    return await this.page.evaluate(script, args);
  }
}
