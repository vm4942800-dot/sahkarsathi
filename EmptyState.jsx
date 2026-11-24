import React from 'react';
import { motion } from 'framer-motion';
import { FolderOpen, ArrowRight } from 'lucide-react';
import Button from './Button';

export default function EmptyState({
  title = 'No Records Found',
  description = 'There are no active records in this section right now.',
  icon: Icon = FolderOpen,
  actionLabel,
  actionTo,
  onAction,
  className = '',
}) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      className={`p-10 rounded-3xl bg-white border border-brand-border text-center space-y-4 max-w-md mx-auto shadow-2xs ${className}`}
    >
      <div className="w-14 h-14 rounded-2xl bg-brand-surface border border-brand-border flex items-center justify-center mx-auto text-brand-teal shadow-2xs">
        <Icon className="w-7 h-7" />
      </div>

      <div className="space-y-1">
        <h3 className="font-display font-bold text-lg text-brand-primary">{title}</h3>
        <p className="text-xs text-brand-secondary leading-relaxed max-w-xs mx-auto">
          {description}
        </p>
      </div>

      {(actionLabel && (actionTo || onAction)) && (
        <div className="pt-2">
          {actionTo ? (
            <Button
              to={actionTo}
              variant="primary"
              size="sm"
              icon={ArrowRight}
              iconPosition="right"
              className="font-bold shadow-2xs"
            >
              {actionLabel}
            </Button>
          ) : (
            <Button
              onClick={onAction}
              variant="primary"
              size="sm"
              icon={ArrowRight}
              iconPosition="right"
              className="font-bold shadow-2xs"
            >
              {actionLabel}
            </Button>
          )}
        </div>
      )}
    </motion.div>
  );
}
