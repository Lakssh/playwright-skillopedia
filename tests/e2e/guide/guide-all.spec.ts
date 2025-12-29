// spec: specs/skill-guide-seeker-management.plan.md
// seed: tests/seed.spec.ts

import { test, expect } from '@playwright/test';
import { LoginPage } from '../../../src/pages/auth/LoginPage';
import { SkillGuideDashboardPage } from '../../../src/pages/auth/DashboardPage';
import { AddSeekerPage } from '../../../src/pages/auth/AddSeekerPage';

test.describe('Skill Guide - All Guide Tests', () => {
  let loginPage: LoginPage;
  let dashboard: SkillGuideDashboardPage;
  let addSeeker: AddSeekerPage;

  test.beforeEach(async ({ page, context }) => {
    loginPage = new LoginPage(page);
    dashboard = new SkillGuideDashboardPage(page);
    addSeeker = new AddSeekerPage(page);

    // Login using storage state when available, fallback to manual login
    const email = loginPage.config().getEnvVariable('GUIDE_EMAIL');
    const pwd = loginPage.config().getEnvVariable('GUIDE_PASSWORD');
    await loginPage.quickLogin('Skill Guide', context, email, pwd);
    await loginPage.waitForLoginSuccess();
  });

  test.describe('Login and Dashboard Access', () => {
    test('Login as Skill Guide successfully', async ({ page }) => {
      // Verify welcome message and role
      const guideName = loginPage.config().getEnvVariable('GUIDE_NAME');
      await dashboard.verifyWelcomeMessage(guideName);
      await dashboard.verifySkillGuideRole();
      await dashboard.browser().expectToBeVisible(dashboard.manageSeekersSectionHeading);
      await dashboard.browser().expectToBeVisible(dashboard.addNewSeekerButton);
    });

    test('Verify dashboard structure and statistics', async () => {
      await dashboard.verifyDashboardDisplayed();
      await dashboard.browser().expectToBeVisible(dashboard.totalSeekerCount);
      const total = await dashboard.getTotalSeekerCount();
      expect(total).toBeGreaterThanOrEqual(0);
      await dashboard.browser().expectToBeVisible(dashboard.independentSeekerCount);
      await dashboard.browser().expectToBeVisible(dashboard.managedSeekerCount);
      await dashboard.browser().expectToBeVisible(dashboard.seekersListContainer);
      await dashboard.browser().expectToBeVisible(dashboard.createLoginButton);
    });
  });

  test.describe('Add Seeker - Form Validation & Fields', () => {
    test('Verify mandatory fields in Add New Skill Seeker form', async () => {
      // Open form
      await dashboard.clickAddNewSeekerButton();
      await addSeeker.verifyFormDisplayed();

      // Mandatory and optional fields
      await addSeeker.browser().expectToBeVisible(addSeeker.firstNameLabel);
      await addSeeker.browser().expectToBeVisible(addSeeker.lastNameInput);
      await addSeeker.browser().expectToBeVisible(addSeeker.ageLabel);
      await addSeeker.browser().expectToBeVisible(addSeeker.gradeInput);
      await addSeeker.browser().expectToBeVisible(addSeeker.subjectsInput);
      await addSeeker.browser().expectToBeVisible(addSeeker.hobbiesInput);
      await addSeeker.verifyOptionalLoginSection();
      await addSeeker.browser().expectToBeVisible(addSeeker.cancelButton);
      await addSeeker.browser().expectToBeVisible(addSeeker.submitButton);
    });

    test('Verify form field validations for mandatory fields', async ({ page }) => {
      await dashboard.clickAddNewSeekerButton();
      await addSeeker.verifyFormDisplayed();

      // Leave first name and age empty, fill last name, submit
      await addSeeker.browser().fill(addSeeker.lastNameInput, 'TestLastName');
      await addSeeker.submitForm();
      await addSeeker.assertion().assertFocused(addSeeker.firstNameInput);

      // Fill first name, leave age
      await addSeeker.browser().fill(addSeeker.firstNameInput, 'TestFirst');
      await addSeeker.submitForm();
      await addSeeker.assertion().assertFocused(addSeeker.ageInput);

      // Fill age and submit
      await addSeeker.browser().fill(addSeeker.ageInput, '14');
      page.once('dialog', async dialog => {
        expect(dialog.message()).toContain('added successfully');
        await dialog.accept();
      });
      await addSeeker.submitForm();

      // Verify returned to dashboard
      await dashboard.browser().expectToBeVisible(dashboard.manageSeekersSectionHeading);
    });

    test('Verify field input constraints and data types', async ({ page }) => {
      await dashboard.clickAddNewSeekerButton();
      await addSeeker.verifyFormDisplayed();

      const longName = 'A'.repeat(150);
      await addSeeker.browser().fill(addSeeker.firstNameInput, longName);
      const v1 = await addSeeker.getFieldValue(addSeeker.firstNameInput);
      expect(v1.length).toBeLessThanOrEqual(150);

      await addSeeker.browser().fill(addSeeker.firstNameInput, 'Name123');
      expect(await addSeeker.getFieldValue(addSeeker.firstNameInput)).toBe('Name123');

      await addSeeker.browser().fill(addSeeker.firstNameInput, "O'Neil-Å");
      expect(await addSeeker.getFieldValue(addSeeker.firstNameInput)).toContain("O'Neil");

      // Age negative / zero / large
      await addSeeker.browser().fill(addSeeker.ageInput, '-5');
      await addSeeker.submitForm();
      await addSeeker.assertion().assertFocused(addSeeker.ageInput);

      await addSeeker.browser().fill(addSeeker.ageInput, '0');
      await addSeeker.submitForm();
      await addSeeker.assertion().assertFocused(addSeeker.ageInput);

      await addSeeker.browser().fill(addSeeker.ageInput, '150');
      await addSeeker.submitForm();
      const ageVal = await addSeeker.getFieldValue(addSeeker.ageInput);
      expect(Number(ageVal)).toBeGreaterThanOrEqual(0);

      await addSeeker.browser().fill(addSeeker.emailInput, 'invalid-email');
      expect(await addSeeker.getFieldValue(addSeeker.emailInput)).toBe('invalid-email');
      await addSeeker.browser().fill(addSeeker.emailInput, 'valid.email@example.com');
      expect(await addSeeker.getFieldValue(addSeeker.emailInput)).toBe('valid.email@example.com');
    });

    test('Add Skill Seeker and verify cancel button functionality', async () => {
      const initialTotal = await dashboard.getTotalSeekerCount();

      await dashboard.clickAddNewSeekerButton();
      await addSeeker.verifyFormDisplayed();

      await addSeeker.browser().fill(addSeeker.firstNameInput, 'TestName');
      await addSeeker.browser().fill(addSeeker.ageInput, '15');
      await addSeeker.browser().fill(addSeeker.subjectsInput, 'Science');

      await addSeeker.cancelForm();
      await addSeeker.browser().expectToBeHidden(addSeeker.formHeading);

      const finalTotal = await dashboard.getTotalSeekerCount();
      expect(finalTotal).toBe(initialTotal);
    });
  });

  test.describe('Add Seeker - Successful Creation', () => {
    test('Successfully add new Skill Seeker with all fields', async ({ page }) => {
      await dashboard.clickAddNewSeekerButton();
      await addSeeker.verifyFormDisplayed();

      const ts = Date.now();
      const data = {
        firstName: `Complete${ts}`,
        lastName: 'Profile',
        age: 12,
        grade: 'Year 8',
        subjects: 'Math, Science',
        hobbies: 'Reading, Sports'
      };

      await addSeeker.fillCompleteForm(data as any);
      page.once('dialog', async dialog => await dialog.accept());
      await addSeeker.submitForm();

      await addSeeker.browser().expectToBeHidden(addSeeker.formHeading);
      const fullName = `${data.firstName} ${data.lastName}`;
      await dashboard.waitForSeekerToAppear(fullName);
      const found = await dashboard.findSeekerByName(fullName);
      expect(found).not.toBeNull();
    });

    test('Successfully add new Skill Seeker with optional login credentials', async ({ page }) => {
      await dashboard.clickAddNewSeekerButton();
      await addSeeker.verifyFormDisplayed();

      const ts = Date.now();
      const data = {
        firstName: `LoginSeeker${ts}`,
        lastName: 'WithLogin',
        age: 10,
        grade: 'Year 5',
        subjects: 'Math',
        hobbies: 'Drawing',
        email: `seeker${ts}@example.com`,
        password: 'SecureP@ssw0rd!'
      };

      await addSeeker.fillCompleteForm(data as any);
      page.once('dialog', async dialog => await dialog.accept());
      await addSeeker.submitForm();

      await addSeeker.browser().expectToBeHidden(addSeeker.formHeading);
      const fullName = `${data.firstName} ${data.lastName}`;
      await dashboard.waitForSeekerToAppear(fullName);
      const found = await dashboard.findSeekerByName(fullName);
      expect(found).not.toBeNull();
    });

    test('Add multiple Skill Seekers in sequence ', async ({ page }) => {
      const initialCount = await dashboard.getTotalSeekerCount();

      // Alice
      await dashboard.clickAddNewSeekerButton();
      await addSeeker.fillAndSubmit({ firstName: 'Alice', lastName: 'Young', age: 10 } as any);
      page.once('dialog', async d => await d.accept());
      await page.waitForTimeout(1000);
      await dashboard.waitForSeekerToAppear('Alice Young');

      // Bob
      await dashboard.clickAddNewSeekerButton();
      await addSeeker.fillAndSubmit({ firstName: 'Bob', lastName: 'Teenager', age: 15 } as any);
      page.once('dialog', async d => await d.accept());
      await page.waitForTimeout(1000);
      await dashboard.waitForSeekerToAppear('Bob Teenager');

      // Charlie
      await dashboard.clickAddNewSeekerButton();
      await addSeeker.fillAndSubmit({ firstName: 'Charlie', lastName: 'Middle', age: 12 } as any);
      page.once('dialog', async d => await d.accept());
      await page.waitForTimeout(1000);
      await dashboard.waitForSeekerToAppear('Charlie Middle');

      const finalCount = await dashboard.getTotalSeekerCount();
      expect(finalCount).toBe(initialCount + 3);

      const managed = await dashboard.getManagedSeekerCount();
      const independent = await dashboard.getIndependentSeekerCount();
      expect(managed).toBeGreaterThanOrEqual(1);
      expect(independent).toBeGreaterThanOrEqual(1);
    });

    test('Verify newly added Seeker card displays all expected information', async ({ page }) => {
      const seeker = {
        firstName: 'Jessica',
        lastName: 'Thompson',
        age: 11,
        grade: 'Year 6',
        subjects: 'Math, English'
      };

      await dashboard.clickAddNewSeekerButton();
      await addSeeker.fillCompleteForm(seeker as any);
      page.once('dialog', async d => await d.accept());
      await addSeeker.submitForm();

      const fullName = `${seeker.firstName} ${seeker.lastName}`;
      await dashboard.waitForSeekerToAppear(fullName);

      const details = await dashboard.getSeekerDetails(fullName);
      expect(details).not.toBeNull();
      expect(details.name).toBe(fullName);
      expect(details.age).toBe(seeker.age);
      expect(details.status).toContain('Managed');
      expect(details.grade).toContain('Year 6');

      await dashboard.browser().expectToBeVisible(dashboard.createLoginButton);
    });
  });

  test.describe('Dashboard Verification', () => {
    test('Verify newly added Skill Seeker appears in dashboard', async ({ page }) => {
      const initialTotal = await dashboard.getTotalSeekerCount();
      const ts = Date.now();
      const seeker = {
        firstName: `NewSkills${ts}`,
        lastName: 'Dashboard',
        age: 14,
        grade: 'Year 9',
        subjects: 'Science, Technology'
      };

      await dashboard.clickAddNewSeekerButton();
      await addSeeker.fillCompleteForm(seeker as any);
      page.once('dialog', async d => await d.accept());
      await addSeeker.submitForm();

      await addSeeker.browser().expectToBeHidden(addSeeker.formHeading);
      const finalTotal = await dashboard.getTotalSeekerCount();
      expect(finalTotal).toBe(initialTotal + 1);

      const fullName = `${seeker.firstName} ${seeker.lastName}`;
      await dashboard.waitForSeekerToAppear(fullName);
      const details = await dashboard.getSeekerDetails(fullName);
      expect(details.age).toBe(seeker.age);
      expect(details.status).toContain('Independent');
    });

    test('Verify Skill Seeker statistics update after addition', async ({ page }) => {
      const initialTotal = await dashboard.getTotalSeekerCount();
      const initialIndependent = await dashboard.getIndependentSeekerCount();
      const initialManaged = await dashboard.getManagedSeekerCount();

      await dashboard.clickAddNewSeekerButton();
      await addSeeker.fillMandatoryAndSubmit('YoungSeeker', 11);
      page.once('dialog', async d => await d.accept());
      await page.waitForTimeout(1000);

      let newTotal = await dashboard.getTotalSeekerCount();
      let newManaged = await dashboard.getManagedSeekerCount();
      let newIndependent = await dashboard.getIndependentSeekerCount();

      expect(newTotal).toBe(initialTotal + 1);
      expect(newManaged).toBe(initialManaged + 1);
      expect(newIndependent).toBe(initialIndependent);

      await dashboard.clickAddNewSeekerButton();
      await addSeeker.fillMandatoryAndSubmit('TeenSeeker', 16);
      page.once('dialog', async d => await d.accept());
      await page.waitForTimeout(1000);

      newTotal = await dashboard.getTotalSeekerCount();
      newManaged = await dashboard.getManagedSeekerCount();
      newIndependent = await dashboard.getIndependentSeekerCount();

      expect(newTotal).toBe(initialTotal + 2);
      expect(newIndependent).toBe(initialIndependent + 1);
      expect(newManaged).toBe(initialManaged + 1);

      expect(newTotal).toBe(newIndependent + newManaged);
    });

    test('Verify seeker card information display and organization', async ({ page }) => {
      const seeker = {
        firstName: 'DetailedSeeker',
        lastName: 'Complete',
        age: 13,
        grade: 'Year 8',
        subjects: 'Physics, Chemistry',
        hobbies: 'Basketball, Reading'
      };

      await dashboard.clickAddNewSeekerButton();
      await addSeeker.fillCompleteForm(seeker as any);
      page.once('dialog', async d => await d.accept());
      await addSeeker.submitForm();

      const fullName = `${seeker.firstName} ${seeker.lastName}`;
      await dashboard.waitForSeekerToAppear(fullName);

      const details = await dashboard.getSeekerDetails(fullName);
      expect(details.name).toBe(fullName);
      expect(details.age).toBe(seeker.age);
      expect(details.status).toContain('Independent');
      expect(details.grade).toContain(seeker.grade);
      await dashboard.browser().expectToBeVisible(dashboard.createLoginButton);
    });

    test('Verify dashboard responsiveness and seeker list management', async ({ page }) => {
      await dashboard.verifyDashboardDisplayed();
      const initialCount = await dashboard.getTotalSeekerCount();

      const seekersToAdd = [
        { firstName: 'ListTest1', lastName: 'List', age: 9 },
        { firstName: 'ListTest2', lastName: 'List', age: 14 },
        { firstName: 'ListTest3', lastName: 'List', age: 17 }
      ];

      for (const s of seekersToAdd) {
        await dashboard.clickAddNewSeekerButton();
        await addSeeker.fillAndSubmit(s as any);
        page.once('dialog', async d => await d.accept());
        await page.waitForTimeout(1500);
        const fullName = `${s.firstName} ${s.lastName}`;
        await dashboard.waitForSeekerToAppear(fullName);
      }

      const finalCount = await dashboard.getTotalSeekerCount();
      expect(finalCount).toBe(initialCount + seekersToAdd.length);
      const managed = await dashboard.getManagedSeekerCount();
      const independent = await dashboard.getIndependentSeekerCount();
      expect(finalCount).toBe(managed + independent);
    });
  });
});