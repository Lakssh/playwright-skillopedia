/**
 * Environment configuration
 */

export interface EnvironmentConfig {
  name: string;
  baseURL: string;
  apiBaseURL: string;
  timeout: number;
  retries: number;
  workers: number;
}

export const environments: Record<string, EnvironmentConfig> = {
  dev: {
    name: 'Development',
    baseURL: process.env.BASE_URL || 'https://skill-sprig.vercel.app',
    apiBaseURL: process.env.API_BASE_URL || 'https://skill-sprig.vercel.app/api',
    timeout: parseInt(process.env.TEST_TIMEOUT || '60000', 10),
    retries: parseInt(process.env.RETRY_COUNT || '0', 10),
    workers: parseInt(process.env.PARALLEL_WORKERS || '4', 10),
  },
  staging: {
    name: 'Staging',
    baseURL: process.env.BASE_URL || 'https://staging.skill-sprig.vercel.app',
    apiBaseURL: process.env.API_BASE_URL || 'https://staging.skill-sprig.vercel.app/api',
    timeout: parseInt(process.env.TEST_TIMEOUT || '60000', 10),
    retries: parseInt(process.env.RETRY_COUNT || '1', 10),
    workers: parseInt(process.env.PARALLEL_WORKERS || '3', 10),
  },
  prod: {
    name: 'Production',
    baseURL: process.env.BASE_URL || 'https://skill-sprig.vercel.app',
    apiBaseURL: process.env.API_BASE_URL || 'https://skill-sprig.vercel.app/api',
    timeout: parseInt(process.env.TEST_TIMEOUT || '90000', 10),
    retries: parseInt(process.env.RETRY_COUNT || '2', 10),
    workers: parseInt(process.env.PARALLEL_WORKERS || '2', 10),
  },
};

export function getEnvironment(): EnvironmentConfig {
  const env = process.env.TEST_ENV || 'dev';
  return environments[env] || environments.dev;
}
