/**
 * Direct Booking Engine API endpoints.
 */

export const BOOKING_API = {
  search: '/api/v1/public/booking/search',
  roomDetail: (roomTypeId: string) => `/api/v1/public/booking/rooms/${roomTypeId}`,
  addons: '/api/v1/public/booking/addons',
  quote: '/api/v1/public/booking/quote',
  applyCoupon: '/api/v1/public/booking/coupon/apply',
  hold: '/api/v1/public/booking/hold',
  createReservation: '/api/v1/public/booking/reservations',
  getReservation: (code: string) => `/api/v1/public/booking/reservations/${code}`,
  cancelReservation: (code: string) => `/api/v1/public/booking/reservations/${code}/cancel`,
  dashboard: '/api/v1/booking/dashboard',
  listReservations: '/api/v1/booking/reservations',
} as const;
