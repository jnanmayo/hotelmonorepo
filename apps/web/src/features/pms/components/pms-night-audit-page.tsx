'use client';

import { useEffect, useState } from 'react';
import { Loader2, Moon } from 'lucide-react';
import toast from 'react-hot-toast';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { PMS_API } from '@/features/pms/api/endpoints';
import { apiClient } from '@/services/api-client';

import type { NightAuditSummary } from '@tungaos/shared';

export function PmsNightAuditPage() {
  const [audits, setAudits] = useState<NightAuditSummary[]>([]);
  const [running, setRunning] = useState(false);

  function load() {
    apiClient.get<{ data: NightAuditSummary[] }>(PMS_API.nightAudit).then((r) => setAudits(r.data.data)).catch(() => {});
  }

  useEffect(() => {
    load();
  }, []);

  async function runAudit() {
    setRunning(true);
    try {
      await apiClient.post(PMS_API.runNightAudit, {
        auditDate: new Date().toISOString().split('T')[0],
      });
      toast.success('Night audit completed');
      load();
    } catch {
      toast.error('Night audit failed');
    } finally {
      setRunning(false);
    }
  }

  return (
    <div className="mx-auto max-w-4xl space-y-6 px-4 lg:px-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-h2">Night Audit</h2>
          <p className="mt-1 text-sm text-muted-foreground">Daily closing, revenue summary & cash reconciliation</p>
        </div>
        <Button onClick={runAudit} disabled={running}>
          {running ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Moon className="mr-2 h-4 w-4" />}
          Run Tonight&apos;s Audit
        </Button>
      </div>

      <div className="space-y-4">
        {audits.map((a) => (
          <Card key={a.id}>
            <CardHeader>
              <CardTitle className="text-base">{a.auditDate}</CardTitle>
              <CardDescription>Status: {a.status}</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-2 text-sm sm:grid-cols-3">
              <p>Revenue: ₹{a.totalRevenue.toLocaleString('en-IN')}</p>
              <p>Occupancy: {a.occupancyPct}%</p>
              <p>ADR: ₹{a.adr.toLocaleString('en-IN')}</p>
              <p>RevPAR: ₹{a.revPar.toLocaleString('en-IN')}</p>
              <p>Open Folios: {a.openFolios}</p>
              <p>Pending Checkouts: {a.pendingCheckouts}</p>
            </CardContent>
          </Card>
        ))}
        {audits.length === 0 && (
          <p className="py-8 text-center text-sm text-muted-foreground">No night audits recorded yet.</p>
        )}
      </div>
    </div>
  );
}
