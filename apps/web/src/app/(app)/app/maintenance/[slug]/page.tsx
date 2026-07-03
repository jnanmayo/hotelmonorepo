import { notFound } from 'next/navigation';

import {
  EamAmcPage,
  EamAnalyticsPage,
  EamAssetsPage,
  EamCorrectivePage,
  EamEnergyPage,
  EamInspectionPage,
  EamMobilePage,
  EamOwnerPage,
  EamPartsPage,
  EamPreventivePage,
  EamReportsPage,
  EamRequestsPage,
  EamRoomsPage,
  EamSafetyPage,
  EamScannerPage,
  EamTechniciansPage,
  EamWarrantyPage,
  EamWorkOrdersPage,
} from '@/features/maintenance/components/eam-sections';

const SECTIONS: Record<string, () => React.ReactNode> = {
  assets: () => <EamAssetsPage />,
  'work-orders': () => <EamWorkOrdersPage />,
  requests: () => <EamRequestsPage />,
  preventive: () => <EamPreventivePage />,
  corrective: () => <EamCorrectivePage />,
  amc: () => <EamAmcPage />,
  warranty: () => <EamWarrantyPage />,
  technicians: () => <EamTechniciansPage />,
  parts: () => <EamPartsPage />,
  inspection: () => <EamInspectionPage />,
  safety: () => <EamSafetyPage />,
  energy: () => <EamEnergyPage />,
  rooms: () => <EamRoomsPage />,
  owner: () => <EamOwnerPage />,
  reports: () => <EamReportsPage />,
  analytics: () => <EamAnalyticsPage />,
  scanner: () => <EamScannerPage />,
  mobile: () => <EamMobilePage />,
};

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  return { title: `${slug.replace(/-/g, ' ')} — Maintenance` };
}

export default async function MaintenanceSlugPage({ params }: PageProps) {
  const { slug } = await params;
  const Section = SECTIONS[slug];
  if (!Section) notFound();
  return Section();
}
