/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          bg: 'var(--color-bg-main)',
          surface: 'var(--color-bg-secondary)',
          dark: 'var(--color-dark-section)',
          'dark-elevated': 'var(--color-dark-elevated)',
          primary: 'var(--color-text-primary)',
          secondary: 'var(--color-text-secondary)',
          teal: 'var(--color-accent-teal)',
          'teal-light': 'var(--color-accent-teal-light)',
          emerald: 'var(--color-accent-emerald)',
          'emerald-light': 'var(--color-accent-emerald-light)',
          gold: 'var(--color-highlight-gold)',
          'gold-light': 'var(--color-highlight-gold-light)',
          border: 'var(--color-border)',
          'border-dark': 'var(--color-border-dark)',
        },
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', 'system-ui', '-apple-system', 'sans-serif'],
        display: ['Outfit', 'Plus Jakarta Sans', 'sans-serif'],
      },
      boxShadow: {
        'subtle': '0 2px 10px rgba(36, 51, 50, 0.04)',
        'premium': '0 10px 30px -5px rgba(36, 51, 50, 0.07), 0 4px 12px -2px rgba(36, 51, 50, 0.03)',
        'premium-hover': '0 20px 40px -10px rgba(79, 157, 146, 0.15), 0 8px 16px -4px rgba(36, 51, 50, 0.05)',
        'dark-card': '0 10px 30px -5px rgba(0, 0, 0, 0.3)',
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.5rem',
        '4xl': '2rem',
      },
      animation: {
        'float-slow': 'float 6s ease-in-out infinite',
        'pulse-subtle': 'pulseSubtle 4s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        pulseSubtle: {
          '0%, 100%': { opacity: '0.4' },
          '50%': { opacity: '0.8' },
        },
      },
    },
  },
  plugins: [],
}
