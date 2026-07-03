'use client';

import { useEffect, useState } from 'react';
import { Loader2 } from 'lucide-react';
import Link from 'next/link';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { PROC_API, PROC_ROUTES } from '@/features/procurement/constants/procurement-navigation';
import { asRoute } from '@/lib/navigation';
import { apiClient } from '@/services/api-client';

export function VendorPortalPage() {
  const [vendorId, setVendorId] = useState('');
  const [dashboard, setDashboard] = useState<{ vendorName: string; purchaseOrders: number; rfqs: number; quotations: number; invoices: number } | null>(null);
  const [loading, setLoading] = useState(false);

  const load = async () => {
    if (!vendorId) return;
    setLoading(true);
    try {
      const r = await apiClient.get<{ data: typeof dashboard }>(PROC_API.vendorPortalDashboard, { params: { vendorId } });
      setDashboard(r.data.data);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-muted/30">
      <header className="border-b bg-background px-6 py-4">
        <div className="mx-auto max-w-5xl flex items-center justify-between">
          <div>
            <h1 className="text-xl font-semibold">Vendor Portal</h1>
            <p className="text-sm text-muted-foreground">TungaOS — Sharada Sama Solutions</p>
          </div>
          <Button asChild variant="outline" size="sm">
            <Link href={asRoute(PROC_ROUTES.home)}>Back to Procurement</Link>
          </Button>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-6 py-8">
        <Card className="mb-6">
          <CardHeader><CardTitle className="text-base">Vendor Login</CardTitle></CardHeader>
          <CardContent className="flex gap-2 max-w-md">
            <Input placeholder="Vendor ID (UUID)…" value={vendorId} onChange={(e) => setVendorId(e.target.value)} />
            <Button onClick={load} disabled={!vendorId || loading}>Enter</Button>
          </CardContent>
        </Card>

        {loading && <div className="flex justify-center py-8"><Loader2 className="h-8 w-8 animate-spin" /></div>}

        {dashboard && (
          <>
            <h2 className="text-lg font-medium mb-4">Welcome, {dashboard.vendorName}</h2>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <Card><CardHeader className="pb-2"><CardTitle className="text-sm">Purchase Orders</CardTitle></CardHeader><CardContent><div className="text-2xl font-bold">{dashboard.purchaseOrders}</div></CardContent></Card>
              <Card><CardHeader className="pb-2"><CardTitle className="text-sm">RFQs</CardTitle></CardHeader><CardContent><div className="text-2xl font-bold">{dashboard.rfqs}</div></CardContent></Card>
              <Card><CardHeader className="pb-2"><CardTitle className="text-sm">Quotations</CardTitle></CardHeader><CardContent><div className="text-2xl font-bold">{dashboard.quotations}</div></CardContent></Card>
              <Card><CardHeader className="pb-2"><CardTitle className="text-sm">Invoices</CardTitle></CardHeader><CardContent><div className="text-2xl font-bold">{dashboard.invoices}</div></CardContent></Card>
            </div>
            <p className="mt-6 text-sm text-muted-foreground">Submit quotations, view POs, upload invoices, and track delivery schedules from this portal.</p>
          </>
        )}
      </main>
    </div>
  );
}
