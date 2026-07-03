'use client';

import { useEffect, useState } from 'react';
import { ExternalLink, RefreshCw } from 'lucide-react';
import toast from 'react-hot-toast';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CHANNEL_API } from '@/features/channels/api/endpoints';
import type { CHANNEL_SECTIONS } from '@/features/channels/constants/channel-navigation';
import { SUPPORTED_OTAS } from '@/features/channels/constants/channel-navigation';
import { apiClient } from '@/services/api-client';

interface ChannelSectionShellProps {
  sectionKey: keyof typeof CHANNEL_SECTIONS;
  config: (typeof CHANNEL_SECTIONS)[keyof typeof CHANNEL_SECTIONS];
}

export function ChannelSectionShell({ sectionKey, config }: ChannelSectionShellProps) {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<unknown[]>([]);

  useEffect(() => {
    loadData();
  }, [sectionKey]);

  const loadData = async () => {
    setLoading(true);
    try {
      const endpoint = endpointForSection(sectionKey);
      if (endpoint) {
        const res = await apiClient.get<{ data: unknown }>(endpoint);
        const payload = res.data.data;
        setData(Array.isArray(payload) ? payload : (payload as { items?: unknown[] })?.items ?? []);
      }
    } catch {
      setData([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSync = async () => {
    try {
      if (sectionKey === 'sync-logs' || sectionKey === 'room-mapping') {
        await apiClient.post(CHANNEL_API.syncInventory);
      } else if (sectionKey === 'rate-mapping') {
        await apiClient.post(CHANNEL_API.syncRates);
      }
      toast.success('Sync initiated');
      loadData();
    } catch {
      toast.error('Sync failed');
    }
  };

  return (
    <div className="mx-auto max-w-7xl space-y-6 px-4 lg:px-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-h2">{config.title}</h2>
            <Badge variant="outline" className="text-[10px]">Channel Manager</Badge>
          </div>
          <p className="mt-1 max-w-2xl text-sm text-muted-foreground">{config.description}</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={loadData}>
            <RefreshCw className="mr-2 h-4 w-4" />
            Refresh
          </Button>
          {['sync-logs', 'room-mapping', 'rate-mapping'].includes(sectionKey) && (
            <Button size="sm" onClick={handleSync}>
              <ExternalLink className="mr-2 h-4 w-4" />
              Trigger Sync
            </Button>
          )}
        </div>
      </div>

      <Tabs defaultValue={config.tabs?.[0]?.toLowerCase().replace(/\s+/g, '-') ?? 'all'} className="space-y-4">
        <TabsList className="flex h-auto flex-wrap gap-1">
          {(config.tabs ?? ['All']).map((tab) => (
            <TabsTrigger key={tab} value={tab.toLowerCase().replace(/\s+/g, '-')} className="text-xs sm:text-sm">
              {tab}
            </TabsTrigger>
          ))}
        </TabsList>

        {(config.tabs ?? ['All']).map((tab) => (
          <TabsContent key={tab} value={tab.toLowerCase().replace(/\s+/g, '-')}>
            <Card>
              <CardHeader>
                <CardTitle className="text-base">{tab}</CardTitle>
                <CardDescription>{config.description}</CardDescription>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <p className="py-8 text-center text-sm text-muted-foreground">Loading...</p>
                ) : (
                  <SectionContent sectionKey={sectionKey} data={data} onReload={loadData} />
                )}
              </CardContent>
            </Card>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}

function SectionContent({
  sectionKey,
  data,
  onReload,
}: {
  sectionKey: string;
  data: unknown[];
  onReload: () => void;
}) {
  if (sectionKey === 'connections') {
    return <ConnectionsPanel data={data as ConnectionItem[]} onReload={onReload} />;
  }

  if (data.length === 0) {
    return (
      <div className="rounded-lg border border-dashed p-8 text-center">
        <p className="text-sm text-muted-foreground">
          No records yet. Connect a channel and configure mappings to start syncing.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {data.slice(0, 20).map((item, i) => (
        <div key={i} className="flex items-center justify-between rounded-lg border px-4 py-3 text-sm">
          <pre className="max-w-full overflow-x-auto text-xs">{JSON.stringify(item, null, 0).slice(0, 200)}</pre>
        </div>
      ))}
    </div>
  );
}

interface ConnectionItem {
  provider: string;
  name: string;
  connected: boolean;
  connection?: { id: string; status: string; lastSyncAt?: string; syncError?: string };
}

function ConnectionsPanel({ data, onReload }: { data: ConnectionItem[]; onReload: () => void }) {
  const items = data.length > 0 ? data : SUPPORTED_OTAS.map((o) => ({
    provider: o.id,
    name: o.name,
    connected: false,
    connection: null,
  }));

  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {items.map((ch) => (
        <div key={ch.provider} className="flex items-center justify-between rounded-xl border p-4">
          <div>
            <p className="font-medium">{ch.name}</p>
            <Badge variant={ch.connected ? 'default' : 'secondary'} className="mt-1">
              {ch.connected ? ch.connection?.status ?? 'ACTIVE' : 'Not Connected'}
            </Badge>
            {ch.connection?.syncError && (
              <p className="mt-1 text-xs text-destructive">{ch.connection.syncError}</p>
            )}
          </div>
          <Button
            size="sm"
            variant={ch.connected ? 'outline' : 'default'}
            onClick={async () => {
              if (ch.connected && ch.connection) {
                await apiClient.post(CHANNEL_API.disconnect(ch.connection.id));
                toast.success('Channel disconnected');
              } else {
                await apiClient.post(CHANNEL_API.connect, { provider: ch.provider, environment: 'SANDBOX' });
                toast.success(`${ch.name} connected`);
              }
              onReload();
            }}
          >
            {ch.connected ? 'Disconnect' : 'Connect'}
          </Button>
        </div>
      ))}
    </div>
  );
}

function endpointForSection(section: string): string | null {
  const map: Record<string, string> = {
    connections: CHANNEL_API.connections,
    'room-mapping': CHANNEL_API.roomMappings,
    'rate-mapping': CHANNEL_API.rateMappings,
    restrictions: CHANNEL_API.restrictions,
    'sync-logs': CHANNEL_API.syncLogs,
    webhooks: CHANNEL_API.webhooks,
    'ota-bookings': CHANNEL_API.otaBookings,
    commission: CHANNEL_API.commission,
    analytics: CHANNEL_API.analytics,
  };
  return map[section] ?? null;
}
