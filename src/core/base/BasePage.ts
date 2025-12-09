import { Page } from '@playwright/test';
import { BrowserHelper } from '../helpers/BrowserHelper';
import { AssertionHelper } from '../helpers/AssertionHelper';
import { DataHelper } from '@core/helpers/DataHelper';
import { WaitHelper } from '@core/helpers/WaitHelper';

/**
 * BasePage - Abstract base class for all page objects
 * Provides common functionality and utilities for all pages
 */
export abstract class BasePage {
  protected readonly page: Page;
  private browserHelperInstance: BrowserHelper;
  private assertionHelperInstance: AssertionHelper;
  private dataHelperInstance: DataHelper;
  private waitHelperInstance: WaitHelper;

  constructor(page: Page) {
    this.page = page;
    this.browserHelperInstance = new BrowserHelper(page);
    this.assertionHelperInstance = new AssertionHelper();
    this.dataHelperInstance = new DataHelper();
    this.waitHelperInstance = new WaitHelper();
  }

  /**
   * Get BrowserHelper instance
   * Returns a singleton instance of BrowserHelper for this page
   */
  browser(): BrowserHelper {
    return this.browserHelperInstance;
  }

  /**
 * Get assertionHelper instance
 * Returns a singleton instance of AssertionHelper for this page
 */
  assertion(): AssertionHelper {
    return this.assertionHelperInstance;
  }

    /**
 * Get assertionHelper instance
 * Returns a singleton instance of AssertionHelper for this page
 */
  data(): DataHelper {
    return this.dataHelperInstance;
  }

      /**
 * Get assertionHelper instance
 * Returns a singleton instance of AssertionHelper for this page
 */
  wait(): WaitHelper {
    return this.waitHelperInstance;
  }
}