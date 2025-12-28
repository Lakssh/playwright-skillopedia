import { test } from '@playwright/test';

/**
 * LogHelper - Centralized logging utility that logs to console and Playwright report
 */
export class LogHelper {
  private static readonly COMPLETED = '☑️ COMPLETED';
  private static readonly PASS = '✅ PASS';
  private static readonly FAIL = '❌ FAIL';
  private static readonly ERROR = '🔴 ERROR';

  /**
   * Log success message to console and Playwright report (grey tick - used in BrowserHelper)
   * @param message - Message to log
   */
  static logCompleted(message: string): void {
    console.log(`${this.COMPLETED}: ${message}`);
    // Add to Playwright report as a step
    test.step(`${this.COMPLETED} ${message}`, async () => {
      // This creates a visible step in the HTML report
    });
  }

  /**
   * Log success message to console and Playwright report (green tick - used in AssertionHelper)
   * @param message - Message to log
   */
  static logPass(message: string): void {
    console.log(`${this.PASS}: ${message}`);
    // Add to Playwright report as a step
    test.step(`${this.PASS} ${message}`, async () => {
      // This creates a visible step in the HTML report
    });
  }

  /**
   * Log failure message to console and Playwright report
   * @param message - Message to log
   * @param error - Optional error object
   */
  static logFail(message: string, error?: Error | unknown): void {
    const errorMsg = error instanceof Error ? error.message : String(error);
    const fullMsg = `${this.FAIL}: ${message}${errorMsg ? ` | Error: ${errorMsg}` : ''}`;
    console.error(fullMsg);
    // Add to Playwright report as a step
    test.step(`${this.FAIL} ${message}`, async () => {
      // This creates a visible step in the HTML report
    });
  }

  /**
   * Log error message to console and Playwright report
   * @param message - Message to log
   * @param error - Optional error object
   */
  static logError(message: string, error?: Error | unknown): void {
    const errorMsg = error instanceof Error ? error.message : String(error);
    const fullMsg = `${this.ERROR}: ${message}${errorMsg ? ' | ' + errorMsg : ''}`;
    console.warn(fullMsg);
    // Add to Playwright report as a step
    test.step(`${this.ERROR} ${message}`, async () => {
      // This creates a visible step in the HTML report
    });
  }

  /**
   * Log info message to console and Playwright report
   * @param message - Message to log
   */
  static logInfo(message: string): void {
    console.info(`ℹ️ INFO: ${message}`);
    test.step(`ℹ️ INFO: ${message}`, async () => {
      // This creates a visible step in the HTML report
    });
  }
}
