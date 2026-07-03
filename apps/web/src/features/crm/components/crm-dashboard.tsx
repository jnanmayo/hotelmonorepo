'use client';

import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import {
  Heart,
  Loader2,
  Mail,
  MessageCircle,
  Repeat,
  Star,
  TrendingUp,
  Users,
  UserPlus,
} from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CrmShell } from '@/features/crm/components/crm-shell';
import { CRM_API, CRM_ROUTES } from '@/features/crm/constants/crm-navigation';
import { useCrmRealtime } from '@/features/crm/hooks/use-crm-realtime';
import { asRoute } from '@/lib/navigation';
import { apiClient } from '@/services/api-client';
import { useAuthStore } from '@/stores/auth.store';

import type { CrmDashboardStats } from '@tungaos/shared';

function Kpi({ title, value, icon: Icon, suffix }: { title: string; value: string | number; icon: React.ElementType; suffix?: string }) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold tabular-nums">{value}{suffix ?? ''}</div>
      </CardContent>
    </Card>
  );
}

export function CrmDashboard() {
  const [stats, setStats] = useState<CrmDashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [seeding, setSeeding] = useState(false);
  const hotelId = useAuthStore((s) => s.user?.hotelId ?? null);

  const load = useCallback(() => {
    apiClient.get<{ data: CrmDashboardStats }>(CRM_API.dashboard)
      .then((r) => setStats(r.data.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => { load(); }, [load]);
  useCrmRealtime(hotelId, () => load());

  const handleSeed = () => {
    setSeeding(true);
    apiClient.post(CRM_API.seed).then(() => load()).finally(() => setSeeding(false));
  };

  if (loading) {
    return (
      <CrmShell title="CRM" description="Enterprise Guest Relationship Platform — TungaOS">
        <div className="flex justify-center py-16"><Loader2 className="h-8 w-8 animate-spin text-muted-foreground" /></div>
      </CrmShell>
    );
  }

  const s = stats ?? ({} as CrmDashboardStats);
  const needsSetup = (s.loyaltyMembers ?? 0) === 0;

  return (
    <CrmShell title="CRM Executive Dashboard" description="Guest relationships, loyalty, campaigns, and lifetime value">
      <div className="mb-4 flex flex-wrap gap-2">
        <Button asChild size="sm"><Link href={asRoute(CRM_ROUTES.guests)}>Guest 360</Link></Button>
        <Button asChild size="sm" variant="outline"><Link href={asRoute(CRM_ROUTES.campaigns)}>Campaigns</Link></Button>
        <Button asChild size="sm" variant="outline"><Link href={asRoute(CRM_ROUTES.loyalty)}>Loyalty</Link></Button>
        {needsSetup && (
          <Button size="sm" variant="secondary" onClick={handleSeed} disabled={seeding}>
            {seeding ? 'Initializing…' : 'Initialize Loyalty & Automation'}
          </Button>
        )}
        <Badge variant="secondary" className="self-center">Live</Badge>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6">
        <Kpi title="Total Guests" value={s.totalGuests ?? 0} icon={Users} />
        <Kpi title="New Guests" value={s.newGuests ?? 0} icon={UserPlus} />
        <Kpi title="Returning" value={s.returningGuests ?? 0} icon={Repeat} />
        <Kpi title="VIP Guests" value={s.vipGuests ?? 0} icon={Star} />
        <Kpi title="Corporate" value={s.corporateGuests ?? 0} icon={Users} />
        <Kpi title="Loyalty Members" value={s.loyaltyMembers ?? 0} icon={Heart} />
        <Kpi title="Active Campaigns" value={s.activeCampaigns ?? 0} icon={Mail} />
        <Kpi title="Email Open Rate" value={s.emailOpenRate ?? 0} icon={Mail} suffix="%" />
        <Kpi title="WhatsApp Delivery" value={s.whatsappDeliveryRate ?? 0} icon={MessageCircle} suffix="%" />
        <Kpi title="Repeat Booking" value={s.repeatBookingPct ?? 0} icon={Repeat} suffix="%" />
        <Kpi title="Avg CLV" value={`₹${(s.customerLifetimeValue ?? 0).toLocaleString('en-IN')}`} icon={TrendingUp} />
        <Kpi title="Satisfaction" value={s.guestSatisfactionScore ?? 0} icon={Star} suffix="%" />
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-3">
        <Card>
          <CardHeader><CardTitle className="text-base">Top Cities</CardTitle></CardHeader>
          <CardContent className="space-y-2 text-sm">
            {(s.topCities ?? []).map((c) => (
              <div key={c.city} className="flex justify-between"><span className="text-muted-foreground">{c.city}</span><span>{c.count}</span></div>
            ))}
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle className="text-base">Top Countries</CardTitle></CardHeader>
          <CardContent className="space-y-2 text-sm">
            {(s.topCountries ?? []).map((c) => (
              <div key={c.country} className="flex justify-between"><span className="text-muted-foreground">{c.country}</span><span>{c.count}</span></div>
            ))}
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle className="text-base">Quick Links</CardTitle></CardHeader>
          <CardContent className="flex flex-col gap-2">
            <Button asChild variant="outline" size="sm"><Link href={asRoute(CRM_ROUTES.leads)}>Lead Pipeline</Link></Button>
            <Button asChild variant="outline" size="sm"><Link href={asRoute(CRM_ROUTES.referrals)}>Referral Program</Link></Button>
            <Button asChild variant="outline" size="sm"><Link href={asRoute(CRM_ROUTES.analytics)}>Analytics</Link></Button>
          </CardContent>
        </Card>
      </div>
    </CrmShell>
  );
}
