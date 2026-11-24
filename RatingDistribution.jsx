import React from 'react';
import { Star, Award, ShieldCheck, CheckCircle2 } from 'lucide-react';

export default function RatingDistribution({ ratingSummary }) {
  if (!ratingSummary || !ratingSummary.hasReviews) {
    return (
      <div className="p-6 rounded-3xl bg-brand-surface/70 border border-brand-border text-center space-y-2">
        <div className="w-10 h-10 rounded-2xl bg-white border border-brand-border mx-auto flex items-center justify-center text-amber-500">
          <Star className="w-5 h-5 text-zinc-300" />
        </div>
        <h4 className="font-bold text-sm text-brand-primary">No Verified Reviews Yet</h4>
        <p className="text-xs text-brand-secondary max-w-xs mx-auto">
          This cooperative artisan is newly verified. Completed dispatch ratings will appear here directly after customer sign-off.
        </p>
      </div>
    );
  }

  const { averageRating, reviewsCount, distribution, categories } = ratingSummary;

  return (
    <div className="p-6 rounded-3xl bg-white border border-brand-border space-y-6">
      {/* Top Summary */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-brand-border/60">
        <div className="flex items-center gap-4">
          <div className="text-center px-4 py-2.5 rounded-2xl bg-amber-50 border border-amber-200/80">
            <span className="font-display font-black text-3xl sm:text-4xl text-amber-900 block leading-none">
              {averageRating}
            </span>
            <div className="flex items-center justify-center gap-0.5 mt-1">
              {[1, 2, 3, 4, 5].map((s) => (
                <Star
                  key={s}
                  className={`w-3.5 h-3.5 ${
                    s <= Math.round(averageRating)
                      ? 'fill-amber-400 text-amber-500'
                      : 'text-zinc-300'
                  }`}
                />
              ))}
            </div>
            <span className="text-[10px] text-amber-800 font-semibold block mt-0.5">
              out of 5 stars
            </span>
          </div>

          <div>
            <h4 className="font-display font-bold text-base sm:text-lg text-brand-primary flex items-center gap-2">
              <span>Verified Cooperative Satisfaction</span>
              <Award className="w-4 h-4 text-emerald-600" />
            </h4>
            <p className="text-xs text-brand-secondary mt-0.5">
              Calculated across <strong>{reviewsCount}</strong> verified customer reviews on completed jobs.
            </p>
            <div className="flex items-center gap-1.5 text-[11px] text-emerald-800 font-medium mt-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              <span>100% Genuine completed dispatches • Zero fabricated reviews</span>
            </div>
          </div>
        </div>
      </div>

      {/* 2-Column: Star Bar Distribution + Category Averages */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
        {/* Star Bars */}
        <div className="space-y-2">
          <h5 className="font-bold text-brand-primary uppercase tracking-wider text-[11px]">
            Rating Breakdown
          </h5>
          <div className="space-y-1.5">
            {[5, 4, 3, 2, 1].map((stars) => {
              const count = distribution[stars] || 0;
              const percentage = reviewsCount > 0 ? Math.round((count / reviewsCount) * 100) : 0;
              return (
                <div key={stars} className="flex items-center gap-2 text-xs">
                  <div className="w-12 flex items-center gap-1 font-semibold text-brand-secondary justify-end">
                    <span>{stars}</span>
                    <Star className="w-3 h-3 fill-amber-400 text-amber-500" />
                  </div>
                  <div className="flex-1 h-2 rounded-full bg-zinc-100 overflow-hidden">
                    <div
                      className="h-full bg-amber-400 rounded-full transition-all duration-500"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                  <div className="w-10 text-right text-[11px] font-mono text-brand-secondary">
                    {count} ({percentage}%)
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Category Ratings */}
        {categories && (
          <div className="space-y-2">
            <h5 className="font-bold text-brand-primary uppercase tracking-wider text-[11px]">
              Craft Category Averages
            </h5>
            <div className="space-y-2">
              {Object.entries(categories).map(([catKey, score]) => (
                <div
                  key={catKey}
                  className="flex items-center justify-between p-2 rounded-xl bg-brand-surface/50 border border-brand-border/60"
                >
                  <span className="capitalize text-brand-primary font-medium text-[11px]">
                    {catKey.replace(/_/g, ' ')}
                  </span>
                  <div className="flex items-center gap-1 font-bold text-brand-teal text-[11px]">
                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-500" />
                    <span>{score} / 5.0</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
