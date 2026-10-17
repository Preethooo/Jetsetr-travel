/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        navy: '#1D3045',
        sand: '#F4EFE8',
        gold: '#C9A46A',
      },
      fontFamily: {
        sans: ["'Helvetica Neue'", 'Helvetica', 'Inter', 'Arial', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
