import { Locator, Page } from '@playwright/test';

/**
 * BaseComponent - Abstract base class for reusable components
 * Used for components that appear across multiple pages (header, footer, modals, etc.)
 */
export abstract class BaseComponent {
  protected readonly page: Page;
  protected readonly container: Locator;

  constructor(page: Page, containerSelector: string) {
    this.page = page;
    this.container = page.locator(containerSelector);
  }

  /**
   * Wait for the component to be visible
   */
  async waitForVisible(): Promise<void> {
    await this.container.waitFor({ state: 'visible' });
  }

  /**
   * Wait for the component to be hidden
   */
  async waitForHidden(): Promise<void> {
    await this.container.waitFor({ state: 'hidden' });
  }

  /**
   * Check if component is visible
   */
  async isVisible(): Promise<boolean> {
    try {
      return await this.container.isVisible();
    } catch {
      return false;
    }
  }

  /**
   * Get a child locator within the component
   * @param selector - Selector relative to component container
   */
  protected getLocator(selector: string): Locator {
    return this.container.locator(selector);
  }

  /**
   * Click on a child element within the component
   * @param selector - Selector relative to component container
   */
  protected async clickWithin(selector: string): Promise<void> {
    await this.getLocator(selector).click();
  }

  /**
   * Get text from a child element within the component
   * @param selector - Selector relative to component container
   */
  protected async getTextWithin(selector: string): Promise<string> {
    return (await this.getLocator(selector).textContent()) || '';
  }
}
