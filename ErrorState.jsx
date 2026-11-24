import React from 'react';
import { motion } from 'framer-motion';
import { AlertCircle, RefreshCw, ArrowLeft } from 'lucide-react';
import Button from './Button';

export default function ErrorState({
  title = 'Something Went Wrong',
  description = 'An error occurred while loading this section. Please try again or return to safety.',
  onRetry,
  backUrl,
  backText = 'Go Back',
  className = '',
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`p-8 rounded-3xl bg-rose-50/60 border border-rose-200/80 text-center space-y-4 max-w-md mx-auto ${className}`}
      role="alert"
      aria-live="assertive"
    >
      <div className="w-12 h-12 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center mx-auto shadow-xs">
        <AlertCircle className="w-6 h-6" />
      </div>

      <div className="space-y-1">
        <h3 className="font-display font-bold text-lg text-brand-primary">{title}</h3>
        <p className="text-xs text-brand-secondary leading-relaxed">{description}</p>
      </div>

      <div className="pt-2 flex items-center justify-center gap-3">
        {onRetry && (
          <Button
            onClick={onRetry}
            variant="primary"
            size="sm"
            icon={RefreshCw}
            className="font-bold shadow-2xs"
          >
            Retry
          </Button>
        )}

        {backUrl && (
          <Button
            to={backUrl}
            variant="secondary"
            size="sm"
            icon={ArrowLeft}
            className="font-semibold"
          >
            {backText}
          </Button>
        )}
      </div>
    </motion.div>
  );
}
