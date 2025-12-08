/**
 * Test configuration and settings
 */

export interface TestUser {
  email: string;
  password: string;
  role: string;
}

export const testUsers: Record<string, TestUser> = {
  admin: {
    email: process.env.ADMIN_EMAIL || 'admin@test.com',
    password: process.env.ADMIN_PASSWORD || 'Admin@123',
    role: 'Super Admin',
  },
  mentor: {
    email: process.env.MENTOR_EMAIL || 'mentor@test.com',
    password: process.env.MENTOR_PASSWORD || 'Mentor@123',
    role: 'Tutor/Mentor',
  },
  student: {
    email: process.env.STUDENT_EMAIL || 'student@test.com',
    password: process.env.STUDENT_PASSWORD || 'Student@123',
    role: 'Student/Springer',
  },
};

export const featureFlags = {
  enableVideo: process.env.ENABLE_VIDEO === 'true',
  enableTrace: process.env.ENABLE_TRACE === 'true',
  enableScreenshots: process.env.ENABLE_SCREENSHOTS !== 'false',
};

export const testConfig = {
  screenshotPath: 'screenshots',
  videoPath: 'videos',
  tracePath: 'traces',
  testDataPath: 'test-data',
};
