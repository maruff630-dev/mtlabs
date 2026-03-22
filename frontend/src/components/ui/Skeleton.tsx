"use client";

import React from 'react';

// Common shimmer animation keyframes globally injected once
const shimmerStyles = `
  @keyframes shimmer {
    0% { transform: translateX(-100%); }
    100% { transform: translateX(100%); }
  }
  .animate-shimmer {
    animation: shimmer 1.5s infinite;
  }
`;

export function Skeleton({ className = "", ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: shimmerStyles }} />
      <div
        className={`relative overflow-hidden bg-slate-200/60 dark:bg-slate-800/60 rounded-[16px] ${className}`}
        {...props}
      >
        <div className="absolute inset-0 z-10 animate-shimmer bg-gradient-to-r from-transparent via-white/50 dark:via-white/10 to-transparent" />
      </div>
    </>
  );
}

export function SkeletonText({ lines = 1, className = "" }: { lines?: number, className?: string }) {
  return (
    <div className={`space-y-3 ${className}`}>
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton 
          key={i} 
          className={`h-4 w-full ${i === lines - 1 && lines > 1 ? 'max-w-[70%]' : ''} rounded-md`} 
        />
      ))}
    </div>
  );
}

export function SkeletonProfile({ className = "" }: { className?: string }) {
  return (
    <div className={`flex items-center gap-4 ${className}`}>
      <Skeleton className="h-12 w-12 rounded-full shrink-0" />
      <div className="space-y-2 flex-1 max-w-[120px]">
        <Skeleton className="h-4 w-full rounded-md" />
        <Skeleton className="h-3 w-2/3 rounded-md" />
      </div>
    </div>
  );
}

export function SkeletonCard({ className = "" }: { className?: string }) {
  return (
    <div className={`p-6 bg-white dark:bg-slate-900 rounded-[24px] border border-slate-100 dark:border-slate-800 shadow-sm flex flex-col ${className}`}>
      <Skeleton className="h-12 w-12 rounded-[14px] mb-5" />
      <Skeleton className="h-6 w-3/4 rounded-md mb-3" />
      <SkeletonText lines={2} className="mb-6 flex-1" />
      <Skeleton className="h-10 w-full rounded-xl mt-auto" />
    </div>
  );
}

export function SkeletonBanner({ className = "" }: { className?: string }) {
  return (
    <div className={`w-full overflow-hidden rounded-[24px] ${className}`}>
      <Skeleton className="w-full h-full min-h-[160px]" />
    </div>
  );
}

export function SkeletonDetails({ className = "" }: { className?: string }) {
  return (
    <div className={`space-y-6 ${className}`}>
      <SkeletonBanner className="h-48 md:h-64" />
      <div className="space-y-4">
        <Skeleton className="h-8 w-3/4 md:w-1/2 rounded-lg" />
        <SkeletonText lines={4} />
      </div>
    </div>
  );
}

export function SkeletonStatCard({ className = "" }: { className?: string }) {
  return (
    <div className={`p-6 bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm flex flex-col justify-between ${className}`}>
       <div className="flex justify-between items-center mb-4">
         <Skeleton className="w-12 h-12 rounded-2xl" />
         <Skeleton className="w-16 h-8 rounded-lg" />
       </div>
       <Skeleton className="w-24 h-4 rounded-md" />
    </div>
  );
}
