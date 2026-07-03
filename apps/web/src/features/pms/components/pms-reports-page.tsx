'use client';

import { useState } from 'react';
import { FileText, Loader2 } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { PMS_API } from '@/features/pms/api/endpoints';
import { apiClient } from '@/services/api-client';

const REPORT_TYPES = [
  { id: 'occupancy', label: 'Occupancy Report' },
  { id: 'arrivals', label: 'Arrival Report' },
  { id: 'departures', label: 'Departure Report' },
  { id: 'revenue', label: 'Revenue Report' },
  { id: 'cancellation', label: 'Cancellation Report' },
  { id: 'no-show', label: 'No Show Report' },
  { id: 'corporate', label: 'Corporate Report' },
  { id: 'housekeeping', label: 'Housekeeping Report' },
];

export function PmsReportsPage() {
  const [result, setResult] = useState<Record<string, unknown> | null>(null);
  const [loading, setLoading] = useState<string | null>(null);

  async function generate(type: string) {
    setLoading(type);
    try {
      const r = await apiClient.get<{ data: Record<string, unknown> }>(PMS_API.reports(type));
      setResult(r.data.data);
    } finally {
      setLoading(null);
    }
  }

  return (
    <div className="mx-auto max-w-5xl space-y-6 px-4 lg:px-8">
      <div>
        <h2 className="text-h2">Reports</h2>
        <p className="mt-1 text-sm text-muted-foreground">Enterprise reporting for operations & finance</p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        {REPORT_TYPES.map((r) => (
          <Card key={r.id}>
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-base">
                <FileText className="h-4 w-4" /> {r.label}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Button variant="outline" size="sm" onClick={() => generate(r.id)} disabled={loading === r.id}>
                {loading === r.id ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Generate'}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {result && (
        <Card>
          <CardHeader>
            <CardTitle>Report Output</CardTitle>
            <CardDescription>{String(result.reportType ?? 'Report')}</CardDescription>
          </CardHeader>
          <CardContent>
            <pre className="max-h-96 overflow-auto rounded-lg bg-muted p-4 text-xs">
              {JSON.stringify(result, null, 2)}
            </pre>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
