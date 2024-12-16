/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx}',  // If you're using Next.js 13 with the app directory
    './pages/**/*.{js,ts,jsx,tsx}', // For older versions or traditional pages
    './components/**/*.{js,ts,jsx,tsx}', // If you have a components folder
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}

