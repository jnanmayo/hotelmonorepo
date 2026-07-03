import StayHomeClient from '@/app/stay/[token]/StayHomeClient';

export default async function StayHomePage({
  params,
}: {
  params: Promise<{
    token: string;
  }>;
}) {
  const { token } = await params;

  return <StayHomeClient token={token} />;
}
