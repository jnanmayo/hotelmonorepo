import type { Metadata } from 'next';
import Link from 'next/link';

import { PageHero } from '@/components/layouts/page-hero';
import { Button } from '@/components/ui/button';
import { PUBLIC_ROUTES } from '@/constants/routes';
import { getWebsiteContent } from '@/features/website/services/content.service';
import { asRoute } from '@/lib/navigation';

export async function generateMetadata(): Promise<Metadata> {
  const content = await getWebsiteContent();
  return {
    title: `Careers | ${content.hotelName}`,
    description: `Join the team at ${content.hotelName}. Explore career opportunities in hospitality.`,
  };
}

const OPEN_POSITIONS = [
  { title: 'Front Office Manager', department: 'Operations', type: 'Full-time' },
  { title: 'Sous Chef', department: 'Culinary', type: 'Full-time' },
  { title: 'Guest Relations Executive', department: 'Front Office', type: 'Full-time' },
  { title: 'Housekeeping Supervisor', department: 'Housekeeping', type: 'Full-time' },
  { title: 'Marketing Coordinator', department: 'Sales & Marketing', type: 'Full-time' },
];

export default async function CareersPage() {
  const content = await getWebsiteContent();

  return (
    <>
      <PageHero
        eyebrow="Join Our Team"
        title="Careers"
        subtitle="Build your hospitality career with a team that values excellence."
        imageUrl={content.hero.imageUrl}
      />
      <section className="py-16">
        <div className="mx-auto max-w-3xl px-4 lg:px-8">
          <p className="text-lg text-muted-foreground">
            At {content.hotelName}, we believe our people are our greatest asset. We offer competitive benefits,
            growth opportunities, and a culture of genuine hospitality.
          </p>

          <h2 className="mt-12 font-heading text-2xl font-semibold">Open Positions</h2>
          <div className="mt-6 space-y-4">
            {OPEN_POSITIONS.map((job) => (
              <div key={job.title} className="flex items-center justify-between rounded-xl border p-5">
                <div>
                  <h3 className="font-medium">{job.title}</h3>
                  <p className="text-sm text-muted-foreground">{job.department} · {job.type}</p>
                </div>
                <Button variant="outline" size="sm" asChild>
                  <Link href={asRoute(PUBLIC_ROUTES.contact)}>Apply</Link>
                </Button>
              </div>
            ))}
          </div>

          <p className="mt-8 text-sm text-muted-foreground">
            Don&apos;t see a matching role? Send your resume to{' '}
            <a href={`mailto:careers@${content.contact.email.split('@')[1]}`} className="text-primary underline">
              careers@{content.contact.email.split('@')[1]}
            </a>
          </p>
        </div>
      </section>
    </>
  );
}
