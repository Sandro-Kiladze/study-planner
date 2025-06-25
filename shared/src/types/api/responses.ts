/**
 * Standard API response wrapper
 * @template T - The type of data being returned
 */
export interface ApiResponse<T> {
  /** Indicates if the request was successful */
  success: boolean;
  /** The response data */
  data: T;
  /** Optional message */
  message?: string;
}

/**
 * API error response structure
 */
export interface ApiError {
  /** Indicates the request failed */
  success: false;
  /** Error identifier */
  error: string;
  /** Human-readable error message */
  message: string;
  /** HTTP status code */
  statusCode: number;
}

/**
 * Paginated response structure
 * @template T - The type of items in the data array
 */
export interface PaginatedResponse<T> {
  /** Indicates if the request was successful */
  success: boolean;
  /** Array of items */
  data: T[];
  /** Pagination metadata */
  pagination: {
    /** Current page number */
    page: number;
    /** Number of items per page */
    limit: number;
    /** Total number of items available */
    total: number;
    /** Total number of pages */
    totalPages: number;
  };
}