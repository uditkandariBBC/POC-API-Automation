import { test, expect } from '../fixtures/authFixture';
import { updatedBooking, partialUpdate } from '../data/bookingData';

const endpoint = '/booking';

test.describe('Update Booking API Tests', () => {
  test.beforeEach(async ({ apiClient }) => {
    await apiClient.fetchAuthToken(); // Ensure auth token is fetched before tests
  });

  test('Update a booking successfully', async ({ apiClient }) => {
    const createResponse = await apiClient.sendRequest(
      'POST',
      endpoint,
      updatedBooking,
    );
    const bookingId = createResponse.body.bookingid;

    const updateResponse = await apiClient.sendRequest(
      'PUT',
      `${endpoint}/${bookingId}`,
      updatedBooking,
    );
    expect(updateResponse.status).toBe(200);
    expect(updateResponse.body.firstname).toBe(updatedBooking.firstname);
  });

  test('Partially update a booking successfully', async ({ apiClient }) => {
    const createResponse = await apiClient.sendRequest(
      'POST',
      endpoint,
      updatedBooking,
    );
    const bookingId = createResponse.body.bookingid;

    const partialResponse = await apiClient.sendRequest(
      'PATCH',
      `${endpoint}/${bookingId}`,
      partialUpdate,
    );
    expect(partialResponse.status).toBe(200);
    expect(partialResponse.body.firstname).toBe(partialUpdate.firstname);
  });
});
