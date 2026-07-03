import Link from 'next/link';
import {
  ArrowUpRight,
  BedDouble,
  Clock,
  Eye,
  FileEdit,
  MousePointerClick,
  Tag,
  TrendingUp,
  Users,
  UtensilsCrossed,
} from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CMS_BASE } from '@/features/cms/constants/cms-navigation';
import { CmsStatCard } from '@/features/cms/components/cms-stat-card';
import { asRoute } from '@/lib/navigation';

const RECENT_UPDATES = [
  { section: 'Hero Banner', editor: 'Priya Sharma', action: 'Published slide 3', time: '12 min ago' },
  { section: 'Rooms', editor: 'Amit Patel', action: 'Updated Deluxe Suite pricing', time: '45 min ago' },
  { section: 'Offers', editor: 'Sneha Reddy', action: 'Created Weekend Escape offer', time: '2 hours ago' },
  { section: 'Gallery', editor: 'Ravi Kumar', action: 'Uploaded 12 pool images', time: '3 hours ago' },
  { section: 'SEO', editor: 'Anita Desai', action: 'Updated homepage meta', time: '5 hours ago' },
];

const POPULAR_PAGES = [
  { page: 'Homepage', views: '4,218', path: '/' },
  { page: 'Rooms & Suites', views: '2,847', path: '/rooms' },
  { page: 'Special Offers', views: '1,923', path: '/offers' },
  { page: 'Dining', views: '1,456', path: '/dining' },
  { page: 'Book Now', views: '1,102', path: '/book' },
];

const QUICK_LINKS = [
  { label: 'Edit Homepage', href: `${CMS_BASE}/homepage` },
  { label: 'Manage Hero', href: `${CMS_BASE}/hero` },
  { label: 'Add Room', href: `${CMS_BASE}/rooms` },
  { label: 'Upload Media', href: `${CMS_BASE}/media` },
  { label: 'SEO Settings', href: `${CMS_BASE}/seo` },
];

export function CmsDashboard() {
  return (
    <div className="mx-auto max-w-7xl space-y-8 px-4 lg:px-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-h2">Website CMS Dashboard</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Manage every section of your hotel website — no developer required.
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" asChild>
            <a href="/" target="_blank" rel="noopener noreferrer">
              <Eye className="mr-2 h-4 w-4" />
              Preview Site
            </a>
          </Button>
          <Button size="sm" asChild>
            <Link href={asRoute(`${CMS_BASE}/homepage`)}>
              <FileEdit className="mr-2 h-4 w-4" />
              Edit Homepage
            </Link>
          </Button>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <CmsStatCard title="Website Visitors" value="12,847" change="+18.2% vs last month" changeType="positive" icon={Users} />
        <CmsStatCard title="Today's Visitors" value="342" change="+24 since yesterday" changeType="positive" icon={Eye} />
        <CmsStatCard title="CTA Clicks" value="1,284" change="+8.4% this week" changeType="positive" icon={MousePointerClick} />
        <CmsStatCard title="Conversion Rate" value="3.8%" change="+0.6% improvement" changeType="positive" icon={TrendingUp} />
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <CmsStatCard title="Published Pages" value="24" icon={FileEdit} />
        <CmsStatCard title="Draft Pages" value="3" change="2 awaiting approval" changeType="neutral" icon={Clock} />
        <CmsStatCard title="Popular Room" value="Deluxe Suite" change="847 views" changeType="neutral" icon={BedDouble} />
        <CmsStatCard title="Top Restaurant" value="Azure Restaurant" change="456 menu views" changeType="neutral" icon={UtensilsCrossed} />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-lg">Popular Pages</CardTitle>
            <CardDescription>Most visited pages on your hotel website</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {POPULAR_PAGES.map((page, i) => (
                <div key={page.path} className="flex items-center justify-between rounded-lg border px-4 py-3">
                  <div className="flex items-center gap-3">
                    <span className="flex h-7 w-7 items-center justify-center rounded-full bg-muted text-xs font-medium">
                      {i + 1}
                    </span>
                    <div>
                      <p className="text-sm font-medium">{page.page}</p>
                      <p className="text-xs text-muted-foreground">{page.path}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-sm text-muted-foreground">{page.views} views</span>
                    <a href={page.path} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-foreground">
                      <ArrowUpRight className="h-4 w-4" />
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Quick Actions</CardTitle>
            <CardDescription>Jump to common CMS tasks</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            {QUICK_LINKS.map((link) => (
              <Button key={link.href} variant="outline" size="sm" className="w-full justify-start" asChild>
                <Link href={asRoute(link.href)}>{link.label}</Link>
              </Button>
            ))}
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Recent Updates</CardTitle>
            <CardDescription>Latest content changes by your team</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {RECENT_UPDATES.map((update) => (
                <div key={`${update.section}-${update.time}`} className="flex items-start justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary" className="text-[10px]">{update.section}</Badge>
                      <span className="text-xs text-muted-foreground">{update.time}</span>
                    </div>
                    <p className="mt-1 text-sm">{update.action}</p>
                    <p className="text-xs text-muted-foreground">by {update.editor}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Content Overview</CardTitle>
            <CardDescription>Published content across website sections</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              {[
                { label: 'Hero Slides', count: 4, href: `${CMS_BASE}/hero` },
                { label: 'Rooms', count: 8, href: `${CMS_BASE}/rooms` },
                { label: 'Offers', count: 6, href: `${CMS_BASE}/offers` },
                { label: 'Gallery Items', count: 124, href: `${CMS_BASE}/gallery` },
                { label: 'Testimonials', count: 18, href: `${CMS_BASE}/testimonials` },
                { label: 'Blog Posts', count: 12, href: `${CMS_BASE}/blog` },
              ].map((item) => (
                <Link
                  key={item.label}
                  href={asRoute(item.href)}
                  className="rounded-lg border p-4 transition-colors hover:bg-muted/50"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">{item.label}</span>
                    <Tag className="h-3.5 w-3.5 text-muted-foreground" />
                  </div>
                  <p className="mt-1 text-2xl font-bold">{item.count}</p>
                </Link>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
