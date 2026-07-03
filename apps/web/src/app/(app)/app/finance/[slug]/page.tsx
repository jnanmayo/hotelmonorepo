import { notFound } from 'next/navigation';

import {
  FinAnalyticsPage,
  FinApprovalsPage,
  FinBankPage,
  FinBudgetPage,
  FinCashPage,
  FinChartOfAccountsPage,
  FinCostCentersPage,
  FinDepartmentsPage,
  FinExpensesPage,
  FinFixedAssetsPage,
  FinGeneralLedgerPage,
  FinGstPage,
  FinInvoicesPage,
  FinJournalEntriesPage,
  FinMobilePage,
  FinOwnerPage,
  FinPayablesPage,
  FinReceivablesPage,
  FinReconciliationPage,
  FinReportsPage,
  FinRevenuePage,
  FinTaxPage,
} from '@/features/finance/components/fin-sections';

const SECTIONS: Record<string, () => React.ReactNode> = {
  'chart-of-accounts': () => <FinChartOfAccountsPage />,
  'general-ledger': () => <FinGeneralLedgerPage />,
  'journal-entries': () => <FinJournalEntriesPage />,
  receivables: () => <FinReceivablesPage />,
  payables: () => <FinPayablesPage />,
  revenue: () => <FinRevenuePage />,
  expenses: () => <FinExpensesPage />,
  bank: () => <FinBankPage />,
  cash: () => <FinCashPage />,
  gst: () => <FinGstPage />,
  tax: () => <FinTaxPage />,
  budget: () => <FinBudgetPage />,
  'cost-centers': () => <FinCostCentersPage />,
  invoices: () => <FinInvoicesPage />,
  reconciliation: () => <FinReconciliationPage />,
  departments: () => <FinDepartmentsPage />,
  'fixed-assets': () => <FinFixedAssetsPage />,
  reports: () => <FinReportsPage />,
  analytics: () => <FinAnalyticsPage />,
  owner: () => <FinOwnerPage />,
  approvals: () => <FinApprovalsPage />,
  mobile: () => <FinMobilePage />,
};

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  return { title: `${slug.replace(/-/g, ' ')} — Finance` };
}

export default async function FinanceSlugPage({ params }: PageProps) {
  const { slug } = await params;
  const Section = SECTIONS[slug];
  if (!Section) notFound();
  return Section();
}
