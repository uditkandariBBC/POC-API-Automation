import { test as baseTest } from '@playwright/test';
import { ApiUtils } from '../utils/apiUtils';
import { newBooking, partialUpdate } from '../data/bookingData';
import logger from '../utils/logger';

type MyFixtures = {
  apiClient: ApiUtils;
  authToken: string;
  testData: { bookingId: number; firstname: string; lastname: string };
};

export const test = baseTest.extend<MyFixtures>({
  apiClient: async ({ request }, use, testInfo) => {
    const apiUtils = new ApiUtils();
    try {
      logger.info('Initializing API client...');
      await apiUtils.initialize();
      logger.info('API client initialized successfully.');
    } catch (error) {
      logger.error(`API client initialization failed: ${error}`);
    }
    await use(apiUtils);
    logger.info(
      `Test '${testInfo.title}' completed with status: ${testInfo.status?.toUpperCase()}`,
    );
  },
  authToken: async ({ apiClient }, use) => {
    logger.info('Fetching authentication token...');
    await apiClient.fetchAuthToken();
    const token = apiClient.getAuthHeaders().Cookie.split('=')[1];
    logger.info('Authentication token fetched successfully.');
    await use(token);
  },
  testData: async ({ apiClient }, use) => {
    logger.info('Creating test booking data using Fixtures...');
    const createResponse = await apiClient.sendRequest(
      'POST',
      '/booking',
      newBooking,
      undefined,
      undefined,
      false,
    );
    const bookingId = createResponse.body.bookingid;
    if (!bookingId) {
      logger.error('Failed to create test booking data.');
      throw new Error('Failed to create test booking data.');
    }
    logger.info(`Test booking created with ID: ${bookingId}`);
    await use({ bookingId, ...newBooking });
  },
});

export const expect = test.expect;
