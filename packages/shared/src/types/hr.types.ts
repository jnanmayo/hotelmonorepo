/**
 * TungaOS Enterprise HRMS & Payroll — Shared types
 */

export interface HrDashboardStats {
  totalEmployees: number;
  presentToday: number;
  absentToday: number;
  lateToday: number;
  onLeaveToday: number;
  upcomingBirthdays: number;
  upcomingAnniversaries: number;
  newJoiners: number;
  resignations: number;
  openPositions: number;
  interviewsScheduled: number;
  payrollPending: number;
  avgAttendancePct: number;
  employeeSatisfaction: number;
  trainingProgressPct: number;
  departmentStrength: HrDepartmentStrength[];
}

export interface HrDepartmentStrength {
  department: string;
  count: number;
}

export interface HrOwnerDashboardStats {
  totalSalaryCost: number;
  departmentPayroll: { department: string; amount: number }[];
  attendancePct: number;
  attritionRate: number;
  overtimeCost: number;
  trainingCost: number;
  topPerformers: { name: string; score: number }[];
}

export interface HrAnalyticsData {
  attritionRate: number;
  attendanceTrend: { month: string; pct: number }[];
  payrollCostTrend: { month: string; amount: number }[];
  leaveAnalysis: { type: string; count: number }[];
  overtimeAnalysis: { department: string; hours: number }[];
  trainingCompletion: { course: string; pct: number }[];
  performanceTrend: { month: string; score: number }[];
}

export interface HrEmployeeItem {
  id: string;
  employeeCode: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string | null;
  department: string | null;
  designation: string | null;
  status: string;
  joiningDate: string | null;
  employmentType: string | null;
  photoUrl: string | null;
}

export interface HrDepartmentItem {
  id: string;
  name: string;
  code: string;
  parentName: string | null;
  employeeCount: number;
}

export interface HrDesignationItem {
  id: string;
  name: string;
  departmentName: string | null;
  level: number;
}

export interface HrAttendanceItem {
  id: string;
  staffName: string;
  employeeCode: string;
  date: string;
  status: string;
  checkIn: string | null;
  checkOut: string | null;
  hoursWorked: number | null;
}

export interface HrLeaveItem {
  id: string;
  staffName: string;
  leaveType: string;
  status: string;
  startDate: string;
  endDate: string;
  reason: string | null;
}

export interface HrShiftItem {
  id: string;
  name: string;
  type: string;
  startTime: string;
  endTime: string;
  assignedCount: number;
}

export interface HrRosterItem {
  id: string;
  staffName: string;
  shiftName: string;
  date: string;
}

export interface HrPayrollRunItem {
  id: string;
  runNumber: string;
  status: string;
  periodStart: string;
  periodEnd: string;
  totalGross: number;
  totalNet: number;
  employeeCount: number;
}

export interface HrJobOpeningItem {
  id: string;
  title: string;
  department: string | null;
  status: string;
  openings: number;
  candidateCount: number;
  postedAt: string;
}

export interface HrCandidateItem {
  id: string;
  name: string;
  email: string;
  jobTitle: string;
  status: string;
  appliedAt: string;
}

export interface HrInterviewItem {
  id: string;
  candidateName: string;
  jobTitle: string;
  scheduledAt: string;
  interviewer: string | null;
  round: number;
  completed: boolean;
}

export interface HrOnboardingItem {
  id: string;
  staffName: string;
  title: string;
  category: string;
  status: string;
  dueDate: string | null;
}

export interface HrTrainingCourseItem {
  id: string;
  title: string;
  category: string;
  durationHrs: number;
  isMandatory: boolean;
  enrolledCount: number;
  completionPct: number;
}

export interface HrPerformanceItem {
  id: string;
  staffName: string;
  period: string;
  status: string;
  kpiScore: number | null;
  finalScore: number | null;
}

export interface HrExpenseItem {
  id: string;
  claimNumber: string;
  staffName: string;
  category: string;
  amount: number;
  status: string;
  claimDate: string;
}

export interface HrExitItem {
  id: string;
  staffName: string;
  status: string;
  resignationDate: string;
  lastWorkingDate: string | null;
}

export interface HrDocumentItem {
  id: string;
  staffName: string;
  docType: string;
  title: string | null;
  createdAt: string;
}

export type HrRealtimeEvent = {
  type:
    | 'attendance:update'
    | 'leave:update'
    | 'payroll:update'
    | 'dashboard:update'
    | 'approval:pending';
  hotelId: string;
  payload: Record<string, unknown>;
  timestamp: string;
};

export const HR_WORKFLOW_MERMAID = `flowchart TD
  A[Job Opening] --> B[Candidate Application]
  B --> C[Interview]
  C --> D[Offer Letter]
  D --> E[Joining]
  E --> F[Document Verification]
  F --> G[Employee Created]
  G --> H[Attendance]
  H --> I[Performance]
  I --> J[Payroll]
  J --> K[Promotion]
  K --> L[Exit]`;

export const PAYROLL_WORKFLOW_MERMAID = `flowchart TD
  A[Attendance] --> B[Leave]
  B --> C[Overtime]
  C --> D[Deductions]
  D --> E[Salary Calculation]
  E --> F[Manager Approval]
  F --> G[Finance Approval]
  G --> H[Bank Transfer]
  H --> I[Salary Slip]`;
