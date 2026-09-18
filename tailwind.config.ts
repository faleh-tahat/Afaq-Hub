import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          950: '#050505',
          900: '#11131A',
          800: '#1B212B',
          700: '#2C333C',
          600: '#4A5260',
          500: '#9BD8FF',
          400: '#B9C2CE',
          300: '#E5ECF4',
          200: '#F1F5F9',
          100: '#F8FBFE',
        },
        accent: {
          DEFAULT: '#22D7FF',
          50:  'rgba(34,215,255,0.06)',
          100: 'rgba(34,215,255,0.12)',
          200: '#9BD8FF',
          300: '#6BCFFF',
          400: '#3DC4FF',
          500: '#0B78E7',
        },
        surface: {
          DEFAULT: '#11131A',
          muted:   '#0D1016',
          raised:  '#1B212B',
        },
        impact: {
          bg:      '#0b0c0e',
          panel:   '#101215',
          divider: 'rgba(242,240,236,0.10)',
          text:    '#f2f0ec',
          muted:   '#8c8a86',
          accent:  '#4f8ef7',
        },
      },
      boxShadow: {
        'glow':    '0 0 0 1px rgba(34,215,255,0.08), 0 24px 80px rgba(34,215,255,0.12)',
        'glow-sm': '0 0 0 1px rgba(34,215,255,0.06), 0 8px 32px rgba(34,215,255,0.10)',
        'glow-lg': '0 0 0 1px rgba(34,215,255,0.12), 0 32px 120px rgba(34,215,255,0.18)',
        'soft':    '0 1px 3px rgba(0,0,0,0.24), 0 8px 24px rgba(0,0,0,0.16)',
        'card':    '0 2px 8px rgba(0,0,0,0.2), 0 16px 48px rgba(0,0,0,0.14)',
        'card-hover': '0 4px 16px rgba(0,0,0,0.28), 0 24px 64px rgba(34,215,255,0.08)',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        plex: ['var(--font-plex)', 'IBM Plex Sans', 'system-ui', 'sans-serif'],
        'plex-arabic': ['var(--font-plex-arabic)', 'IBM Plex Sans Arabic', 'Tahoma', 'sans-serif'],
        fraunces: ['var(--font-fraunces)', 'ui-serif', 'Georgia', 'serif'],
      },
      fontSize: {
        '2xs': ['0.6875rem', { lineHeight: '1rem' }],
      },
      letterSpacing: {
        'widest-2': '0.2em',
        'widest-3': '0.3em',
        'widest-4': '0.4em',
      },
      borderRadius: {
        '4xl': '2rem',
        '5xl': '2.5rem',
      },
      backgroundImage: {
        'hero-grid': [
          'radial-gradient(ellipse 80% 60% at 50% -10%, rgba(34,215,255,0.14) 0%, transparent 60%)',
          'radial-gradient(ellipse 50% 40% at 80% 80%, rgba(11,120,231,0.08) 0%, transparent 50%)',
          'radial-gradient(ellipse 60% 50% at 0% 50%, rgba(34,215,255,0.06) 0%, transparent 50%)',
        ].join(', '),
        'cta-gradient': 'linear-gradient(135deg, #1B212B 0%, #11131A 50%, #0D1016 100%)',
        'accent-gradient': 'linear-gradient(135deg, #22D7FF 0%, #0B78E7 100%)',
        'surface-gradient': 'linear-gradient(180deg, rgba(27,33,43,0.8) 0%, rgba(17,19,26,0.9) 100%)',
        'dot-grid': 'radial-gradient(circle, rgba(229,236,244,0.06) 1px, transparent 1px)',
        'impact-glow': 'linear-gradient(90deg, transparent 0%, #4f8ef7 50%, transparent 100%)',
      },
      backgroundSize: {
        'dot-grid': '24px 24px',
      },
      keyframes: {
        'fade-in': {
          from: { opacity: '0' },
          to:   { opacity: '1' },
        },
        'fade-up': {
          from: { opacity: '0', transform: 'translateY(16px)' },
          to:   { opacity: '1', transform: 'translateY(0)' },
        },
        'slide-down': {
          from: { opacity: '0', transform: 'translateY(-8px)' },
          to:   { opacity: '1', transform: 'translateY(0)' },
        },
        'pulse-dot': {
          '0%, 100%': { opacity: '1', transform: 'scale(1)' },
          '50%':       { opacity: '0.5', transform: 'scale(0.85)' },
        },
        'shimmer': {
          from: { backgroundPosition: '200% 0' },
          to:   { backgroundPosition: '-200% 0' },
        },
        'glow-pulse': {
          '0%, 100%': { boxShadow: '0 0 0 0 rgba(34,215,255,0)' },
          '50%':       { boxShadow: '0 0 0 6px rgba(34,215,255,0.08)' },
        },
      },
      animation: {
        'fade-in':    'fade-in 0.4s ease-out both',
        'fade-up':    'fade-up 0.5s ease-out both',
        'slide-down': 'slide-down 0.3s ease-out both',
        'pulse-dot':  'pulse-dot 2s ease-in-out infinite',
        'shimmer':    'shimmer 2.5s linear infinite',
        'glow-pulse': 'glow-pulse 3s ease-in-out infinite',
      },
      transitionDuration: {
        '250': '250ms',
        '350': '350ms',
      },
      transitionTimingFunction: {
        'smooth': 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
        'spring': 'cubic-bezier(0.34, 1.56, 0.64, 1)',
      },
    },
  },
  plugins: [],
};

export default config;
