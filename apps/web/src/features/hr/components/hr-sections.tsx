'use client';

import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import { Loader2, Smartphone, Sparkles } from 'lucide-react';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { HrShell } from '@/features/hr/components/hr-shell';
import { HR_API, HR_ROUTES } from '@/features/hr/constants/hr-navigation';
import { asRoute } from '@/lib/navigation';
import { apiClient } from '@/services/api-client';

import type {
  HrAnalyticsData,
  HrAttendanceItem,
  HrCandidateItem,
  HrDepartmentItem,
  HrDesignationItem,
  HrDocumentItem,
  HrEmployeeItem,
  HrExitItem,
  HrExpenseItem,
  HrInterviewItem,
  HrJobOpeningItem,
  HrLeaveItem,
  HrOnboardingItem,
  HrOwnerDashboardStats,
  HrPayrollRunItem,
  HrPerformanceItem,
  HrRosterItem,
  HrShiftItem,
  HrTrainingCourseItem,
} from '@tungaos/shared';
import { HR_WORKFLOW_MERMAID, PAYROLL_WORKFLOW_MERMAID } from '@tungaos/shared';

function Loading({ title, description }: { title: string; description: string }) {
  return (
    <HrShell title={title} description={description}>
      <div className="flex justify-center py-16"><Loader2 className="h-8 w-8 animate-spin text-muted-foreground" /></div>
    </HrShell>
  );
}

function StatusBadge({ status }: { status: string }) {
  const pending = ['PENDING', 'DRAFT', 'CALCULATED', 'SCREENING', 'APPLIED'].some((x) => status.includes(x));
  const done = ['APPROVED', 'COMPLETED', 'PAID', 'HIRED', 'ACTIVE'].some((x) => status.includes(x));
  const variant = pending ? 'secondary' : done ? 'default' : 'outline';
  return <Badge variant={variant}>{status.replace(/_/g, ' ')}</Badge>;
}

function DataTable({ headers, rows }: { headers: string[]; rows: React.ReactNode[][] }) {
  return (
    <div className="overflow-x-auto rounded-lg border">
      <table className="w-full text-sm">
        <thead className="bg-muted/50">
          <tr>{headers.map((h) => <th key={h} className="px-4 py-2 text-left">{h}</th>)}</tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i} className="border-t">{row.map((cell, j) => <td key={j} className="px-4 py-2">{cell}</td>)}</tr>
          ))}
        </tbody>
      </table>
      {rows.length === 0 && <p className="p-4 text-sm text-muted-foreground">No records yet.</p>}
    </div>
  );
}

export function HrEmployeesPage() {
  const [rows, setRows] = useState<HrEmployeeItem[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  const load = useCallback((q?: string) => {
    apiClient.get<{ data: HrEmployeeItem[] }>(HR_API.employees, { params: q ? { search: q } : {} })
      .then((r) => setRows(r.data.data)).finally(() => setLoading(false));
  }, []);

  useEffect(() => { load(); }, [load]);
  if (loading) return <Loading title="Employee Master" description="Complete employee records — ID, documents, salary, bank, PF, ESIC" />;

  return (
    <HrShell title="Employee Master" description="Enterprise employee database integrated with payroll, attendance, and finance">
      <div className="mb-4">
        <Input placeholder="Search by name, code, department…" value={search} onChange={(e) => setSearch(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && load(search)} className="max-w-sm" />
      </div>
      <DataTable
        headers={['Code', 'Name', 'Department', 'Designation', 'Type', 'Status', 'Joined']}
        rows={rows.map((e) => [
          <span key="c" className="font-mono text-xs">{e.employeeCode}</span>,
          `${e.firstName} ${e.lastName}`,
          e.department ?? '—',
          e.designation ?? '—',
          e.employmentType ?? '—',
          <StatusBadge key="s" status={e.status} />,
          e.joiningDate ?? '—',
        ])}
      />
    </HrShell>
  );
}

export function HrOrganizationPage() {
  const [depts, setDepts] = useState<HrDepartmentItem[]>([]);
  const [desigs, setDesigs] = useState<HrDesignationItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      apiClient.get<{ data: HrDepartmentItem[] }>(HR_API.departments),
      apiClient.get<{ data: HrDesignationItem[] }>(HR_API.designations),
    ]).then(([d, g]) => {
      setDepts(d.data.data);
      setDesigs(g.data.data);
    }).finally(() => setLoading(false));
  }, []);

  if (loading) return <Loading title="Organization Structure" description="Company → Hotel → Department → Sub Department → Designation → Employee" />;

  return (
    <HrShell title="Organization Structure" description="Multi-hotel hierarchy with departments and designations">
      <div className="grid gap-6 lg:grid-cols-2">
        <div>
          <h3 className="mb-3 font-medium">Departments</h3>
          <div className="grid gap-2 sm:grid-cols-2">
            {depts.map((d) => (
              <Card key={d.id}>
                <CardContent className="p-3 text-sm">
                  <div className="font-medium">{d.name}</div>
                  <div className="text-muted-foreground">{d.code} · {d.employeeCount} employees</div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
        <div>
          <h3 className="mb-3 font-medium">Designations</h3>
          <DataTable
            headers={['Designation', 'Department', 'Level']}
            rows={desigs.map((d) => [d.name, d.departmentName ?? '—', d.level])}
          />
        </div>
      </div>
    </HrShell>
  );
}

export function HrRecruitmentPage() {
  const [openings, setOpenings] = useState<HrJobOpeningItem[]>([]);
  const [candidates, setCandidates] = useState<HrCandidateItem[]>([]);
  const [interviews, setInterviews] = useState<HrInterviewItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      apiClient.get<{ data: HrJobOpeningItem[] }>(HR_API.jobOpenings),
      apiClient.get<{ data: HrCandidateItem[] }>(HR_API.candidates),
      apiClient.get<{ data: HrInterviewItem[] }>(HR_API.interviews),
    ]).then(([o, c, i]) => {
      setOpenings(o.data.data);
      setCandidates(c.data.data);
      setInterviews(i.data.data);
    }).finally(() => setLoading(false));
  }, []);

  if (loading) return <Loading title="Recruitment (ATS)" description="Job openings, applications, interviews, offer letters, hiring analytics" />;

  return (
    <HrShell title="Applicant Tracking System" description="Job Opening → Application → Interview → Offer → Joining">
      <pre className="mb-4 overflow-x-auto rounded-lg bg-muted p-3 text-xs">{HR_WORKFLOW_MERMAID}</pre>
      <div className="space-y-6">
        <div>
          <h3 className="mb-2 font-medium">Open Positions ({openings.length})</h3>
          <DataTable
            headers={['Title', 'Department', 'Status', 'Openings', 'Candidates']}
            rows={openings.map((o) => [o.title, o.department ?? '—', <StatusBadge key="s" status={o.status} />, o.openings, o.candidateCount])}
          />
        </div>
        <div>
          <h3 className="mb-2 font-medium">Candidates</h3>
          <DataTable
            headers={['Name', 'Email', 'Position', 'Status', 'Applied']}
            rows={candidates.map((c) => [c.name, c.email, c.jobTitle, <StatusBadge key="s" status={c.status} />, c.appliedAt])}
          />
        </div>
        <div>
          <h3 className="mb-2 font-medium">Scheduled Interviews</h3>
          <DataTable
            headers={['Candidate', 'Position', 'When', 'Round', 'Interviewer']}
            rows={interviews.map((i) => [i.candidateName, i.jobTitle, new Date(i.scheduledAt).toLocaleString(), i.round, i.interviewer ?? '—'])}
          />
        </div>
      </div>
    </HrShell>
  );
}

export function HrOnboardingPage() {
  const [rows, setRows] = useState<HrOnboardingItem[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    apiClient.get<{ data: HrOnboardingItem[] }>(HR_API.onboarding).then((r) => setRows(r.data.data)).finally(() => setLoading(false));
  }, []);
  if (loading) return <Loading title="Digital Onboarding" description="Documents, training, uniform, ID card, biometric, payroll setup" />;
  return (
    <HrShell title="Onboarding Checklist" description="Automated tasks from offer acceptance to first day">
      <DataTable
        headers={['Employee', 'Task', 'Category', 'Status', 'Due']}
        rows={rows.map((r) => [r.staffName, r.title, r.category, <StatusBadge key="s" status={r.status} />, r.dueDate ?? '—'])}
      />
    </HrShell>
  );
}

export function HrAttendancePage() {
  const [rows, setRows] = useState<HrAttendanceItem[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    apiClient.get<{ data: HrAttendanceItem[] }>(HR_API.attendance).then((r) => setRows(r.data.data)).finally(() => setLoading(false));
  }, []);
  if (loading) return <Loading title="Attendance Management" description="Biometric, face recognition, QR, GPS, manual, shift attendance" />;
  return (
    <HrShell title="Today's Attendance" description="Real-time attendance with late marks, half-day, WFH support">
      <DataTable
        headers={['Employee', 'Code', 'Status', 'Check In', 'Check Out', 'Hours']}
        rows={rows.map((r) => [r.staffName, r.employeeCode, <StatusBadge key="s" status={r.status} />, r.checkIn ? new Date(r.checkIn).toLocaleTimeString() : '—', r.checkOut ? new Date(r.checkOut).toLocaleTimeString() : '—', r.hoursWorked ?? '—'])}
      />
    </HrShell>
  );
}

export function HrShiftsPage() {
  const [rows, setRows] = useState<HrShiftItem[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    apiClient.get<{ data: HrShiftItem[] }>(HR_API.shifts).then((r) => setRows(r.data.data)).finally(() => setLoading(false));
  }, []);
  if (loading) return <Loading title="Shift Management" description="Morning, evening, night, split, rotational shifts" />;
  return (
    <HrShell title="Shift Definitions" description="Configure shift timings and types">
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {rows.map((s) => (
          <Card key={s.id}>
            <CardHeader className="pb-2"><CardTitle className="text-base flex justify-between">{s.name}<Badge variant="outline">{s.type}</Badge></CardTitle></CardHeader>
            <CardContent className="text-sm">
              <div>{s.startTime} – {s.endTime}</div>
              <div className="text-muted-foreground">{s.assignedCount} roster assignments</div>
            </CardContent>
          </Card>
        ))}
      </div>
    </HrShell>
  );
}

export function HrRosterPage() {
  const [rows, setRows] = useState<HrRosterItem[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    apiClient.get<{ data: HrRosterItem[] }>(HR_API.roster).then((r) => setRows(r.data.data)).finally(() => setLoading(false));
  }, []);
  if (loading) return <Loading title="Roster Planning" description="Weekly roster with shift assignments and weekly offs" />;
  return (
    <HrShell title="Roster Planning" description="Assign shifts to employees by date">
      <DataTable headers={['Employee', 'Shift', 'Date']} rows={rows.map((r) => [r.staffName, r.shiftName, r.date])} />
    </HrShell>
  );
}

export function HrLeavePage() {
  const [rows, setRows] = useState<HrLeaveItem[]>([]);
  const [loading, setLoading] = useState(true);
  const load = useCallback(() => {
    apiClient.get<{ data: HrLeaveItem[] }>(HR_API.leave).then((r) => setRows(r.data.data)).finally(() => setLoading(false));
  }, []);
  useEffect(() => { load(); }, [load]);
  if (loading) return <Loading title="Leave Management" description="CL, SL, EL, maternity, paternity, comp-off, LOP with approval workflow" />;
  return (
    <HrShell title="Leave Requests" description="Manager approval workflow with balance tracking">
      <DataTable
        headers={['Employee', 'Type', 'From', 'To', 'Status', 'Action']}
        rows={rows.map((r) => [
          r.staffName, r.leaveType, r.startDate, r.endDate, <StatusBadge key="s" status={r.status} />,
          r.status === 'PENDING' ? (
            <Button key="a" size="sm" variant="outline" onClick={() => apiClient.patch(HR_API.leaveApprove(r.id), { approved: true }).then(load)}>Approve</Button>
          ) : '—',
        ])}
      />
    </HrShell>
  );
}

export function HrPayrollPage() {
  const [runs, setRuns] = useState<HrPayrollRunItem[]>([]);
  const [loading, setLoading] = useState(true);
  const load = useCallback(() => {
    apiClient.get<{ data: HrPayrollRunItem[] }>(HR_API.payrollRuns).then((r) => setRuns(r.data.data)).finally(() => setLoading(false));
  }, []);
  useEffect(() => { load(); }, [load]);
  if (loading) return <Loading title="Payroll Engine" description="Basic, HRA, DA, PF, ESIC, PT, TDS, net salary with finance integration" />;
  return (
    <HrShell title="Payroll Processing" description="Attendance → Leave → Overtime → Deductions → Calculation → Approval → Bank Transfer">
      <pre className="mb-4 overflow-x-auto rounded-lg bg-muted p-3 text-xs">{PAYROLL_WORKFLOW_MERMAID}</pre>
      <DataTable
        headers={['Run #', 'Period', 'Status', 'Employees', 'Gross', 'Net', 'Actions']}
        rows={runs.map((r) => [
          r.runNumber, `${r.periodStart} – ${r.periodEnd}`, <StatusBadge key="s" status={r.status} />, r.employeeCount,
          `₹${r.totalGross.toLocaleString('en-IN')}`, `₹${r.totalNet.toLocaleString('en-IN')}`,
          r.status === 'DRAFT' ? <Button key="c" size="sm" variant="outline" onClick={() => apiClient.post(HR_API.payrollCalculate(r.id)).then(load)}>Calculate</Button>
            : r.status === 'CALCULATED' ? <Button key="a" size="sm" variant="outline" onClick={() => apiClient.patch(HR_API.payrollApprove(r.id)).then(load)}>Approve</Button> : '—',
        ])}
      />
    </HrShell>
  );
}

export function HrPerformancePage() {
  const [rows, setRows] = useState<HrPerformanceItem[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    apiClient.get<{ data: HrPerformanceItem[] }>(HR_API.performance).then((r) => setRows(r.data.data)).finally(() => setLoading(false));
  }, []);
  if (loading) return <Loading title="Performance Management" description="KPI tracking — attendance, punctuality, guest feedback, sales, task completion" />;
  return (
    <HrShell title="Performance Reviews" description="KPI scores with manager ratings">
      <DataTable headers={['Employee', 'Period', 'Status', 'KPI', 'Final Score']} rows={rows.map((r) => [r.staffName, r.period, <StatusBadge key="s" status={r.status} />, r.kpiScore ?? '—', r.finalScore ?? '—'])} />
    </HrShell>
  );
}

export function HrAppraisalsPage() {
  return (
    <HrShell title="Appraisal Cycles" description="Quarterly, half-yearly, and annual reviews with goal setting">
      <Card>
        <CardContent className="p-6 text-sm text-muted-foreground">
          Appraisal cycles integrate with Performance Management. Configure quarterly, half-yearly, and annual review cycles with self-review, manager review, and promotion recommendations.
        </CardContent>
      </Card>
      <div className="mt-4">
        <Button asChild variant="outline"><Link href={asRoute(HR_ROUTES.performance)}>View Performance Reviews</Link></Button>
      </div>
    </HrShell>
  );
}

export function HrTrainingPage() {
  const [rows, setRows] = useState<HrTrainingCourseItem[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    apiClient.get<{ data: HrTrainingCourseItem[] }>(HR_API.training).then((r) => setRows(r.data.data)).finally(() => setLoading(false));
  }, []);
  if (loading) return <Loading title="Training Management" description="Courses, videos, assessments, certificates, completion tracking" />;
  return (
    <HrShell title="Training Catalog" description="Mandatory compliance and role-based skill development">
      <div className="grid gap-3 sm:grid-cols-2">
        {rows.map((c) => (
          <Card key={c.id}>
            <CardHeader className="pb-2">
              <CardTitle className="text-base flex justify-between">{c.title}{c.isMandatory && <Badge variant="danger">Mandatory</Badge>}</CardTitle>
            </CardHeader>
            <CardContent className="text-sm space-y-1">
              <div className="text-muted-foreground">{c.category} · {c.durationHrs}h</div>
              <div>{c.enrolledCount} enrolled · {c.completionPct}% avg completion</div>
            </CardContent>
          </Card>
        ))}
      </div>
    </HrShell>
  );
}

export function HrDocumentsPage() {
  const [rows, setRows] = useState<HrDocumentItem[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    apiClient.get<{ data: HrDocumentItem[] }>(HR_API.documents).then((r) => setRows(r.data.data)).finally(() => setLoading(false));
  }, []);
  if (loading) return <Loading title="Document Management" description="Secure storage in AWS S3 — PAN, Aadhaar, contracts, salary slips" />;
  return (
    <HrShell title="Employee Documents" description="Encrypted document vault with expiry alerts">
      <DataTable headers={['Employee', 'Type', 'Title', 'Uploaded']} rows={rows.map((r) => [r.staffName, r.docType, r.title ?? '—', r.createdAt])} />
    </HrShell>
  );
}

export function HrExpensesPage() {
  const [rows, setRows] = useState<HrExpenseItem[]>([]);
  const [loading, setLoading] = useState(true);
  const load = useCallback(() => {
    apiClient.get<{ data: HrExpenseItem[] }>(HR_API.expenses).then((r) => setRows(r.data.data)).finally(() => setLoading(false));
  }, []);
  useEffect(() => { load(); }, [load]);
  if (loading) return <Loading title="Expense Reimbursement" description="Travel, food, medical, fuel with approval workflow" />;
  return (
    <HrShell title="Expense Claims" description="Submit and approve employee expense reimbursements">
      <DataTable
        headers={['Claim #', 'Employee', 'Category', 'Amount', 'Status', 'Action']}
        rows={rows.map((r) => [
          r.claimNumber, r.staffName, r.category, `₹${r.amount.toLocaleString('en-IN')}`, <StatusBadge key="s" status={r.status} />,
          r.status === 'PENDING' ? <Button key="a" size="sm" variant="outline" onClick={() => apiClient.patch(HR_API.expenseApprove(r.id)).then(load)}>Approve</Button> : '—',
        ])}
      />
    </HrShell>
  );
}

export function HrUniformPage() {
  return (
    <HrShell title="Uniform Management" description="Issue, return, laundry, and replacement tracking">
      <Card><CardContent className="p-6 text-sm text-muted-foreground">Uniform tracking integrates with Asset Management and Housekeeping Laundry modules.</CardContent></Card>
    </HrShell>
  );
}

export function HrEssPage() {
  return (
    <HrShell title="Employee Self Service" description="Apply leave, view attendance, download salary slip, update profile">
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {[
          { label: 'Apply Leave', href: HR_ROUTES.leave },
          { label: 'View Attendance', href: HR_ROUTES.attendance },
          { label: 'Download Salary Slip', href: HR_ROUTES.payroll },
          { label: 'View Shift', href: HR_ROUTES.roster },
          { label: 'My Documents', href: HR_ROUTES.documents },
          { label: 'Submit Expense', href: HR_ROUTES.expenses },
        ].map((item) => (
          <Button key={item.label} asChild variant="outline" className="h-auto py-4"><Link href={asRoute(item.href)}>{item.label}</Link></Button>
        ))}
      </div>
    </HrShell>
  );
}

export function HrMssPage() {
  return (
    <HrShell title="Manager Self Service" description="Approve leave, attendance, overtime, expenses, and performance">
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {[
          { label: 'Approve Leave', href: HR_ROUTES.leave },
          { label: 'Team Attendance', href: HR_ROUTES.attendance },
          { label: 'Approve Expenses', href: HR_ROUTES.expenses },
          { label: 'Performance Reviews', href: HR_ROUTES.performance },
          { label: 'Roster Planning', href: HR_ROUTES.roster },
        ].map((item) => (
          <Button key={item.label} asChild variant="outline" className="h-auto py-4"><Link href={asRoute(item.href)}>{item.label}</Link></Button>
        ))}
      </div>
    </HrShell>
  );
}

export function HrExitPage() {
  const [rows, setRows] = useState<HrExitItem[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    apiClient.get<{ data: HrExitItem[] }>(HR_API.exit).then((r) => setRows(r.data.data)).finally(() => setLoading(false));
  }, []);
  if (loading) return <Loading title="Exit Management" description="Resignation, notice period, clearance, final settlement, relieving letter" />;
  return (
    <HrShell title="Exit Process" description="Resignation → Notice Period → Exit Interview → Clearance → Final Settlement">
      <DataTable headers={['Employee', 'Status', 'Resignation', 'Last Working Day']} rows={rows.map((r) => [r.staffName, <StatusBadge key="s" status={r.status} />, r.resignationDate, r.lastWorkingDate ?? '—'])} />
    </HrShell>
  );
}

export function HrAnalyticsPage() {
  const [data, setData] = useState<HrAnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    apiClient.get<{ data: HrAnalyticsData }>(HR_API.analytics).then((r) => setData(r.data.data)).finally(() => setLoading(false));
  }, []);
  if (loading) return <Loading title="HR Analytics" description="Attrition, attendance, payroll cost, leave, overtime, training analysis" />;
  const d = data!;
  return (
    <HrShell title="HR Analytics" description="Workforce intelligence and trend analysis">
      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader><CardTitle className="text-base">Attendance Trend</CardTitle></CardHeader>
          <CardContent className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={d.attendanceTrend}><XAxis dataKey="month" /><YAxis /><Tooltip /><Line type="monotone" dataKey="pct" stroke="hsl(var(--primary))" /></LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle className="text-base">Payroll Cost</CardTitle></CardHeader>
          <CardContent className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={d.payrollCostTrend}><XAxis dataKey="month" /><YAxis /><Tooltip /><Bar dataKey="amount" fill="hsl(var(--primary))" /></BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
      <div className="mt-4 text-sm text-muted-foreground">Attrition Rate: {d.attritionRate}%</div>
    </HrShell>
  );
}

export function HrOwnerPage() {
  const [stats, setStats] = useState<HrOwnerDashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    apiClient.get<{ data: HrOwnerDashboardStats }>(HR_API.ownerDashboard).then((r) => setStats(r.data.data)).finally(() => setLoading(false));
  }, []);
  if (loading) return <Loading title="Owner Dashboard" description="Total salary cost, department payroll, attrition, top performers" />;
  const s = stats!;
  return (
    <HrShell title="Owner HR Dashboard" description="Executive workforce and payroll overview">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card><CardHeader className="pb-2"><CardTitle className="text-sm text-muted-foreground">Total Salary Cost</CardTitle></CardHeader><CardContent><div className="text-2xl font-bold">₹{s.totalSalaryCost.toLocaleString('en-IN')}</div></CardContent></Card>
        <Card><CardHeader className="pb-2"><CardTitle className="text-sm text-muted-foreground">Attendance</CardTitle></CardHeader><CardContent><div className="text-2xl font-bold">{s.attendancePct}%</div></CardContent></Card>
        <Card><CardHeader className="pb-2"><CardTitle className="text-sm text-muted-foreground">Attrition</CardTitle></CardHeader><CardContent><div className="text-2xl font-bold">{s.attritionRate}%</div></CardContent></Card>
        <Card><CardHeader className="pb-2"><CardTitle className="text-sm text-muted-foreground">Overtime Cost</CardTitle></CardHeader><CardContent><div className="text-2xl font-bold">₹{s.overtimeCost.toLocaleString('en-IN')}</div></CardContent></Card>
      </div>
      <div className="mt-6">
        <h3 className="mb-2 font-medium">Top Performers</h3>
        <DataTable headers={['Employee', 'Score']} rows={s.topPerformers.map((p) => [p.name, p.score])} />
      </div>
    </HrShell>
  );
}

export function HrReportsPage() {
  const [report, setReport] = useState<{ type: string; summary: Record<string, number> } | null>(null);
  useEffect(() => {
    apiClient.get<{ data: { type: string; summary: Record<string, number> } }>(HR_API.report('summary')).then((r) => setReport(r.data.data));
  }, []);
  return (
    <HrShell title="HR Reports" description="Attendance, payroll, leave, employee master, training, performance, recruitment">
      <div className="flex flex-wrap gap-2 mb-4">
        {['attendance', 'payroll', 'leave', 'employees', 'training', 'recruitment'].map((t) => (
          <Button key={t} variant="outline" size="sm" onClick={() => apiClient.get(HR_API.report(t)).then((r) => setReport(r.data.data))}>{t.replace(/-/g, ' ')}</Button>
        ))}
      </div>
      {report && (
        <Card><CardContent className="p-4 text-sm space-y-1">
          <div className="font-medium capitalize">{report.type} Report</div>
          {Object.entries(report.summary).map(([k, v]) => <div key={k} className="flex justify-between"><span className="text-muted-foreground capitalize">{k}</span><span>{v}</span></div>)}
        </CardContent></Card>
      )}
    </HrShell>
  );
}

export function HrMobilePage() {
  return (
    <HrShell title="HR Mobile Apps" description="Employee, Manager, HR, Attendance, and Payroll mobile apps">
      <div className="flex flex-col items-center gap-4 py-12 text-center">
        <Smartphone className="h-16 w-16 text-muted-foreground" />
        <p className="max-w-md text-sm text-muted-foreground">Native mobile apps for clock-in/out, leave requests, salary slips, and manager approvals. PWA-ready for field staff.</p>
      </div>
    </HrShell>
  );
}

export function HrAiPage() {
  return (
    <HrShell title="AI HR Framework" description="Future-ready workforce intelligence">
      <div className="flex flex-col items-center gap-4 py-12 text-center">
        <Sparkles className="h-16 w-16 text-muted-foreground" />
        <div className="grid gap-2 text-sm text-muted-foreground max-w-lg">
          <p>• Predict attrition and overtime</p>
          <p>• AI resume screening and interview scoring</p>
          <p>• Skill gap analysis and promotion recommendations</p>
          <p>• Attendance anomaly detection</p>
          <p>• AI workforce planning</p>
        </div>
      </div>
    </HrShell>
  );
}
