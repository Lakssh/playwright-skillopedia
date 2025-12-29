import { Page, Locator } from '@playwright/test';
import { BasePage } from '@core/base/BasePage';

interface SeekerFormData {
  firstName: string;
  lastName?: string;
  age: number;
  grade?: string;
  subjects?: string;
  hobbies?: string;
  email?: string;
  password?: string;
}

/**
 * AddSeekerPage - Page Object Model for Add New Skill Seeker form
 * Handles form field interactions and validations
 */
export class AddSeekerPage extends BasePage {
  // Form Heading
  public readonly formHeading: Locator;

  // Mandatory Field Locators
  public readonly firstNameInput: Locator;
  public readonly firstNameLabel: Locator;
  public readonly lastNameInput: Locator;
  public readonly ageInput: Locator;
  public readonly ageLabel: Locator;

  // Optional Field Locators
  public readonly gradeInput: Locator;
  public readonly subjectsInput: Locator;
  public readonly hobbiesInput: Locator;

  // Optional Login Account Section
  public readonly loginAccountHeading: Locator;
  public readonly emailInput: Locator;
  public readonly passwordInput: Locator;
  public readonly loginAccountInfo: Locator;

  // Action Buttons
  public readonly cancelButton: Locator;
  public readonly submitButton: Locator;

  // Validation/Error Messages
  public readonly errorMessage: Locator;
  public readonly requiredFieldIndicator: Locator;

  constructor(page: Page) {
    super(page);

    // Form Heading
    this.formHeading = page.getByRole('heading', { level: 3, name: 'Add New Skill Seeker' });

    // Mandatory Fields
    this.firstNameLabel = page.locator('text=First Name *');
    this.firstNameInput = page.getByRole('textbox').first();
    this.lastNameInput = page.getByRole('textbox').nth(1);
    this.ageLabel = page.locator('text=Age *');
    this.ageInput = page.getByRole('spinbutton');

    // Optional Fields
    this.gradeInput = page.getByPlaceholder('e.g., Year 9, Grade 10');
    this.subjectsInput = page.getByPlaceholder('e.g., Math, Science, English');
    this.hobbiesInput = page.getByPlaceholder('e.g., Reading, Sports, Art');

    // Optional Login Account
    this.loginAccountHeading = page.getByRole('heading', { level: 4, name: /Optional.*Login/ });
    this.emailInput = page.locator('text=Email (Optional)').locator('..').getByRole('textbox');
    this.passwordInput = page.locator('text=Password (Optional)').locator('..').getByRole('textbox');
    this.loginAccountInfo = page.locator('text=Under-13 users can log in');

    // Action Buttons
    this.cancelButton = page.getByRole('button', { name: 'Cancel' });
    this.submitButton = page.getByRole('button', { name: 'Add Skill Seeker' });

    // Error Messages
    this.errorMessage = page.locator('[class*="error"]').or(page.locator('text=/error|required|invalid/i'));
    this.requiredFieldIndicator = page.locator('text=*');
  }

  /**
   * Fill form with mandatory fields only
   */
  async fillMandatoryFields(firstName: string, age: number): Promise<void> {
    await this.browser().fill(this.firstNameInput, firstName);
    await this.browser().fill(this.ageInput, age.toString());
  }

  /**
   * Fill complete form with all fields
   */
  async fillCompleteForm(data: SeekerFormData): Promise<void> {
    await this.browser().fill(this.firstNameInput, data.firstName);
    
    if (data.lastName) {
      await this.browser().fill(this.lastNameInput, data.lastName);
    }

    await this.browser().fill(this.ageInput, data.age.toString());

    if (data.grade && await this.browser().isVisible(this.gradeInput)) {
      await this.browser().fill(this.gradeInput, data.grade);
    }

    if (data.subjects && await this.browser().isVisible(this.subjectsInput)) {
      await this.browser().fill(this.subjectsInput, data.subjects);
    }

    if (data.hobbies && await this.browser().isVisible(this.hobbiesInput)) {
      await this.browser().fill(this.hobbiesInput, data.hobbies);
    }

    if (data.email && await this.browser().isVisible(this.emailInput)) {
      await this.browser().fill(this.emailInput, data.email);
    }

    if (data.password && await this.browser().isVisible(this.passwordInput)) {
      await this.browser().fill(this.passwordInput, data.password);
    }
  }

  /**
   * Submit the form
   */
  async submitForm(): Promise<void> {
    await this.browser().click(this.submitButton);
    await this.page.waitForTimeout(1000);
  }

  /**
   * Cancel the form
   */
  async cancelForm(): Promise<void> {
    await this.browser().click(this.cancelButton);
    await this.page.waitForTimeout(500);
  }

  /**
   * Get error message if present
   */
  async getErrorMessage(): Promise<string | null> {
    try {
      if (await this.browser().isVisible(this.errorMessage)) {
        return await this.browser().getText(this.errorMessage);
      }
    } catch {
      return null;
    }
    return null;
  }

  /**
   * Fill and submit the form
   */
  async fillAndSubmit(data: SeekerFormData): Promise<void> {
    await this.fillCompleteForm(data);
    await this.submitForm();
  }

  /**
   * Fill mandatory and submit
   */
  async fillMandatoryAndSubmit(firstName: string, age: number): Promise<void> {
    await this.fillMandatoryFields(firstName, age);
    await this.submitForm();
  }

  /**
   * Verify form is displayed
   */
  async verifyFormDisplayed(): Promise<void> {
    await this.browser().expectToBeVisible(this.formHeading);
    await this.browser().expectToBeVisible(this.firstNameLabel);
    await this.browser().expectToBeVisible(this.ageLabel);
    await this.browser().expectToBeVisible(this.submitButton);
  }

  /**
   * Verify mandatory field indicators are present
   */
  async verifyMandatoryFieldIndicators(): Promise<void> {
    const firstNameLabelText = await this.browser().getText(this.firstNameLabel);
    const ageLabelText = await this.browser().getText(this.ageLabel);
    
    this.assertion().assertTruthy(
      firstNameLabelText.includes('*')
    );
    this.assertion().assertTruthy(
      ageLabelText.includes('*')
    );
  }

  /**
   * Get field value
   */
  async getFieldValue(fieldLocator: Locator): Promise<string> {
    return await fieldLocator.inputValue();
  }

  /**
   * Clear field
   */
  async clearField(fieldLocator: Locator): Promise<void> {
    await this.browser().fill(fieldLocator, '');
  }

  /**
   * Check if field is visible
   */
  async isFieldVisible(fieldLocator: Locator): Promise<boolean> {
    return await this.browser().isVisible(fieldLocator);
  }

  /**
   * Verify optional login section is present
   */
  async verifyOptionalLoginSection(): Promise<void> {
    await this.browser().expectToBeVisible(this.loginAccountHeading);
    await this.browser().expectToBeVisible(this.loginAccountInfo);
    await this.browser().expectToBeVisible(this.emailInput);
    await this.browser().expectToBeVisible(this.passwordInput);
  }
}