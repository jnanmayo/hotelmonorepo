export interface AvailableRoom {
  roomTypeId: string;
  name: string;
  code: string;
  description: string | null;
  baseRate: number;
  maxOccupancy: number;
  maxAdults: number;
  maxChildren: number;
  sizeSqm: number | null;
  bedType: string | null;
  viewType: string | null;
  amenities: string[];
  images: string[];
  availableCount: number;
  ratePlans: RatePlanOption[];
  lowestPrice: number;
  originalPrice?: number;
  offerBadge?: string;
  breakfastIncluded: boolean;
  cancellationPolicy: string;
  cmsSlug?: string;
}

export interface RatePlanOption {
  id: string;
  name: string;
  code: string;
  planType: string;
  pricePerNight: number;
  totalPrice: number;
  nights: number;
  breakfastIncluded: boolean;
  cancellationPolicy: string;
  description?: string;
}

export interface BookingAddonOption {
  id: string;
  name: string;
  code: string;
  category: string;
  description: string | null;
  price: number;
  perNight: boolean;
  perPerson: boolean;
  imageUrl: string | null;
}

export interface BookingQuote {
  roomTypeId: string;
  ratePlanId: string;
  nights: number;
  roomSubtotal: number;
  addonsSubtotal: number;
  discountAmount: number;
  taxAmount: number;
  totalAmount: number;
  currency: string;
  breakdown: {
    label: string;
    amount: number;
  }[];
  couponApplied?: string;
}

export interface BookingConfirmation {
  reservationCode: string;
  status: string;
  checkIn: string;
  checkOut: string;
  guestName: string;
  guestEmail: string;
  roomName: string;
  totalAmount: number;
  paidAmount: number;
  currency: string;
  qrCodeData: string;
  invoiceNumber?: string;
}

export interface BookingAnalytics {
  todayBookings: number;
  todayRevenue: number;
  directBookingPct: number;
  otaBookingPct: number;
  conversionRate: number;
  cancelledBookings: number;
  averageBookingValue: number;
  topRoom: string;
  topOffer: string;
}
