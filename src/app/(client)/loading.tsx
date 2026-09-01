import { Skeleton } from "@/components/ui/skeleton";

export default function HomeLoading() {
  return (
    <div className="flex flex-col">
      <div className="h-150 sm:h-175 md:h-200">
        <Skeleton className="h-full w-full rounded-none" />
      </div>
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="mb-8 space-y-2">
            <Skeleton className="h-8 w-64" />
            <Skeleton className="h-4 w-80" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="rounded-xl border bg-card overflow-hidden">
                <Skeleton className="aspect-video rounded-none" />
                <div className="p-4 space-y-3">
                  <Skeleton className="h-5 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
