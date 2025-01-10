import { test, expect } from '@playwright/test';
import { ApiUtils } from '../utils/apiUtils';

test.describe('Authentication Tests', () => {
  test('Verify that the authentication token is fetched successfully', async () => {
    const apiUtils = new ApiUtils();
    await apiUtils.initialize();
    await apiUtils.fetchAuthToken();

    const token = apiUtils.getAuthToken();
    expect(token).toBeDefined();
    expect(token).not.toBe('');

    console.log('Authentication token fetched successfully:', token);
  });
});
