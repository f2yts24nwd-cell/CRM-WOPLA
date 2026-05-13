/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{vue,js,ts}'],
  theme: {
    extend: {
      colors: {
        primary: {
          50:  '#FFF7ED',
          100: '#FFEDD5',
          200: '#FED7AA',
          400: '#FB923C',
          DEFAULT: '#F97316',
          500: '#F97316',
          600: '#EA580C',
          700: '#C2410C',
        },
        teal: {
          50:  '#F0FDFA',
          100: '#CCFBF1',
          200: '#99F6E4',
          400: '#2DD4BF',
          DEFAULT: '#14B8A6',
          500: '#14B8A6',
          600: '#0D9488',
          700: '#0F766E',
        }
      }
    }
  },
  plugins: []
}
