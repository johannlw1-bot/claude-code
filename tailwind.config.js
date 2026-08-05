/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        display: ['"Bricolage Grotesque"', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        body: ['"Instrument Sans"', 'ui-sans-serif', 'system-ui', '-apple-system', 'sans-serif'],
        schrift: ['Yellowtail', 'ui-serif', 'cursive'],
      },
      colors: {
        // Aus dem Ort abgeleitet: Sonnenschirm, See, Nachmittagssonne, Baumschatten.
        sand: '#F4EDE0',
        sandhell: '#FBF6EC',
        tief: '#0B3B3C',
        see: '#1B8A86',
        seehell: '#63B0AE',
        sonne: '#E8B04B',
        rot: '#C8452F',
        schatten: '#2F4A34',
      },
    },
  },
  plugins: [],
};
