'use client';

import { Building2 } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useState } from 'react';
import toast from 'react-hot-toast';

import { AuthCard } from '@/components/auth/auth-shell';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { asRoute } from '@/lib/navigation';

interface HotelOption {
  id: string;
  name: string;
  city: string;
}

const MOCK_HOTELS: HotelOption[] = [
  { id: '1', name: 'Tunga International', city: 'Mumbai' },
  { id: '2', name: 'Tunga Residency', city: 'Pune' },
];

export function ChooseHotelForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get('redirect') ?? '/app/dashboard';
  const [selected, setSelected] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleContinue = async () => {
    if (!selected) return;
    setIsSubmitting(true);
    try {
      // API: POST /auth/select-hotel { hotelId }
      toast.success('Hotel selected');
      router.push(asRoute(redirect));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AuthCard title="Select Hotel" description="Choose which property to access">
      <div className="space-y-3">
        {MOCK_HOTELS.map((hotel) => (
          <button
            key={hotel.id}
            type="button"
            onClick={() => setSelected(hotel.id)}
            className={cn(
              'flex w-full items-center gap-4 rounded-tunga border p-4 text-left transition-colors hover:border-secondary',
              selected === hotel.id && 'border-secondary bg-secondary/5',
            )}
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-tunga-navy/10">
              <Building2 className="h-5 w-5 text-tunga-navy" />
            </div>
            <div>
              <p className="font-medium">{hotel.name}</p>
              <p className="text-sm text-muted-foreground">{hotel.city}</p>
            </div>
          </button>
        ))}
        <Button
          className="w-full"
          size="lg"
          disabled={!selected}
          isLoading={isSubmitting}
          onClick={handleContinue}
        >
          Continue
        </Button>
      </div>
    </AuthCard>
  );
}
