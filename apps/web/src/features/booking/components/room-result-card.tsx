'use client';

import Image from 'next/image';
import Link from 'next/link';
import { BedDouble, Coffee, Shield, Users } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import type { AvailableRoom } from '@tungaos/shared/types';
import { buildSearchParams, useBookingStore } from '@/features/booking/stores/booking.store';
import { asRoute } from '@/lib/navigation';
import { isOptimizableImageUrl, resolveImageUrl } from '@/lib/image-url';

interface RoomResultCardProps {
  room: AvailableRoom;
}

export function RoomResultCard({ room }: RoomResultCardProps) {
  const search = useBookingStore((s) => s.search);
  const selectRoom = useBookingStore((s) => s.selectRoom);
  const params = buildSearchParams(search);
  const image = resolveImageUrl(typeof room.images[0] === 'string' ? room.images[0] : null, 'room');
  const bestPlan = room.ratePlans[0];

  return (
    <Card className="overflow-hidden transition-shadow hover:shadow-tunga-lg">
      <div className="grid md:grid-cols-5">
        <div className="relative aspect-[4/3] md:col-span-2 md:aspect-auto md:min-h-[220px]">
          <Image src={image} alt={room.name} fill className="object-cover" sizes="(max-width:768px) 100vw, 40vw" unoptimized={!isOptimizableImageUrl(image)} />
          {room.offerBadge && (
            <Badge className="absolute left-3 top-3 bg-tunga-gold text-tunga-navy">{room.offerBadge}</Badge>
          )}
        </div>
        <CardContent className="flex flex-col justify-between p-6 md:col-span-3">
          <div>
            <h3 className="font-heading text-xl font-semibold text-tunga-navy">{room.name}</h3>
            <div className="mt-2 flex flex-wrap gap-3 text-sm text-muted-foreground">
              {room.sizeSqm && <span>{room.sizeSqm} m²</span>}
              {room.bedType && (
                <span className="flex items-center gap-1"><BedDouble className="h-3.5 w-3.5" />{room.bedType}</span>
              )}
              <span className="flex items-center gap-1"><Users className="h-3.5 w-3.5" />Up to {room.maxOccupancy}</span>
              {room.breakfastIncluded && (
                <span className="flex items-center gap-1 text-emerald-700"><Coffee className="h-3.5 w-3.5" />Breakfast</span>
              )}
            </div>
            <p className="mt-3 line-clamp-2 text-sm text-muted-foreground">{room.description}</p>
            <div className="mt-3 flex flex-wrap gap-1.5">
              {room.amenities.slice(0, 4).map((a) => (
                <Badge key={a} variant="secondary" className="text-[10px] font-normal">{a}</Badge>
              ))}
            </div>
            <p className="mt-2 flex items-center gap-1 text-xs text-muted-foreground">
              <Shield className="h-3.5 w-3.5" />
              {room.cancellationPolicy.replace(/_/g, ' ')}
            </p>
          </div>

          <div className="mt-6 flex items-end justify-between gap-4">
            <div>
              {room.originalPrice && (
                <p className="text-sm text-muted-foreground line-through">
                  ₹{room.originalPrice.toLocaleString('en-IN')}
                </p>
              )}
              <p className="text-2xl font-bold text-tunga-navy">
                ₹{room.lowestPrice.toLocaleString('en-IN')}
              </p>
              <p className="text-xs text-muted-foreground">total incl. taxes · {room.availableCount} left</p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" asChild>
                <Link href={asRoute(`/book/rooms/${room.roomTypeId}?${params}`)}>View Details</Link>
              </Button>
              <Button
                size="sm"
                className="bg-tunga-navy hover:bg-tunga-gold hover:text-tunga-navy"
                asChild
              >
                <Link
                  href={asRoute(`/book/checkout?${params}`)}
                  onClick={() => bestPlan && selectRoom(room.roomTypeId, bestPlan)}
                >
                  Book Now
                </Link>
              </Button>
            </div>
          </div>
        </CardContent>
      </div>
    </Card>
  );
}
