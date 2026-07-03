'use client';

import { useEffect, useState } from 'react';
import { BarChart3, DollarSign, Loader2, Percent, TrendingUp, Users } from 'lucide-react';
import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PMS_API } from '@/features/pms/api/endpoints';
import { apiClient } from '@/services/api-client';

import type { OwnerDashboardStats } from '@tungaos/shared';

export function PmsOwnerDashboard() {
  const [stats, setStats] = useState<OwnerDashboardStats | null>(null);

  useEffect(() => {
    apiClient.get<{ data: OwnerDashboardStats }>(PMS_API.ownerDashboard).then((r) => setStats(r.data.data)).catch(() => {});
  }, []);

  if (!stats) {
    return (
      <div className="flex justify-center py-16">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  const chartData = [
    { name: 'Corporate', value: stats.corporateRevenue },
    { name: 'OTA', value: stats.otaRevenue },
    { name: 'Direct', value: stats.revenue - stats.corporateRevenue - stats.otaRevenue },
  ];

  return (
    <div className="mx-auto max-w-7xl space-y-8 px-4 lg:px-8">
      <div>
        <h2 className="text-h2">Owner Dashboard</h2>
        <p className="mt-1 text-sm text-muted-foreground">ADR, RevPAR, occupancy & revenue analytics (30-day)</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">ADR</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹{stats.adr.toLocaleString('en-IN')}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">RevPAR</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹{stats.revPar.toLocaleString('en-IN')}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">Occupancy</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.occupancy}%</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">Avg Stay</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.averageStay} nights</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <DollarSign className="h-4 w-4" /> Revenue Mix
            </CardTitle>
          </CardHeader>
          <CardContent className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip formatter={(v: number) => `₹${v.toLocaleString('en-IN')}`} />
                <Bar dataKey="value" fill="#001F3F" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Key Metrics</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-sm">
            <p className="flex items-center justify-between">
              <span className="flex items-center gap-2 text-muted-foreground">
                <TrendingUp className="h-4 w-4" /> Total Revenue
              </span>
              <span className="font-semibold">₹{stats.revenue.toLocaleString('en-IN')}</span>
            </p>
            <p className="flex items-center justify-between">
              <span className="flex items-center gap-2 text-muted-foreground">
                <Percent className="h-4 w-4" /> Direct Booking
              </span>
              <span className="font-semibold">{stats.directBookingPct}%</span>
            </p>
            <p className="flex items-center justify-between">
              <span className="flex items-center gap-2 text-muted-foreground">
                <Users className="h-4 w-4" /> Guest Satisfaction
              </span>
              <span className="font-semibold">{stats.guestSatisfaction}/5</span>
            </p>
            <p className="flex items-center justify-between">
              <span className="flex items-center gap-2 text-muted-foreground">
                <BarChart3 className="h-4 w-4" /> Corporate Revenue
              </span>
              <span className="font-semibold">₹{stats.corporateRevenue.toLocaleString('en-IN')}</span>
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
