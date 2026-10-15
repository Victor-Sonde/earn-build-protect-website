import type { Config } from 'tailwindcss';

/**
 * Earn.Build.Protect design tokens.
 * Colours are defined once as CSS variables in src/app/globals.css and mapped here.
 */
const config: Config = {
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    screens: { sm: '560px', md: '820px', lg: '1080px', xl: '1320px' },
    extend: {
      colors: {
        ink: { DEFAULT: 'rgb(var(--ink) / <alpha-value>)', raised: 'rgb(var(--ink-raised) / <alpha-value>)', line: 'rgb(var(--ink-line) / <alpha-value>)' },
        paper: { DEFAULT: 'rgb(var(--paper) / <alpha-value>)', bright: 'rgb(var(--paper-bright) / <alpha-value>)', deep: 'rgb(var(--paper-deep) / <alpha-value>)', line: 'rgb(var(--paper-line) / <alpha-value>)' },
        amber: { DEFAULT: 'rgb(var(--amber) / <alpha-value>)', deep: 'rgb(var(--amber-deep) / <alpha-value>)', soft: 'rgb(var(--amber-soft) / <alpha-value>)' },
        stone: { dark: 'rgb(var(--stone-on-ink) / <alpha-value>)', light: 'rgb(var(--stone-on-paper) / <alpha-value>)' },
      },
      fontFamily: {
        display: ['"Bricolage Grotesque Variable"', 'system-ui', 'sans-serif'],
        serif: ['"Newsreader Variable"', 'Georgia', 'serif'],
      },
      fontSize: {
        // Modular scale, ratio 1.25, base 17px
        meta: ['0.8125rem', { lineHeight: '1.4' }],
        small: ['0.9375rem', { lineHeight: '1.5' }],
        base: ['1.0625rem', { lineHeight: '1.6' }],
        lead: ['1.3125rem', { lineHeight: '1.5' }],
        h4: ['1.3125rem', { lineHeight: '1.25' }],
        h3: ['1.6875rem', { lineHeight: '1.15' }],
        h2: ['clamp(2rem, 4.2vw, 3.25rem)', { lineHeight: '1.04' }],
        h1: ['clamp(2.5rem, 6.4vw, 5rem)', { lineHeight: '0.98' }],
        hero: ['clamp(2.75rem, 7vw, 6.75rem)', { lineHeight: '0.94' }],
      },
      spacing: { section: 'clamp(4rem, 9vw, 8rem)', gutter: 'clamp(1.25rem, 4vw, 3rem)' },
      maxWidth: { page: '82rem', prose: '40rem' },
      borderRadius: { tile: '10px', panel: '20px', card: '28px' },
      boxShadow: {
        lift: '0 1px 2px rgb(30 28 26 / 0.06), 0 12px 32px -12px rgb(30 28 26 / 0.18)',
        'lift-dark': '0 1px 0 rgb(255 255 255 / 0.04) inset, 0 24px 48px -24px rgb(0 0 0 / 0.6)',
        amber: '0 10px 30px -12px rgb(221 154 44 / 0.65)',
      },
    },
  },
  plugins: [],
};

export default config;
