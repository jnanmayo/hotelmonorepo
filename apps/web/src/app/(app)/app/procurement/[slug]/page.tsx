import { notFound } from 'next/navigation';

import {
  ProcAnalyticsPage,
  ProcApprovalsPage,
  ProcBudgetsPage,
  ProcComparisonPage,
  ProcContractsPage,
  ProcGrnsPage,
  ProcInspectionPage,
  ProcInvoicesPage,
  ProcMobilePage,
  ProcPurchaseOrdersPage,
  ProcPurchaseRequestsPage,
  ProcQuotationsPage,
  ProcReportsPage,
  ProcReturnsPage,
  ProcRfqsPage,
  ProcVendorsPage,
} from '@/features/procurement/components/proc-sections';

const SECTIONS: Record<string, () => React.ReactNode> = {
  vendors: () => <ProcVendorsPage />,
  'purchase-requests': () => <ProcPurchaseRequestsPage />,
  rfqs: () => <ProcRfqsPage />,
  quotations: () => <ProcQuotationsPage />,
  comparison: () => <ProcComparisonPage />,
  'purchase-orders': () => <ProcPurchaseOrdersPage />,
  grns: () => <ProcGrnsPage />,
  inspection: () => <ProcInspectionPage />,
  returns: () => <ProcReturnsPage />,
  contracts: () => <ProcContractsPage />,
  budgets: () => <ProcBudgetsPage />,
  invoices: () => <ProcInvoicesPage />,
  approvals: () => <ProcApprovalsPage />,
  reports: () => <ProcReportsPage />,
  analytics: () => <ProcAnalyticsPage />,
  mobile: () => <ProcMobilePage />,
};

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  return { title: `${slug.replace(/-/g, ' ')} — Procurement` };
}

export default async function ProcurementSlugPage({ params }: PageProps) {
  const { slug } = await params;
  const Section = SECTIONS[slug];
  if (Section) return Section();
  notFound();
}
