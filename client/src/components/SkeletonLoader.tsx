import React from 'react';

interface SkeletonProps {
  className?: string;
}

export const Skeleton: React.FC<SkeletonProps> = ({ className = 'h-4 w-full' }) => {
  return <div className={`skeleton-shimmer ${className}`} />;
};

export const CardSkeleton: React.FC = () => {
  return (
    <div className="bg-[#FAF8F3] dark:bg-[#161616] border border-[#E5E0D8] dark:border-[#262626] p-5 space-y-4 rounded-none">
      <div className="flex items-center justify-between">
        <Skeleton className="h-5 w-24" />
        <Skeleton className="h-4 w-16" />
      </div>
      <Skeleton className="h-6 w-3/4" />
      <div className="space-y-2">
        <Skeleton className="h-3.5 w-full" />
        <Skeleton className="h-3.5 w-4/5" />
      </div>
      <div className="pt-2 flex items-center justify-between">
        <Skeleton className="h-4 w-28" />
        <Skeleton className="h-8 w-24 rounded-none" />
      </div>
    </div>
  );
};

export const StatCardSkeleton: React.FC = () => {
  return (
    <div className="bg-[#FAF8F3] dark:bg-[#161616] border border-[#E5E0D8] dark:border-[#262626] p-5 space-y-3 rounded-none">
      <Skeleton className="h-3.5 w-24" />
      <Skeleton className="h-8 w-16" />
      <Skeleton className="h-3 w-32" />
    </div>
  );
};

export const ListItemSkeleton: React.FC = () => {
  return (
    <div className="p-4 flex items-center justify-between gap-4 border-b border-[#E5E0D8] dark:border-[#262626]">
      <div className="flex items-center gap-3 flex-1">
        <Skeleton className="w-10 h-10 rounded-none shrink-0" />
        <div className="space-y-1.5 flex-1 max-w-md">
          <Skeleton className="h-4 w-3/5" />
          <Skeleton className="h-3 w-2/5" />
        </div>
      </div>
      <Skeleton className="h-6 w-20 rounded-none shrink-0" />
    </div>
  );
};
