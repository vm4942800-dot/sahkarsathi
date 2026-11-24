import React from 'react';

export default function Badge({
  children,
  variant = 'teal', // 'teal' | 'emerald' | 'gold' | 'neutral' | 'dark'
  size = 'md', // 'sm' | 'md'
  icon: Icon,
  className = '',
}) {
  const sizeStyles = {
    sm: 'text-[11px] px-2.5 py-0.5 gap-1',
    md: 'text-xs px-3 py-1 gap-1.5',
  };

  const variantStyles = {
    teal: 'bg-brand-teal/10 text-brand-teal border border-brand-teal/20',
    emerald: 'bg-brand-emerald/10 text-brand-emerald border border-brand-emerald/20',
    gold: 'bg-brand-gold/15 text-[#9E7A31] border border-brand-gold/30',
    neutral: 'bg-brand-surface text-brand-secondary border border-brand-border',
    dark: 'bg-white/10 text-brand-surface border border-white/15',
  };

  return (
    <span
      className={`inline-flex items-center font-medium rounded-full tracking-wide select-none ${
        sizeStyles[size] || sizeStyles.md
      } ${variantStyles[variant] || variantStyles.teal} ${className}`}
    >
      {Icon && <Icon className="w-3.5 h-3.5 shrink-0" />}
      <span>{children}</span>
    </span>
  );
}
