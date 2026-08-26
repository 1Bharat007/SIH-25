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
        sikkim: {
          50: '#f0fdf9',
          100: '#ccfbee',
          200: '#9af6de',
          300: '#5ce8cb',
          400: '#27d0b3',
          500: '#0fb49a',
          600: '#09907d',
          700: '#0b7365',
          800: '#0d5c52',
          900: '#104c44',
          950: '#042c28',
        },
        monastery: {
          50: '#fffbeb',
          100: '#fef3c7',
          500: '#f59e0b',
          600: '#d97706',
          700: '#b45309',
        },
        alpine: {
          800: '#1e293b',
          900: '#0f172a',
          950: '#020617',
        },
      },
      fontFamily: {
        sans: ['var(--font-sans)', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};

export default config;
