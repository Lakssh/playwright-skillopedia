import { Page, Locator } from '@playwright/test';
import { ROUTES } from '../../../test-data/constants';
import { BasePage } from '@core/base/BasePage';

/**
 * LoginPage - Page Object Model for login functionality
 */
export class LoginPage extends BasePage {
  // Locators
  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly submitButton: Locator;
  readonly forgotPasswordLink: Locator;
  readonly registerLink: Locator;
  readonly errorMessage: Locator;
  readonly successMessage: Locator;
  readonly signInButton: Locator;
  readonly cookiesAcceptButton: Locator;
  readonly signOutButton: Locator;

  constructor(page: Page) {
    super(page);
    
    // Initialize locators with accessibility-based selectors for reliability
    this.signInButton = page.getByRole('link', { name: 'Sign In' });
    this.emailInput = page.getByRole('textbox', { name: 'Email address' });
    this.passwordInput = page.getByRole('textbox', { name: 'Password' });
    this.submitButton = page.getByRole('button', { name: 'Sign in' });
    this.forgotPasswordLink = page.getByRole('link', { name: 'Forgot your password?' });
    this.registerLink = page.getByRole('link', { name: 'Sign up free' });
    this.errorMessage = page.getByRole('alert').or(page.locator('.error, .error-message, [data-testid="error-message"]')).first();
    this.successMessage = page.locator('.success, .success-message, [role="status"], [data-testid="success-message"]').first();
    this.cookiesAcceptButton = page.getByRole('button', { name: 'Accept All' });
    this.signOutButton = page.getByRole('button', { name: 'Sign Out' }).or(page.getByRole('link', { name: 'Sign Out' }));
  
  }

  /**
   * Navigate to login page
   */

  async goto(): Promise<LoginPage> {
    await this.browser().navigate(ROUTES.HOME);
    await this.browser().waitForPageLoad();
    await this.assertion().assertTitle(this.page, 'Skillopedia - Find Your Perfect Skill Mentor');
    await this.signInButton.click();
    await this.handleCookieConsent();    
    return this;
  }

  /**
   * Handle cookie consent banner if present
   */

  async handleCookieConsent(): Promise<void> {
    try {
      if (await this.cookiesAcceptButton.isVisible({ timeout: 2000 })) {
        await this.cookiesAcceptButton.click();
      }
    } catch (error) {
      // Cookie banner not present, continue
    }
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
    await this.page.waitForURL((url) => url.pathname.includes('/dashboard'), { timeout: 15000 });
  }

  /**
   * Verify login page is displayed
   */
  async verifyLoginPageDisplayed(): Promise<void> {
    await this.browser().expectToBeVisible(this.emailInput);
    await this.browser().expectToBeVisible(this.passwordInput);
    await this.browser().expectToBeVisible(this.submitButton);
  }

    /**
   * Verify user name and role are displayed after successful login
  */
  async verifyUserProfileDisplayed(userName : string, role: string): Promise<void> {
    // Wait for dashboard page to fully load
    await this.page.waitForLoadState('networkidle');
    const userProfileButton = this.page.getByRole('button', { name: new RegExp(`.*${userName}.*`) });
    const userNameDisplay = this.page.getByText(userName).nth(1);
    const userRoleDisplay = this.page.getByText(role).nth(1);
    
    // Wait for profile button to be visible
    await this.browser().expectToBeVisible(userProfileButton);
    await this.browser().click(userProfileButton);
    
    // Wait for dropdown to open and verify elements
    await this.browser().expectToBeVisible(userNameDisplay);
    await this.browser().expectToBeVisible(userRoleDisplay);
    
    // Verify the actual text matches expected values
    await this.assertion().assertHasText(userNameDisplay, userName);
    await this.assertion().assertHasText(userRoleDisplay, role);
    await this.browser().click(userProfileButton);
  }

  async signOut(userName : string): Promise<void> {
    const userProfileButton = this.page.getByRole('button', { name: new RegExp(`.*${userName}.*`) });
    await this.browser().click(userProfileButton);
    await this.browser().click(this.signOutButton);
    await this.page.waitForURL((url) => url.pathname.includes('/signin'), { timeout: 10000 });
  }

  /**
 * Login using saved storage state (faster than manual login)
 * @param role - User role: 'Skill Seeker', 'Skill Guide', or 'Skill Mentor'
 * @param context - Browser context to apply storage state to
 */
async loginWithStorageState(role: string, context: any): Promise<LoginPage> {
  try {
    // Convert role to filename format
    const roleFileName = role.toLowerCase().replace(' ', '-');
    const storageStatePath = `./.auth/${roleFileName}-auth.json`;
    
    // Check if storage state file exists
    const fs = require('fs');
    if (!fs.existsSync(storageStatePath)) {
      throw new Error(`Storage state file not found: ${storageStatePath}. Please run authentication setup first.`);
    }
    
    // Load storage state
    await context.addCookies(JSON.parse(fs.readFileSync(storageStatePath, 'utf-8')).cookies || []);
    console.log(`✅ Loaded ${role} authentication state from: ${storageStatePath}`);
    
    // Navigate directly to dashboard since user is already authenticated
    await this.page.goto('/dashboard-new');
    await this.browser().waitForPageLoad();
    
    await this.waitForLoginSuccess();
    
    console.log(`✅ Successfully logged in as ${role} using storage state`);
    return this;
    
  } catch (error) {
    console.error(`❌ Failed to login with storage state: ${error}`);
    console.log('🔄 Falling back to manual login...');
    
    // Fallback to manual login if storage state fails
    return await this.goto();
  }
}

/**
 * Quick login method that tries storage state first, then falls back to manual login
 * @param role - User role
 * @param context - Browser context
 * @param email - Email for fallback login
 * @param password - Password for fallback login
 */
async quickLogin(role: string, context: any, email?: string, password?: string): Promise<LoginPage> {
  try {
    return await this.loginWithStorageState(role, context);
  } catch (error) {
    if (email && password) {
      console.log('🔄 Storage state failed, using manual login...');
      await this.goto();
      await this.verifyLoginPageDisplayed();
      await this.login(email, password);
      await this.waitForLoginSuccess();
      return this;
    } else {
      throw new Error(`Storage state login failed and no fallback credentials provided: ${error}`);
    }
  }
}

/**
 * Save current authentication state for future use
 * @param role - User role to save state for
 * @param context - Browser context to save
 */
async saveAuthState(role: string, context: any): Promise<void> {
  const roleFileName = role.toLowerCase().replace(' ', '-');
  const storageStatePath = `.auth/${roleFileName}-auth.json`;
  
  // Ensure auth-states directory exists
  const fs = require('fs');
  const path = require('path');
  const dir = path.dirname(storageStatePath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  
  await context.storageState({ path: storageStatePath });
  console.log(`✅ Saved ${role} authentication state to: ${storageStatePath}`);
}

}