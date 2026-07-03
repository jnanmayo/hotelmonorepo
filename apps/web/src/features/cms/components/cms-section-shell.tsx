'use client';

import { Archive, Clock, ExternalLink, Eye, Plus, Save } from 'lucide-react';
import Link from 'next/link';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import type { CmsSectionConfig } from '@/features/cms/constants/cms-sections';
import { CMS_BASE } from '@/features/cms/constants/cms-navigation';
import { asRoute } from '@/lib/navigation';

interface CmsSectionShellProps {
  config: CmsSectionConfig;
  subPath?: string;
}

export function CmsSectionShell({ config, subPath }: CmsSectionShellProps) {
  const isNew = subPath === 'new';
  const isUpload = subPath === 'upload';

  return (
    <div className="mx-auto max-w-7xl space-y-6 px-4 lg:px-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-h2">{isNew ? `New ${config.listLabel ?? config.title}` : config.title}</h2>
            <Badge variant="outline" className="text-[10px]">CMS</Badge>
          </div>
          <p className="mt-1 max-w-2xl text-sm text-muted-foreground">{config.description}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          {config.previewHref && (
            <Button variant="outline" size="sm" asChild>
              <a href={config.previewHref} target="_blank" rel="noopener noreferrer">
                <ExternalLink className="mr-2 h-4 w-4" />
                Preview
              </a>
            </Button>
          )}
          {config.listLabel && !isNew && (
            <Button size="sm" asChild>
              <Link href={asRoute(`${CMS_BASE}/${config.key}/new`)}>
                <Plus className="mr-2 h-4 w-4" />
                Add {config.listLabel.replace(/s$/, '')}
              </Link>
            </Button>
          )}
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        {config.features.map((feature) => (
          <Badge key={feature} variant="secondary" className="text-xs font-normal">
            {feature}
          </Badge>
        ))}
      </div>

      <Tabs defaultValue={config.tabs[0]?.toLowerCase().replace(/\s+/g, '-') ?? 'content'} className="space-y-4">
        <TabsList className="flex h-auto flex-wrap gap-1">
          {config.tabs.map((tab) => (
            <TabsTrigger key={tab} value={tab.toLowerCase().replace(/\s+/g, '-')} className="text-xs sm:text-sm">
              {tab}
            </TabsTrigger>
          ))}
          <TabsTrigger value="versions" className="text-xs sm:text-sm">
            <Clock className="mr-1.5 h-3.5 w-3.5" />
            Versions
          </TabsTrigger>
        </TabsList>

        {config.tabs.map((tab) => {
          const tabKey = tab.toLowerCase().replace(/\s+/g, '-');
          return (
            <TabsContent key={tab} value={tabKey}>
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">{tab}</CardTitle>
                  <CardDescription>
                    {isNew
                      ? `Create a new ${config.listLabel?.toLowerCase() ?? 'item'} for ${config.title.toLowerCase()}.`
                      : isUpload
                        ? 'Upload and manage media assets for your website.'
                        : `Manage ${tab.toLowerCase()} content for ${config.title.toLowerCase()}.`}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <CmsContentPlaceholder
                    section={config.title}
                    tab={tab}
                    isNew={isNew}
                    listLabel={config.listLabel}
                  />
                </CardContent>
              </Card>
            </TabsContent>
          );
        })}

        <TabsContent value="versions">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Version History</CardTitle>
              <CardDescription>Draft, published, and archived versions with restore capability.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[
                  { version: 'v3', status: 'Published', date: 'Jun 28, 2026', author: 'Priya Sharma' },
                  { version: 'v2', status: 'Draft', date: 'Jun 25, 2026', author: 'Amit Patel' },
                  { version: 'v1', status: 'Archived', date: 'Jun 10, 2026', author: 'Sneha Reddy' },
                ].map((v) => (
                  <div key={v.version} className="flex items-center justify-between rounded-lg border px-4 py-3">
                    <div className="flex items-center gap-3">
                      <Badge
                        variant={v.status === 'Published' ? 'default' : v.status === 'Draft' ? 'secondary' : 'outline'}
                      >
                        {v.status}
                      </Badge>
                      <div>
                        <p className="text-sm font-medium">{v.version}</p>
                        <p className="text-xs text-muted-foreground">{v.date} · {v.author}</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="ghost" size="sm"><Eye className="h-4 w-4" /></Button>
                      {v.status !== 'Published' && (
                        <Button variant="outline" size="sm">Restore</Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="sticky bottom-4 flex justify-end gap-2 rounded-lg border bg-card/95 p-3 shadow-lg backdrop-blur">
        <Button variant="outline" size="sm">
          <Archive className="mr-2 h-4 w-4" />
          Save Draft
        </Button>
        <Button variant="outline" size="sm">
          <Eye className="mr-2 h-4 w-4" />
          Preview
        </Button>
        <Button size="sm">
          <Save className="mr-2 h-4 w-4" />
          Publish
        </Button>
      </div>
    </div>
  );
}

function CmsContentPlaceholder({
  section,
  tab,
  isNew,
  listLabel,
}: {
  section: string;
  tab: string;
  isNew?: boolean;
  listLabel?: string;
}) {
  if (isNew) {
    return (
      <div className="rounded-lg border border-dashed p-8 text-center">
        <p className="text-sm text-muted-foreground">
          Content editor for new {listLabel?.toLowerCase() ?? 'item'} will connect to the CMS API.
          Fields, validation, and media picker are ready to wire to <code className="text-xs">/api/v1/cms</code>.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {[1, 2, 3].map((i) => (
        <div key={i} className="flex items-center justify-between rounded-lg border px-4 py-3">
          <div>
            <p className="text-sm font-medium">{section} — {tab} Item {i}</p>
            <p className="text-xs text-muted-foreground">Last updated 2 days ago · Published</p>
          </div>
          <div className="flex gap-2">
            <Button variant="ghost" size="sm">Edit</Button>
            <Button variant="ghost" size="sm" className="text-destructive">Delete</Button>
          </div>
        </div>
      ))}
      <p className="text-center text-xs text-muted-foreground">
        Content loads dynamically from the database via CMS API. Connect your hotel tenant to see live data.
      </p>
    </div>
  );
}
