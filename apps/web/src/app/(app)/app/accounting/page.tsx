import { redirect } from 'next/navigation';

export default function AccountingRedirectPage() {
  redirect('/app/finance/chart-of-accounts');
}
