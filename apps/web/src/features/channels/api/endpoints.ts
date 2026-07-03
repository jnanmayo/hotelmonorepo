/**
 * Channel Manager API endpoints.
 */

export const CHANNEL_API = {
  dashboard: '/api/v1/channels/dashboard',
  connections: '/api/v1/channels/connections',
  connect: '/api/v1/channels/connect',
  disconnect: (id: string) => `/api/v1/channels/${id}/disconnect`,
  roomMappings: '/api/v1/channels/room-mappings',
  rateMappings: '/api/v1/channels/rate-mappings',
  restrictions: '/api/v1/channels/restrictions',
  syncInventory: '/api/v1/channels/sync/inventory',
  syncRates: '/api/v1/channels/sync/rates',
  retrySync: (jobId: string) => `/api/v1/channels/sync/retry/${jobId}`,
  syncLogs: '/api/v1/channels/sync-logs',
  webhooks: '/api/v1/channels/webhooks',
  otaBookings: '/api/v1/channels/ota-bookings',
  commission: '/api/v1/channels/commission',
  analytics: '/api/v1/channels/analytics',
} as const;
