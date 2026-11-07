/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        magic: {
          pink: '#FF70A6',
          peach: '#FF9770',
          yellow: '#FFD670',
          green: '#E9FF70',
          sky: '#70D6FF',
          lavender: '#D8B4FE',
          purple: '#A855F7',
          mint: '#6EE7B7'
        }
      },
      fontFamily: {
        comic: ['"Comic Neue"', '"Quicksand"', 'Nunito', 'ui-rounded', 'sans-serif'],
      },
      animation: {
        'float-slow': 'float 4s ease-in-out infinite',
        'float-medium': 'float 3s ease-in-out infinite',
        'float-fast': 'float 2s ease-in-out infinite',
        'wobble-cute': 'wobble 0.6s ease-in-out',
        'pop-scale': 'pop 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
        'sparkle-spin': 'spin 8s linear infinite',
        'pulse-soft': 'pulseSoft 2s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px) rotate(0deg)' },
          '50%': { transform: 'translateY(-12px) rotate(2deg)' },
        },
        wobble: {
          '0%, 100%': { transform: 'translateX(0) rotate(0deg)' },
          '20%': { transform: 'translateX(-8px) rotate(-6deg)' },
          '40%': { transform: 'translateX(8px) rotate(6deg)' },
          '60%': { transform: 'translateX(-4px) rotate(-3deg)' },
          '80%': { transform: 'translateX(4px) rotate(3deg)' },
        },
        pop: {
          '0%': { transform: 'scale(0.8)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        pulseSoft: {
          '0%, 100%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.05)' },
        }
      }
    },
  },
  plugins: [],
}
