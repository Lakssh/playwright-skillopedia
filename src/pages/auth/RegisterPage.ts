import { Page, Locator } from '@playwright/test';
import { ROUTES } from '../../../test-data/constants';
import { BasePage } from '@core/base/BasePage';

/**
 * RegisterPage - Page Object Model for registration functionality
 */
export class RegisterPage extends BasePage {
  // Locators
  private readonly firstNameInput: Locator;
  private readonly lastNameInput: Locator;
  private readonly emailInput: Locator;
  private readonly passwordInput: Locator;
  private readonly confirmPasswordInput: Locator;
  private readonly submitButton: Locator;
  private readonly loginLink: Locator;
  private readonly errorMessage: Locator;
  private readonly successMessage: Locator;
  private readonly termsCheckbox: Locator;

  constructor(page: Page) {
    super(page);
    
    this.firstNameInput = page.locator('input[name="firstName"], input[placeholder*="first name" i]').first();
    this.lastNameInput = page.locator('input[name="lastName"], input[placeholder*="last name" i]').first();
    this.emailInput = page.locator('input[type="email"], input[name="email"]').first();
    this.passwordInput = page.locator('input[type="password"], input[name="password"]').first();
    this.confirmPasswordInput = page.locator('input[name="confirmPassword"], input[placeholder*="confirm" i]').first();
    this.submitButton = page.locator('button[type="submit"], button:has-text("Sign up"), button:has-text("Register")').first();
    this.loginLink = page.locator('a:has-text("Sign in"), a:has-text("Login")').first();
    this.errorMessage = page.locator('[role="alert"], .error, .error-message').first();
    this.successMessage = page.locator('.success, .success-message').first();
    this.termsCheckbox = page.locator('input[type="checkbox"]').first();
  }

  /**
   * Navigate to register page
   */
  async goto(): Promise<RegisterPage> {
    await this.browser().navigate(ROUTES.REGISTER);
    await this.browser().waitForPageLoad();
    return this;
  }

  /**
   * Register with user details
   * @param userData - User registration data
   */
  async register(userData: {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    confirmPassword?: string;
  }): Promise<RegisterPage> {
    await this.browser().fill(this.firstNameInput, userData.firstName);
    await this.browser().fill(this.lastNameInput, userData.lastName);
    await this.browser().fill(this.emailInput, userData.email);
    await this.browser().fill(this.passwordInput, userData.password);
    
    if (userData.confirmPassword) {
      await this.browser().fill(this.confirmPasswordInput, userData.confirmPassword);
    }
    
    // Accept terms if checkbox exists
    if (await this.browser().isVisible(this.termsCheckbox)) {
      await this.browser().click(this.termsCheckbox);
    }
    
    await this.browser().click(this.submitButton);
    return this;
  }

  /**
   * Enter first name
   */
  async enterFirstName(firstName: string): Promise<RegisterPage> {
    await this.browser().fill(this.firstNameInput, firstName);
    return this;
  }

  /**
   * Enter last name
   */
  async enterLastName(lastName: string): Promise<RegisterPage> {
    await this.browser().fill(this.lastNameInput, lastName);
    return this;
  }

  /**
   * Enter email
   */
  async enterEmail(email: string): Promise<RegisterPage> {
    await this.browser().fill(this.emailInput, email);
    return this;
  }

  /**
   * Enter password
   */
  async enterPassword(password: string): Promise<RegisterPage> {
    await this.browser().fill(this.passwordInput, password);
    return this;
  }

  /**
   * Enter confirm password
   */
  async enterConfirmPassword(password: string): Promise<RegisterPage> {
    await this.browser().fill(this.confirmPasswordInput, password);
    return this;
  }

  /**
   * Accept terms and conditions
   */
  async acceptTerms(): Promise<RegisterPage> {
    if (await this.browser().isVisible(this.termsCheckbox)) {
      await this.browser().click(this.termsCheckbox);
    }
    return this;
  }

  /**
   * Click submit button
   */
  async clickSubmit(): Promise<void> {
    await this.browser().click(this.submitButton);
  }

  /**
   * Click login link
   */
  async clickLogin(): Promise<void> {
    await this.browser().click(this.loginLink);
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
    return await this.getText(this.successMessage);
  }

  /**
   * Check if error message is displayed
   */
  async isErrorDisplayed(): Promise<boolean> {
    return await this.browserisVisible(this.errorMessage);
  }

  /**
   * Wait for successful registration
   */
  async waitForRegistrationSuccess(): Promise<void> {
    await this.page.waitForURL((url) => !url.pathname.includes('/register'), { timeout: 15000 });
  }

  /**
   * Verify register page is displayed
   */
  async verifyRegisterPageDisplayed(): Promise<void> {
    await this.browser().expectToBeVisible(this.emailInput);
    await this.browser().expectToBeVisible(this.passwordInput);
    await this.browser().expectToBeVisible(this.submitButton);
  }
}
