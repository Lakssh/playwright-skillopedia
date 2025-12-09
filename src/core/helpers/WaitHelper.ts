import { Page, Locator } from '@playwright/test';
import { TIMEOUTS } from '../../../test-data/constants';

/**
 * WaitHelper - Custom wait utilities
 */
export class WaitHelper {
  /**
   * Wait for element to appear and be stable
   * @param locator - Element locator
   * @param timeout - Maximum wait time
   */
  static async waitForElementStable(locator: Locator, timeout: number = TIMEOUTS.MEDIUM): Promise<void> {
    await locator.waitFor({ state: 'visible', timeout });
    // Wait a bit for animations to complete
    await locator.evaluate(() => {
      return new Promise<void>((resolve) => {
        // @ts-expect-error - requestAnimationFrame is available in browser context
        requestAnimationFrame(() => {
          // @ts-expect-error - requestAnimationFrame is available in browser context
          requestAnimationFrame(() => resolve());
        });
      });
    });
  }

  /**
   * Wait for network to be idle with custom timeout
   * @param page - Page instance
   * @param timeout - Maximum wait time
   */
  static async waitForNetworkIdle(page: Page, timeout: number = TIMEOUTS.LONG): Promise<void> {
    await page.waitForLoadState('networkidle', { timeout });
  }

  /**
   * Wait for DOM to be ready
   * @param page - Page instance
   */
  static async waitForDomReady(page: Page): Promise<void> {
    await page.waitForLoadState('domcontentloaded');
  }

  /**
   * Wait for specific network request
   * @param page - Page instance
   * @param urlPattern - URL pattern to match
   * @param timeout - Maximum wait time
   */
  static async waitForRequest(page: Page, urlPattern: string | RegExp, timeout: number = TIMEOUTS.MEDIUM): Promise<void> {
    await page.waitForRequest(urlPattern, { timeout });
  }

  /**
   * Wait for specific network response
   * @param page - Page instance
   * @param urlPattern - URL pattern to match
   * @param timeout - Maximum wait time
   */
  static async waitForResponse(page: Page, urlPattern: string | RegExp, timeout: number = TIMEOUTS.MEDIUM): Promise<void> {
    await page.waitForResponse(urlPattern, { timeout });
  }

  /**
   * Custom polling wait for condition
   * @param condition - Condition function to check
   * @param timeout - Maximum wait time
   * @param interval - Polling interval
   */
  static async waitForCondition(
    condition: () => Promise<boolean>,
    timeout: number = TIMEOUTS.MEDIUM,
    interval: number = 500
  ): Promise<void> {
    const startTime = Date.now();
    
    while (Date.now() - startTime < timeout) {
      if (await condition()) {
        return;
      }
      await new Promise((resolve) => setTimeout(resolve, interval));
    }
    
    throw new Error(`Condition not met within ${timeout}ms`);
  }

  /**
   * Wait for element count to match expected
   * @param locator - Element locator
   * @param expectedCount - Expected element count
   * @param timeout - Maximum wait time
   */
  static async waitForElementCount(locator: Locator, expectedCount: number, timeout: number = TIMEOUTS.MEDIUM): Promise<void> {
    await this.waitForCondition(
      async () => (await locator.count()) === expectedCount,
      timeout
    );
  }

  /**
   * Wait for text to appear in element
   * @param locator - Element locator
   * @param text - Text to wait for
   * @param timeout - Maximum wait time
   */
  static async waitForText(locator: Locator, text: string | RegExp, timeout: number = TIMEOUTS.MEDIUM): Promise<void> {
    await locator.waitFor({ state: 'visible', timeout });
    
    await this.waitForCondition(
      async () => {
        const content = await locator.textContent();
        if (!content) return false;
        
        if (typeof text === 'string') {
          return content.includes(text);
        }
        return text.test(content);
      },
      timeout
    );
  }

  /**
   * Exponential backoff retry
   * @param operation - Operation to retry
   * @param maxRetries - Maximum number of retries
   * @param baseDelay - Base delay in ms
   */
  static async retryWithBackoff<T>(
    operation: () => Promise<T>,
    maxRetries: number = 3,
    baseDelay: number = 1000
  ): Promise<T> {
    for (let attempt = 0; attempt < maxRetries; attempt++) {
      try {
        return await operation();
      } catch (error) {
        if (attempt === maxRetries - 1) {
          throw error;
        }
        
        const delay = baseDelay * Math.pow(2, attempt);
        await new Promise((resolve) => setTimeout(resolve, delay));
      }
    }
    
    throw new Error('Retry failed');
  }
}
