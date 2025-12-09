import { test as base, Page } from '@playwright/test';
import { ROUTES } from '../../../test-data/constants';
import path from 'path';

export type AuthFixtures = {
  authenticatedAdminPage: Page;
  authenticatedMentorPage: Page;
  authenticatedStudentPage: Page;
};

/**
 * Authentication fixtures
 * Provides pre-authenticated pages for different user roles
 */
export const authTest = base.extend<AuthFixtures>({
  /**
   * Authenticated admin page
   */
  authenticatedAdminPage: async ({ browser }, use) => {
    const context = await browser.newContext({
      storageState: path.join(__dirname, '../../../.auth/admin.json'),
    });
    const page = await context.newPage();
    
    try {
      await use(page);
    } finally {
      await page.close();
      await context.close();
    }
  },

  /**
   * Authenticated mentor page
   */
  authenticatedMentorPage: async ({ browser }, use) => {
    const context = await browser.newContext({
      storageState: path.join(__dirname, '../../../.auth/mentor.json'),
    });
    const page = await context.newPage();
    
    try {
      await use(page);
    } finally {
      await page.close();
      await context.close();
    }
  },

  /**
   * Authenticated student page
   */
  authenticatedStudentPage: async ({ browser }, use) => {
    const context = await browser.newContext({
      storageState: path.join(__dirname, '../../../.auth/student.json'),
    });
    const page = await context.newPage();
    
    try {
      await use(page);
    } finally {
      await page.close();
      await context.close();
    }
  },
});

/**
 * Helper function to perform login
 * @param page - Page instance
 * @param email - User email
 * @param password - User password
 */
export async function performLogin(page: Page, email: string, password: string): Promise<void> {
  await page.goto(ROUTES.LOGIN);
  
  // Wait for login form to be visible
  await page.waitForSelector('input[type="email"], input[name="email"]', { timeout: 10000 });
  
  // Fill in credentials
  const emailInput = page.locator('input[type="email"], input[name="email"]').first();
  const passwordInput = page.locator('input[type="password"], input[name="password"]').first();
  
  await emailInput.fill(email);
  await passwordInput.fill(password);
  
  // Submit form
  const submitButton = page.locator('button[type="submit"], button:has-text("Sign in"), button:has-text("Login")').first();
  await submitButton.click();
  
  // Wait for navigation after login
  await page.waitForLoadState('networkidle', { timeout: 15000 });
}

export { expect } from '@playwright/test';
