import { Page, Locator } from '@playwright/test';
import { BasePage } from '@core/base/BasePage';

/**
 * SkillGuideDashboardPage - Page Object Model for Skill Guide Dashboard
 * Handles navigation, statistics, and skill seeker list management
 */
export class SkillGuideDashboardPage extends BasePage {
  // Navigation Locators
  public readonly dashboardLink: Locator;
  public readonly coursesLink: Locator;
  public readonly mentorsLink: Locator;
  public readonly messagesLink: Locator;
  public readonly searchButton: Locator;
  public readonly moreButton: Locator;
  public readonly profileButton: Locator;

  // Dashboard Header Locators
  public readonly welcomeHeading: Locator;
  public readonly roleIndicator: Locator;

  // Manage Skill Seekers Section Locators
  public readonly manageSeekersSectionHeading: Locator;
  public readonly addNewSeekerButton: Locator;
  public readonly findMentorsButton: Locator;

  // Statistics Locators
  public readonly totalSeekerCount: Locator;
  public readonly independentSeekerCount: Locator;
  public readonly managedSeekerCount: Locator;

  // Skill Seekers List Locators
  public readonly seekersListContainer: Locator;
  public readonly seekerCard: Locator;
  public readonly seekerName: Locator;
  public readonly seekerStatus: Locator;
  public readonly seekerAge: Locator;
  public readonly createLoginButton: Locator;

  // Additional Dashboard Sections
  public readonly upcomingSessionsCount: Locator;
  public readonly announcementsCount: Locator;
  public readonly messagesCount: Locator;
  public readonly ratingDisplay: Locator;
  public readonly profileViewsCount: Locator;

  constructor(page: Page) {
    super(page);

    // Navigation Elements
    this.dashboardLink = page.getByRole('link', { name: 'Dashboard' });
    this.coursesLink = page.getByRole('link', { name: 'Courses' });
    this.mentorsLink = page.getByRole('link', { name: 'Mentors' });
    this.messagesLink = page.getByRole('link', { name: 'Messages' });
    this.searchButton = page.getByRole('button', { name: /Search/ });
    this.moreButton = page.getByRole('button', { name: 'More' });
    this.profileButton = page.getByRole('button').filter({ hasText: /Lakshmanan Chellappan/ });

    // Dashboard Header
    this.welcomeHeading = page.getByRole('heading', { level: 1, name: /Welcome back/ });
    this.roleIndicator = page.locator('text=🧭 Skill Guide');

    // Manage Skill Seekers Section
    this.manageSeekersSectionHeading = page.getByRole('heading', { level: 2, name: 'Manage Skill Seekers' });
    this.addNewSeekerButton = page.getByRole('button', { name: 'Add New Skill Seeker' });
    this.findMentorsButton = page.getByRole('button', { name: 'Find Skill Mentors' });

    // Statistics
    this.totalSeekerCount = page.locator('text=Total Skill Seekers').locator('../..').locator('p').nth(1);
    this.independentSeekerCount = page.locator('text=Independent (13+)').locator('../..').locator('p').nth(1);
    this.managedSeekerCount = page.locator('text=Managed (Under 13)').locator('../..').locator('p').nth(1);

    // Skill Seekers List
    this.seekersListContainer = page.locator('text=Your Skill Seekers').locator('..');
    this.seekerCard = page.locator('text=Your Skill Seekers').locator('..').locator('h4').locator('../..');
    this.seekerName = page.locator('h4');
    this.seekerStatus = page.locator('text=/Managed|Independent/');
    this.seekerAge = page.locator('text=/Age:/').locator('..').locator('text=/\\d+/');
    this.createLoginButton = page.getByRole('button', { name: 'Create Login Account' }).first();

    // Additional Dashboard Stats
    this.upcomingSessionsCount = page.locator('text=Upcoming Sessions').locator('../..').locator('p').nth(1);
    this.announcementsCount = page.locator('text=New Announcements').locator('../..').locator('p').nth(1);
    this.messagesCount = page.locator('text=Messages').locator('../..').locator('p').nth(1);
    this.ratingDisplay = page.locator('text=Rating').locator('../..').locator('p').nth(1);
    this.profileViewsCount = page.locator('text=Profile Views').locator('../..').locator('p').nth(1);
  }

  /**
   * Navigate to dashboard
   */
  async navigateToDashboard(): Promise<void> {
    await this.browser().click(this.dashboardLink);
    await this.browser().waitForPageLoad();
  }

  /**
   * Click Add New Skill Seeker button
   */
  async clickAddNewSeekerButton(): Promise<void> {
    await this.browser().click(this.addNewSeekerButton);
    await this.page.waitForTimeout(500);
  }

  /**
   * Click Find Skill Mentors button
   */
  async clickFindMentorsButton(): Promise<void> {
    await this.browser().click(this.findMentorsButton);
    await this.browser().waitForPageLoad();
  }

  /**
   * Get total number of skill seekers
   */
  async getTotalSeekerCount(): Promise<number> {
    const text = await this.browser().getText(this.totalSeekerCount);
    return parseInt(text, 10);
  }

  /**
   * Get number of independent skill seekers (13+)
   */
  async getIndependentSeekerCount(): Promise<number> {
    const text = await this.browser().getText(this.independentSeekerCount);
    return parseInt(text, 10);
  }

  /**
   * Get number of managed skill seekers (Under 13)
   */
  async getManagedSeekerCount(): Promise<number> {
    const text = await this.browser().getText(this.managedSeekerCount);
    return parseInt(text, 10);
  }

  /**
   * Get list of all seeker names displayed
   */
  async getAllSeekerNames(): Promise<string[]> {
    const names: string[] = [];
    const cards = await this.seekerCard.all();
    
    for (const card of cards) {
      const name = await card.locator('h4').first().textContent();
      if (name) {
        names.push(name.trim());
      }
    }
    
    return names;
  }

  /**
   * Find a seeker by name
   */
  async findSeekerByName(name: string): Promise<Locator | null> {
    const seekers = await this.seekerCard.all();
    
    for (const seeker of seekers) {
      const seekerName = await seeker.locator('h4').first().textContent();
      if (seekerName && seekerName.trim() === name) {
        return seeker;
      }
    }
    
    return null;
  }

  /**
   * Get seeker details by name
   */
  async getSeekerDetails(name: string): Promise<any> {
    const seeker = await this.findSeekerByName(name);
    
    if (!seeker) {
      return null;
    }

    const age = await seeker.locator('text=/Age:/').locator('..').locator('text=/\\d+/').textContent();
    const status = await seeker.locator('text=/Managed|Independent/').textContent();
    const grade = await seeker.locator('text=/Grade:/').locator('..').textContent().catch(() => 'N/A');

    return {
      name,
      age: age ? parseInt(age, 10) : null,
      status: status?.trim(),
      grade: grade?.replace(/Grade:/, '').trim()
    };
  }

  /**
   * Verify dashboard is displayed
   */
  async verifyDashboardDisplayed(): Promise<void> {
    await this.browser().expectToBeVisible(this.welcomeHeading);
    await this.browser().expectToBeVisible(this.manageSeekersSectionHeading);
    await this.browser().expectToBeVisible(this.addNewSeekerButton);
    await this.assertion().assertUrlContains(this.page, '/dashboard');
  }

  /**
   * Verify role is displayed as Skill Guide
   */
  async verifySkillGuideRole(): Promise<void> {
    await this.browser().expectToBeVisible(this.roleIndicator);
  }

  /**
   * Verify welcome message contains user's name
   */
  async verifyWelcomeMessage(expectedName: string): Promise<void> {
    const heading = await this.browser().getText(this.welcomeHeading);
    this.assertion().assertTruthy(heading.includes(expectedName));
  }

  /**
   * Click on a specific seeker card
   */
  async clickSeekerCard(name: string): Promise<void> {
    const seeker = await this.findSeekerByName(name);
    if (seeker) {
      await this.browser().click(seeker);
    }
  }

  /**
   * Click Create Login Account button for a specific seeker
   */
  async clickCreateLoginForSeeker(name: string): Promise<void> {
    const seeker = await this.findSeekerByName(name);
    if (seeker) {
      const createButton = seeker.getByRole('button', { name: 'Create Login Account' });
      await this.browser().click(createButton);
    }
  }

  /**
   * Wait for seeker to appear in the dashboard
   */
  async waitForSeekerToAppear(name: string, timeout: number = 10000): Promise<void> {
    await this.page.locator(`h4:has-text("${name}")`).first().waitFor({ timeout });
  }
}