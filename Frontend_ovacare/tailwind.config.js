/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          500: '#5C7A5C',
          600: '#4A6A4A',
          100: '#EEF2EE',
        },
      },
    },
  },
  plugins: [],
}