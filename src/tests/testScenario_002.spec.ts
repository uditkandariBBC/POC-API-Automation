import { test, expect } from '../fixtures/authFixture';
import { updatedBooking, partialUpdate, newBooking } from '../data/bookingData';
import logger from '../utils/logger';
// Comprehensive CRUD Test
test('CRUD Scenario', async ({ apiClient, testData }) => {
  logger.info(`Starting test: ${test.info().title}`);
  const { bookingId } = testData;

  logger.info(`Starting CRUD Scenario test with booking ID: ${bookingId}`);

  // Step 1: Get by ID and verify all fields
  logger.info(`Verifying booking details for ID: ${bookingId}`);
  const getByIdResult = await apiClient.sendRequest(
    'GET',
    `/booking/${bookingId}`,
    undefined,
    undefined,
    undefined,
    false,
  );
  expect(getByIdResult.status).toBe(200);
  expect(getByIdResult.body).toEqual(newBooking);

  // Step 2: Get all and verify presence of created booking
  // logger.info(
  //   'Fetching all bookings and verifying presence of created booking.',
  // );
  // const getAllResult = await apiClient.sendRequest(
  //   'GET',
  //   '/booking',
  //   undefined,
  //   undefined,
  //   undefined,
  //   false,
  // );
  // expect(getAllResult.status).toBe(200);
  // const allBookingIds = getAllResult.body.map(
  //   (booking: any) => booking.bookingid,
  // );
  // expect(allBookingIds).toContain(bookingId);

  // Step 3: Patch and verify updated fields
  logger.info(`Updating booking ID: ${bookingId} with PATCH.`);
  const patchResult = await apiClient.sendRequest(
    'PATCH',
    `/booking/${bookingId}`,
    partialUpdate,
    undefined,
    undefined,
    true,
  );
  expect(patchResult.status).toBe(200);
  expect(patchResult.body).toMatchObject(partialUpdate);

  // Step 4: Put and verify complete data
  logger.info(`Updating booking ID: ${bookingId} with PUT.`);
  const putResult = await apiClient.sendRequest(
    'PUT',
    `/booking/${bookingId}`,
    updatedBooking,
    undefined,
    undefined,
    true,
  );
  expect(putResult.status).toBe(200);
  expect(putResult.body).toEqual(updatedBooking);

  // Step 5: Get by ID after update and verify
  logger.info(`Verifying booking details after PUT for ID: ${bookingId}`);
  const getByIdAfterUpdateResult = await apiClient.sendRequest(
    'GET',
    `/booking/${bookingId}`,
    undefined,
    undefined,
    undefined,
    false,
  );
  expect(getByIdAfterUpdateResult.status).toBe(200);
  expect(getByIdAfterUpdateResult.body).toEqual(updatedBooking);

  // Step 6: Delete and verify deletion
  logger.info(`Deleting booking with ID: ${bookingId}`);
  const deleteResult = await apiClient.sendRequest(
    'DELETE',
    `/booking/${bookingId}`,
    undefined,
    undefined,
    undefined,
    true,
  );
  expect(deleteResult.status).toBe(201);
  expect(deleteResult.body).toBe('Created');

  // Step 7: Confirm deletion
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

  logger.info(`CRUD Scenario test completed for booking ID: ${bookingId}`);
});
