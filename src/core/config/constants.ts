/**
 * Global constants for the Playwright automation framework
 */

export const TIMEOUTS = {
  SHORT: 5000,
  MEDIUM: 15000,
  LONG: 30000,
  VERY_LONG: 60000,
} as const;

export const USER_ROLES = {
  ADMIN: 'Super Admin',
  MENTOR: 'Tutor/Mentor',
  STUDENT: 'Student/Springer',
} as const;

export const TEST_TAGS = {
  SMOKE: '@smoke',
  REGRESSION: '@regression',
  CRITICAL: '@critical',
  AUTH: '@auth',
  ADMIN: '@admin',
  MENTOR: '@mentor',
  STUDENT: '@student',
  API: '@api',
  VISUAL: '@visual',
  A11Y: '@a11y',
  PERFORMANCE: '@performance',
} as const;

export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  FORGOT_PASSWORD: '/forgot-password',
  SELECT_ROLE: '/select-role',
  
  // Admin routes
  ADMIN_DASHBOARD: '/admin/dashboard',
  USER_MANAGEMENT: '/admin/users',
  REVENUE_MANAGEMENT: '/admin/revenue',
  PAYOUTS: '/admin/payouts',
  
  // Mentor routes
  MENTOR_DASHBOARD: '/mentor/dashboard',
  MENTOR_PROFILE: '/mentor/profile',
  EARNINGS: '/mentor/earnings',
  COURSE_MANAGEMENT: '/mentor/courses',
  BOOKING_MANAGEMENT: '/mentor/bookings',
  
  // Student routes
  STUDENT_DASHBOARD: '/student/dashboard',
  MENTOR_DISCOVERY: '/mentors',
  BOOKING: '/booking',
  PAYMENT: '/payment',
  LEARNING: '/learning',
  
  // Course routes
  COURSE_CATALOG: '/courses',
  COURSE_DETAIL: '/courses/:id',
  ENROLLMENT: '/enroll/:id',
  
  // Communication routes
  CHAT: '/chat',
  VIDEO_SESSION: '/video',
  NOTIFICATIONS: '/notifications',
} as const;

export const ERROR_MESSAGES = {
  INVALID_CREDENTIALS: 'Invalid email or password',
  EMAIL_REQUIRED: 'Email is required',
  PASSWORD_REQUIRED: 'Password is required',
  WEAK_PASSWORD: 'Password must be at least 8 characters',
  EMAIL_ALREADY_EXISTS: 'Email already exists',
  NETWORK_ERROR: 'Network error occurred',
  UNAUTHORIZED: 'Unauthorized access',
  NOT_FOUND: 'Resource not found',
} as const;

export const SUCCESS_MESSAGES = {
  LOGIN_SUCCESS: 'Login successful',
  REGISTRATION_SUCCESS: 'Registration successful',
  PROFILE_UPDATED: 'Profile updated successfully',
  COURSE_CREATED: 'Course created successfully',
  BOOKING_CONFIRMED: 'Booking confirmed',
  PAYMENT_SUCCESS: 'Payment processed successfully',
} as const;

export const PAYMENT_METHODS = {
  CREDIT_CARD: 'credit_card',
  DEBIT_CARD: 'debit_card',
  PAYPAL: 'paypal',
  STRIPE: 'stripe',
} as const;

export const BOOKING_STATUS = {
  PENDING: 'pending',
  CONFIRMED: 'confirmed',
  CANCELLED: 'cancelled',
  COMPLETED: 'completed',
} as const;

export const COURSE_STATUS = {
  DRAFT: 'draft',
  PUBLISHED: 'published',
  ARCHIVED: 'archived',
} as const;
