import { redirect } from 'next/navigation';

export default function VendorsRedirectPage() {
  redirect('/app/procurement/vendors');
}
