'use client';

import { useEffect, useState } from 'react';
import { Crown, Loader2, Mail, Phone, Star } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PMS_API } from '@/features/pms/api/endpoints';
import { apiClient } from '@/services/api-client';

import type { PmsGuestProfile } from '@tungaos/shared';

export function PmsGuestProfileView({ guestId }: { guestId: string }) {
  const [profile, setProfile] = useState<PmsGuestProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiClient
      .get<{ data: PmsGuestProfile }>(PMS_API.guest(guestId))
      .then((r) => setProfile(r.data.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [guestId]);

  if (loading) {
    return (
      <div className="flex justify-center py-16">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!profile) {
    return <p className="py-8 text-center text-muted-foreground">Guest not found</p>;
  }

  return (
    <div className="mx-auto max-w-5xl space-y-6 px-4 lg:px-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex items-center gap-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-2xl font-serif text-primary">
            {profile.firstName[0]}
            {profile.lastName[0]}
          </div>
          <div>
            <h2 className="text-h2">
              {profile.firstName} {profile.lastName}
            </h2>
            <p className="text-sm text-muted-foreground">{profile.guestCode}</p>
            <div className="mt-2 flex flex-wrap gap-2">
              {profile.vipStatus && (
                <Badge className="gap-1">
                  <Crown className="h-3 w-3" /> VIP
                </Badge>
              )}
              {profile.isCorporate && <Badge variant="secondary">Corporate</Badge>}
              {profile.isBlacklisted && <Badge variant="danger">Blacklisted</Badge>}
              {profile.membershipTier && <Badge variant="outline">{profile.membershipTier}</Badge>}
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Contact</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            {profile.phone && (
              <p className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-muted-foreground" /> {profile.phone}
              </p>
            )}
            {profile.email && (
              <p className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-muted-foreground" /> {profile.email}
              </p>
            )}
            {profile.nationality && <p>Nationality: {profile.nationality}</p>}
            {profile.companyName && <p>Company: {profile.companyName}</p>}
            {profile.gstNumber && <p>GST: {profile.gstNumber}</p>}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Stay History</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <p className="flex items-center gap-2">
              <Star className="h-4 w-4 text-amber-500" />
              {profile.previousStays} previous stays
            </p>
            {profile.previousRooms.length > 0 && (
              <p>Previous rooms: {profile.previousRooms.join(', ')}</p>
            )}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Documents</CardTitle>
        </CardHeader>
        <CardContent>
          {profile.documents.length === 0 ? (
            <p className="text-sm text-muted-foreground">No documents on file</p>
          ) : (
            <ul className="space-y-2 text-sm">
              {profile.documents.map((d) => (
                <li key={d.id} className="flex justify-between border-b pb-2">
                  <span>{d.docType}</span>
                  <span className="text-muted-foreground">{d.docNumber ?? '—'}</span>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Reservations</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b text-left text-muted-foreground">
                  <th className="pb-2 pr-4">Code</th>
                  <th className="pb-2 pr-4">Dates</th>
                  <th className="pb-2 pr-4">Room</th>
                  <th className="pb-2 pr-4">Status</th>
                  <th className="pb-2">Amount</th>
                </tr>
              </thead>
              <tbody>
                {profile.reservations.map((r) => (
                  <tr key={r.id} className="border-b">
                    <td className="py-2 pr-4 font-mono text-xs">{r.reservationCode}</td>
                    <td className="py-2 pr-4">
                      {r.checkInDate} → {r.checkOutDate}
                    </td>
                    <td className="py-2 pr-4">{r.roomNumber ?? '—'}</td>
                    <td className="py-2 pr-4">{r.status}</td>
                    <td className="py-2">₹{r.totalAmount.toLocaleString('en-IN')}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
