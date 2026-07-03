'use client';

import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import {
  Briefcase,
  Calendar,
  Clock,
  Loader2,
  TrendingUp,
  UserCheck,
  UserMinus,
  Users,
  UserX,
} from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { HrShell } from '@/features/hr/components/hr-shell';
import { HR_API, HR_ROUTES } from '@/features/hr/constants/hr-navigation';
import { useHrRealtime } from '@/features/hr/hooks/use-hr-realtime';
import { asRoute } from '@/lib/navigation';
import { apiClient } from '@/services/api-client';
import { useAuthStore } from '@/stores/auth.store';

import type { HrDashboardStats } from '@tungaos/shared';

function Kpi({ title, value, icon: Icon, suffix }: { title: string; value: string | number; icon: React.ElementType; suffix?: string }) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold tabular-nums">
          {value}
          {suffix ?? ''}
        </div>
      </CardContent>
    </Card>
  );
}

export function HrDashboard() {
  const [stats, setStats] = useState<HrDashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [seeding, setSeeding] = useState(false);
  const hotelId = useAuthStore((s) => s.user?.hotelId ?? null);

  const load = useCallback(() => {
    apiClient
      .get<{ data: HrDashboardStats }>(HR_API.dashboard)
      .then((r) => setStats(r.data.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => { load(); }, [load]);
  useHrRealtime(hotelId, () => load());

  const handleSeed = () => {
    setSeeding(true);
    apiClient.post(HR_API.seed).then(() => load()).finally(() => setSeeding(false));
  };

  if (loading) {
    return (
      <HrShell title="HRMS" description="Enterprise Human Capital Management — TungaOS">
        <div className="flex justify-center py-16">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      </HrShell>
    );
  }

  const s = stats ?? ({} as HrDashboardStats);
  const needsSetup = (s.totalEmployees ?? 0) === 0 && (s.departmentStrength?.length ?? 0) === 0;

  return (
    <HrShell title="HR Executive Dashboard" description="Workforce overview — attendance, recruitment, payroll, and performance">
      <div className="mb-4 flex flex-wrap gap-2">
        <Button asChild size="sm"><Link href={asRoute(HR_ROUTES.employees)}>Employee Master</Link></Button>
        <Button asChild size="sm" variant="outline"><Link href={asRoute(HR_ROUTES.attendance)}>Today&apos;s Attendance</Link></Button>
        <Button asChild size="sm" variant="outline"><Link href={asRoute(HR_ROUTES.payroll)}>Payroll</Link></Button>
        <Button asChild size="sm" variant="outline"><Link href={asRoute(HR_ROUTES.recruitment)}>Recruitment</Link></Button>
        {needsSetup && (
          <Button size="sm" variant="secondary" onClick={handleSeed} disabled={seeding}>
            {seeding ? 'Initializing…' : 'Initialize HR Structure'}
          </Button>
        )}
        <Badge variant="secondary" className="self-center">Live</Badge>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6">
        <Kpi title="Total Employees" value={s.totalEmployees ?? 0} icon={Users} />
        <Kpi title="Present Today" value={s.presentToday ?? 0} icon={UserCheck} />
        <Kpi title="Absent" value={s.absentToday ?? 0} icon={UserX} />
        <Kpi title="Late" value={s.lateToday ?? 0} icon={Clock} />
        <Kpi title="On Leave" value={s.onLeaveToday ?? 0} icon={Calendar} />
        <Kpi title="Avg Attendance" value={s.avgAttendancePct ?? 0} icon={TrendingUp} suffix="%" />
        <Kpi title="Open Positions" value={s.openPositions ?? 0} icon={Briefcase} />
        <Kpi title="Interviews" value={s.interviewsScheduled ?? 0} icon={Users} />
        <Kpi title="Payroll Pending" value={s.payrollPending ?? 0} icon={Briefcase} />
        <Kpi title="New Joiners" value={s.newJoiners ?? 0} icon={UserCheck} />
        <Kpi title="Resignations" value={s.resignations ?? 0} icon={UserMinus} />
        <Kpi title="Training Progress" value={s.trainingProgressPct ?? 0} icon={TrendingUp} suffix="%" />
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-3">
        <Card>
          <CardHeader><CardTitle className="text-base">Department Strength</CardTitle></CardHeader>
          <CardContent className="space-y-2 text-sm">
            {(s.departmentStrength ?? []).slice(0, 8).map((d) => (
              <div key={d.department} className="flex justify-between">
                <span className="text-muted-foreground">{d.department}</span>
                <span className="font-medium tabular-nums">{d.count}</span>
              </div>
            ))}
            {(s.departmentStrength ?? []).length === 0 && (
              <p className="text-muted-foreground">Initialize HR structure to see departments.</p>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle className="text-base">Upcoming Events</CardTitle></CardHeader>
          <CardContent className="space-y-2 text-sm">
            <div className="flex justify-between"><span className="text-muted-foreground">Birthdays (7 days)</span><span>{s.upcomingBirthdays ?? 0}</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">Work Anniversaries</span><span>{s.upcomingAnniversaries ?? 0}</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">Employee Satisfaction</span><span>{s.employeeSatisfaction ?? 0}%</span></div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle className="text-base">Quick Links</CardTitle></CardHeader>
          <CardContent className="flex flex-col gap-2">
            <Button asChild variant="outline" size="sm"><Link href={asRoute(HR_ROUTES.leave)}>Leave Management</Link></Button>
            <Button asChild variant="outline" size="sm"><Link href={asRoute(HR_ROUTES.roster)}>Roster Planning</Link></Button>
            <Button asChild variant="outline" size="sm"><Link href={asRoute(HR_ROUTES.analytics)}>HR Analytics</Link></Button>
          </CardContent>
        </Card>
      </div>
    </HrShell>
  );
}
