import { expect, Locator, Page } from '@playwright/test';
import { LogHelper } from './LogHelper';

/**
 * AssertionHelper - Custom assertion utilities with detailed logging to console and Playwright report
 */
export class AssertionHelper {
  /**
   * Assert URL contains text
   */
  async assertUrlContains(page: Page, text: string): Promise<void> {
    try {
      const url = page.url();
      expect(url).toContain(text);
      LogHelper.logPass(`URL contains "${text}" | Current URL: ${url}`);
    } catch (error) {
      LogHelper.logFail(`URL should contain "${text}"`, error);
      throw error;
    }
  }

  async assertUrlMatches(page: Page, pattern: RegExp): Promise<void> {
    try {
      const url = page.url();
      expect(url).toMatch(pattern);
      LogHelper.logPass(`URL matches pattern ${pattern} | Current URL: ${url}`);
    } catch (error) {
      LogHelper.logFail(`URL should match pattern ${pattern}`, error);
      throw error;
    }
  }

  async assertTitle(page: Page, expectedTitle: string): Promise<void> {
    try {
      await expect(page).toHaveTitle(expectedTitle);
      LogHelper.logPass(`Page title is "${expectedTitle}"`);
    } catch (error) {
      LogHelper.logFail(`Page title should be "${expectedTitle}"`, error);
      throw error;
    }
  }

  async assertVisible(locator: Locator): Promise<void> {
    try {
      await expect(locator).toBeVisible();
      LogHelper.logPass(`Element is visible`);
    } catch (error) {
      LogHelper.logFail(`Element should be visible`, error);
      throw error;
    }
  }

  async assertHidden(locator: Locator): Promise<void> {
    try {
      await expect(locator).toBeHidden();
      LogHelper.logPass(`Element is hidden`);
    } catch (error) {
      LogHelper.logFail(`Element should be hidden`, error);
      throw error;
    }
  }

  async assertEnabled(locator: Locator): Promise<void> {
    try {
      await expect(locator).toBeEnabled();
      LogHelper.logPass(`Element is enabled`);
    } catch (error) {
      LogHelper.logFail(`Element should be enabled`, error);
      throw error;
    }
  }

  async assertDisabled(locator: Locator): Promise<void> {
    try {
      await expect(locator).toBeDisabled();
      LogHelper.logPass(`Element is disabled`);
    } catch (error) {
      LogHelper.logFail(`Element should be disabled`, error);
      throw error;
    }
  }

  async assertHasText(locator: Locator, text: string | RegExp): Promise<void> {
    try {
      await expect(locator).toHaveText(text);
      LogHelper.logPass(`Element has text "${text}"`);
    } catch (error) {
      LogHelper.logFail(`Element should have text "${text}"`, error);
      throw error;
    }
  }

  async assertContainsText(locator: Locator, text: string | RegExp): Promise<void> {
    try {
      await expect(locator).toContainText(text);
      LogHelper.logPass(`Element contains text "${text}"`);
    } catch (error) {
      LogHelper.logFail(`Element should contain text "${text}"`, error);
      throw error;
    }
  }

  async assertHasValue(locator: Locator, value: string | RegExp): Promise<void> {
    try {
      await expect(locator).toHaveValue(value);
      LogHelper.logPass(`Element has value "${value}"`);
    } catch (error) {
      LogHelper.logFail(`Element should have value "${value}"`, error);
      throw error;
    }
  }

  async assertHasAttribute(locator: Locator, name: string, value?: string | RegExp): Promise<void> {
    try {
      if (value !== undefined) {
        await expect(locator).toHaveAttribute(name, value);
        LogHelper.logPass(`Element has attribute "${name}" with value "${value}"`);
      } else {
        await expect(locator).toHaveAttribute(name);
        LogHelper.logPass(`Element has attribute "${name}"`);
      }
    } catch (error) {
      const msg = value !== undefined ? `attribute "${name}" with value "${value}"` : `attribute "${name}"`;
      LogHelper.logFail(`Element should have ${msg}`, error);
      throw error;
    }
  }

  async assertHasClass(locator: Locator, className: string | RegExp): Promise<void> {
    try {
      await expect(locator).toHaveClass(className);
      LogHelper.logPass(`Element has class "${className}"`);
    } catch (error) {
      LogHelper.logFail(`Element should have class "${className}"`, error);
      throw error;
    }
  }

  async assertCount(locator: Locator, count: number): Promise<void> {
    try {
      await expect(locator).toHaveCount(count);
      LogHelper.logPass(`Element count is ${count}`);
    } catch (error) {
      LogHelper.logFail(`Element count should be ${count}`, error);
      throw error;
    }
  }

  async assertChecked(locator: Locator): Promise<void> {
    try {
      await expect(locator).toBeChecked();
      LogHelper.logPass(`Element is checked`);
    } catch (error) {
      LogHelper.logFail(`Element should be checked`, error);
      throw error;
    }
  }

  async assertNotChecked(locator: Locator): Promise<void> {
    try {
      await expect(locator).not.toBeChecked();
      LogHelper.logPass(`Element is not checked`);
    } catch (error) {
      LogHelper.logFail(`Element should not be checked`, error);
      throw error;
    }
  }

  async assertFocused(locator: Locator): Promise<void> {
    try {
      await expect(locator).toBeFocused();
      LogHelper.logPass(`Element is focused`);
    } catch (error) {
      LogHelper.logFail(`Element should be focused`, error);
      throw error;
    }
  }

  async assertHasCss(locator: Locator, name: string, value: string | RegExp): Promise<void> {
    try {
      await expect(locator).toHaveCSS(name, value);
      LogHelper.logPass(`Element has CSS property "${name}" with value "${value}"`);
    } catch (error) {
      LogHelper.logFail(`Element should have CSS property "${name}" with value "${value}"`, error);
      throw error;
    }
  }

  async assertArrayContains<T>(array: T[], item: T): Promise<void> {
    try {
      expect(array).toContain(item);
      LogHelper.logPass(`Array contains item: ${JSON.stringify(item)}`);
    } catch (error) {
      LogHelper.logFail(`Array should contain item ${JSON.stringify(item)}`, error);
      throw error;
    }
  }

  async assertArraysEqual<T>(actual: T[], expected: T[]): Promise<void> {
    try {
      expect(JSON.stringify(actual)).toBe(JSON.stringify(expected));
      LogHelper.logPass(`Arrays are equal: ${JSON.stringify(actual)}`);
    } catch (error) {
      LogHelper.logFail(`Arrays should be equal | Expected: ${JSON.stringify(expected)} | Actual: ${JSON.stringify(actual)}`, error);
      throw error;
    }
  }

  async assertObjectsEqual<T>(actual: T, expected: T): Promise<void> {
    try {
      expect(JSON.stringify(actual)).toBe(JSON.stringify(expected));
      LogHelper.logPass(`Objects are equal: ${JSON.stringify(actual)}`);
    } catch (error) {
      LogHelper.logFail(`Objects should be equal | Expected: ${JSON.stringify(expected)} | Actual: ${JSON.stringify(actual)}`, error);
      throw error;
    }
  }

  async assertTruthy(value: unknown): Promise<void> {
    try {
      expect(value).toBeTruthy();
      LogHelper.logPass(`Value is truthy: ${JSON.stringify(value)}`);
    } catch (error) {
      LogHelper.logFail(`Value should be truthy | Value: ${JSON.stringify(value)}`, error);
      throw error;
    }
  }

  async assertFalsy(value: unknown): Promise<void> {
    try {
      expect(value).toBeFalsy();
      LogHelper.logPass(`Value is falsy: ${JSON.stringify(value)}`);
    } catch (error) {
      LogHelper.logFail(`Value should be falsy | Value: ${JSON.stringify(value)}`, error);
      throw error;
    }
  }

  async assertNull(value: unknown): Promise<void> {
    try {
      expect(value).toBeNull();
      LogHelper.logPass(`Value is null`);
    } catch (error) {
      LogHelper.logFail(`Value should be null | Value: ${JSON.stringify(value)}`, error);
      throw error;
    }
  }

  async assertNotNull(value: unknown): Promise<void> {
    try {
      expect(value).not.toBeNull();
      LogHelper.logPass(`Value is not null: ${JSON.stringify(value)}`);
    } catch (error) {
      LogHelper.logFail(`Value should not be null`, error);
      throw error;
    }
  }

  async assertUndefined(value: unknown): Promise<void> {
    try {
      expect(value).toBeUndefined();
      LogHelper.logPass(`Value is undefined`);
    } catch (error) {
      LogHelper.logFail(`Value should be undefined | Value: ${JSON.stringify(value)}`, error);
      throw error;
    }
  }

  async assertDefined(value: unknown): Promise<void> {
    try {
      expect(value).toBeDefined();
      LogHelper.logPass(`Value is defined: ${JSON.stringify(value)}`);
    } catch (error) {
      LogHelper.logFail(`Value should be defined`, error);
      throw error;
    }
  }

  async assertGreaterThan(actual: number, expected: number): Promise<void> {
    try {
      expect(actual).toBeGreaterThan(expected);
      LogHelper.logPass(`${actual} is greater than ${expected}`);
    } catch (error) {
      LogHelper.logFail(`${actual} should be greater than ${expected}`, error);
      throw error;
    }
  }

  async assertLessThan(actual: number, expected: number): Promise<void> {
    try {
      expect(actual).toBeLessThan(expected);
      LogHelper.logPass(`${actual} is less than ${expected}`);
    } catch (error) {
      LogHelper.logFail(`${actual} should be less than ${expected}`, error);
      throw error;
    }
  }

  async assertResponseStatus(status: number, expectedStatus: number): Promise<void> {
    try {
      expect(status).toBe(expectedStatus);
      LogHelper.logPass(`Response status is ${status}`);
    } catch (error) {
      LogHelper.logFail(`Response status should be ${expectedStatus} but got ${status}`, error);
      throw error;
    }
  }
}

export { expect } from '@playwright/test';
