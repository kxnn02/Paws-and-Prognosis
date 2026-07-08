module.exports = {
  content: ["./App.tsx", "./src/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        cream: 'rgba(248, 224, 196, 0.3)',
        beige: '#FEF9F4',
        primary: '#71924F',
        'primary-light': 'rgba(113, 146, 79, 0.67)',
        'primary-border': '#7BBD38',
        'primary-dark': '#4A6B35',
        'primary-soft': 'rgba(113, 146, 79, 0.08)',
        heading: '#544864',
        dark: '#343434',
        grey: '#808080',
        'light-grey': '#9BA1A8',
        placeholder: '#AA865D',
        'input-bg': '#F5F5F5',
        surface: '#FFFFFF',
        'surface-warm': '#FAF7F4',
        'accent-amber': '#F59E0B',
        'accent-blue': '#3B82F6',
      },
      fontSize: {
        'display': ['32px', { lineHeight: '40px' }],
        'title': ['24px', { lineHeight: '32px' }],
        'heading': ['20px', { lineHeight: '28px' }],
        'body-lg': ['16px', { lineHeight: '24px' }],
        'body': ['14px', { lineHeight: '20px' }],
        'caption': ['12px', { lineHeight: '16px' }],
        'tiny': ['10px', { lineHeight: '14px' }],
      },
      spacing: {
        '4.5': '18px',
        '13': '52px',
        '15': '60px',
        '18': '72px',
        '22': '88px',
      },
      borderRadius: {
        'card': '16px',
        'btn': '12px',
        'glass': '29px',
        'nav': '32px',
        'xl': '20px',
        '2xl': '24px',
      },
      fontFamily: {
        poppins: ['Poppins'],
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'pulse-soft': {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.7' },
        },
      },
      animation: {
        'fade-in': 'fadeIn 300ms ease-in-out',
        'slide-up': 'slideUp 400ms ease-out',
        'pulse-soft': 'pulse-soft 2s ease-in-out infinite',
      },
    },
  },
  plugins: [],
};
