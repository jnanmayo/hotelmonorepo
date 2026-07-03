'use client';

import { Eye, EyeOff } from 'lucide-react';
import { useMemo, useState } from 'react';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';

interface PasswordFieldProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: string;
  error?: string;
  showStrength?: boolean;
  value?: string;
}

function getStrengthScore(password: string): number {
  let score = 0;
  if (password.length >= 12) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[a-z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) score++;
  return score;
}

const strengthLabels = ['Very Weak', 'Weak', 'Fair', 'Good', 'Strong'];
const strengthColors = [
  'bg-destructive',
  'bg-orange-500',
  'bg-yellow-500',
  'bg-lime-500',
  'bg-green-600',
];

export function PasswordField({
  label = 'Password',
  error,
  showStrength = false,
  value = '',
  className,
  id = 'password',
  ...props
}: PasswordFieldProps) {
  const [visible, setVisible] = useState(false);
  const score = useMemo(() => getStrengthScore(value), [value]);

  return (
    <div className={cn('space-y-2', className)}>
      <Label htmlFor={id}>{label}</Label>
      <div className="relative">
        <Input
          id={id}
          type={visible ? 'text' : 'password'}
          error={error}
          value={value}
          autoComplete="current-password"
          className="pr-11"
          {...props}
        />
        <button
          type="button"
          onClick={() => setVisible((v) => !v)}
          className="absolute right-3 top-3 text-muted-foreground hover:text-foreground"
          aria-label={visible ? 'Hide password' : 'Show password'}
        >
          {visible ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
        </button>
      </div>
      {showStrength && value.length > 0 && (
        <div className="space-y-1">
          <div className="flex gap-1">
            {Array.from({ length: 5 }).map((_, i) => (
              <div
                key={i}
                className={cn('h-1 flex-1 rounded-full bg-muted', i < score && strengthColors[score - 1])}
              />
            ))}
          </div>
          <p className="text-xs text-muted-foreground">
            Strength: {strengthLabels[Math.max(0, score - 1)]}
          </p>
        </div>
      )}
    </div>
  );
}
