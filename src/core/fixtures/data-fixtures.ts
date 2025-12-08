import { test as base } from '@playwright/test';
import { DataHelper } from '../helpers/DataHelper';

export type DataFixtures = {
  testData: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    phoneNumber: string;
  };
};

/**
 * Data fixtures for test data generation
 */
export const dataTest = base.extend<DataFixtures>({
  /**
   * Generate fresh test data for each test
   */
  testData: async ({}, use) => {
    const data = {
      email: DataHelper.generateEmail(),
      password: DataHelper.generatePassword(),
      firstName: DataHelper.generateFirstName(),
      lastName: DataHelper.generateLastName(),
      phoneNumber: DataHelper.generatePhoneNumber(),
    };
    
    await use(data);
  },
});

export { expect } from '@playwright/test';
