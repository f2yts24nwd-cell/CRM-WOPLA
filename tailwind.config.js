/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{vue,js,ts}'],
  theme: {
    extend: {
      colors: {
        // Fiori Horizon semantische Tokens via CSS Custom Properties
        shell:    'rgb(var(--c-shell) / <alpha-value>)',
        page:     'rgb(var(--c-page) / <alpha-value>)',
        surface:  'rgb(var(--c-surface) / <alpha-value>)',
        surface2: 'rgb(var(--c-surface-2) / <alpha-value>)',
        input:    'rgb(var(--c-input) / <alpha-value>)',
        brand: {
          DEFAULT: 'rgb(var(--c-brand) / <alpha-value>)',
          active:  'rgb(var(--c-brand-active) / <alpha-value>)',
        },
        text1:    'rgb(var(--c-text) / <alpha-value>)',
        text2:    'rgb(var(--c-text-2) / <alpha-value>)',
        border:   'rgb(var(--c-border) / <alpha-value>)',
        borders:  'rgb(var(--c-border-s) / <alpha-value>)',
        positive: 'rgb(var(--c-positive) / <alpha-value>)',
        negative: 'rgb(var(--c-negative) / <alpha-value>)',
        critical: 'rgb(var(--c-critical) / <alpha-value>)',
        info:     'rgb(var(--c-info) / <alpha-value>)',
        neutral:  'rgb(var(--c-neutral) / <alpha-value>)',
        // SAP Blue als primary (ersetzt Orange)
        primary: {
          50:  '#eaf1fb',
          100: '#d5e4f7',
          200: '#aac9ef',
          400: '#5599e8',
          DEFAULT: '#0070f2',
          500: '#0070f2',
          600: '#0064d9',
          700: '#0057c1',
        },
        teal: {
          50:  '#f0fdfa',
          100: '#ccfbf1',
          200: '#99f6e4',
          400: '#2dd4bf',
          DEFAULT: '#14b8a6',
          500: '#14b8a6',
          600: '#0d9488',
          700: '#0f766e',
        }
      }
    }
  },
  plugins: []
}
