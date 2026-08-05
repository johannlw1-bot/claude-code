/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        heading: ['"Instrument Serif"', 'ui-serif', 'Georgia', 'Times New Roman', 'serif'],
        body: ['Barlow', 'ui-sans-serif', 'system-ui', '-apple-system', 'Segoe UI', 'sans-serif'],
      },
      colors: {
        void: '#02040A',
      },
    },
  },
  plugins: [],
};
