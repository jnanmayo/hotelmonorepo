/**
 * TungaOS Enterprise CRM, Loyalty & Marketing — Shared types
 */

export interface CrmDashboardStats {
  totalGuests: number;
  newGuests: number;
  returningGuests: number;
  vipGuests: number;
  corporateGuests: number;
  travelAgentGuests: number;
  loyaltyMembers: number;
  activeCampaigns: number;
  emailOpenRate: number;
  whatsappDeliveryRate: number;
  repeatBookingPct: number;
  customerLifetimeValue: number;
  guestSatisfactionScore: number;
  referralRevenue: number;
  topCities: { city: string; count: number }[];
  topCountries: { country: string; count: number }[];
}

export interface CrmOwnerDashboardStats {
  repeatBookingPct: number;
  customerLifetimeValue: number;
  guestRetention: number;
  campaignRoi: number;
  referralRevenue: number;
  loyaltyMembers: number;
  topCorporateClients: { name: string; revenue: number }[];
  topTravelAgents: { name: string; bookings: number }[];
  guestSatisfaction: number;
}

export interface CrmAnalyticsData {
  guestAcquisition: { month: string; count: number }[];
  retentionTrend: { month: string; pct: number }[];
  loyaltyAnalytics: { tier: string; count: number }[];
  campaignPerformance: { name: string; reach: number; conversions: number }[];
  emailAnalytics: { sent: number; opened: number; clicked: number; bounced: number };
  whatsappAnalytics: { sent: number; delivered: number; read: number };
  repeatRevenue: { month: string; amount: number }[];
  referralAnalytics: { month: string; referrals: number; rewards: number }[];
}

export interface CrmGuestItem {
  id: string;
  guestCode: string;
  firstName: string;
  lastName: string;
  email: string | null;
  phone: string | null;
  nationality: string | null;
  city: string | null;
  country: string | null;
  vipStatus: boolean;
  isCorporate: boolean;
  isBlacklisted: boolean;
  membershipTier: string | null;
  loyaltyPoints: number | null;
  stayCount: number;
  photoUrl: string | null;
}

export interface CrmGuest360 {
  id: string;
  guestCode: string;
  firstName: string;
  lastName: string;
  email: string | null;
  phone: string | null;
  nationality: string | null;
  dateOfBirth: string | null;
  anniversary: string | null;
  passportNumber: string | null;
  gstNumber: string | null;
  address: string | null;
  city: string | null;
  country: string | null;
  companyName: string | null;
  vipStatus: boolean;
  isCorporate: boolean;
  isBlacklisted: boolean;
  membershipTier: string | null;
  loyaltyPoints: number;
  referralCode: string | null;
  preferences: Record<string, unknown> | null;
  foodPreferences: Record<string, unknown> | null;
  notes: string | null;
  photoUrl: string | null;
  stayCount: number;
  totalSpend: number;
}

export interface CrmTimelineItem {
  id: string;
  eventType: string;
  title: string;
  description: string | null;
  occurredAt: string;
}

export interface CrmSegmentItem {
  id: string;
  name: string;
  description: string;
  guestCount: number;
}

export interface CrmLeadItem {
  id: string;
  name: string;
  email: string | null;
  phone: string | null;
  company: string | null;
  status: string;
  source: string | null;
  estimatedValue: number | null;
  assignedTo: string | null;
  createdAt: string;
}

export interface CrmLoyaltyMemberItem {
  id: string;
  guestName: string;
  guestCode: string;
  tier: string;
  balance: number;
  lifetimePoints: number;
}

export interface CrmLoyaltyTransactionItem {
  id: string;
  guestName: string;
  type: string;
  points: number;
  balanceAfter: number;
  description: string | null;
  createdAt: string;
}

export interface CrmCorporateItem {
  id: string;
  name: string;
  code: string;
  industry: string | null;
  creditLimit: number;
  employeeCount: number;
  contractCount: number;
}

export interface CrmTravelAgentItem {
  id: string;
  name: string;
  code: string;
  email: string | null;
  commissionPct: number;
  bookingCount: number;
}

export interface CrmCampaignItem {
  id: string;
  name: string;
  code: string;
  status: string;
  channel: string | null;
  startsAt: string | null;
  endsAt: string | null;
  budget: number | null;
}

export interface CrmCouponItem {
  id: string;
  code: string;
  name: string;
  type: string;
  value: number;
  usedCount: number;
  maxUses: number | null;
  endsAt: string | null;
}

export interface CrmGiftCardItem {
  id: string;
  code: string;
  guestName: string | null;
  initialValue: number;
  balance: number;
  status: string;
  expiresAt: string | null;
}

export interface CrmReferralItem {
  id: string;
  referrerName: string;
  referredEmail: string;
  referralCode: string;
  status: string;
  rewardPoints: number;
  createdAt: string;
}

export interface CrmFeedbackItem {
  id: string;
  guestName: string | null;
  type: string;
  rating: number | null;
  comment: string | null;
  createdAt: string;
}

export interface CrmReviewItem {
  id: string;
  guestName: string | null;
  source: string;
  rating: number;
  title: string | null;
  content: string | null;
  isPublished: boolean;
  createdAt: string;
}

export interface CrmAutomationItem {
  id: string;
  name: string;
  trigger: string;
  channel: string;
  isActive: boolean;
  delayHours: number;
}

export interface CrmCommunicationLogItem {
  id: string;
  channel: string;
  recipient: string;
  subject: string | null;
  status: string;
  sentAt: string | null;
}

export type CrmRealtimeEvent = {
  type:
    | 'guest:update'
    | 'campaign:update'
    | 'feedback:new'
    | 'loyalty:update'
    | 'dashboard:update'
    | 'lead:update';
  hotelId: string;
  payload: Record<string, unknown>;
  timestamp: string;
};

export const CRM_ARCHITECTURE_MERMAID = `flowchart TD
  A[Guest] --> B[Website]
  B --> C[Booking]
  C --> D[Stay]
  D --> E[Restaurant]
  E --> F[Feedback]
  F --> G[CRM]
  G --> H[Loyalty]
  H --> I[Marketing Automation]
  I --> J[Repeat Booking]`;

export const REFERRAL_WORKFLOW_MERMAID = `flowchart TD
  A[Guest] --> B[Invite Friend]
  B --> C[Friend Books]
  C --> D[Reward Both Guests]`;
