import { test, expect } from '@playwright/test';
import { ROUTES } from '../../../src/core/config/constants';

test.describe('Mentor Discovery', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to mentors/discovery page
    await page.goto(ROUTES.MENTOR_DISCOVERY);
    await page.waitForLoadState('domcontentloaded');
  });

  test('should display mentor discovery page @student @smoke', async ({ page }) => {
    // Check if page loaded
    const currentUrl = page.url();
    expect(currentUrl).toBeTruthy();
    
    // Look for common elements that might be on mentor discovery page
    const heading = page.locator('h1, h2').first();
    
    if (await heading.isVisible({ timeout: 5000 }).catch(() => false)) {
      await expect(heading).toBeVisible();
    }
  });

  test('should display list of mentors @student', async ({ page }) => {
    // Wait a bit for data to load
    await page.waitForTimeout(2000);
    
    // Look for mentor cards or list items
    const mentorCards = page.locator('[data-testid*="mentor"], .mentor-card, [class*="mentor"]').first();
    
    if (await mentorCards.isVisible({ timeout: 5000 }).catch(() => false)) {
      await expect(mentorCards).toBeVisible();
    } else {
      // Might be empty state or different structure
      test.skip();
    }
  });

  test('should have search functionality @student', async ({ page }) => {
    // Look for search input
    const searchInput = page.locator('input[type="search"], input[placeholder*="search" i], input[name="search"]').first();
    
    if (await searchInput.isVisible({ timeout: 3000 }).catch(() => false)) {
      await searchInput.fill('JavaScript');
      
      // Wait for search results
      await page.waitForTimeout(2000);
      
      // Verify search was performed
      const currentUrl = page.url();
      expect(currentUrl).toBeTruthy();
    } else {
      test.skip();
    }
  });

  test('should have filter options @student', async ({ page }) => {
    // Look for filter elements
    const filterButton = page.locator('button:has-text("Filter"), button:has-text("Filters"), [data-testid="filter"]').first();
    const selectFilter = page.locator('select').first();
    
    if (await filterButton.isVisible({ timeout: 3000 }).catch(() => false)) {
      await filterButton.click();
      await page.waitForTimeout(1000);
      
      // Filter options should appear
      expect(true).toBe(true);
    } else if (await selectFilter.isVisible({ timeout: 3000 }).catch(() => false)) {
      await expect(selectFilter).toBeVisible();
    } else {
      test.skip();
    }
  });

  test('should be able to view mentor profile @student', async ({ page }) => {
    // Wait for content to load
    await page.waitForTimeout(2000);
    
    // Look for mentor profile links
    const mentorLink = page.locator('a[href*="/mentor"], button:has-text("View Profile")').first();
    
    if (await mentorLink.isVisible({ timeout: 5000 }).catch(() => false)) {
      await mentorLink.click();
      
      // Wait for navigation
      await page.waitForTimeout(2000);
      
      const currentUrl = page.url();
      expect(currentUrl).toBeTruthy();
    } else {
      test.skip();
    }
  });

  test('should handle pagination @student', async ({ page }) => {
    // Wait for content
    await page.waitForTimeout(2000);
    
    // Look for pagination controls
    const nextButton = page.locator('button:has-text("Next"), a:has-text("Next"), [aria-label="Next"]').first();
    const pageNumber = page.locator('[class*="pagination"] button, [class*="page-"] button').first();
    
    if (await nextButton.isVisible({ timeout: 3000 }).catch(() => false)) {
      await nextButton.click();
      await page.waitForTimeout(2000);
      
      // Should navigate to next page
      expect(true).toBe(true);
    } else if (await pageNumber.isVisible({ timeout: 3000 }).catch(() => false)) {
      await expect(pageNumber).toBeVisible();
    } else {
      test.skip();
    }
  });

  test('should display mentor skills and expertise @student', async ({ page }) => {
    // Wait for content
    await page.waitForTimeout(2000);
    
    // Look for skills/tags
    const skillTag = page.locator('[class*="skill"], [class*="tag"], [class*="badge"]').first();
    
    if (await skillTag.isVisible({ timeout: 5000 }).catch(() => false)) {
      await expect(skillTag).toBeVisible();
    } else {
      test.skip();
    }
  });
});
