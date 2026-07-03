import { Skeleton } from '@/components/ui/skeleton';

export function ShellSkeleton() {
  return (
    <div className="flex min-h-screen bg-background">
      <div className="hidden w-64 flex-col border-r bg-sidebar p-4 lg:flex">
        <Skeleton className="mb-6 h-10 w-32" />
        {Array.from({ length: 8 }).map((_, i) => (
          <Skeleton key={i} className="mb-2 h-10 w-full" />
        ))}
      </div>
      <div className="flex flex-1 flex-col">
        <Skeleton className="h-16 w-full rounded-none" />
        <div className="space-y-4 p-6">
          <Skeleton className="h-8 w-48" />
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-28 w-full" />
            ))}
          </div>
          <Skeleton className="h-64 w-full" />
        </div>
      </div>
    </div>
  );
}
