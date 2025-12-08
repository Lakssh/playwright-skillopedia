import { APIRequestContext, request } from '@playwright/test';

/**
 * BaseApi - Base class for API clients
 * Provides common functionality for making API requests
 */
export class BaseApi {
  protected apiContext: APIRequestContext | null = null;
  protected readonly baseURL: string;
  protected authToken: string | null = null;

  constructor(baseURL?: string) {
    this.baseURL = baseURL || process.env.API_BASE_URL || 'https://skill-sprig.vercel.app/api';
  }

  /**
   * Initialize API context
   */
  async init(): Promise<void> {
    this.apiContext = await request.newContext({
      baseURL: this.baseURL,
      extraHTTPHeaders: this.getHeaders(),
    });
  }

  /**
   * Set authentication token
   * @param token - Auth token to set
   */
  setAuthToken(token: string): void {
    this.authToken = token;
  }

  /**
   * Get request headers
   */
  protected getHeaders(): Record<string, string> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    };

    if (this.authToken) {
      headers.Authorization = `Bearer ${this.authToken}`;
    }

    return headers;
  }

  /**
   * Make GET request
   * @param endpoint - API endpoint
   * @param params - Query parameters
   */
  async get<T>(endpoint: string, params?: Record<string, string>): Promise<T> {
    if (!this.apiContext) await this.init();
    
    const response = await this.apiContext!.get(endpoint, {
      params,
      headers: this.getHeaders(),
    });

    if (!response.ok()) {
      throw new Error(`GET ${endpoint} failed: ${response.status()} ${response.statusText()}`);
    }

    return (await response.json()) as T;
  }

  /**
   * Make POST request
   * @param endpoint - API endpoint
   * @param data - Request body
   */
  async post<T>(endpoint: string, data?: unknown): Promise<T> {
    if (!this.apiContext) await this.init();

    const response = await this.apiContext!.post(endpoint, {
      data,
      headers: this.getHeaders(),
    });

    if (!response.ok()) {
      throw new Error(`POST ${endpoint} failed: ${response.status()} ${response.statusText()}`);
    }

    return (await response.json()) as T;
  }

  /**
   * Make PUT request
   * @param endpoint - API endpoint
   * @param data - Request body
   */
  async put<T>(endpoint: string, data?: unknown): Promise<T> {
    if (!this.apiContext) await this.init();

    const response = await this.apiContext!.put(endpoint, {
      data,
      headers: this.getHeaders(),
    });

    if (!response.ok()) {
      throw new Error(`PUT ${endpoint} failed: ${response.status()} ${response.statusText()}`);
    }

    return (await response.json()) as T;
  }

  /**
   * Make PATCH request
   * @param endpoint - API endpoint
   * @param data - Request body
   */
  async patch<T>(endpoint: string, data?: unknown): Promise<T> {
    if (!this.apiContext) await this.init();

    const response = await this.apiContext!.patch(endpoint, {
      data,
      headers: this.getHeaders(),
    });

    if (!response.ok()) {
      throw new Error(`PATCH ${endpoint} failed: ${response.status()} ${response.statusText()}`);
    }

    return (await response.json()) as T;
  }

  /**
   * Make DELETE request
   * @param endpoint - API endpoint
   */
  async delete<T>(endpoint: string): Promise<T> {
    if (!this.apiContext) await this.init();

    const response = await this.apiContext!.delete(endpoint, {
      headers: this.getHeaders(),
    });

    if (!response.ok()) {
      throw new Error(`DELETE ${endpoint} failed: ${response.status()} ${response.statusText()}`);
    }

    return (await response.json()) as T;
  }

  /**
   * Dispose API context
   */
  async dispose(): Promise<void> {
    if (this.apiContext) {
      await this.apiContext.dispose();
      this.apiContext = null;
    }
  }
}
