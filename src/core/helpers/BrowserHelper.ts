import { Page, Locator, expect } from '@playwright/test';
import { LogHelper } from './LogHelper';

/**
 * BasePage -  base class for all page objects
 * Provides common functionality and utilities for all pages
 */
export  class BrowserHelper {
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
    try {
      const url = path.startsWith('http') ? path : `${this.baseURL}${path}`;
      await this.page.goto(url, { waitUntil: options?.waitUntil || 'domcontentloaded' });
      LogHelper.logCompleted(`Navigated to URL: ${url}`);
    } catch (error) {
      LogHelper.logFail(`Failed to navigate`, error);
      throw error;
    }
  }

  /**
   * Wait for the page to load completely
   */
  async waitForPageLoad(): Promise<void> {
    try {
      await this.page.waitForLoadState('networkidle', { timeout: 30000 });
      LogHelper.logCompleted(`Page loaded successfully (networkidle)`);
    } catch (error) {
      LogHelper.logFail(`Page load timeout`, error);
      throw error;
    }
  }

  /**
   * Get the page title
   */
  async getTitle(): Promise<string> {
    try {
      const title = await this.page.title();
      LogHelper.logCompleted(`Retrieved page title: "${title}"`);
      return title;
    } catch (error) {
      LogHelper.logFail(`Failed to get page title`, error);
      throw error;
    }
  }

  /**
   * Get the current URL
   */
  async getCurrentUrl(): Promise<string> {
    try {
      const url = this.page.url();
      LogHelper.logCompleted(`Retrieved current URL: ${url}`);
      return url;
    } catch (error) {
      LogHelper.logFail(`Failed to get current URL`, error);
      throw error;
    }
  }

  /**
   * Take a screenshot
   * @param name - Name of the screenshot file
   */
  async takeScreenshot(name: string): Promise<Buffer> {
    try {
      const screenshot = await this.page.screenshot({ path: `screenshots/${name}.png`, fullPage: true });
      LogHelper.logCompleted(`Screenshot captured: ${name}.png`);
      return screenshot;
    } catch (error) {
      LogHelper.logFail(`Failed to take screenshot`, error);
      throw error;
    }
  }

  /**
   * Wait for an element to be visible
   * @param locator - The locator to wait for
   * @param timeout - Optional timeout in milliseconds
   */
  async waitForVisible(locator: Locator, timeout?: number): Promise<void> {
    try {
      await locator.waitFor({ state: 'visible', timeout });
      LogHelper.logCompleted(`Element became visible`);
    } catch (error) {
      LogHelper.logFail(`Element did not become visible`, error);
      throw error;
    }
  }

  /**
   * Wait for an element to be hidden
   * @param locator - The locator to wait for
   * @param timeout - Optional timeout in milliseconds
   */
  async waitForHidden(locator: Locator, timeout?: number): Promise<void> {
    try {
      await locator.waitFor({ state: 'hidden', timeout });
      LogHelper.logCompleted(`Element became hidden`);
    } catch (error) {
      LogHelper.logFail(`Element did not become hidden`, error);
      throw error;
    }
  }

  /**
   * Click on an element with retry logic
   * @param locator - The locator to click
   */
  async click(locator: Locator): Promise<void> {
    try {
      await locator.waitFor({ state: 'visible' });
      await locator.click();
      LogHelper.logCompleted(`Element clicked successfully`);
    } catch (error) {
      LogHelper.logFail(`Failed to click element`, error);
      throw error;
    }
  }

  /**
   * Fill input field with text
   * @param locator - The locator to fill
   * @param text - The text to fill
   */
  async fill(locator: Locator, text: string): Promise<void> {
    try {
      await locator.waitFor({ state: 'visible' });
      await locator.fill(text);
      LogHelper.logCompleted(`Input field filled with text: "${text}"`);
    } catch (error) {
      LogHelper.logFail(`Failed to fill input field`, error);
      throw error;
    }
  }

  /**
   * Type text into an input field (slower than fill, simulates real typing)
   * @param locator - The locator to type into
   * @param text - The text to type
   * @param delay - Delay between keystrokes in ms
   */
  async type(locator: Locator, text: string, delay: number = 100): Promise<void> {
    try {
      await locator.waitFor({ state: 'visible' });
      await locator.pressSequentially(text, { delay });
      LogHelper.logCompleted(`Text typed into field: "${text}" (delay: ${delay}ms)`);
    } catch (error) {
      LogHelper.logFail(`Failed to type text`, error);
      throw error;
    }
  }

  /**
   * Select option from dropdown
   * @param locator - The select locator
   * @param value - The value to select
   */
  async selectOption(locator: Locator, value: string | { label?: string; value?: string; index?: number }): Promise<void> {
    try {
      await locator.waitFor({ state: 'visible' });
      await locator.selectOption(value);
      LogHelper.logCompleted(`Option selected: ${JSON.stringify(value)}`);
    } catch (error) {
      LogHelper.logFail(`Failed to select option`, error);
      throw error;
    }
  }

  /**
   * Get text content of an element
   * @param locator - The locator to get text from
   */
  async getText(locator: Locator): Promise<string> {
    try {
      await locator.waitFor({ state: 'visible' });
      const text = (await locator.textContent()) || '';
      LogHelper.logCompleted(`Text retrieved: "${text}"`);
      return text;
    } catch (error) {
      LogHelper.logFail(`Failed to get text`, error);
      throw error;
    }
  }

  /**
   * Check if element is visible
   * @param locator - The locator to check
   */
  async isVisible(locator: Locator): Promise<boolean> {
    try {
      const visible = await locator.isVisible();
      LogHelper.logCompleted(`Element visibility check: ${visible}`);
      return visible;
    } catch (error) {
      LogHelper.logError(`Element visibility check failed`, error);
      return false;
    }
  }

  /**
   * Check if element is enabled
   * @param locator - The locator to check
   */
  async isEnabled(locator: Locator): Promise<boolean> {
    try {
      const enabled = await locator.isEnabled();
      LogHelper.logCompleted(`Element enabled check: ${enabled}`);
      return enabled;
    } catch (error) {
      LogHelper.logFail(`Failed to check if element is enabled`, error);
      throw error;
    }
  }

  /**
   * Wait for URL to match pattern
   * @param pattern - URL pattern to match
   */
  async waitForURL(pattern: string | RegExp): Promise<void> {
    try {
      await this.page.waitForURL(pattern);
      LogHelper.logCompleted(`URL matched pattern: ${pattern}`);
    } catch (error) {
      LogHelper.logFail(`URL did not match pattern ${pattern}`, error);
      throw error;
    }
  }

  /**
   * Reload the current page
   */
  async reload(): Promise<void> {
    try {
      await this.page.reload();
      LogHelper.logCompleted(`Page reloaded successfully`);
    } catch (error) {
      LogHelper.logFail(`Failed to reload page`, error);
      throw error;
    }
  }

  /**
   * Go back in browser history
   */
  async goBack(): Promise<void> {
    try {
      await this.page.goBack();
      LogHelper.logCompleted(`Navigated back in browser history`);
    } catch (error) {
      LogHelper.logFail(`Failed to go back`, error);
      throw error;
    }
  }

  /**
   * Scroll to element
   * @param locator - The locator to scroll to
   */
  async scrollToElement(locator: Locator): Promise<void> {
    try {
      await locator.scrollIntoViewIfNeeded();
      LogHelper.logCompleted(`Scrolled to element`);
    } catch (error) {
      LogHelper.logFail(`Failed to scroll to element`, error);
      throw error;
    }
  }

  /**
   * Hover over element
   * @param locator - The locator to hover over
   */
  async hover(locator: Locator): Promise<void> {
    try {
      await locator.hover();
      LogHelper.logCompleted(`Hovered over element`);
    } catch (error) {
      LogHelper.logFail(`Failed to hover over element`, error);
      throw error;
    }
  }

  /**
   * Double click on element
   * @param locator - The locator to double click
   */
  async doubleClick(locator: Locator): Promise<void> {
    try {
      await locator.dblclick();
      LogHelper.logCompleted(`Double clicked element`);
    } catch (error) {
      LogHelper.logFail(`Failed to double click element`, error);
      throw error;
    }
  }

  /**
   * Right click on element
   * @param locator - The locator to right click
   */
  async rightClick(locator: Locator): Promise<void> {
    try {
      await locator.click({ button: 'right' });
      LogHelper.logCompleted(`Right clicked element`);
    } catch (error) {
      LogHelper.logFail(`Failed to right click element`, error);
      throw error;
    }
  }

  /**
   * Expect element to be visible with assertion
   * @param locator - The locator to check
   */
  async expectToBeVisible(locator: Locator): Promise<void> {
    try {
      await expect(locator).toBeVisible();
      LogHelper.logCompleted(`Element is visible (assertion passed)`);
    } catch (error) {
      LogHelper.logFail(`Element should be visible`, error);
      throw error;
    }
  }

  /**
   * Expect element to have text
   * @param locator - The locator to check
   * @param text - Expected text
   */
  async expectToHaveText(locator: Locator, text: string | RegExp): Promise<void> {
    try {
      await expect(locator).toHaveText(text);
      LogHelper.logCompleted(`Element has expected text: "${text}"`);
    } catch (error) {
      LogHelper.logFail(`Element should have text "${text}"`, error);
      throw error;
    }
  }

  /**
   * Expect element to contain text
   * @param locator - The locator to check
   * @param text - Expected text to contain
   */
  async expectToContainText(locator: Locator, text: string | RegExp): Promise<void> {
    try {
      await expect(locator).toContainText(text);
      LogHelper.logCompleted(`Element contains expected text: "${text}"`);
    } catch (error) {
      LogHelper.logFail(`Element should contain text "${text}"`, error);
      throw error;
    }
  }

  /**
   * Wait for network to be idle
   */
  async waitForNetworkIdle(): Promise<void> {
    try {
      await this.page.waitForLoadState('networkidle');
      LogHelper.logCompleted(`Network is idle`);
    } catch (error) {
      LogHelper.logFail(`Failed to wait for network idle`, error);
      throw error;
    }
  }

  /**
   * Execute JavaScript in browser context
   * @param script - JavaScript code to execute
   * @param arg - Argument to pass to the script
   */
  async evaluate<R>(script: () => R | Promise<R>): Promise<R> {
    try {
      const result = await this.page.evaluate(script);
      LogHelper.logCompleted(`JavaScript executed successfully | Result: ${JSON.stringify(result)}`);
      return result;
    } catch (error) {
      LogHelper.logFail(`Failed to execute JavaScript`, error);
      throw error;
    }
  }

  /**
   * Get a locator within a container element
   * @param containerSelector - Container selector
   * @param childSelector - Child selector relative to container
   */
  protected getLocatorWithin(containerSelector: string, childSelector: string): Locator {
    try {
      const locator = this.page.locator(containerSelector).locator(childSelector);
      LogHelper.logCompleted(`Locator created for container "${containerSelector}" > "${childSelector}"`);
      return locator;
    } catch (error) {
      LogHelper.logFail(`Failed to create locator`, error);
      throw error;
    }
  }

  /**
   * Click on a child element within a container
   * @param containerSelector - Container selector
   * @param childSelector - Child selector relative to container
   */
  protected async clickWithin(containerSelector: string, childSelector: string): Promise<void> {
    try {
      await this.getLocatorWithin(containerSelector, childSelector).click();
      LogHelper.logCompleted(`Clicked child element in container "${containerSelector}" > "${childSelector}"`);
    } catch (error) {
      LogHelper.logFail(`Failed to click child element`, error);
      throw error;
    }
  }

  /**
   * Get text from a child element within a container
   * @param containerSelector - Container selector
   * @param childSelector - Child selector relative to container
   */
  protected async getTextWithin(containerSelector: string, childSelector: string): Promise<string> {
    try {
      const text = (await this.getLocatorWithin(containerSelector, childSelector).textContent()) || '';
      LogHelper.logCompleted(`Retrieved text from child: "${text}"`);
      return text;
    } catch (error) {
      LogHelper.logFail(`Failed to get text from child element`, error);
      throw error;
    }
  }

  /**
   * Wait for a container element to be visible
   * @param selector - Selector for the container
   */
  async waitForContainerVisible(selector: string): Promise<void> {
    try {
      await this.page.locator(selector).waitFor({ state: 'visible' });
      LogHelper.logCompleted(`Container "${selector}" became visible`);
    } catch (error) {
      LogHelper.logFail(`Container "${selector}" did not become visible`, error);
      throw error;
    }
  }

  /**
   * Wait for a container element to be hidden
   * @param selector - Selector for the container
   */
  async waitForContainerHidden(selector: string): Promise<void> {
    try {
      await this.page.locator(selector).waitFor({ state: 'hidden' });
      LogHelper.logCompleted(`Container "${selector}" became hidden`);
    } catch (error) {
      LogHelper.logFail(`Container "${selector}" did not become hidden`, error);
      throw error;
    }
  }

  /**
   * Check if a container element is visible
   * @param selector - Selector for the container
   */
  async isContainerVisible(selector: string): Promise<boolean> {
    try {
      const visible = await this.page.locator(selector).isVisible();
      LogHelper.logCompleted(`Container "${selector}" visibility check: ${visible}`);
      return visible;
    } catch (error) {
      LogHelper.logError(`Container visibility check failed for "${selector}"`, error);
      return false;
    }
  }
}
