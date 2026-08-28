import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Google Enterprise Utility Color Palette
        google: {
          navy: '#0B3D91',
          navyHover: '#082E6E',
          navyActive: '#062252',
          blue: '#1A73E8',
          blueTint: '#E8F0FE',
          green: '#1E8E3E',
          greenTint: '#E6F4EA',
          greenText: '#137333',
          greenBorder: '#CEEAD6',
          red: '#D93025',
          redTint: '#FCE8E6',
          redText: '#C5221F',
          redBorder: '#FAD2CF',
          amber: '#E37400',
          amberTint: '#FEF7E0',
          amberText: '#B06000',
          amberBorder: '#FEEFC3',
          textPrimary: '#202124',
          textSecondary: '#5F6368',
          textDisabled: '#80868B',
          surface: '#FFFFFF',
          bgGray: '#F8F9FA',
          border: '#DADCE0',
        },
        sikkim: {
          50: '#F8F9FA',
          100: '#E8F0FE',
          200: '#D2E3FC',
          300: '#AECBFA',
          400: '#8AB4F8',
          500: '#1A73E8',
          600: '#185ABC',
          700: '#174EA6',
          800: '#0B3D91',
          900: '#082E6E',
          950: '#062252',
        },
      },
      fontFamily: {
        sans: ['Roboto', 'Google Sans', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        DEFAULT: '4px',
        md: '4px',
        lg: '8px',
        xl: '8px',
        '2xl': '8px',
        '3xl': '8px',
      },
    },
  },
  plugins: [],
};

export default config;
