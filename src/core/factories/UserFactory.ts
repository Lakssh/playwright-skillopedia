import { DataHelper } from '../helpers/DataHelper';
import { USER_ROLES } from '../config/constants';

export interface User {
  id?: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role: string;
  phoneNumber?: string;
  bio?: string;
  skills?: string[];
}

/**
 * UserFactory - Factory for generating test user data
 */
export class UserFactory {
  /**
   * Create admin user
   * @param overrides - Optional property overrides
   */
  static createAdmin(overrides?: Partial<User>): User {
    return {
      email: DataHelper.generateEmail(),
      password: DataHelper.generatePassword(),
      firstName: DataHelper.generateFirstName(),
      lastName: DataHelper.generateLastName(),
      role: USER_ROLES.ADMIN,
      phoneNumber: DataHelper.generatePhoneNumber(),
      bio: DataHelper.generateBio(),
      ...overrides,
    };
  }

  /**
   * Create mentor user
   * @param overrides - Optional property overrides
   */
  static createMentor(overrides?: Partial<User>): User {
    return {
      email: DataHelper.generateEmail(),
      password: DataHelper.generatePassword(),
      firstName: DataHelper.generateFirstName(),
      lastName: DataHelper.generateLastName(),
      role: USER_ROLES.MENTOR,
      phoneNumber: DataHelper.generatePhoneNumber(),
      bio: DataHelper.generateBio(),
      skills: DataHelper.generateSkills(5),
      ...overrides,
    };
  }

  /**
   * Create student user
   * @param overrides - Optional property overrides
   */
  static createStudent(overrides?: Partial<User>): User {
    return {
      email: DataHelper.generateEmail(),
      password: DataHelper.generatePassword(),
      firstName: DataHelper.generateFirstName(),
      lastName: DataHelper.generateLastName(),
      role: USER_ROLES.STUDENT,
      phoneNumber: DataHelper.generatePhoneNumber(),
      bio: DataHelper.generateBio(),
      ...overrides,
    };
  }

  /**
   * Create user by role
   * @param role - User role
   * @param overrides - Optional property overrides
   */
  static createByRole(role: string, overrides?: Partial<User>): User {
    switch (role) {
      case USER_ROLES.ADMIN:
        return this.createAdmin(overrides);
      case USER_ROLES.MENTOR:
        return this.createMentor(overrides);
      case USER_ROLES.STUDENT:
        return this.createStudent(overrides);
      default:
        throw new Error(`Unknown role: ${role}`);
    }
  }

  /**
   * Create multiple users
   * @param count - Number of users to create
   * @param role - User role
   */
  static createMultiple(count: number, role: string): User[] {
    return Array.from({ length: count }, () => this.createByRole(role));
  }

  /**
   * Create user with minimal data
   * @param role - User role
   */
  static createMinimal(role: string): Pick<User, 'email' | 'password' | 'role'> {
    return {
      email: DataHelper.generateEmail(),
      password: DataHelper.generatePassword(),
      role,
    };
  }
}
