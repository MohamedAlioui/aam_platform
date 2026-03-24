/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        /* CSS-variable-backed — theme-aware */
        'navy-deep':  'var(--bg-page)',
        'navy':       'var(--bg-section)',
        'blue':       'var(--blue)',
        'blue-mid':   'var(--blue)',
        'blue-light': 'var(--blue-light)',
        'blue-pale':  'var(--blue-pale)',
        'cyan':       'var(--blue)',
        'off-white':  'var(--text-primary)',
        'gold':       'var(--gold)',
        'page':       'var(--bg-page)',
        'section':    'var(--bg-section)',
        'card':       'var(--bg-card)',
        'primary':    'var(--text-primary)',
        'secondary':  'var(--text-secondary)',
        'muted':      'var(--text-muted)',
        'accent':     'var(--blue)',
      },
      fontFamily: {
        display:   ['"Playfair Display"', 'serif'],
        arabic:    ['"Cairo"', 'sans-serif'],
        editorial: ['"Cormorant Garamond"', 'serif'],
        mono:      ['"Space Mono"', 'monospace'],
      },
      animation: {
        'float':     'float 6s ease-in-out infinite',
        'spin-slow': 'spin 20s linear infinite',
      },
      keyframes: {
        float: {
          '0%,100%': { transform: 'translateY(0)' },
          '50%':     { transform: 'translateY(-16px)' },
        },
      },
    },
  },
  plugins: [],
};
