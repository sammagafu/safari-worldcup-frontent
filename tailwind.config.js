/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{vue,js,ts,jsx,tsx}',
  ],
  theme: {
    container: {
      center: true,
      padding: {
        DEFAULT: '0.75rem',
        sm: '1rem',
        md: '1.5rem',
      },
      screens: {
        xl: '80rem', /* 1280px – main width for all views */
      },
    },
    extend: {
      fontFamily: {
        sans: ['Poppins', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        display: ['Rawer', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        '2.5xs': ['0.625rem', { lineHeight: '1rem' }],     // 10px
        '3xs': ['0.8125rem', { lineHeight: '1.25rem' }],   // 13px
        'display-sm': ['1.375rem', { lineHeight: '2rem' }], // 22px
      },
      minHeight: {
        11: '2.75rem',   // 44px
        13: '3.25rem',   // 52px
        15: '3.75rem',   // 60px
        70: '17.5rem',   // 280px
      },
      maxHeight: {
        '40vh': '40vh',
        '45vh': '45vh',
        '60vh': '60vh',
        '70vh': '70vh',
      },
      height: {
        15: '3.75rem',  // 60px
        18: '4.5rem',   // 72px
        22: '5.5rem',   // 88px
      },
      minWidth: {
        25: '6.25rem',  // 100px
        35: '8.75rem',  // 140px
      },
    },
  },
  plugins: [],
}
