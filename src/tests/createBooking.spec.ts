import { test, expect } from '../fixtures/authFixture';
import { newBooking } from '../data/bookingData';

const endpoint = '/booking';

test.describe('Create Booking API Tests', () => {
  test('Create a new booking successfully', async ({ apiClient }) => {
    const response = await apiClient.sendRequest('POST', endpoint, newBooking);
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('bookingid');
    expect(response.body.booking.firstname).toBe(newBooking.firstname);
  });
});
