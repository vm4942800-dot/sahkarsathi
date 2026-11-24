import React from 'react';

export default function SkeletonCard({ lines = 3, hasAvatar = false, className = '' }) {
  return (
    <div
      className={`p-5 rounded-3xl bg-white border border-brand-border/70 space-y-3.5 animate-pulse ${className}`}
      aria-hidden="true"
    >
      {hasAvatar && (
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-zinc-200" />
          <div className="space-y-1.5 flex-1">
            <div className="h-3.5 bg-zinc-200 rounded-md w-1/3" />
            <div className="h-2.5 bg-zinc-100 rounded-md w-1/4" />
          </div>
        </div>
      )}

      <div className="space-y-2">
        {Array.from({ length: lines }).map((_, i) => (
          <div
            key={i}
            className="h-3 bg-zinc-100 rounded-md"
            style={{ width: i === lines - 1 ? '60%' : '100%' }}
          />
        ))}
      </div>

      <div className="pt-2 flex items-center justify-between border-t border-brand-border/40">
        <div className="h-3 bg-zinc-100 rounded-md w-1/4" />
        <div className="h-6 bg-zinc-200 rounded-xl w-20" />
      </div>
    </div>
  );
}
