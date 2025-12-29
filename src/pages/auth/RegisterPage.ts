import { Page, Locator } from '@playwright/test';
import { BasePage } from '@core/base/BasePage';

/**
 * RegisterPage - Page Object Model for registration functionality
 * Based on actual exploration of skillopedia.app registration flow
 */
export class RegisterPage extends BasePage {
  // Role Selection Locators
  public readonly skillSeekerButton: Locator;
  public readonly skillGuideButton: Locator;
  public readonly skillMentorButton: Locator;
  public readonly individualMentorButton: Locator;
  public readonly organizationMentorButton: Locator;

  // Form Field Locators
  public readonly firstNameInput: Locator;
  public readonly lastNameInput: Locator;
  public readonly emailInput: Locator;
  public readonly ageInput: Locator;
  public readonly passwordInput: Locator;
  public readonly confirmPasswordInput: Locator;
  public readonly termsCheckbox: Locator;
  public readonly submitButton: Locator;
  

  // Navigation Locators
  public readonly registrationButton: Locator;
  public readonly googleButton: Locator;
  public readonly signInLink: Locator;
  
  // Message Locators
  public readonly roleDescription: Locator;
  public readonly ageNote: Locator;

  constructor(page: Page) {
    super(page);
    
    // Role selection buttons
    this.skillSeekerButton = page.getByRole('button', { name: 'Skill Seeker Learn new skills' });
    this.skillGuideButton = page.getByRole('button', { name: 'Skill Guide Guide others\' learning' });
    this.skillMentorButton = page.getByRole('button', { name: 'Skill Mentor Teach skills' });
    this.individualMentorButton = page.getByRole('button', { name: 'Individual Personal mentor' });
    this.organizationMentorButton = page.getByRole('button', { name: 'Organization School, center, academy' });

    // Form fields
    this.firstNameInput = page.getByRole('textbox', { name: 'First name' });
    this.lastNameInput = page.getByRole('textbox', { name: 'Last name' });
    this.emailInput = page.getByRole('textbox', { name: 'Email address' });
    this.ageInput = page.getByRole('spinbutton', { name: 'Age' });
    this.passwordInput = page.getByRole('textbox', { name: 'Password', exact: true });
    this.confirmPasswordInput = page.getByRole('textbox', { name: 'Confirm password' });
    this.termsCheckbox = page.getByRole('checkbox', { name: /I agree to the Terms and/ });
    this.submitButton = page.getByRole('button', { name: 'Create account' });

    // Navigation elements
  
    this.registrationButton = page.getByText('Get Started', { exact: true });
    this.googleButton = page.getByRole('button', { name: 'Sign up with Google' });
    this.signInLink = page.getByRole('link', { name: 'Sign in' });
    

    // Information elements
    this.roleDescription = page.locator('div').filter({ hasText: /Skill .* learn|guide|teach/ }).last();
    this.ageNote = page.getByText('Note: Skill Seekers under 13 must be registered');
  }

  /**
   * Navigate to homepage
   */
  async navigateToHomepage(): Promise<void> {
    await this.page.goto('/');
    await this.browser().waitForPageLoad();
  }

  /**
   * Navigate to registration page via Sign In -> Sign up free path
   */
  async navigateToRegistration(): Promise<RegisterPage> {
    await this.navigateToHomepage();
    await this.browser().click(this.registrationButton);
    await this.browser().waitForPageLoad(); 
    return this;
  }

    /**
   * Navigate to registration page via Sign In -> Sign up free path
   */
  async navigateToSignIn(): Promise<RegisterPage> {
    await this.browser().click(this.signInLink);
    await this.browser().waitForPageLoad(); 
    return this;
  }

  /**
   * Select user role
   */
  async selectRole(role: 'seeker' | 'guide' | 'mentor'): Promise<RegisterPage> {
    switch (role) {
      case 'seeker':
        await this.browser().click(this.skillSeekerButton);
        break;
      case 'guide':
        await this.browser().click(this.skillGuideButton);
        break;
      case 'mentor':
        await this.browser().click(this.skillMentorButton);
        break;
    }
    
    await this.page.waitForTimeout(500);
    return this;
  }

  /**
   * Select mentor type (only for mentor role)
   */
  async selectMentorType(type: 'individual' | 'organization'): Promise<RegisterPage> {
    if (type === 'individual') {
      await this.browser().click(this.individualMentorButton);
    } else {
      await this.browser().click(this.organizationMentorButton);
    }
    
    await this.page.waitForTimeout(500);
    return this;
  }

  /**
   * Fill registration form
   */
  async fillRegistrationForm(userData: {
    firstName: string;
    lastName: string;
    email: string;
    age?: number;
    password: string;
    confirmPassword: string;
    acceptTerms?: boolean;
  }): Promise<RegisterPage> {
    
    await this.browser().fill(this.firstNameInput, userData.firstName);
    await this.browser().fill(this.lastNameInput, userData.lastName);
    await this.browser().fill(this.emailInput, userData.email);
    
    // Age field is only for certain roles
    if (userData.age && await this.browser().isVisible(this.ageInput)) {
      await this.browser().fill(this.ageInput, userData.age.toString());
    }
    
    await this.browser().fill(this.passwordInput, userData.password);
    await this.browser().fill(this.confirmPasswordInput, userData.confirmPassword);
    
    // Accept terms if required
    if (userData.acceptTerms !== false) {
      await this.browser().click(this.termsCheckbox);
    }
    
    return this;
  }

  /**
   * Submit registration form
   */
  async submitRegistration(): Promise<void> {
    await this.browser().click(this.submitButton);
    await this.page.waitForTimeout(2000);
  }

  /**
   * Complete full registration process
   */
  async register(userData: {
    role: 'seeker' | 'guide' | 'mentor';
    mentorType?: 'individual' | 'organization';
    firstName: string;
    lastName: string;
    email: string;
    age?: number;
    password: string;
    confirmPassword: string;
    acceptTerms?: boolean;
  }): Promise<RegisterPage> {
    
    await this.navigateToRegistration();
    await this.selectRole(userData.role);
    
    if (userData.role === 'mentor' && userData.mentorType) {
      await this.selectMentorType(userData.mentorType);
    }
    
    await this.fillRegistrationForm(userData);
    await this.submitRegistration();
    
    return this;
  }

  /**
   * Handle registration success dialog and verify redirect
   */
  async handleRegistrationSuccess(): Promise<boolean> {
    try {
      // Wait for success dialog
      await this.page.waitForEvent('dialog', { timeout: 5000 });
      this.page.on('dialog', dialog => dialog.accept());
      
      // Check if redirected to signin page after dialog
      await this.page.waitForURL('**/auth/signin', { timeout: 10000 });
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Get role description text
   */
  async getRoleDescription(): Promise<string> {
    return await this.browser().getText(this.roleDescription);
  }

  /**
   * Check if age field is visible
   */
  async isAgeFieldVisible(): Promise<boolean> {
    return await this.browser().isVisible(this.ageInput);
  }

  /**
   * Check if mentor type selection is visible
   */
  async isMentorTypeSelectionVisible(): Promise<boolean> {
    return await this.browser().isVisible(this.individualMentorButton);
  }

  /**
   * Get age requirement note
   */
  async getAgeNote(): Promise<string> {
    if (await this.browser().isVisible(this.ageNote)) {
      return await this.browser().getText(this.ageNote);
    }
    return '';
  }

  /**
   * Verify registration page is displayed
   */
  async verifyRegistrationPageDisplayed(): Promise<void> {
    await this.browser().expectToBeVisible(this.emailInput);
    await this.browser().expectToBeVisible(this.passwordInput);
    await this.browser().expectToBeVisible(this.submitButton);
    await this.browser().expectToBeVisible(this.skillSeekerButton);
    await this.assertion().assertUrlContains(this.page, '/auth/signup');
  }

}