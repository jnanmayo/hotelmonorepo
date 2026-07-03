import { create } from 'zustand';
import { persist } from 'zustand/middleware';

import type { BookingAddonOption, BookingQuote, RatePlanOption } from '@tungaos/shared/types';
import type { GuestDetailsInput } from '@tungaos/shared/validation';

export interface BookingSearchState {
  hotelSlug: string;
  checkIn: string;
  checkOut: string;
  adults: number;
  children: number;
  rooms: number;
  promoCode: string;
  corporateCode: string;
}

interface BookingStore {
  sessionId: string;
  search: BookingSearchState;
  selectedRoomTypeId: string | null;
  selectedRatePlan: RatePlanOption | null;
  selectedAddons: BookingAddonOption[];
  guest: Partial<GuestDetailsInput>;
  quote: BookingQuote | null;
  specialRequests: string;

  setSearch: (search: Partial<BookingSearchState>) => void;
  selectRoom: (roomTypeId: string, ratePlan: RatePlanOption) => void;
  toggleAddon: (addon: BookingAddonOption) => void;
  setGuest: (guest: Partial<GuestDetailsInput>) => void;
  setQuote: (quote: BookingQuote | null) => void;
  setSpecialRequests: (requests: string) => void;
  reset: () => void;
}

const defaultSearch: BookingSearchState = {
  hotelSlug: 'tunga-international',
  checkIn: '',
  checkOut: '',
  adults: 2,
  children: 0,
  rooms: 1,
  promoCode: '',
  corporateCode: '',
};

function generateSessionId() {
  return `sess_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
};

export const useBookingStore = create<BookingStore>()(
  persist(
    (set, get) => ({
      sessionId: generateSessionId(),
      search: defaultSearch,
      selectedRoomTypeId: null,
      selectedRatePlan: null,
      selectedAddons: [],
      guest: {},
      quote: null,
      specialRequests: '',

      setSearch: (search) => set({ search: { ...get().search, ...search } }),
      selectRoom: (roomTypeId, ratePlan) =>
        set({ selectedRoomTypeId: roomTypeId, selectedRatePlan: ratePlan }),
      toggleAddon: (addon) => {
        const current = get().selectedAddons;
        const exists = current.find((a) => a.id === addon.id);
        set({
          selectedAddons: exists
            ? current.filter((a) => a.id !== addon.id)
            : [...current, addon],
        });
      },
      setGuest: (guest) => set({ guest: { ...get().guest, ...guest } }),
      setQuote: (quote) => set({ quote }),
      setSpecialRequests: (specialRequests) => set({ specialRequests }),
      reset: () =>
        set({
          sessionId: generateSessionId(),
          search: defaultSearch,
          selectedRoomTypeId: null,
          selectedRatePlan: null,
          selectedAddons: [],
          guest: {},
          quote: null,
          specialRequests: '',
        }),
    }),
    { name: 'tungaos-booking' },
  ),
);

export function buildSearchParams(search: BookingSearchState) {
  const p = new URLSearchParams({
    checkIn: search.checkIn,
    checkOut: search.checkOut,
    adults: String(search.adults),
    children: String(search.children),
    rooms: String(search.rooms),
  });
  if (search.promoCode) p.set('promo', search.promoCode);
  if (search.corporateCode) p.set('corporate', search.corporateCode);
  return p;
}
