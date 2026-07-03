import { notFound } from 'next/navigation';

import {
  CrmAiPage,
  CrmAnalyticsPage,
  CrmAutomationPage,
  CrmCampaignsPage,
  CrmCorporatePage,
  CrmCouponsPage,
  CrmEmailPage,
  CrmFeedbackPage,
  CrmGiftCardsPage,
  CrmGuestsPage,
  CrmLeadsPage,
  CrmLoyaltyPage,
  CrmMobilePage,
  CrmOwnerPage,
  CrmPipelinePage,
  CrmPointsPage,
  CrmReferralsPage,
  CrmReportsPage,
  CrmReviewsPage,
  CrmSegmentsPage,
  CrmSmsPage,
  CrmTravelAgentsPage,
  CrmUpsellPage,
  CrmWhatsAppPage,
} from '@/features/crm/components/crm-sections';

const SECTIONS: Record<string, () => React.ReactNode> = {
  guests: () => <CrmGuestsPage />,
  segments: () => <CrmSegmentsPage />,
  leads: () => <CrmLeadsPage />,
  pipeline: () => <CrmPipelinePage />,
  loyalty: () => <CrmLoyaltyPage />,
  points: () => <CrmPointsPage />,
  corporate: () => <CrmCorporatePage />,
  'travel-agents': () => <CrmTravelAgentsPage />,
  campaigns: () => <CrmCampaignsPage />,
  email: () => <CrmEmailPage />,
  whatsapp: () => <CrmWhatsAppPage />,
  sms: () => <CrmSmsPage />,
  automation: () => <CrmAutomationPage />,
  coupons: () => <CrmCouponsPage />,
  'gift-cards': () => <CrmGiftCardsPage />,
  referrals: () => <CrmReferralsPage />,
  feedback: () => <CrmFeedbackPage />,
  reviews: () => <CrmReviewsPage />,
  upsell: () => <CrmUpsellPage />,
  analytics: () => <CrmAnalyticsPage />,
  owner: () => <CrmOwnerPage />,
  reports: () => <CrmReportsPage />,
  mobile: () => <CrmMobilePage />,
  ai: () => <CrmAiPage />,
};

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  return { title: `${slug.replace(/-/g, ' ')} — CRM` };
}

export default async function CrmSlugPage({ params }: PageProps) {
  const { slug } = await params;
  const Section = SECTIONS[slug];
  if (Section) return Section();
  notFound();
}
