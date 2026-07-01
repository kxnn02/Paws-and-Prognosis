/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./App.tsx",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        // Backgrounds
        cream: 'rgba(248, 224, 196, 0.3)',
        beige: '#FEF9F4',
        // Primary (Green)
        primary: '#71924F',
        'primary-light': 'rgba(113, 146, 79, 0.67)',
        'primary-border': '#7BBD38',
        'primary-dark': '#4A6B35',
        // Text
        heading: '#544864',
        dark: '#343434',
        grey: '#808080',
        'light-grey': '#9BA1A8',
        placeholder: '#AA865D',
        // UI
        'input-bg': '#F5F5F5',
      },
      borderRadius: {
        'card': '16px',
        'btn': '12px',
        'glass': '29px',
        'nav': '32px',
      },
      fontFamily: {
        poppins: ['Poppins'],
      },
    },
  },
  plugins: [],
};
