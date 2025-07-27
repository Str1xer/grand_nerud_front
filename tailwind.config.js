/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",      // если используете /app
    "./pages/**/*.{js,ts,jsx,tsx}",    // если есть /pages
    "./components/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {},
  },
  plugins: [],  // без плагинов, если не нужны
}
