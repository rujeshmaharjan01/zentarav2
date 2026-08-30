export default function PackageDetailLoading() {
  return (
    <div className="container mx-auto px-4 py-8 pb-24 lg:pb-8">
      <div className="h-4 w-64 bg-muted animate-pulse rounded mb-6" />
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-8">
        <div className="space-y-10">
          <div className="aspect-video lg:aspect-[21/9] bg-muted animate-pulse rounded-xl" />
          <div className="space-y-4">
            <div className="h-8 w-3/4 bg-muted animate-pulse rounded" />
            <div className="flex gap-4">
              <div className="h-4 w-24 bg-muted animate-pulse rounded" />
              <div className="h-4 w-24 bg-muted animate-pulse rounded" />
              <div className="h-4 w-24 bg-muted animate-pulse rounded" />
            </div>
          </div>
          <div className="space-y-3">
            <div className="h-6 w-32 bg-muted animate-pulse rounded" />
            <div className="h-4 w-full bg-muted animate-pulse rounded" />
            <div className="h-4 w-full bg-muted animate-pulse rounded" />
            <div className="h-4 w-2/3 bg-muted animate-pulse rounded" />
          </div>
          <div className="space-y-3">
            <div className="h-6 w-28 bg-muted animate-pulse rounded" />
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-4 w-full bg-muted animate-pulse rounded" />
            ))}
          </div>
        </div>
        <div className="hidden lg:block">
          <div className="sticky top-20 rounded-xl border p-5 space-y-4">
            <div className="h-8 w-24 bg-muted animate-pulse rounded" />
            <div className="h-10 w-full bg-muted animate-pulse rounded" />
            <div className="h-10 w-full bg-muted animate-pulse rounded" />
            <div className="h-12 w-full bg-muted animate-pulse rounded" />
          </div>
        </div>
      </div>
    </div>
  );
}
