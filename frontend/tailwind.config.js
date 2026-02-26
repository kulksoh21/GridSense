/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'energy-blue': '#1e40af',
        'energy-green': '#16a34a',
        'energy-orange': '#ea580c',
      }
    },
  },
  plugins: [],
}
