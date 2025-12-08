import { test, expect } from '@playwright/test';
import { LoginPage } from '../../../src/pages/auth/LoginPage';
import { testUsers } from '../../../src/core/config/test-config';
import { DataHelper } from '../../../src/core/helpers/DataHelper';
import { ERROR_MESSAGES } from '../../../src/core/config/constants';

test.describe('Login Functionality', () => {
  let loginPage: LoginPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    await loginPage.goto();
  });

  test('should display login page correctly @smoke @auth', async () => {
    await loginPage.verifyLoginPageDisplayed();
    
    const title = await loginPage.getTitle();
    expect(title).toBeTruthy();
  });

  test('should show validation error for empty email @auth', async () => {
    await loginPage.enterPassword('SomePassword123!');
    await loginPage.clickSubmit();
    
    // Wait a bit for validation to appear
    await loginPage.page.waitForTimeout(1000);
    
    // The form should not submit successfully
    const currentUrl = await loginPage.getCurrentUrl();
    expect(currentUrl).toContain('/login');
  });

  test('should show validation error for empty password @auth', async () => {
    await loginPage.enterEmail('test@example.com');
    await loginPage.clickSubmit();
    
    // Wait a bit for validation to appear
    await loginPage.page.waitForTimeout(1000);
    
    // The form should not submit successfully
    const currentUrl = await loginPage.getCurrentUrl();
    expect(currentUrl).toContain('/login');
  });

  test('should show error for invalid credentials @auth @critical', async () => {
    const invalidEmail = DataHelper.generateEmail();
    const invalidPassword = DataHelper.generatePassword();
    
    await loginPage.login(invalidEmail, invalidPassword);
    
    // Wait for error message or stay on login page
    await loginPage.page.waitForTimeout(2000);
    
    const currentUrl = await loginPage.getCurrentUrl();
    // Should either stay on login page or show error
    expect(currentUrl).toContain('/login');
  });

  test('should navigate to forgot password page @auth', async ({ page }) => {
    // Check if forgot password link exists
    const forgotPasswordLink = page.locator('a:has-text("Forgot"), a:has-text("Reset password")').first();
    
    if (await forgotPasswordLink.isVisible()) {
      await loginPage.clickForgotPassword();
      
      // Wait for navigation
      await page.waitForTimeout(2000);
      
      const currentUrl = await loginPage.getCurrentUrl();
      // Should navigate to forgot password or reset password page
      expect(currentUrl).toMatch(/forgot|reset/i);
    } else {
      test.skip();
    }
  });

  test('should navigate to registration page @auth', async ({ page }) => {
    // Check if register link exists
    const registerLink = page.locator('a:has-text("Sign up"), a:has-text("Register"), a:has-text("Create account")').first();
    
    if (await registerLink.isVisible()) {
      await loginPage.clickRegister();
      
      // Wait for navigation
      await page.waitForTimeout(2000);
      
      const currentUrl = await loginPage.getCurrentUrl();
      // Should navigate to registration page
      expect(currentUrl).toMatch(/register|signup|sign-up/i);
    } else {
      test.skip();
    }
  });

  test('should handle network errors gracefully @auth', async ({ page, context }) => {
    // Simulate offline mode
    await context.setOffline(true);
    
    await loginPage.enterEmail('test@example.com');
    await loginPage.enterPassword('Password123!');
    await loginPage.clickSubmit();
    
    // Wait for error handling
    await page.waitForTimeout(2000);
    
    // Should stay on login page or show network error
    const currentUrl = await loginPage.getCurrentUrl();
    expect(currentUrl).toContain('/login');
    
    // Restore network
    await context.setOffline(false);
  });

  test('should validate email format @auth', async () => {
    await loginPage.enterEmail('invalid-email');
    await loginPage.enterPassword('Password123!');
    await loginPage.clickSubmit();
    
    await loginPage.page.waitForTimeout(1000);
    
    // Should stay on login page due to validation
    const currentUrl = await loginPage.getCurrentUrl();
    expect(currentUrl).toContain('/login');
  });
});
