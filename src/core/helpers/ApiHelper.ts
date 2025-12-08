import { APIResponse } from '@playwright/test';

/**
 * ApiHelper - API interaction utilities
 */
export class ApiHelper {
  /**
   * Parse JSON response body
   * @param response - API response
   */
  static async parseJsonResponse<T>(response: APIResponse): Promise<T> {
    return (await response.json()) as T;
  }

  /**
   * Get response headers
   * @param response - API response
   */
  static getHeaders(response: APIResponse): Record<string, string> {
    const headers: Record<string, string> = {};
    for (const [key, value] of Object.entries(response.headers())) {
      headers[key] = value;
    }
    return headers;
  }

  /**
   * Check if response is successful (2xx status)
   * @param response - API response
   */
  static isSuccessResponse(response: APIResponse): boolean {
    const status = response.status();
    return status >= 200 && status < 300;
  }

  /**
   * Check if response is error (4xx or 5xx status)
   * @param response - API response
   */
  static isErrorResponse(response: APIResponse): boolean {
    const status = response.status();
    return status >= 400;
  }

  /**
   * Get response status text
   * @param response - API response
   */
  static getStatusText(response: APIResponse): string {
    return response.statusText();
  }

  /**
   * Extract token from response
   * @param response - API response
   * @param tokenKey - Key where token is stored in response
   */
  static async extractToken(response: APIResponse, tokenKey: string = 'token'): Promise<string> {
    const body = await this.parseJsonResponse<Record<string, unknown>>(response);
    const token = body[tokenKey];
    
    if (typeof token !== 'string') {
      throw new Error(`Token not found in response with key: ${tokenKey}`);
    }
    
    return token;
  }

  /**
   * Build query string from parameters
   * @param params - Query parameters
   */
  static buildQueryString(params: Record<string, string | number | boolean>): string {
    const searchParams = new URLSearchParams();
    
    for (const [key, value] of Object.entries(params)) {
      searchParams.append(key, String(value));
    }
    
    return searchParams.toString();
  }

  /**
   * Validate response schema (basic validation)
   * @param response - API response
   * @param requiredFields - Required fields in response
   */
  static async validateResponseSchema(response: APIResponse, requiredFields: string[]): Promise<boolean> {
    const body = await this.parseJsonResponse<Record<string, unknown>>(response);
    
    for (const field of requiredFields) {
      if (!(field in body)) {
        throw new Error(`Required field '${field}' not found in response`);
      }
    }
    
    return true;
  }

  /**
   * Wait for API response with retry
   * @param apiCall - API call function
   * @param maxRetries - Maximum number of retries
   * @param retryDelay - Delay between retries in ms
   */
  static async retryApiCall<T>(
    apiCall: () => Promise<T>,
    maxRetries: number = 3,
    retryDelay: number = 1000
  ): Promise<T> {
    let lastError: Error | undefined;
    
    for (let attempt = 0; attempt < maxRetries; attempt++) {
      try {
        return await apiCall();
      } catch (error) {
        lastError = error as Error;
        
        if (attempt < maxRetries - 1) {
          await new Promise((resolve) => setTimeout(resolve, retryDelay));
        }
      }
    }
    
    throw lastError || new Error('API call failed after retries');
  }

  /**
   * Create authorization header
   * @param token - Auth token
   * @param type - Auth type (Bearer, Basic, etc.)
   */
  static createAuthHeader(token: string, type: string = 'Bearer'): string {
    return `${type} ${token}`;
  }

  /**
   * Parse error message from response
   * @param response - API response
   */
  static async parseErrorMessage(response: APIResponse): Promise<string> {
    try {
      const body = await this.parseJsonResponse<{ message?: string; error?: string }>(response);
      return body.message || body.error || `HTTP ${response.status()}: ${response.statusText()}`;
    } catch {
      return `HTTP ${response.status()}: ${response.statusText()}`;
    }
  }
}
