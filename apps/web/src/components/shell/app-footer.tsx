import { brand } from '@/theme/tokens';

export function AppFooter() {
  const version = process.env.NEXT_PUBLIC_APP_VERSION ?? '0.1.0';
  const env = process.env.NODE_ENV === 'production' ? 'Production' : 'Development';

  return (
    <footer className="border-t bg-card px-4 py-3 lg:px-6">
      <div className="flex flex-col items-center justify-between gap-2 text-xs text-muted-foreground sm:flex-row">
        <p>
          Powered by <span className="font-medium text-foreground">{brand.vendor}</span>
        </p>
        <div className="flex items-center gap-4">
          <span>{brand.name} v{version}</span>
          <span>{env}</span>
          <span className="flex items-center gap-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-success" aria-hidden />
            All systems operational
          </span>
        </div>
      </div>
    </footer>
  );
}
