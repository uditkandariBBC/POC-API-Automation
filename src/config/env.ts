import * as dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

export const ENV = {
  baseURL: process.env.BASE_URL || 'https://restful-booker.herokuapp.com',
  username: process.env.AUTH_USERNAME || '',
  password: process.env.AUTH_PASSWORD || '',
};
