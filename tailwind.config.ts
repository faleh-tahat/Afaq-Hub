import type { Config } from 'tailwindcss';

// Colours are CSS variables holding RGB channels (see app/globals.css) so that
// opacity modifiers such as `bg-accent/10` work on every token.
const token = (name: string) => `rgb(var(--${name}) / <alpha-value>)`;

const config: Config = {
  content: ['./app/**/*.{js,ts,jsx,tsx}', './components/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        canvas: token('canvas'),
        surface: {
          DEFAULT: token('surface'),
          raised: token('surface-raised'),
          overlay: token('surface-overlay'),
        },
        line: {
          DEFAULT: token('line'),
          strong: token('line-strong'),
          input: token('line-input'),
        },
        ink: {
          DEFAULT: token('ink'),
          secondary: token('ink-secondary'),
          muted: token('ink-muted'),
        },
        accent: {
          DEFAULT: token('accent'),
          strong: token('accent-strong'),
        },
        silver: token('silver'),
        gold: token('gold'),
        success: token('success'),
      },
      fontFamily: {
        sans: [
          'var(--font-plex-arabic)',
          'IBM Plex Sans Arabic',
          'Tahoma',
          'system-ui',
          'sans-serif',
        ],
      },
      fontSize: {
        display: ['clamp(2.5rem, 1.95rem + 2.3vw, 3.75rem)', { lineHeight: '1.3' }],
        'title-1': ['clamp(2rem, 1.62rem + 1.6vw, 2.75rem)', { lineHeight: '1.35' }],
        'title-2': ['clamp(1.625rem, 1.45rem + 0.75vw, 2rem)', { lineHeight: '1.4' }],
        'title-3': ['clamp(1.1875rem, 1.14rem + 0.2vw, 1.3125rem)', { lineHeight: '1.55' }],
        lead: ['clamp(1.0625rem, 1rem + 0.25vw, 1.1875rem)', { lineHeight: '1.9' }],
        body: ['1rem', { lineHeight: '1.85' }],
        small: ['0.875rem', { lineHeight: '1.75' }],
        caption: ['0.8125rem', { lineHeight: '1.6' }],
      },
      maxWidth: {
        container: '76rem',
        prose: '65ch',
      },
      spacing: {
        header: '4.5rem',
        'header-sm': '4rem',
      },
      borderRadius: {
        control: '0.625rem',
        card: '1rem',
        panel: '1.5rem',
      },
      boxShadow: {
        'elev-1': '0 1px 2px rgb(0 0 0 / 0.35), 0 8px 24px -14px rgb(0 0 0 / 0.6)',
        'elev-2': '0 2px 6px rgb(0 0 0 / 0.35), 0 28px 56px -24px rgb(0 0 0 / 0.75)',
        cta: '0 10px 28px -12px rgb(var(--accent) / 0.55)',
      },
      backgroundImage: {
        'accent-gradient':
          'linear-gradient(135deg, rgb(var(--accent)) 0%, rgb(var(--accent-strong)) 100%)',
        'accent-hairline':
          'linear-gradient(90deg, transparent 0%, rgb(var(--accent) / 0.55) 50%, transparent 100%)',
        'page-glow':
          'radial-gradient(56rem 26rem at 88% -12%, rgb(var(--accent) / 0.09), transparent 62%), radial-gradient(40rem 22rem at 8% 0%, rgb(var(--accent-strong) / 0.07), transparent 60%)',
      },
      transitionTimingFunction: {
        brand: 'cubic-bezier(0.22, 1, 0.36, 1)',
      },
    },
  },
  plugins: [],
};

export default config;
