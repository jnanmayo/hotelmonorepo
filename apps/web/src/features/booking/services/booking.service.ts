import type {
  AvailableRoom,
  BookingAddonOption,
  BookingConfirmation,
  BookingQuote,
  RatePlanOption,
} from '@tungaos/shared/types';
import type {
  ApplyCouponInput,
  BookingSearchInput,
  CreateBookingInput,
  CreateHoldInput,
  GuestDetailsInput,
} from '@tungaos/shared/validation';

import { BOOKING_API } from '@/features/booking/api/endpoints';

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000';

async function bookingFetch<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: { 'Content-Type': 'application/json', ...options?.headers },
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err?.message ?? err?.error?.message ?? 'Booking request failed');
  }
  const json = await res.json();
  return json.data as T;
}

export const bookingService = {
  search(params: BookingSearchInput & { sessionId?: string }) {
    const q = new URLSearchParams({
      hotelSlug: params.hotelSlug,
      checkIn: params.checkIn,
      checkOut: params.checkOut,
      adults: String(params.adults),
      children: String(params.children),
      rooms: String(params.rooms),
      ...(params.sessionId ? { sessionId: params.sessionId } : {}),
    });
    return bookingFetch<{ hotel: { name: string }; rooms: AvailableRoom[] }>(
      `${BOOKING_API.search}?${q}`,
    );
  },

  getRoomDetail(roomTypeId: string, params: BookingSearchInput) {
    const q = new URLSearchParams({
      hotelSlug: params.hotelSlug,
      checkIn: params.checkIn,
      checkOut: params.checkOut,
      rooms: String(params.rooms),
    });
    return bookingFetch<{
      roomTypeId: string;
      name: string;
      description: string | null;
      shortDescription?: string | null;
      images: unknown;
      images360?: unknown;
      virtualTourUrl?: string | null;
      amenities: string[];
      sizeSqm: number | null;
      bedType: string | null;
      viewType: string | null;
      maxOccupancy: number;
      availableCount: number;
      ratePlans: RatePlanOption[];
      addons: BookingAddonOption[];
    }>(`${BOOKING_API.roomDetail(roomTypeId)}?${q}`);
  },

  getQuote(body: Record<string, unknown>) {
    return bookingFetch<BookingQuote>(BOOKING_API.quote, {
      method: 'POST',
      body: JSON.stringify(body),
    });
  },

  applyCoupon(body: ApplyCouponInput) {
    return bookingFetch<{ valid: boolean; discount?: number; message?: string }>(
      BOOKING_API.applyCoupon,
      { method: 'POST', body: JSON.stringify(body) },
    );
  },

  createHold(body: CreateHoldInput) {
    return bookingFetch<unknown>(BOOKING_API.hold, {
      method: 'POST',
      body: JSON.stringify(body),
    });
  },

  createBooking(body: CreateBookingInput) {
    return bookingFetch<BookingConfirmation>(BOOKING_API.createReservation, {
      method: 'POST',
      body: JSON.stringify(body),
    });
  },

  getBooking(code: string, hotelSlug = 'tunga-international') {
    return bookingFetch<Record<string, unknown>>(`${BOOKING_API.getReservation(code)}?hotelSlug=${hotelSlug}`);
  },

  cancelBooking(code: string, reason?: string, hotelSlug = 'tunga-international') {
    return bookingFetch<unknown>(`${BOOKING_API.cancelReservation(code)}?hotelSlug=${hotelSlug}`, {
      method: 'POST',
      body: JSON.stringify({ reason }),
    });
  },
};

export type { GuestDetailsInput };
