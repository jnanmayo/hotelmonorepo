import { notFound } from 'next/navigation';

import {
  HrAiPage,
  HrAnalyticsPage,
  HrAppraisalsPage,
  HrAttendancePage,
  HrDocumentsPage,
  HrEmployeesPage,
  HrEssPage,
  HrExitPage,
  HrExpensesPage,
  HrLeavePage,
  HrMobilePage,
  HrMssPage,
  HrOnboardingPage,
  HrOrganizationPage,
  HrOwnerPage,
  HrPayrollPage,
  HrPerformancePage,
  HrRecruitmentPage,
  HrReportsPage,
  HrRosterPage,
  HrShiftsPage,
  HrTrainingPage,
  HrUniformPage,
} from '@/features/hr/components/hr-sections';

const SECTIONS: Record<string, () => React.ReactNode> = {
  employees: () => <HrEmployeesPage />,
  organization: () => <HrOrganizationPage />,
  recruitment: () => <HrRecruitmentPage />,
  onboarding: () => <HrOnboardingPage />,
  attendance: () => <HrAttendancePage />,
  shifts: () => <HrShiftsPage />,
  roster: () => <HrRosterPage />,
  leave: () => <HrLeavePage />,
  payroll: () => <HrPayrollPage />,
  performance: () => <HrPerformancePage />,
  appraisals: () => <HrAppraisalsPage />,
  training: () => <HrTrainingPage />,
  documents: () => <HrDocumentsPage />,
  expenses: () => <HrExpensesPage />,
  uniform: () => <HrUniformPage />,
  ess: () => <HrEssPage />,
  mss: () => <HrMssPage />,
  exit: () => <HrExitPage />,
  analytics: () => <HrAnalyticsPage />,
  owner: () => <HrOwnerPage />,
  reports: () => <HrReportsPage />,
  mobile: () => <HrMobilePage />,
  ai: () => <HrAiPage />,
};

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  return { title: `${slug.replace(/-/g, ' ')} — HRMS` };
}

export default async function HrSlugPage({ params }: PageProps) {
  const { slug } = await params;
  const Section = SECTIONS[slug];
  if (Section) return Section();
  notFound();
}
