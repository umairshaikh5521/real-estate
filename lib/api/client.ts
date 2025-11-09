/**
 * API Client
 * Centralized HTTP client for all API requests
 */

const RAW_API_BASE_URL = (process.env.NEXT_PUBLIC_API_URL || "").trim();
const ABSOLUTE_URL_REGEX = /^https?:\/\//i;

const isAbsoluteUrl = ABSOLUTE_URL_REGEX.test(RAW_API_BASE_URL);
const RELATIVE_API_BASE_URL = isAbsoluteUrl ? "" : RAW_API_BASE_URL;
const ABSOLUTE_API_BASE_URL = isAbsoluteUrl ? RAW_API_BASE_URL : "";

interface RequestConfig extends RequestInit {
  params?: Record<string, string>;
}

class ApiError extends Error {
  constructor(
    public status: number,
    public code: string,
    message: string,
    public details?: unknown
  ) {
    super(message);
    this.name = "ApiError";
  }
}

/**
 * Main API client for making HTTP requests
 */
class ApiClient {
  private baseURL: string;
  private absoluteBaseURL?: string;

  constructor(baseURL: string, absoluteBaseURL?: string) {
    this.baseURL = baseURL.replace(/\/$/, "");
    this.absoluteBaseURL = absoluteBaseURL?.replace(/\/$/, "");
  }

  /**
   * Resolve the base URL depending on environment.
   * Browsers always use relative URLs to avoid CORS,
   * while the server can fall back to an absolute URL.
   */
  private getActiveBaseURL(): string {
    if (typeof window === "undefined" && this.absoluteBaseURL) {
      return this.absoluteBaseURL;
    }

    return this.baseURL;
  }

  /**
   * Build full URL with query parameters
   */
  private buildURL(endpoint: string, params?: Record<string, string>): string {
    const base = this.getActiveBaseURL();
    const normalizedEndpoint = endpoint.startsWith("/")
      ? endpoint
      : `/${endpoint}`;

    let urlString: string;

    if (base && ABSOLUTE_URL_REGEX.test(base)) {
      urlString = `${base}${normalizedEndpoint}`;
    } else {
      const relativeBase = base || "";
      urlString = `${relativeBase}${normalizedEndpoint}` || normalizedEndpoint;
    }

    if (!params || Object.keys(params).length === 0) {
      return urlString;
    }

    const searchParams = new URLSearchParams(params);
    const separator = urlString.includes("?") ? "&" : "?";
    return `${urlString}${separator}${searchParams.toString()}`;
  }

  /**
   * Generic request method
   */
  private async request<T>(
    endpoint: string,
    config: RequestConfig = {}
  ): Promise<T> {
    const { params, ...fetchConfig } = config;

    const url = this.buildURL(endpoint, params);

    // Default headers
    const headers: HeadersInit = {
      "Content-Type": "application/json",
      ...config.headers,
    };

    try {
      const response = await fetch(url, {
        ...fetchConfig,
        headers,
        credentials: "include", // Important: Include cookies for auth
      });

      const data = await response.json();

      // Handle error responses
      if (!response.ok) {
        throw new ApiError(
          response.status,
          data.error?.code || "UNKNOWN_ERROR",
          data.error?.message || "An error occurred",
          data.error?.details
        );
      }

      return data;
    } catch (error: unknown) {
      if (error instanceof ApiError) {
        throw error;
      }

      // Network or other errors
      if (error instanceof Error) {
        throw new ApiError(0, "NETWORK_ERROR", error.message);
      }

      throw new ApiError(0, "UNKNOWN_ERROR", "An unknown error occurred");
    }
  }

  /**
   * GET request
   */
  async get<T>(endpoint: string, config?: RequestConfig): Promise<T> {
    return this.request<T>(endpoint, {
      ...config,
      method: "GET",
    });
  }

  /**
   * POST request
   */
  async post<T>(
    endpoint: string,
    data?: unknown,
    config?: RequestConfig
  ): Promise<T> {
    return this.request<T>(endpoint, {
      ...config,
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  /**
   * PUT request
   */
  async put<T>(
    endpoint: string,
    data?: unknown,
    config?: RequestConfig
  ): Promise<T> {
    return this.request<T>(endpoint, {
      ...config,
      method: "PUT",
      body: JSON.stringify(data),
    });
  }

  /**
   * DELETE request
   */
  async delete<T>(endpoint: string, config?: RequestConfig): Promise<T> {
    return this.request<T>(endpoint, {
      ...config,
      method: "DELETE",
    });
  }
}

// Export singleton instance
export const apiClient = new ApiClient(
  RELATIVE_API_BASE_URL,
  ABSOLUTE_API_BASE_URL || undefined
);

// Export error class for error handling
export { ApiError };
