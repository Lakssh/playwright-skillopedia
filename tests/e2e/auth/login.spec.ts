import { test, expect } from '@playwright/test';
import { LoginPage } from '../../../src/pages/auth/LoginPage';
import { DataHelper } from '../../../src/core/helpers/DataHelper';

test.describe('Login Functionality', () => {
  let loginPage: LoginPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    await loginPage.goto();
  });

  const userTestData = [
  {
    role: 'Skill Seeker',
    emailKey: 'STUDENT_EMAIL',
    passwordKey: 'STUDENT_PASSWORD', 
    nameKey: 'STUDENT_NAME'
  },
  {
    role: 'Skill Guide',
    emailKey: 'GUIDE_EMAIL',
    passwordKey: 'GUIDE_PASSWORD',
    nameKey: 'GUIDE_NAME'
  },
  {
    role: 'Skill Mentor',
    emailKey: 'MENTOR_EMAIL', 
    passwordKey: 'MENTOR_PASSWORD',
    nameKey: 'MENTOR_NAME'
  }
];

userTestData.forEach(({ role, emailKey, passwordKey, nameKey }) => {
  test(`successful login as ${role} @login @critical`, async ({  }) => {

    const user_name = loginPage.config().getEnvVariable(emailKey);
    const user_password = loginPage.config().getEnvVariable(passwordKey);
    const user_display_name = loginPage.config().getEnvVariable(nameKey);
    await loginPage.verifyLoginPageDisplayed();
    await loginPage.login(user_name, user_password);
    await loginPage.waitForLoginSuccess();
    await loginPage.verifyUserProfileDisplayed(user_display_name, role);
    await loginPage.signOut(user_display_name);
    
  });
});

  test('should show validation error for empty email @login', async ({ page }) => {
    await loginPage.enterPassword('SomePassword123!');
    await loginPage.clickSubmit();
    await page.waitForTimeout(1000);
    const currentUrl = await loginPage.browser().getCurrentUrl();
    expect(currentUrl).toContain('/signin');
    await loginPage.browser().expectToBeVisible(loginPage.emailInput);
    await loginPage.browser().expectToBeVisible(loginPage.passwordInput);
    await loginPage.browser().expectToBeVisible(loginPage.submitButton);
  });

  test('should show validation error for empty password @login', async ({ page }) => {
    await loginPage.enterEmail('test@example.com');
    await loginPage.clickSubmit();
    await page.waitForTimeout(1000);
    const currentUrl = await loginPage.browser().getCurrentUrl();
    expect(currentUrl).toContain('/signin');
    await loginPage.browser().expectToBeVisible(loginPage.emailInput);
    await loginPage.browser().expectToBeVisible(loginPage.passwordInput);
    await loginPage.browser().expectToBeVisible(loginPage.submitButton);
  });

  test('should show error for invalid credentials @login ', async ({ page }) => {
    const invalidEmail = DataHelper.generateEmail();
    const invalidPassword = DataHelper.generatePassword();
    
    await loginPage.login(invalidEmail, invalidPassword);
    await page.waitForTimeout(2000);
    const currentUrl = await loginPage.browser().getCurrentUrl();
    expect(currentUrl).toContain('/signin');
    await loginPage.browser().expectToBeVisible(loginPage.emailInput);
    await loginPage.browser().expectToBeVisible(loginPage.passwordInput);
    await  loginPage.browser().expectToBeVisible(loginPage.submitButton);
  });

  test('should navigate to forgot password page @login', async ({ page }) => {

      await loginPage.clickForgotPassword();
      await page.waitForTimeout(2000);
      const currentUrl = await loginPage.browser().getCurrentUrl();
      expect(currentUrl).toMatch(/forgot|reset/i);

  });

  test('should navigate to registration page @login', async ({ page }) => {

      await loginPage.clickRegister();
      await page.waitForTimeout(2000);
      const currentUrl = await loginPage.browser().getCurrentUrl();
      expect(currentUrl).toMatch(/register|signup|sign-up/i);

  });

});
