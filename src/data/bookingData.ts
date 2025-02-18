import { Booking } from '../models/booking';

export const newBooking: Booking = {
  firstname: 'Tony',
  lastname: 'Stark',
  totalprice: 250,
  depositpaid: true,
  bookingdates: {
    checkin: '2024-05-15',
    checkout: '2024-06-15',
  },
  additionalneeds: 'Arc Reactor Charging Station',
};

export const updatedBooking: Booking = {
  firstname: 'Tony',
  lastname: 'Stark',
  totalprice: 300,
  depositpaid: false,
  bookingdates: {
    checkin: '2024-05-15',
    checkout: '2024-09-15',
  },
  additionalneeds: 'Arc Reactor Charging Station',
};

export const partialUpdate: Partial<Booking> = {
  firstname: 'Jamie',
  lastname: 'Doe',
};

