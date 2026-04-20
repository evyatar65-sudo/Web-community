interface SkeletonProps {
  className?: string;
}

export function Skeleton({ className = "" }: SkeletonProps) {
  return (
    <div className={`animate-pulse bg-gray-200 rounded ${className}`} />
  );
}

export function MemberCardSkeleton() {
  return (
    <div className="card-green-accent p-5">
      <div className="flex items-start gap-4">
        <Skeleton className="w-14 h-14 rounded-full shrink-0" />
        <div className="flex-1">
          <Skeleton className="h-4 w-3/4 mb-2" />
          <Skeleton className="h-3 w-1/2 mb-3" />
          <Skeleton className="h-3 w-2/3 mb-1.5" />
          <Skeleton className="h-3 w-1/2" />
        </div>
      </div>
    </div>
  );
}

export function EventCardSkeleton() {
  return (
    <div className="card p-5">
      <div className="flex items-start gap-4">
        <Skeleton className="w-14 h-16 rounded-lg shrink-0" />
        <div className="flex-1">
          <Skeleton className="h-5 w-3/4 mb-2" />
          <Skeleton className="h-3 w-1/2 mb-1.5" />
          <Skeleton className="h-3 w-2/3 mb-1.5" />
          <Skeleton className="h-3 w-1/3" />
        </div>
      </div>
    </div>
  );
}

export function PageHeroSkeleton() {
  return (
    <div className="pt-32 pb-20 px-4 hero-texture" style={{ backgroundColor: "#1a2e1a" }}>
      <div className="max-w-xl mx-auto text-center">
        <Skeleton className="h-12 w-2/3 mx-auto mb-4 bg-white/10" />
        <Skeleton className="h-5 w-1/2 mx-auto bg-white/10" />
      </div>
    </div>
  );
}
