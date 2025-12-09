import { Page, Locator } from '@playwright/test';
import { ROUTES } from '../../../test-data/constants';
import { BasePage } from '@core/base/BasePage';

/**
 * LoginPage - Page Object Model for login functionality
 */
export class LoginPage extends BasePage {
  // Locators
  private readonly emailInput: Locator;
  private readonly passwordInput: Locator;
  private readonly submitButton: Locator;
  private readonly forgotPasswordLink: Locator;
  private readonly registerLink: Locator;
  private readonly errorMessage: Locator;
  private readonly successMessage: Locator;

  constructor(page: Page) {
    super(page);
    
    // Initialize locators with multiple strategies for self-healing
    this.emailInput = page.locator('input[type="email"], input[name="email"], input[placeholder*="email" i]').first();
    this.passwordInput = page.locator('input[type="password"], input[name="password"]').first();
    this.submitButton = page.locator('button[type="submit"], button:has-text("Sign in"), button:has-text("Login")').first();
    this.forgotPasswordLink = page.locator('a:has-text("Forgot"), a:has-text("Reset password")').first();
    this.registerLink = page.locator('a:has-text("Sign up"), a:has-text("Register"), a:has-text("Create account")').first();
    this.errorMessage = page.locator('[role="alert"], .error, .error-message').first();
    this.successMessage = page.locator('.success, .success-message').first();
  }

  /**
   * Navigate to login page
   */
  async goto(): Promise<LoginPage> {
    await this.browser().navigate(ROUTES.LOGIN);
    await this.browser().waitForPageLoad();
    return this;
  }

  /**
   * Login with email and password
   * @param email - User email
   * @param password - User password
   */
  async login(email: string, password: string): Promise<LoginPage> {
    await this.browser().fill(this.emailInput, email);
    await this.browser().fill(this.passwordInput, password);
    await this.browser().click(this.submitButton);
    return this;
  }

  /**
   * Enter email
   * @param email - Email address
   */
  async enterEmail(email: string): Promise<LoginPage> {
    await this.browser().fill(this.emailInput, email);
    return this;
  }

  /**
   * Enter password
   * @param password - Password
   */
  async enterPassword(password: string): Promise<LoginPage> {
    await this.browser().fill(this.passwordInput, password);
    return this;
  }

  /**
   * Click submit button
   */
  async clickSubmit(): Promise<void> {
    await this.browser().click(this.submitButton);
  }

  /**
   * Click forgot password link
   */
  async clickForgotPassword(): Promise<void> {
    await this.browser().click(this.forgotPasswordLink);
  }

  /**
   * Click register link
   */
  async clickRegister(): Promise<void> {
    await this.browser().click(this.registerLink);
  }

  /**
   * Get error message text
   */
  async getErrorMessage(): Promise<string> {
    await this.browser().waitForVisible(this.errorMessage);
    return await this.browser().getText(this.errorMessage);
  }

  /**
   * Get success message text
   */
  async getSuccessMessage(): Promise<string> {
    await this.browser().waitForVisible(this.successMessage);
    return await this.browser().getText(this.successMessage);
  }

  /**
   * Check if error message is displayed
   */
  async isErrorDisplayed(): Promise<boolean> {
    return await this.browser().isVisible(this.errorMessage);
  }

  /**
   * Check if success message is displayed
   */
  async isSuccessDisplayed(): Promise<boolean> {
    return await this.browser().isVisible(this.successMessage);
  }

  /**
   * Wait for successful login (redirect away from login page)
   */
  async waitForLoginSuccess(): Promise<void> {
    await this.page.waitForURL((url) => !url.pathname.includes('/login'), { timeout: 15000 });
  }

  /**
   * Verify login page is displayed
   */
  async verifyLoginPageDisplayed(): Promise<void> {
    await this.browser().expectToBeVisible(this.emailInput);
    await this.browser().expectToBeVisible(this.passwordInput);
    await this.browser().expectToBeVisible(this.submitButton);
  }
}
