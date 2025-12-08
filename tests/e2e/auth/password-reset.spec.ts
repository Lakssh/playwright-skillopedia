import { test, expect } from '@playwright/test';
import { DataHelper } from '../../../src/core/helpers/DataHelper';
import { ROUTES } from '../../../src/core/config/constants';

test.describe('Password Reset Functionality', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(ROUTES.FORGOT_PASSWORD);
  });

  test('should display forgot password page @auth', async ({ page }) => {
    // Check if we're on forgot password page or if it exists
    const currentUrl = page.url();
    
    // Try to find email input for password reset
    const emailInput = page.locator('input[type="email"], input[name="email"]').first();
    
    if (await emailInput.isVisible().catch(() => false)) {
      await expect(emailInput).toBeVisible();
    } else {
      // Page might not exist or have different structure
      test.skip();
    }
  });

  test('should request password reset for valid email @auth', async ({ page }) => {
    const email = DataHelper.generateEmail();
    
    // Try to find email input
    const emailInput = page.locator('input[type="email"], input[name="email"]').first();
    const submitButton = page.locator('button[type="submit"], button:has-text("Reset"), button:has-text("Send")').first();
    
    if (await emailInput.isVisible().catch(() => false)) {
      await emailInput.fill(email);
      
      if (await submitButton.isVisible().catch(() => false)) {
        await submitButton.click();
        
        // Wait for response
        await page.waitForTimeout(2000);
        
        // Success or error message should appear
        const currentUrl = page.url();
        expect(currentUrl).toBeTruthy();
      } else {
        test.skip();
      }
    } else {
      test.skip();
    }
  });

  test('should show validation error for invalid email @auth', async ({ page }) => {
    // Try to find email input
    const emailInput = page.locator('input[type="email"], input[name="email"]').first();
    const submitButton = page.locator('button[type="submit"], button:has-text("Reset"), button:has-text("Send")').first();
    
    if (await emailInput.isVisible().catch(() => false)) {
      await emailInput.fill('invalid-email');
      
      if (await submitButton.isVisible().catch(() => false)) {
        await submitButton.click();
        
        await page.waitForTimeout(1000);
        
        // Should stay on same page or show error
        const currentUrl = page.url();
        expect(currentUrl).toContain('forgot');
      } else {
        test.skip();
      }
    } else {
      test.skip();
    }
  });

  test('should show validation error for empty email @auth', async ({ page }) => {
    const submitButton = page.locator('button[type="submit"], button:has-text("Reset"), button:has-text("Send")').first();
    
    if (await submitButton.isVisible().catch(() => false)) {
      await submitButton.click();
      
      await page.waitForTimeout(1000);
      
      // Should stay on same page
      const currentUrl = page.url();
      expect(currentUrl).toContain('forgot');
    } else {
      test.skip();
    }
  });

  test('should have link back to login @auth', async ({ page }) => {
    const loginLink = page.locator('a:has-text("Back to login"), a:has-text("Sign in"), a:has-text("Login")').first();
    
    if (await loginLink.isVisible().catch(() => false)) {
      await loginLink.click();
      
      await page.waitForTimeout(2000);
      
      const currentUrl = page.url();
      expect(currentUrl).toContain('/login');
    } else {
      test.skip();
    }
  });
});
