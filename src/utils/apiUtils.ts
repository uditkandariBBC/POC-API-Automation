import { APIRequestContext, request } from '@playwright/test';
import { ENV } from '../config/env';
import logger from './logger';

export class ApiUtils {
  private apiContext: APIRequestContext | null = null; // Stores the API request context
  private authToken: string | null = null; // Caches the authentication token

  // Initializes the API context with default headers and base URL
  async initialize() {
    logger.info('Initializing API context with base URL: ' + ENV.baseURL);
    this.apiContext = await request.newContext({
      baseURL: ENV.baseURL,
      extraHTTPHeaders: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
    });
  }

  // Ensures the API context has been initialized before making requests
  ensureApiContextInitialized() {
    if (!this.apiContext) {
      throw new Error(
        'API context is not initialized. Call initialize() first.',
      );
    }
  }

  // Fetches an authentication token if not already cached
  async fetchAuthToken() {
    if (this.authToken) {
      logger.info('Auth token already exists, skipping fetch.');
      return;
    }

    this.ensureApiContextInitialized();

    logger.info('Fetching auth token for username: ' + ENV.username);
    const response = await this.apiContext?.fetch('/auth', {
      method: 'POST',
      data: JSON.stringify({ username: ENV.username, password: ENV.password }),
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
    });

    if (!response || !response.ok()) {
      const errorText = response ? await response.text() : 'No response';
      logger.error(
        `Auth request failed: ${response?.status()} - Error: ${errorText}`,
      );
      throw new Error(
        `Failed to fetch auth token: ${response?.status()} - Error: ${errorText}`,
      );
    }

    const responseBody = await response.json();
    this.authToken = responseBody.token; // Store the auth token
    logger.info('Auth token acquired successfully.');
  }

  // Retrieves the stored authentication token
  private async ensureAuthToken() {
    if (!this.authToken) {
      await this.fetchAuthToken();
    }
  }

  // Constructs authentication headers using the stored token
  getAuthHeaders(): Record<string, string> {
    if (!this.authToken) {
      throw new Error(
        'Auth token not available. Please fetch it before using.',
      );
    }
    return {
      Cookie: `token=${this.authToken}`, // Use Cookie header for authentication
    };
  }

  // Constructs a query string from an object of parameters
  constructQueryString(params?: Record<string, string>): string {
    if (!params || Object.keys(params).length === 0) {
      return '';
    }
    return '?' + new URLSearchParams(params).toString();
  }

  /**
   * Sends an HTTP request to the specified endpoint.
   *
   * @param method - The HTTP method to use for the request ('GET', 'POST', 'PUT', 'DELETE', 'PATCH').
   * @param endpoint - The API endpoint to send the request to.
   * @param data - The request payload to send (optional).
   * @param params - The query parameters to include in the request (optional).
   * @param headers - Additional headers to include in the request (optional).
   * @param requiresAuth - Indicates whether the request requires authentication (default is true).
   * @returns A promise that resolves to the response of the request.
   */
  async sendRequest(
    method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH',
    endpoint: string,
    data?: any,
    params?: Record<string, string>,
    headers?: Record<string, string>,
    requiresAuth: boolean = true,
  ) {
    this.ensureApiContextInitialized();

    if (requiresAuth) {
      await this.ensureAuthToken();
    }

    const authHeaders = requiresAuth ? this.getAuthHeaders() : {};
    const requestHeaders = {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      ...authHeaders,
      ...headers,
    };

    const queryString = this.constructQueryString(params);

    logger.info('Sending API Request', {
      method,
      endpoint,
      queryString,
      headers: requestHeaders,
      body: data || null,
    });

    const response = await this.apiContext?.fetch(endpoint + queryString, {
      method,
      data: data ? JSON.stringify(data) : undefined,
      headers: requestHeaders,
    });

    return this.handleResponse(response);
  }

  private async handleResponse(response: any) {
    if (!response || !response.ok()) {
      const errorText = response ? await response.text() : 'No response';
      logger.error('API Request Failed', {
        status: response?.status(),
        error: errorText,
      });
      throw new Error(
        `Request failed: ${response?.status()} - Error: ${errorText}`,
      );
    }

    const contentType = response.headers()['content-type'] || '';
    let responseBody;
    if (contentType.includes('application/json')) {
      responseBody = await response.json();
    } else if (contentType.includes('text/')) {
      responseBody = await response.text();
    } else {
      responseBody = `Unsupported Content Type: ${contentType}`;
    }

    logger.info('Received API Response', {
      status: response.status(),
      
      body: responseBody,
    });

    return { status: response.status(), body: responseBody };
  }
}
