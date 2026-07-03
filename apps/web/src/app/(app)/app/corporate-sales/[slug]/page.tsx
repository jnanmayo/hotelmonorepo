import { notFound } from 'next/navigation';

import {
  CorpSalesAccountsPage,
  CorpSalesAiPage,
  CorpSalesAnalyticsPage,
  CorpSalesApprovalsPage,
  CorpSalesBillingPage,
  CorpSalesBookingsPage,
  CorpSalesCollectionsPage,
  CorpSalesCommissionsPage,
  CorpSalesCompaniesPage,
  CorpSalesContractsPage,
  CorpSalesCreditPage,
  CorpSalesDocumentsPage,
  CorpSalesEmployeesPage,
  CorpSalesLeadsPage,
  CorpSalesMeetingsPage,
  CorpSalesMobilePage,
  CorpSalesNotificationsPage,
  CorpSalesOwnerPage,
  CorpSalesPipelinePage,
  CorpSalesPortalPage,
  CorpSalesRatesPage,
  CorpSalesRenewalsPage,
  CorpSalesReportsPage,
  CorpSalesRoomAllocationPage,
  CorpSalesTargetsPage,
  CorpSalesTasksPage,
  CorpSalesTravelDeskPage,
} from '@/features/corp-sales/components/corp-sales-sections';

const SECTIONS: Record<string, () => React.ReactNode> = {
  companies: () => <CorpSalesCompaniesPage />,
  accounts: () => <CorpSalesAccountsPage />,
  leads: () => <CorpSalesLeadsPage />,
  pipeline: () => <CorpSalesPipelinePage />,
  contracts: () => <CorpSalesContractsPage />,
  rates: () => <CorpSalesRatesPage />,
  'room-allocation': () => <CorpSalesRoomAllocationPage />,
  bookings: () => <CorpSalesBookingsPage />,
  portal: () => <CorpSalesPortalPage />,
  employees: () => <CorpSalesEmployeesPage />,
  'travel-desk': () => <CorpSalesTravelDeskPage />,
  approvals: () => <CorpSalesApprovalsPage />,
  billing: () => <CorpSalesBillingPage />,
  credit: () => <CorpSalesCreditPage />,
  collections: () => <CorpSalesCollectionsPage />,
  meetings: () => <CorpSalesMeetingsPage />,
  tasks: () => <CorpSalesTasksPage />,
  renewals: () => <CorpSalesRenewalsPage />,
  documents: () => <CorpSalesDocumentsPage />,
  targets: () => <CorpSalesTargetsPage />,
  commissions: () => <CorpSalesCommissionsPage />,
  owner: () => <CorpSalesOwnerPage />,
  analytics: () => <CorpSalesAnalyticsPage />,
  reports: () => <CorpSalesReportsPage />,
  notifications: () => <CorpSalesNotificationsPage />,
  mobile: () => <CorpSalesMobilePage />,
  ai: () => <CorpSalesAiPage />,
};

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  return { title: `${slug.replace(/-/g, ' ')} — Corporate Sales` };
}

export default async function CorpSalesSlugPage({ params }: PageProps) {
  const { slug } = await params;
  const Section = SECTIONS[slug];
  if (Section) return Section();
  notFound();
}
