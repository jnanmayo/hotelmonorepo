/** Supported OTA channel providers — extensible registry */
export const CHANNEL_PROVIDERS = {
  BOOKING_COM: { id: 'BOOKING_COM', name: 'Booking.com', commissionPct: 18 },
  AGODA: { id: 'AGODA', name: 'Agoda', commissionPct: 17 },
  GOIBIBO: { id: 'GOIBIBO', name: 'Goibibo', commissionPct: 15 },
  MMT: { id: 'MMT', name: 'MakeMyTrip', commissionPct: 16 },
  EXPEDIA: { id: 'EXPEDIA', name: 'Expedia', commissionPct: 20 },
  HOTELS_COM: { id: 'HOTELS_COM', name: 'Hotels.com', commissionPct: 20 },
  AIRBNB: { id: 'AIRBNB', name: 'Airbnb', commissionPct: 15 },
  TRIP_COM: { id: 'TRIP_COM', name: 'Trip.com', commissionPct: 17 },
  TRAVEL_AGENT: { id: 'TRAVEL_AGENT', name: 'Travel Agents', commissionPct: 10 },
  CORPORATE: { id: 'CORPORATE', name: 'Corporate Portal', commissionPct: 0 },
  DIRECT_WEBSITE: { id: 'DIRECT_WEBSITE', name: 'Direct Website', commissionPct: 0 },
} as const;

export type ChannelProviderId = keyof typeof CHANNEL_PROVIDERS;

export function mapBookingSourceToProvider(source: string): string {
  const map: Record<string, string> = {
    OTA_BOOKING_COM: 'BOOKING_COM',
    OTA_EXPEDIA: 'EXPEDIA',
    OTA_AGODA: 'AGODA',
    OTA_MMT: 'MMT',
    DIRECT_WEBSITE: 'DIRECT_WEBSITE',
    CORPORATE_PORTAL: 'CORPORATE',
    TRAVEL_AGENT: 'TRAVEL_AGENT',
  };
  return map[source] ?? 'OTHER';
}
