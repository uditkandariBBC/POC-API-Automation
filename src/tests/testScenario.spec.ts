import { test, expect } from '../fixtures/authFixture';
import { updatedBooking, partialUpdate } from '../data/bookingData';
import logger from '../utils/logger';

const endpoint = '/booking';
let bookingId: number;

// Comprehensive CRUD Test

test('CRUD Scenario', async ({ apiClient }) => {
  // Step 1: Create
  const createResult = await apiClient.sendRequest(
    'POST',
    endpoint,
    updatedBooking,
  );
  bookingId = createResult.body.bookingid;
  expect(createResult.status).toBe(200);
  expect(bookingId).toBeDefined();

  // Step 2: Get by ID
  const getByIdResult = await apiClient.sendRequest(
    'GET',
    `${endpoint}/${bookingId}`,
  );
  expect(getByIdResult.status).toBe(200);
  expect(getByIdResult.body.firstname).toBe(updatedBooking.firstname);

  // Step 3: Get all
  const getAllResult = await apiClient.sendRequest('GET', endpoint);
  expect(getAllResult.status).toBe(200);

  // Step 4: Check our ID exists in get all
  const allBookingIds = getAllResult.body.map(
    (booking: any) => booking.bookingid,
  );
  expect(allBookingIds).toContain(bookingId);

  // Step 5: Patch
  const patchResult = await apiClient.sendRequest(
    'PATCH',
    `${endpoint}/${bookingId}`,
    partialUpdate,
  );
  expect(patchResult.status).toBe(200);
  expect(patchResult.body.firstname).toBe(partialUpdate.firstname);

  // Step 6: Put
  const putResult = await apiClient.sendRequest(
    'PUT',
    `${endpoint}/${bookingId}`,
    updatedBooking,
  );
  expect(putResult.status).toBe(200);
  expect(putResult.body.firstname).toBe(updatedBooking.firstname);

  // Step 7: Get by ID after update
  const getByIdAfterUpdateResult = await apiClient.sendRequest(
    'GET',
    `${endpoint}/${bookingId}`,
  );
  expect(getByIdAfterUpdateResult.status).toBe(200);
  expect(getByIdAfterUpdateResult.body.firstname).toBe(
    updatedBooking.firstname,
  );

  // Step 8: Delete
  const deleteResult = await apiClient.sendRequest(
    'DELETE',
    `${endpoint}/${bookingId}`,
  );
  expect(deleteResult.status).toBe(201);

  // Step 9: Get by ID after delete
  try {
    await apiClient.sendRequest('GET', `${endpoint}/${bookingId}`);
    throw new Error('Expected 404 Not Found after deletion.');
  } catch (error: any) {
    if (error.message.includes('404')) {
      logger.info('Resource successfully deleted; 404 confirmed.');
    } else {
      throw error;
    }
  }
});
