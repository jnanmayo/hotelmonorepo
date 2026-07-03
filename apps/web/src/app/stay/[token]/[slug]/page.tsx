import StaySlugClient from '@/app/stay/[token]/[slug]/StaySlugClient';

export default async function StaySlugPage({
  params,
}: {
  params: Promise<{
    token: string;
    slug: string;
  }>;
}) {
  const { token, slug } = await params;

  return <StaySlugClient token={token} slug={slug} />;
}
