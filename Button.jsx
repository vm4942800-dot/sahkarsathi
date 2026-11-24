import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Loader2 } from 'lucide-react';

export default function Button({
  children,
  variant = 'primary', // 'primary' | 'secondary' | 'dark' | 'outline' | 'ghost' | 'gold'
  size = 'md', // 'sm' | 'md' | 'lg'
  to,
  href,
  onClick,
  type = 'button',
  disabled = false,
  loading = false,
  icon: Icon,
  iconPosition = 'left',
  className = '',
  ...props
}) {
  const baseStyles = "relative inline-flex items-center justify-center font-medium rounded-xl transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none select-none";

  const sizeStyles = {
    sm: "text-xs px-3.5 py-2 gap-1.5",
    md: "text-sm px-5 py-2.5 gap-2",
    lg: "text-base px-6 py-3.5 gap-2.5",
  };

  const variantStyles = {
    primary: "bg-brand-teal text-white hover:bg-brand-teal-light shadow-sm hover:shadow-premium-hover active:scale-[0.98] focus-visible:ring-brand-teal",
    secondary: "bg-brand-surface text-brand-primary border border-brand-border hover:bg-white hover:border-brand-teal/40 active:scale-[0.98] focus-visible:ring-brand-teal",
    dark: "bg-brand-dark text-brand-surface hover:bg-brand-dark-elevated border border-white/10 active:scale-[0.98] shadow-subtle focus-visible:ring-brand-teal",
    gold: "bg-brand-gold text-brand-dark hover:bg-brand-gold-light font-semibold shadow-sm active:scale-[0.98] focus-visible:ring-brand-gold",
    outline: "bg-transparent border border-brand-teal/40 text-brand-teal hover:bg-brand-teal/10 active:scale-[0.98] focus-visible:ring-brand-teal",
    ghost: "bg-transparent text-brand-primary hover:bg-brand-surface/70 active:scale-[0.98] focus-visible:ring-brand-teal",
  };

  const combinedClasses = `${baseStyles} ${sizeStyles[size] || sizeStyles.md} ${variantStyles[variant] || variantStyles.primary} ${className}`;

  const innerContent = (
    <>
      {loading ? (
        <Loader2 className="w-4 h-4 animate-spin" />
      ) : (
        <>
          {Icon && iconPosition === 'left' && <Icon className="w-4 h-4 shrink-0 transition-transform group-hover:-translate-x-0.5" />}
          <span>{children}</span>
          {Icon && iconPosition === 'right' && <Icon className="w-4 h-4 shrink-0 transition-transform group-hover:translate-x-0.5" />}
        </>
      )}
    </>
  );

  if (to) {
    return (
      <Link to={to} className={`group ${combinedClasses}`} {...props}>
        {innerContent}
      </Link>
    );
  }

  if (href) {
    return (
      <a href={href} className={`group ${combinedClasses}`} {...props}>
        {innerContent}
      </a>
    );
  }

  return (
    <motion.button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      whileTap={{ scale: disabled ? 1 : 0.98 }}
      className={`group ${combinedClasses}`}
      {...props}
    >
      {innerContent}
    </motion.button>
  );
}
