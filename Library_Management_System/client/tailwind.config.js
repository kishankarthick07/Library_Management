/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['DM Sans', 'system-ui', 'sans-serif'],
      },
      colors: {
        ink: { 950: '#0c1222', 900: '#121a2e', 800: '#1a2540' },
        accent: { DEFAULT: '#3b82f6', dark: '#2563eb' },
      },
    },
  },
  plugins: [],
};
