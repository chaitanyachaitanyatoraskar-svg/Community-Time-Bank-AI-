/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        ivory: {
          DEFAULT: '#F7F4EC',
          50: '#FAF8F3',
          100: '#F2EDE1',
          200: '#E7E2D6',
          300: '#D8D1C2',
        },
        charcoal: {
          DEFAULT: '#111111',
          900: '#111111',
          800: '#1F1F1F',
          700: '#333333',
          600: '#4A4A4A',
          500: '#6B6B6B',
          400: '#8E8E8E',
          300: '#B0B0B0',
        },
        yellow: {
          editorial: '#FFD21C',
          hover: '#E8BD14',
          light: '#FFF6CE',
          DEFAULT: '#FFD21C',
        },
        forest: {
          DEFAULT: '#123D32',
          light: '#E8F2EE',
          dark: '#0A241E',
        },
        brand: {
          50: '#ecfdf5',
          100: '#d1fae5',
          200: '#a7f3d0',
          300: '#6ee7b7',
          400: '#34d399',
          500: '#123D32',
          600: '#0E3027',
          700: '#0A241E',
          800: '#061713',
          900: '#030B09',
        },
        border: {
          editorial: '#E5E0D8',
          dark: '#2A2A2A',
        }
      },
      fontFamily: {
        serif: ['"Instrument Serif"', 'Georgia', 'serif'],
        heading: ['"Instrument Serif"', 'Georgia', 'serif'],
        sans: ['"DM Sans"', 'system-ui', '-apple-system', 'sans-serif'],
        handwriting: ['"Caveat"', 'cursive'],
      },
      boxShadow: {
        editorial: '0 1px 3px rgba(0,0,0,0.05)',
      }
    },
  },
  plugins: [],
}
