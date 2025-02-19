import { PlaywrightTestConfig } from '@playwright/test';
import dotenv from 'dotenv';
import fs from 'fs';
import { ENV } from './src/config/env';

// Load environment variables
if (fs.existsSync('.env')) {
  dotenv.config();
} else {
  console.warn('.env file not found. Using default settings.');
}

const playwrightConfig: PlaywrightTestConfig = {
  testDir: './src/tests',
  timeout: 30000,
  use: {
    baseURL: ENV.baseURL,
    extraHTTPHeaders: {
      'Content-Type': 'application/json',
    },
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },
  retries: 2,
  workers: 4,
  reporter: [
    ['list'],
    ['html', { outputFolder: 'src/reports' }],
    ['allure-playwright'],
  ],
};

export default playwrightConfig;
