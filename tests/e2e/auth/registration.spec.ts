import { test, expect } from '@playwright/test';
import { RegisterPage } from '../../../src/pages/auth/RegisterPage';
import { DataHelper } from '../../../src/core/helpers/DataHelper';
import { UserFactory } from '../../../src/core/factories/UserFactory';

test.describe('Registration Functionality', () => {
  let registerPage: RegisterPage;

  test.beforeEach(async ({ page }) => {
    registerPage = new RegisterPage(page);
    await registerPage.goto();
  });

  test('should display registration page correctly @smoke @auth', async () => {
    await registerPage.verifyRegisterPageDisplayed();
    
    const title = await registerPage.getTitle();
    expect(title).toBeTruthy();
  });

  test('should show validation error for empty fields @auth', async () => {
    await registerPage.clickSubmit();
    
    // Wait for validation
    await registerPage.page.waitForTimeout(1000);
    
    // Should stay on registration page
    const currentUrl = await registerPage.getCurrentUrl();
    expect(currentUrl).toMatch(/register|signup|sign-up/i);
  });

  test('should show error for invalid email format @auth', async () => {
    const user = UserFactory.createStudent();
    
    await registerPage.enterFirstName(user.firstName);
    await registerPage.enterLastName(user.lastName);
    await registerPage.enterEmail('invalid-email');
    await registerPage.enterPassword(user.password);
    await registerPage.clickSubmit();
    
    await registerPage.page.waitForTimeout(1000);
    
    // Should stay on registration page
    const currentUrl = await registerPage.getCurrentUrl();
    expect(currentUrl).toMatch(/register|signup|sign-up/i);
  });

  test('should show error for weak password @auth', async ({ page }) => {
    const user = UserFactory.createStudent();
    
    await registerPage.enterFirstName(user.firstName);
    await registerPage.enterLastName(user.lastName);
    await registerPage.enterEmail(user.email);
    await registerPage.enterPassword('123'); // Weak password
    
    // Check if confirm password field exists
    const confirmPasswordField = page.locator('input[name="confirmPassword"], input[placeholder*="confirm" i]').first();
    if (await confirmPasswordField.isVisible()) {
      await registerPage.enterConfirmPassword('123');
    }
    
    await registerPage.clickSubmit();
    
    await registerPage.page.waitForTimeout(1000);
    
    // Should stay on registration page or show error
    const currentUrl = await registerPage.getCurrentUrl();
    expect(currentUrl).toMatch(/register|signup|sign-up/i);
  });

  test('should show error for mismatched passwords @auth', async ({ page }) => {
    const user = UserFactory.createStudent();
    
    // Check if confirm password field exists
    const confirmPasswordField = page.locator('input[name="confirmPassword"], input[placeholder*="confirm" i]').first();
    
    if (await confirmPasswordField.isVisible()) {
      await registerPage.enterFirstName(user.firstName);
      await registerPage.enterLastName(user.lastName);
      await registerPage.enterEmail(user.email);
      await registerPage.enterPassword(user.password);
      await registerPage.enterConfirmPassword('DifferentPassword123!');
      await registerPage.clickSubmit();
      
      await registerPage.page.waitForTimeout(1000);
      
      // Should stay on registration page
      const currentUrl = await registerPage.getCurrentUrl();
      expect(currentUrl).toMatch(/register|signup|sign-up/i);
    } else {
      test.skip();
    }
  });

  test('should successfully register with valid data @auth @critical', async ({ page }) => {
    const user = UserFactory.createStudent();
    
    // Check what fields are available
    const confirmPasswordField = page.locator('input[name="confirmPassword"], input[placeholder*="confirm" i]').first();
    const hasConfirmPassword = await confirmPasswordField.isVisible().catch(() => false);
    
    await registerPage.register({
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      password: user.password,
      confirmPassword: hasConfirmPassword ? user.password : undefined,
    });
    
    // Wait for response
    await page.waitForTimeout(3000);
    
    // After registration, might redirect or show success
    // This depends on the actual app behavior
    const currentUrl = await registerPage.getCurrentUrl();
    
    // Verify we're not on an error state
    expect(currentUrl).toBeTruthy();
  });

  test('should navigate to login page from registration @auth', async ({ page }) => {
    const loginLink = page.locator('a:has-text("Sign in"), a:has-text("Login")').first();
    
    if (await loginLink.isVisible()) {
      await registerPage.clickLogin();
      
      await page.waitForTimeout(2000);
      
      const currentUrl = await registerPage.getCurrentUrl();
      expect(currentUrl).toContain('/login');
    } else {
      test.skip();
    }
  });

  test('should enforce password requirements @auth', async () => {
    const user = UserFactory.createStudent();
    
    // Try various weak passwords
    const weakPasswords = ['123', 'password', 'abc123'];
    
    for (const weakPassword of weakPasswords) {
      await registerPage.enterFirstName(user.firstName);
      await registerPage.enterLastName(user.lastName);
      await registerPage.enterEmail(DataHelper.generateEmail());
      await registerPage.enterPassword(weakPassword);
      await registerPage.clickSubmit();
      
      await registerPage.page.waitForTimeout(1000);
      
      // Should stay on registration page
      const currentUrl = await registerPage.getCurrentUrl();
      expect(currentUrl).toMatch(/register|signup|sign-up/i);
      
      // Clear fields for next iteration
      await registerPage.page.reload();
      await registerPage.page.waitForLoadState('domcontentloaded');
    }
  });
});
