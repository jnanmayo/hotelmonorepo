'use client';

import { Shield } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useState } from 'react';
import toast from 'react-hot-toast';

import { AuthCard } from '@/components/auth/auth-shell';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { asRoute } from '@/lib/navigation';

import { ROLE_LABELS } from '@tungaos/shared/constants';

const MOCK_ROLES = ['GENERAL_MANAGER', 'RECEPTIONIST', 'FINANCE'] as const;

export function ChooseRoleForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get('redirect') ?? '/app/dashboard';
  const [selected, setSelected] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleContinue = async () => {
    if (!selected) return;
    setIsSubmitting(true);
    try {
      // API: POST /auth/select-role { roleCode }
      toast.success('Role selected');
      router.push(asRoute(redirect));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AuthCard title="Select Role" description="Choose your active role for this session">
      <div className="space-y-3">
        {MOCK_ROLES.map((role) => (
          <button
            key={role}
            type="button"
            onClick={() => setSelected(role)}
            className={cn(
              'flex w-full items-center gap-4 rounded-tunga border p-4 text-left transition-colors hover:border-secondary',
              selected === role && 'border-secondary bg-secondary/5',
            )}
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-tunga-navy/10">
              <Shield className="h-5 w-5 text-tunga-navy" />
            </div>
            <p className="font-medium">{ROLE_LABELS[role] ?? role}</p>
          </button>
        ))}
        <Button
          className="w-full"
          size="lg"
          disabled={!selected}
          isLoading={isSubmitting}
          onClick={handleContinue}
        >
          Continue to Dashboard
        </Button>
      </div>
    </AuthCard>
  );
}
