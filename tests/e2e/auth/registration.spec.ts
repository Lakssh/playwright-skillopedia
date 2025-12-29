import { test, expect } from '@playwright/test';
import { RegisterPage } from '../../../src/pages/auth/RegisterPage';
import { faker } from '@faker-js/faker';

test.describe('User Registration Journey', () => {
  let registerPage: RegisterPage;

  test.beforeEach(async ({ page }) => {
    registerPage = new RegisterPage(page);
  });

  test.describe('Navigation and Role Selection', () => {
    test('should navigate to registration page via Sign In -> Sign up free @registration @navigation', async () => {
      await registerPage.navigateToRegistration();
      await registerPage.verifyRegistrationPageDisplayed();
    });

    test('should display different role descriptions when selecting roles @registration @roles', async () => {
      await registerPage.navigateToRegistration();

      // Test Skill Seeker role
      await registerPage.selectRole('seeker');
      const seekerDescription = await registerPage.getRoleDescription();
      expect(seekerDescription).toContain('Skill Seekers learn new skills independently');

      // Test Skill Guide role
      await registerPage.selectRole('guide');
      const guideDescription = await registerPage.getRoleDescription();
      expect(guideDescription).toContain('Skill Guides help others find and book');

      // Test Skill Mentor role
      await registerPage.selectRole('mentor');
      const mentorDescription = await registerPage.getRoleDescription();
      expect(mentorDescription).toContain('Skill Mentors are verified experts');
    });

    test('should show mentor type selection for mentor role @registration @roles @mentor', async () => {
      await registerPage.navigateToRegistration();

      // Select mentor role
      await registerPage.selectRole('mentor');

      // Verify mentor type selection appears
      expect(await registerPage.isMentorTypeSelectionVisible()).toBeTruthy();

      // Test selecting individual mentor
      await registerPage.selectMentorType('individual');
    });

    test('should show age field for skill seeker role @registration @roles @seeker', async () => {
      await registerPage.navigateToRegistration();

      await registerPage.selectRole('seeker');

      expect(await registerPage.isAgeFieldVisible()).toBeTruthy();

      const ageNote = await registerPage.getAgeNote();
      expect(ageNote).toContain('Skill Seekers under 13 must be registered');
    });
  });

  test.describe('Successful Registration', () => {
    test('should register successfully as Skill Seeker @registration  @smoke', async ({  }) => {
      const userData = {
        role: 'seeker' as const,
        firstName: faker.person.firstName(),
        lastName: faker.person.lastName(),
        email: faker.internet.email(),
        age: faker.number.int({ min: 18, max: 65 }),
        password: 'SecurePass123!',
        confirmPassword: 'SecurePass123!',
        acceptTerms: true
      };

      await registerPage.register(userData);
      await registerPage.handleRegistrationSuccess();
    });

    test('should register successfully as Skill Guide @registration @smoke', async ({ page }) => {
      const userData = {
        role: 'guide' as const,
        firstName: faker.person.firstName(),
        lastName: faker.person.lastName(),
        email: faker.internet.email(),
        password: 'SecurePass123!',
        confirmPassword: 'SecurePass123!',
        acceptTerms: true
      };

      await registerPage.register(userData);
      await registerPage.handleRegistrationSuccess();
    });

    test('should register successfully as Individual Skill Mentor @registration @mentor @smoke', async ({  }) => {
      const userData = {
        role: 'mentor' as const,
        mentorType: 'individual' as const,
        firstName: faker.person.firstName(),
        lastName: faker.person.lastName(),
        email: faker.internet.email(),
        password: 'SecurePass123!',
        confirmPassword: 'SecurePass123!',
        acceptTerms: true
      };

      await registerPage.register(userData);
      await registerPage.handleRegistrationSuccess();
    });

    test('should register successfully as Organization Skill Mentor @registration @mentor @smoke', async ({  }) => {
      const userData = {
        role: 'mentor' as const,
        mentorType: 'organization' as const,
        organizationName: faker.company.name(),
        organizationType: 'Commercial Organization',
        email: faker.internet.email(),
        password: 'SecurePass123!',
        confirmPassword: 'SecurePass123!',
        acceptTerms: true
      };

      await registerPage.register(userData);
      await registerPage.handleRegistrationSuccess();
    });

    test.describe('Form Validation', () => {
      test('should require all mandatory fields @registration @validation', async () => {
        await registerPage.navigateToRegistration();
        await registerPage.selectRole('seeker');

        // Try to submit without filling any fields
        await registerPage.submitRegistration();
        await registerPage.verifyRegistrationPageDisplayed();
      });

      test('should validate email format @registration @validation @email', async () => {
        const userData = {
          role: 'seeker' as const,
          firstName: faker.person.firstName(),
          lastName: faker.person.lastName(),
          email: 'invalid-email-format',
          age: 25,
          password: 'SecurePass123!',
          confirmPassword: 'SecurePass123!',
          acceptTerms: true
        };

        await registerPage.register(userData);
        await registerPage.verifyRegistrationPageDisplayed();
      });

      test('should validate password confirmation match @registration @validation @password', async () => {
        const userData = {
          role: 'seeker' as const,
          firstName: faker.person.firstName(),
          lastName: faker.person.lastName(),
          email: faker.internet.email(),
          age: 25,
          password: 'SecurePass123!',
          confirmPassword: 'DifferentPassword456!',
          acceptTerms: true
        };

        await registerPage.register(userData);
        await registerPage.verifyRegistrationPageDisplayed();

      });

      test('should require terms acceptance @registration @validation @terms', async ({ page }) => {
        const userData = {
          role: 'seeker' as const,
          firstName: faker.person.firstName(),
          lastName: faker.person.lastName(),
          email: faker.internet.email(),
          age: 25,
          password: 'SecurePass123!',
          confirmPassword: 'SecurePass123!',
          acceptTerms: false
        };

        await registerPage.register(userData);
        await registerPage.verifyRegistrationPageDisplayed();
      });

      test('should validate age for skill seekers @registration @validation @age', async () => {
        await registerPage.navigateToRegistration();
        await registerPage.selectRole('seeker');

        const userData = {
          firstName: faker.person.firstName(),
          lastName: faker.person.lastName(),
          email: faker.internet.email(),
          age: -5, // Invalid age
          password: 'SecurePass123!',
          confirmPassword: 'SecurePass123!',
          acceptTerms: true
        };

        await registerPage.fillRegistrationForm(userData);
        await registerPage.submitRegistration();
        await registerPage.verifyRegistrationPageDisplayed();
      });
    });

    test.describe('Edge Cases', () => {
      test('should handle registration with existing email @registration @validation @duplicate', async ({ page }) => {
        const email = 'existing.user@example.com';

        // First registration
        const userData1 = {
          role: 'seeker' as const,
          firstName: faker.person.firstName(),
          lastName: faker.person.lastName(),
          email: email,
          age: 25,
          password: 'SecurePass123!',
          confirmPassword: 'SecurePass123!',
          acceptTerms: true
        };

        await registerPage.register(userData1);

        // Handle first success dialog
        page.on('dialog', dialog => dialog.accept());
        await registerPage.handleRegistrationSuccess();

        // Try to register again with same email
        const userData2 = {
          role: 'guide' as const,
          firstName: faker.person.firstName(),
          lastName: faker.person.lastName(),
          email: email, // Same email
          password: 'SecurePass123!',
          confirmPassword: 'SecurePass123!',
          acceptTerms: true
        };
        await registerPage.register(userData2);
        await registerPage.verifyRegistrationPageDisplayed();
      });

      test('should navigate back to login from registration @registration @navigation', async ({ page }) => {
        await registerPage.navigateToRegistration();
        await registerPage.navigateToSignIn();
        await registerPage.browser().waitForPageLoad
        await registerPage.browser().waitForURL('**/auth/signin');
        await registerPage.assertion().assertUrlContains(page, '/auth/signin');
      });
    });

    test.describe('Google Sign Up', () => {
      test('should display Google sign up option @registration @oauth @google', async () => {
        await registerPage.navigateToRegistration();
        await expect(registerPage.googleButton).toBeVisible();
      });
    });
  })
});