import { faker } from '@faker-js/faker';

/**
 * DataHelper - Test data generation utilities
 */
export class DataHelper {
  /**
   * Generate random email
   */
  static generateEmail(): string {
    return faker.internet.email().toLowerCase();
  }

  /**
   * Generate random password
   * @param length - Password length
   */
  static generatePassword(length: number = 12): string {
    const lowercase = 'abcdefghijklmnopqrstuvwxyz';
    const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const numbers = '0123456789';
    const special = '!@#$%^&*';
    
    const all = lowercase + uppercase + numbers + special;
    let password = '';
    
    // Ensure at least one of each type
    password += lowercase[Math.floor(Math.random() * lowercase.length)];
    password += uppercase[Math.floor(Math.random() * uppercase.length)];
    password += numbers[Math.floor(Math.random() * numbers.length)];
    password += special[Math.floor(Math.random() * special.length)];
    
    // Fill the rest
    for (let i = password.length; i < length; i++) {
      password += all[Math.floor(Math.random() * all.length)];
    }
    
    // Shuffle
    return password.split('').sort(() => Math.random() - 0.5).join('');
  }

  /**
   * Generate random first name
   */
  static generateFirstName(): string {
    return faker.person.firstName();
  }

  /**
   * Generate random last name
   */
  static generateLastName(): string {
    return faker.person.lastName();
  }

  /**
   * Generate random full name
   */
  static generateFullName(): string {
    return faker.person.fullName();
  }

  /**
   * Generate random phone number
   */
  static generatePhoneNumber(): string {
    return faker.phone.number();
  }

  /**
   * Generate random company name
   */
  static generateCompanyName(): string {
    return faker.company.name();
  }

  /**
   * Generate random job title
   */
  static generateJobTitle(): string {
    return faker.person.jobTitle();
  }

  /**
   * Generate random address
   */
  static generateAddress(): {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  } {
    return {
      street: faker.location.streetAddress(),
      city: faker.location.city(),
      state: faker.location.state(),
      zipCode: faker.location.zipCode(),
      country: faker.location.country(),
    };
  }

  /**
   * Generate random course title
   */
  static generateCourseTitle(): string {
    const subjects = ['JavaScript', 'Python', 'React', 'Node.js', 'TypeScript', 'AWS', 'Docker'];
    const levels = ['Beginner', 'Intermediate', 'Advanced', 'Expert'];
    
    const subject = subjects[Math.floor(Math.random() * subjects.length)];
    const level = levels[Math.floor(Math.random() * levels.length)];
    
    return `${level} ${subject} Course`;
  }

  /**
   * Generate random course description
   */
  static generateCourseDescription(): string {
    return faker.lorem.paragraph(3);
  }

  /**
   * Generate random price
   * @param min - Minimum price
   * @param max - Maximum price
   */
  static generatePrice(min: number = 10, max: number = 500): number {
    return parseFloat((Math.random() * (max - min) + min).toFixed(2));
  }

  /**
   * Generate random date in the future
   * @param daysFromNow - Days from current date
   */
  static generateFutureDate(daysFromNow: number = 7): Date {
    const date = new Date();
    date.setDate(date.getDate() + daysFromNow);
    return date;
  }

  /**
   * Generate random date in the past
   * @param daysAgo - Days before current date
   */
  static generatePastDate(daysAgo: number = 7): Date {
    const date = new Date();
    date.setDate(date.getDate() - daysAgo);
    return date;
  }

  /**
   * Generate random UUID
   */
  static generateUUID(): string {
    return faker.string.uuid();
  }

  /**
   * Generate random skills array
   * @param count - Number of skills
   */
  static generateSkills(count: number = 5): string[] {
    const allSkills = [
      'JavaScript', 'TypeScript', 'React', 'Node.js', 'Python', 'Java',
      'Docker', 'Kubernetes', 'AWS', 'Azure', 'MongoDB', 'PostgreSQL',
      'GraphQL', 'REST API', 'Microservices', 'CI/CD', 'Agile', 'Scrum'
    ];
    
    return faker.helpers.arrayElements(allSkills, count);
  }

  /**
   * Generate random URL slug
   * @param text - Text to convert to slug
   */
  static generateSlug(text: string): string {
    return text
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
  }

  /**
   * Generate random bio
   */
  static generateBio(): string {
    return faker.lorem.paragraph(2);
  }

  /**
   * Generate credit card data (test only)
   */
  static generateTestCreditCard(): {
    number: string;
    cvv: string;
    expiryMonth: string;
    expiryYear: string;
  } {
    return {
      number: '4242424242424242', // Stripe test card
      cvv: '123',
      expiryMonth: '12',
      expiryYear: new Date().getFullYear() + 2 + '',
    };
  }
}
