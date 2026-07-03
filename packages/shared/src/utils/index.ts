/**
 * Framework-agnostic utility functions.
 */

/** Creates a branded HotelId from a raw string */
export function toHotelId(id: string): import('../types/index.js').HotelId {
  return id as import('../types/index.js').HotelId;
}

/** Creates a branded UserId from a raw string */
export function toUserId(id: string): import('../types/index.js').UserId {
  return id as import('../types/index.js').UserId;
}

/** Calculates total pages for pagination */
export function calculateTotalPages(total: number, limit: number): number {
  return Math.ceil(total / limit);
}

/** Builds pagination metadata */
export function buildPaginationMeta(
  page: number,
  limit: number,
  total: number,
): import('../types/index.js').PaginationMeta {
  const totalPages = calculateTotalPages(total, limit);
  return {
    page,
    limit,
    total,
    totalPages,
    hasNextPage: page < totalPages,
    hasPreviousPage: page > 1,
  };
}

/** Safely parses JSON without throwing */
export function safeJsonParse<T>(value: string, fallback: T): T {
  try {
    return JSON.parse(value) as T;
  } catch {
    return fallback;
  }
}
