import { notFound } from 'next/navigation';

import {
  InvAdjustmentsPage,
  InvAnalyticsPage,
  InvAuditsPage,
  InvBatchesPage,
  InvConsumptionPage,
  InvExpiryPage,
  InvIssuesPage,
  InvItemsPage,
  InvMobilePage,
  InvMovementsPage,
  InvPurchaseRequestsPage,
  InvReportsPage,
  InvScannerPage,
  InvStockPage,
  InvStoresPage,
  InvTransfersPage,
} from '@/features/inventory/components/inv-sections';

const SECTIONS: Record<string, () => React.ReactNode> = {
  stores: () => <InvStoresPage />,
  items: () => <InvItemsPage />,
  stock: () => <InvStockPage />,
  movements: () => <InvMovementsPage />,
  issues: () => <InvIssuesPage />,
  transfers: () => <InvTransfersPage />,
  consumption: () => <InvConsumptionPage />,
  batches: () => <InvBatchesPage />,
  expiry: () => <InvExpiryPage />,
  adjustments: () => <InvAdjustmentsPage />,
  audits: () => <InvAuditsPage />,
  'purchase-requests': () => <InvPurchaseRequestsPage />,
  scanner: () => <InvScannerPage />,
  mobile: () => <InvMobilePage />,
  reports: () => <InvReportsPage />,
  analytics: () => <InvAnalyticsPage />,
};

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  return { title: `${slug.replace(/-/g, ' ')} — Inventory` };
}

export default async function InventorySlugPage({ params }: PageProps) {
  const { slug } = await params;
  const Section = SECTIONS[slug];
  if (Section) return Section();
  notFound();
}
