import { expect, Locator, Page } from '@playwright/test';

/**
 * AssertionHelper - Custom assertion utilities
 */
export class AssertionHelper {
  /**
   * Assert URL contains text
   * @param page - Page instance
   * @param text - Text to check for in URL
   */
  static async assertUrlContains(page: Page, text: string): Promise<void> {
    const url = page.url();
    expect(url).toContain(text);
  }

  /**
   * Assert URL matches pattern
   * @param page - Page instance
   * @param pattern - Pattern to match
   */
  static async assertUrlMatches(page: Page, pattern: RegExp): Promise<void> {
    const url = page.url();
    expect(url).toMatch(pattern);
  }

  /**
   * Assert page title
   * @param page - Page instance
   * @param expectedTitle - Expected page title
   */
  static async assertTitle(page: Page, expectedTitle: string): Promise<void> {
    await expect(page).toHaveTitle(expectedTitle);
  }

  /**
   * Assert element is visible
   * @param locator - Element locator
   */
  static async assertVisible(locator: Locator): Promise<void> {
    await expect(locator).toBeVisible();
  }

  /**
   * Assert element is hidden
   * @param locator - Element locator
   */
  static async assertHidden(locator: Locator): Promise<void> {
    await expect(locator).toBeHidden();
  }

  /**
   * Assert element is enabled
   * @param locator - Element locator
   */
  static async assertEnabled(locator: Locator): Promise<void> {
    await expect(locator).toBeEnabled();
  }

  /**
   * Assert element is disabled
   * @param locator - Element locator
   */
  static async assertDisabled(locator: Locator): Promise<void> {
    await expect(locator).toBeDisabled();
  }

  /**
   * Assert element has exact text
   * @param locator - Element locator
   * @param text - Expected text
   */
  static async assertHasText(locator: Locator, text: string | RegExp): Promise<void> {
    await expect(locator).toHaveText(text);
  }

  /**
   * Assert element contains text
   * @param locator - Element locator
   * @param text - Text to check for
   */
  static async assertContainsText(locator: Locator, text: string | RegExp): Promise<void> {
    await expect(locator).toContainText(text);
  }

  /**
   * Assert element has value
   * @param locator - Element locator
   * @param value - Expected value
   */
  static async assertHasValue(locator: Locator, value: string | RegExp): Promise<void> {
    await expect(locator).toHaveValue(value);
  }

  /**
   * Assert element has attribute
   * @param locator - Element locator
   * @param name - Attribute name
   * @param value - Expected attribute value
   */
  static async assertHasAttribute(locator: Locator, name: string, value?: string | RegExp): Promise<void> {
    if (value !== undefined) {
      await expect(locator).toHaveAttribute(name, value);
    } else {
      await expect(locator).toHaveAttribute(name);
    }
  }

  /**
   * Assert element has class
   * @param locator - Element locator
   * @param className - Class name
   */
  static async assertHasClass(locator: Locator, className: string | RegExp): Promise<void> {
    await expect(locator).toHaveClass(className);
  }

  /**
   * Assert element count
   * @param locator - Element locator
   * @param count - Expected count
   */
  static async assertCount(locator: Locator, count: number): Promise<void> {
    await expect(locator).toHaveCount(count);
  }

  /**
   * Assert element is checked (checkbox/radio)
   * @param locator - Element locator
   */
  static async assertChecked(locator: Locator): Promise<void> {
    await expect(locator).toBeChecked();
  }

  /**
   * Assert element is not checked (checkbox/radio)
   * @param locator - Element locator
   */
  static async assertNotChecked(locator: Locator): Promise<void> {
    await expect(locator).not.toBeChecked();
  }

  /**
   * Assert element is focused
   * @param locator - Element locator
   */
  static async assertFocused(locator: Locator): Promise<void> {
    await expect(locator).toBeFocused();
  }

  /**
   * Assert element has CSS property
   * @param locator - Element locator
   * @param name - CSS property name
   * @param value - Expected CSS property value
   */
  static async assertHasCss(locator: Locator, name: string, value: string | RegExp): Promise<void> {
    await expect(locator).toHaveCSS(name, value);
  }

  /**
   * Assert array contains item
   * @param array - Array to check
   * @param item - Item to find
   */
  static assertArrayContains<T>(array: T[], item: T): void {
    expect(array).toContain(item);
  }

  /**
   * Assert arrays are equal
   * @param actual - Actual array
   * @param expected - Expected array
   */
  static assertArraysEqual<T>(actual: T[], expected: T[]): void {
    expect(JSON.stringify(actual)).toBe(JSON.stringify(expected));
  }

  /**
   * Assert objects are equal
   * @param actual - Actual object
   * @param expected - Expected object
   */
  static assertObjectsEqual<T>(actual: T, expected: T): void {
    expect(JSON.stringify(actual)).toBe(JSON.stringify(expected));
  }

  /**
   * Assert value is truthy
   * @param value - Value to check
   */
  static assertTruthy(value: unknown): void {
    expect(value).toBeTruthy();
  }

  /**
   * Assert value is falsy
   * @param value - Value to check
   */
  static assertFalsy(value: unknown): void {
    expect(value).toBeFalsy();
  }

  /**
   * Assert value is null
   * @param value - Value to check
   */
  static assertNull(value: unknown): void {
    expect(value).toBeNull();
  }

  /**
   * Assert value is not null
   * @param value - Value to check
   */
  static assertNotNull(value: unknown): void {
    expect(value).not.toBeNull();
  }

  /**
   * Assert value is undefined
   * @param value - Value to check
   */
  static assertUndefined(value: unknown): void {
    expect(value).toBeUndefined();
  }

  /**
   * Assert value is defined
   * @param value - Value to check
   */
  static assertDefined(value: unknown): void {
    expect(value).toBeDefined();
  }

  /**
   * Assert number is greater than
   * @param actual - Actual value
   * @param expected - Expected minimum value
   */
  static assertGreaterThan(actual: number, expected: number): void {
    expect(actual).toBeGreaterThan(expected);
  }

  /**
   * Assert number is less than
   * @param actual - Actual value
   * @param expected - Expected maximum value
   */
  static assertLessThan(actual: number, expected: number): void {
    expect(actual).toBeLessThan(expected);
  }

  /**
   * Assert response status
   * @param status - Response status code
   * @param expectedStatus - Expected status code
   */
  static assertResponseStatus(status: number, expectedStatus: number): void {
    expect(status).toBe(expectedStatus);
  }
}
