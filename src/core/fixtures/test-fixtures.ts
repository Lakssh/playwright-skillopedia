import { test as base } from '@playwright/test';

/**
 * Extended test fixtures
 * Note: Factory pattern has been removed in favor of direct page object usage
 */
export const test = base;

export { expect } from '@playwright/test';
