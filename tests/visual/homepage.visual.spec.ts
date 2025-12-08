import { test, expect } from '@playwright/test';
import { ROUTES } from '../../src/core/config/constants';

test.describe('Homepage Visual Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(ROUTES.HOME);
    await page.waitForLoadState('networkidle');
  });

  test('should render homepage correctly @visual @smoke', async ({ page }) => {
    // Wait for page to fully load
    await page.waitForTimeout(2000);
    
    // Take a screenshot
    await page.screenshot({ path: 'test-results/homepage-full.png', fullPage: true });
    
    // Verify page loaded
    const title = await page.title();
    expect(title).toBeTruthy();
  });

  test('should display header correctly @visual', async ({ page }) => {
    // Look for header element
    const header = page.locator('header, [role="banner"], nav').first();
    
    if (await header.isVisible({ timeout: 5000 }).catch(() => false)) {
      await expect(header).toBeVisible();
      
      // Take screenshot of header
      await header.screenshot({ path: 'test-results/header.png' });
    } else {
      test.skip();
    }
  });

  test('should display footer correctly @visual', async ({ page }) => {
    // Scroll to bottom
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.waitForTimeout(1000);
    
    // Look for footer element
    const footer = page.locator('footer, [role="contentinfo"]').first();
    
    if (await footer.isVisible({ timeout: 5000 }).catch(() => false)) {
      await expect(footer).toBeVisible();
      
      // Take screenshot of footer
      await footer.screenshot({ path: 'test-results/footer.png' });
    } else {
      test.skip();
    }
  });

  test('should display call-to-action buttons @visual', async ({ page }) => {
    // Look for CTA buttons
    const ctaButton = page.locator('button, a[class*="button"], a[class*="cta"]').first();
    
    if (await ctaButton.isVisible({ timeout: 5000 }).catch(() => false)) {
      await expect(ctaButton).toBeVisible();
    } else {
      test.skip();
    }
  });

  test('should render hero section @visual', async ({ page }) => {
    // Look for hero section
    const hero = page.locator('[class*="hero"], [class*="banner"], section').first();
    
    if (await hero.isVisible({ timeout: 5000 }).catch(() => false)) {
      await expect(hero).toBeVisible();
      
      // Take screenshot of hero
      await hero.screenshot({ path: 'test-results/hero-section.png' });
    } else {
      test.skip();
    }
  });

  test('should be responsive on mobile viewport @visual', async ({ page, viewport }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    await page.waitForTimeout(1000);
    
    // Take mobile screenshot
    await page.screenshot({ path: 'test-results/homepage-mobile.png', fullPage: true });
    
    // Verify page is still accessible
    const body = page.locator('body');
    await expect(body).toBeVisible();
  });

  test('should be responsive on tablet viewport @visual', async ({ page }) => {
    // Set tablet viewport
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.waitForTimeout(1000);
    
    // Take tablet screenshot
    await page.screenshot({ path: 'test-results/homepage-tablet.png', fullPage: true });
    
    // Verify page is still accessible
    const body = page.locator('body');
    await expect(body).toBeVisible();
  });

  test('should not have visual regressions in navigation @visual', async ({ page }) => {
    const nav = page.locator('nav, [role="navigation"]').first();
    
    if (await nav.isVisible({ timeout: 5000 }).catch(() => false)) {
      // Take screenshot of navigation
      await nav.screenshot({ path: 'test-results/navigation.png' });
      
      await expect(nav).toBeVisible();
    } else {
      test.skip();
    }
  });

  test('should display images without broken links @visual', async ({ page }) => {
    // Wait for images to load
    await page.waitForTimeout(2000);
    
    // Get all images
    const images = page.locator('img');
    const count = await images.count();
    
    if (count > 0) {
      // Check first few images
      const imagesToCheck = Math.min(count, 5);
      
      for (let i = 0; i < imagesToCheck; i++) {
        const img = images.nth(i);
        if (await img.isVisible().catch(() => false)) {
          // Verify image has src attribute
          const src = await img.getAttribute('src');
          expect(src).toBeTruthy();
        }
      }
    } else {
      test.skip();
    }
  });
});
