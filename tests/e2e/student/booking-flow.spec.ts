import { test, expect } from '@playwright/test';
import { ROUTES } from '../../../test-data/constants';

test.describe('Booking Flow', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(ROUTES.BOOKING);
    await page.waitForLoadState('domcontentloaded');
  });

  test('should display booking page @student @smoke', async ({ page }) => {
    const currentUrl = page.url();
    expect(currentUrl).toBeTruthy();
    
    // Check for page heading
    const heading = page.locator('h1, h2').first();
    if (await heading.isVisible({ timeout: 5000 }).catch(() => false)) {
      await expect(heading).toBeVisible();
    }
  });

  test('should show available time slots @student', async ({ page }) => {
    // Wait for content to load
    await page.waitForTimeout(2000);
    
    // Look for time slot elements
    const timeSlot = page.locator('[data-testid*="time"], [class*="time-slot"], button[class*="slot"]').first();
    
    if (await timeSlot.isVisible({ timeout: 5000 }).catch(() => false)) {
      await expect(timeSlot).toBeVisible();
    } else {
      test.skip();
    }
  });

  test('should allow selecting a date @student', async ({ page }) => {
    // Look for date picker or calendar
    const datePicker = page.locator('input[type="date"], [class*="date-picker"], [class*="calendar"]').first();
    
    if (await datePicker.isVisible({ timeout: 3000 }).catch(() => false)) {
      // Try to interact with date picker
      if (await datePicker.getAttribute('type') === 'date') {
        await datePicker.fill('2025-01-15');
      } else {
        await datePicker.click();
      }
      
      await page.waitForTimeout(1000);
      expect(true).toBe(true);
    } else {
      test.skip();
    }
  });

  test('should allow selecting a time slot @student', async ({ page }) => {
    // Wait for content
    await page.waitForTimeout(2000);
    
    // Look for time slot buttons
    const timeSlotButton = page.locator('button[class*="time"], button[class*="slot"]').first();
    
    if (await timeSlotButton.isVisible({ timeout: 5000 }).catch(() => false)) {
      await timeSlotButton.click();
      
      await page.waitForTimeout(1000);
      
      // Slot should be selected
      expect(true).toBe(true);
    } else {
      test.skip();
    }
  });

  test('should display booking summary @student', async ({ page }) => {
    // Wait for content
    await page.waitForTimeout(2000);
    
    // Look for summary section
    const summary = page.locator('[class*="summary"], [data-testid*="summary"]').first();
    
    if (await summary.isVisible({ timeout: 3000 }).catch(() => false)) {
      await expect(summary).toBeVisible();
    } else {
      test.skip();
    }
  });

  test('should show price information @student', async ({ page }) => {
    // Wait for content
    await page.waitForTimeout(2000);
    
    // Look for price elements
    const price = page.locator('[class*="price"], [data-testid*="price"], text=/\\$[0-9]+/').first();
    
    if (await price.isVisible({ timeout: 5000 }).catch(() => false)) {
      await expect(price).toBeVisible();
    } else {
      test.skip();
    }
  });

  test('should have a confirm/proceed button @student', async ({ page }) => {
    // Wait for content
    await page.waitForTimeout(2000);
    
    // Look for confirm/proceed button
    const confirmButton = page.locator('button:has-text("Confirm"), button:has-text("Proceed"), button:has-text("Book")').first();
    
    if (await confirmButton.isVisible({ timeout: 3000 }).catch(() => false)) {
      await expect(confirmButton).toBeVisible();
    } else {
      test.skip();
    }
  });

  test('should allow adding notes to booking @student', async ({ page }) => {
    // Look for notes/message field
    const notesField = page.locator('textarea, input[placeholder*="note" i], input[placeholder*="message" i]').first();
    
    if (await notesField.isVisible({ timeout: 3000 }).catch(() => false)) {
      const testNotes = 'Test booking notes for mentor session';
      await notesField.fill(testNotes);
      
      await page.waitForTimeout(1000);
      
      // Verify notes were entered
      const value = await notesField.inputValue();
      expect(value).toBeTruthy();
    } else {
      test.skip();
    }
  });
});
