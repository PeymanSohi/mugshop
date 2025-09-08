/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      screens: {
        // Custom aliases while keeping default sm/md/lg/xl/2xl
        tb: '641px',
        lp: '1025px',
        dt: '1441px',
      },
      fontFamily: {
        sans: [
          'IRANYekanX FaNum',
          'IRANYekanX',
          'IRANYekan',
          'Vazirmatn',
          'ui-sans-serif',
          'system-ui',
          '-apple-system',
          'Segoe UI',
          'Roboto',
          'Helvetica',
          'Arial',
          '"Apple Color Emoji"',
          '"Segoe UI Emoji"'
        ]
      }
    },
  },
  plugins: [],
};
