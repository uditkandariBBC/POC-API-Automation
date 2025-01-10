import { test, expect } from '../fixtures/authFixture';
import { updatedBooking, partialUpdate } from '../data/bookingData';
import logger from '../utils/logger';

const endpoint = '/booking';
let bookingId: number;

test.describe('CRUD Booking API Tests', () => {
  test.beforeAll(async ({ apiClient }) => {
    // Fetch and store the auth token once for all tests
    await apiClient.fetchAuthToken();

    // Create a new booking and store its ID
    const createResult = await apiClient.sendRequest(
      'POST',
      endpoint,
      updatedBooking,
    );
    bookingId = createResult.body.bookingid;
    expect(createResult.status).toBe(200);
    expect(bookingId).toBeDefined();
  });

  test('Read a booking successfully', async ({ apiClient }) => {
    const readResult = await apiClient.sendRequest(
      'GET',
      `${endpoint}/${bookingId}`,
    );
    expect(readResult.status).toBe(200);
    expect(readResult.body.firstname).toBe(updatedBooking.firstname);
  });

  test('Update a booking successfully', async ({ apiClient }) => {
    const updateResult = await apiClient.sendRequest(
      'PUT',
      `${endpoint}/${bookingId}`,
      updatedBooking,
    );
    expect(updateResult.status).toBe(200);
    expect(updateResult.body.firstname).toBe(updatedBooking.firstname);
  });

  test('Partially update a booking successfully', async ({ apiClient }) => {
    const partialResult = await apiClient.sendRequest(
      'PATCH',
      `${endpoint}/${bookingId}`,
      partialUpdate,
    );
    expect(partialResult.status).toBe(200);
    expect(partialResult.body.firstname).toBe(partialUpdate.firstname);
  });

  test('Delete a booking successfully', async ({ apiClient }) => {
    const deleteResult = await apiClient.sendRequest(
      'DELETE',
      `${endpoint}/${bookingId}`,
    );
    expect(deleteResult.status).toBe(201);

    if (deleteResult.status === 201) {
      try {
        const confirmResult = await apiClient.sendRequest(
          'GET',
          `${endpoint}/${bookingId}`,
          undefined,
          {},
        );
        throw new Error(
          `Expected 404 Not Found after deletion, but received ${confirmResult.status}`,
        );
      } catch (error: any) {
        if (error.message.includes('404')) {
          logger.info('Resource successfully deleted; 404 confirmed.');
        } else {
          throw error; // Re-throw unexpected errors
        }
      }
    } else {
      throw new Error('DELETE request did not return expected status 201.');
    }
  });
});
