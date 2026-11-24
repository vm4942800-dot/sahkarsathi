import React from 'react';
import { Link } from 'react-router-dom';
import { BRAND } from '../../config/brand';

export default function Logo({
  size = 'md',
  showText = true,
  variant = 'auto', // 'auto' | 'light' | 'dark'
  asLink = true,
  className = '',
}) {
  const sizeMap = {
    sm: { icon: 32, text: 'text-lg', sub: 'text-[10px]' },
    md: { icon: 40, text: 'text-xl', sub: 'text-xs' },
    lg: { icon: 52, text: 'text-2xl', sub: 'text-sm' },
    xl: { icon: 64, text: 'text-3xl', sub: 'text-base' },
  };

  const { icon, text, sub } = sizeMap[size] || sizeMap.md;

  const content = (
    <div className={`flex items-center gap-3 select-none group ${className}`}>
      {/* SVG Emblem */}
      <div 
        className="relative flex items-center justify-center shrink-0 rounded-xl overflow-hidden transition-transform duration-300 group-hover:scale-105"
        style={{ width: icon, height: icon }}
      >
        <svg
          viewBox="0 0 48 48"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full drop-shadow-sm"
        >
          {/* Base Container */}
          <rect width="48" height="48" rx="12" fill="#202B2B" />
          
          {/* Roof Line & Left Worker Figure */}
          <path
            d="M11 34V22L24 11.5L28 15L17 24.5V34H11Z"
            fill="#4F9D92"
            className="transition-colors duration-300"
          />
          
          {/* Roof Line & Right Worker Figure */}
          <path
            d="M37 34V22L24 11.5L20 15L31 24.5V34H37Z"
            fill="#5D9B78"
            className="transition-colors duration-300"
          />
          
          {/* Cooperative Bridge / Connected Clasped Hands */}
          <path
            d="M15 27C15 25.3431 16.3431 24 18 24H30C31.6569 24 33 25.3431 33 27C33 28.6569 31.6569 30 30 30H18C16.3431 30 15 28.6569 15 27Z"
            fill="#F4F3EF"
          />
          
          {/* Shared Hearth / Golden Node */}
          <circle cx="24" cy="18.5" r="3.75" fill="#D9B978" />
          
          {/* Core Union Dot */}
          <circle cx="24" cy="27" r="2" fill="#4F9D92" />
        </svg>
      </div>

      {/* Brand Typography */}
      {showText && (
        <div className="flex flex-col leading-tight">
          <div className="flex items-center gap-1.5">
            <span
              className={`font-display font-bold tracking-tight ${text} ${
                variant === 'dark'
                  ? 'text-white'
                  : variant === 'light'
                  ? 'text-brand-primary'
                  : 'text-brand-primary dark:text-white'
              }`}
            >
              Sahkar<span className="text-brand-teal">Sathi</span>
            </span>
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-brand-gold animate-pulse-subtle" />
          </div>
          <span
            className={`font-medium tracking-wide uppercase ${sub} ${
              variant === 'dark'
                ? 'text-brand-surface/70'
                : 'text-brand-secondary'
            }`}
          >
            Cooperative Services
          </span>
        </div>
      )}
    </div>
  );

  if (asLink) {
    return (
      <Link to="/" aria-label="SahkarSathi Home" className="inline-block focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-teal rounded-xl">
        {content}
      </Link>
    );
  }

  return content;
}
