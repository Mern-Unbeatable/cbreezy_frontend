/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,jsx,ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        orange: {
          50: '#FDF5ED',
          100: '#FBE5D2',
          600: '#E67E22',
          700: '#D96B1F',
        },
        teal: {
          700: '#1A4D43',
        },
        'dark-teal': '#0a4f44',
        'light-orange': '#e97c35',
        'logo-text-guru': '#d77234',
        'logo-text-side': '#0b5d53',
        'price-button-teal': '#115041',
        'price-button-orange': '#d6742e',
        'download-border-teal': '#c9dad7',
        'download-text-teal': '#125244',
        'download-border-orange': '#ebbb89',
        'download-text-orange': '#d8742e',
        'body-text-dark': '#414141',
        'body-text-orange': '#d9762e',
        'pricing-bg': '#fdf3ea',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}

