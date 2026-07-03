import { cn } from '@/lib/utils';

interface LoaderProps {
  className?: string;
  label?: string;
}

export function Loader({ className, label = 'Loading...' }: LoaderProps) {
  return (
    <div className={cn('flex flex-col items-center justify-center gap-3', className)}>
      <div className="h-10 w-10 animate-spin rounded-full border-2 border-muted border-t-secondary" />
      <p className="text-sm text-muted-foreground">{label}</p>
    </div>
  );
}

export function PageLoader({ label = 'Loading...' }: { label?: string }) {
  return (
    <div className="flex min-h-[50vh] items-center justify-center">
      <Loader label={label} />
    </div>
  );
}
