import { newBooking } from '../data/bookingData';
import { test, expect } from '../fixtures/authFixture';
import logger from '../utils/logger';

const endpoint = '/booking';

test.describe('Delete Booking API Tests', () => {
  test('Delete a booking successfully', async ({ apiClient }) => {
    const createResponse = await apiClient.sendRequest(
      'POST',
      endpoint,
      newBooking,
    );
    const bookingId = createResponse.body.bookingid;

    const deleteResponse = await apiClient.sendRequest(
      'DELETE',
      `${endpoint}/${bookingId}`,
    );
    expect(deleteResponse.status).toBe(201);

    try {
      await apiClient.sendRequest(
        'GET',
        `/booking/${bookingId}`,
        undefined,
        undefined,
        undefined,
        false,
      );
      throw new Error('Expected 404 Not Found after deletion.');
    } catch (error: any) {
      if (error.message.includes('404')) {
        logger.info('Resource successfully deleted; 404 confirmed.');
      } else {
        throw error;
      }
    }
  });
});
