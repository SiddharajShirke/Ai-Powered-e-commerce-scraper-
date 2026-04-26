import { Skeleton } from "@/components/ui/skeleton"

export function SearchResultsSkeleton() {
  return (
    <div className="mx-auto max-w-4xl px-6 pb-12">
      <div className="space-y-4">
        {/* Best Deal Card Skeleton */}
        <div className="mb-12 flex flex-col overflow-hidden rounded-2xl bg-card shadow-xl shadow-pink/10 md:flex-row">
          <div className="flex items-center justify-center bg-gradient-to-br from-pink/10 to-purple/5 p-8 md:w-2/5">
            <Skeleton className="h-52 w-52 rounded-2xl" />
          </div>
          <div className="flex flex-1 flex-col justify-center gap-4 p-8">
            <Skeleton className="h-8 w-32" />
            <Skeleton className="h-10 w-40" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-40" />
              <Skeleton className="h-4 w-48" />
            </div>
            <Skeleton className="h-11 w-32 rounded-full" />
          </div>
        </div>

        {/* Ranked Offers Skeleton */}
        <h3 className="mb-6 font-serif text-2xl font-bold text-navy">Ranked Offers</h3>
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="flex flex-col gap-5 rounded-2xl bg-card p-5 shadow-sm sm:flex-row sm:items-center"
          >
            <div className="flex shrink-0 items-center gap-4">
              <Skeleton className="h-10 w-10 rounded-full" />
              <Skeleton className="h-16 w-16 rounded-xl" />
            </div>

            <div className="flex flex-1 flex-col gap-1 sm:flex-row sm:items-center sm:gap-8">
              <div className="min-w-[130px]">
                <Skeleton className="mb-2 h-5 w-24" />
                <Skeleton className="h-4 w-32" />
              </div>
              <Skeleton className="h-6 w-24" />
            </div>

            <div className="flex flex-col gap-1.5">
              {[1, 2, 3].map((j) => (
                <Skeleton key={j} className="h-4 w-40" />
              ))}
            </div>

            <div className="flex shrink-0 gap-3">
              <Skeleton className="h-10 w-10 rounded-full" />
              <Skeleton className="h-10 w-24 rounded-full" />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
