import { Page } from '@playwright/test';
import { LoginPage } from '../../pages/auth/LoginPage';
import { RegisterPage } from '../../pages/auth/RegisterPage';

/**
 * PageFactory - Factory for page object instantiation
 * Centralizes page object creation with dependency injection
 */
export class PageFactory {
  /**
   * Create LoginPage instance
   * @param page - Playwright page instance
   */
  static createLoginPage(page: Page): LoginPage {
    return new LoginPage(page);
  }

  /**
   * Create RegisterPage instance
   * @param page - Playwright page instance
   */
  static createRegisterPage(page: Page): RegisterPage {
    return new RegisterPage(page);
  }

  // Additional page creation methods will be added as pages are implemented
}
