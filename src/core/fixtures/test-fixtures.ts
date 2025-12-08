import { test as base } from '@playwright/test';
import { UserFactory } from '../factories/UserFactory';
import { CourseFactory } from '../factories/CourseFactory';
import { BookingFactory } from '../factories/BookingFactory';
import { PageFactory } from '../factories/PageFactory';

/**
 * Extended test fixtures with custom factories and utilities
 */
export const test = base.extend<{
  userFactory: typeof UserFactory;
  courseFactory: typeof CourseFactory;
  bookingFactory: typeof BookingFactory;
  pageFactory: PageFactory;
}>({
  /**
   * User factory fixture
   */
  userFactory: async ({}, use) => {
    await use(UserFactory);
  },

  /**
   * Course factory fixture
   */
  courseFactory: async ({}, use) => {
    await use(CourseFactory);
  },

  /**
   * Booking factory fixture
   */
  bookingFactory: async ({}, use) => {
    await use(BookingFactory);
  },

  /**
   * Page factory fixture
   */
  pageFactory: async ({ page }, use) => {
    const factory = new PageFactory();
    await use(factory);
  },
});

export { expect } from '@playwright/test';
