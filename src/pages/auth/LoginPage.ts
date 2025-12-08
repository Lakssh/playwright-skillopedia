import { Page, Locator } from '@playwright/test';
import { BasePage } from '../../core/base/BasePage';
import { ROUTES } from '../../core/config/constants';

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
    await this.navigate(ROUTES.LOGIN);
    await this.waitForPageLoad();
    return this;
  }

  /**
   * Login with email and password
   * @param email - User email
   * @param password - User password
   */
  async login(email: string, password: string): Promise<LoginPage> {
    await this.fill(this.emailInput, email);
    await this.fill(this.passwordInput, password);
    await this.click(this.submitButton);
    return this;
  }

  /**
   * Enter email
   * @param email - Email address
   */
  async enterEmail(email: string): Promise<LoginPage> {
    await this.fill(this.emailInput, email);
    return this;
  }

  /**
   * Enter password
   * @param password - Password
   */
  async enterPassword(password: string): Promise<LoginPage> {
    await this.fill(this.passwordInput, password);
    return this;
  }

  /**
   * Click submit button
   */
  async clickSubmit(): Promise<void> {
    await this.click(this.submitButton);
  }

  /**
   * Click forgot password link
   */
  async clickForgotPassword(): Promise<void> {
    await this.click(this.forgotPasswordLink);
  }

  /**
   * Click register link
   */
  async clickRegister(): Promise<void> {
    await this.click(this.registerLink);
  }

  /**
   * Get error message text
   */
  async getErrorMessage(): Promise<string> {
    await this.waitForVisible(this.errorMessage);
    return await this.getText(this.errorMessage);
  }

  /**
   * Get success message text
   */
  async getSuccessMessage(): Promise<string> {
    await this.waitForVisible(this.successMessage);
    return await this.getText(this.successMessage);
  }

  /**
   * Check if error message is displayed
   */
  async isErrorDisplayed(): Promise<boolean> {
    return await this.isVisible(this.errorMessage);
  }

  /**
   * Check if success message is displayed
   */
  async isSuccessDisplayed(): Promise<boolean> {
    return await this.isVisible(this.successMessage);
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
    await this.expectToBeVisible(this.emailInput);
    await this.expectToBeVisible(this.passwordInput);
    await this.expectToBeVisible(this.submitButton);
  }
}
