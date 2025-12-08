import { DataHelper } from '../helpers/DataHelper';
import { COURSE_STATUS } from '../config/constants';

export interface Course {
  id?: string;
  title: string;
  description: string;
  price: number;
  mentorId?: string;
  duration: number; // in hours
  level: 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';
  skills: string[];
  status: string;
  thumbnailUrl?: string;
  maxStudents?: number;
  startDate?: Date;
  endDate?: Date;
}

/**
 * CourseFactory - Factory for generating course test data
 */
export class CourseFactory {
  /**
   * Create a course
   * @param overrides - Optional property overrides
   */
  static create(overrides?: Partial<Course>): Course {
    const levels: Course['level'][] = ['Beginner', 'Intermediate', 'Advanced', 'Expert'];
    const randomLevel = levels[Math.floor(Math.random() * levels.length)];

    return {
      title: DataHelper.generateCourseTitle(),
      description: DataHelper.generateCourseDescription(),
      price: DataHelper.generatePrice(50, 500),
      duration: Math.floor(Math.random() * 40) + 10, // 10-50 hours
      level: randomLevel,
      skills: DataHelper.generateSkills(3),
      status: COURSE_STATUS.DRAFT,
      maxStudents: Math.floor(Math.random() * 20) + 10, // 10-30 students
      startDate: DataHelper.generateFutureDate(7),
      endDate: DataHelper.generateFutureDate(60),
      ...overrides,
    };
  }

  /**
   * Create published course
   * @param overrides - Optional property overrides
   */
  static createPublished(overrides?: Partial<Course>): Course {
    return this.create({
      status: COURSE_STATUS.PUBLISHED,
      ...overrides,
    });
  }

  /**
   * Create draft course
   * @param overrides - Optional property overrides
   */
  static createDraft(overrides?: Partial<Course>): Course {
    return this.create({
      status: COURSE_STATUS.DRAFT,
      ...overrides,
    });
  }

  /**
   * Create archived course
   * @param overrides - Optional property overrides
   */
  static createArchived(overrides?: Partial<Course>): Course {
    return this.create({
      status: COURSE_STATUS.ARCHIVED,
      startDate: DataHelper.generatePastDate(60),
      endDate: DataHelper.generatePastDate(10),
      ...overrides,
    });
  }

  /**
   * Create multiple courses
   * @param count - Number of courses to create
   * @param status - Course status
   */
  static createMultiple(count: number, status?: string): Course[] {
    return Array.from({ length: count }, () => {
      if (status) {
        return this.create({ status });
      }
      return this.create();
    });
  }

  /**
   * Create beginner course
   * @param overrides - Optional property overrides
   */
  static createBeginnerCourse(overrides?: Partial<Course>): Course {
    return this.create({
      level: 'Beginner',
      duration: Math.floor(Math.random() * 15) + 5, // 5-20 hours
      price: DataHelper.generatePrice(50, 200),
      ...overrides,
    });
  }

  /**
   * Create advanced course
   * @param overrides - Optional property overrides
   */
  static createAdvancedCourse(overrides?: Partial<Course>): Course {
    return this.create({
      level: 'Advanced',
      duration: Math.floor(Math.random() * 30) + 20, // 20-50 hours
      price: DataHelper.generatePrice(300, 1000),
      ...overrides,
    });
  }

  /**
   * Create free course
   * @param overrides - Optional property overrides
   */
  static createFreeCourse(overrides?: Partial<Course>): Course {
    return this.create({
      price: 0,
      ...overrides,
    });
  }
}
