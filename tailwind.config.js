/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
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
