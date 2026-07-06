import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{ts,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        blue: {
          50: '#f4f8ff',
          150: '#eaf1ff',
          200: '#c7d9ff',
          300: '#8aaeff',
          500: '#2b6cff',
          600: '#1f58e0',
          700: '#1b4fcc',
        },
        navy: {
          900: '#0a1f44',
        },
        gray: {
          50: '#f7f8fa',
          100: '#edeef2',
          200: '#dcdfe6',
          400: '#9aa0ad',
          600: '#4b5260',
          900: '#1a1d24',
          950: '#0a0a0b',
        },
        brand: {
          50: '#f4f8ff',
          100: '#eaf1ff',
          150: '#eaf1ff',
          200: '#c7d9ff',
          300: '#8aaeff',
          500: '#2b6cff',
          600: '#1f58e0',
          700: '#1b4fcc',
          900: '#0a1f44',
          DEFAULT: '#2b6cff',
        },
        ink: {
          50: '#f7f8fa',
          100: '#edeef2',
          200: '#dcdfe6',
          300: '#c8ccd5',
          400: '#9aa0ad',
          500: '#6f7684',
          600: '#4b5260',
          700: '#323844',
          900: '#1a1d24',
          950: '#0a0a0b',
        },
        kakao: '#f7e600',
        green: {
          light: '#e9f4ef',
          DEFAULT: '#087f68',
        },
        orange: {
          light: '#feefdf',
          DEFAULT: '#f77b00',
        },
        success: '#087f68',
        warning: '#f77b00',
        danger: '#ef4444',
      },
      fontFamily: {
        display: [
          'Plus Jakarta Sans',
          'Pretendard',
          'Apple SD Gothic Neo',
          'Noto Sans KR',
          'sans-serif',
        ],
        sans: [
          'Plus Jakarta Sans',
          'Pretendard',
          'SF Pro Text',
          '-apple-system',
          'BlinkMacSystemFont',
          'Apple SD Gothic Neo',
          'Noto Sans KR',
          'Segoe UI',
          'Roboto',
          'sans-serif',
        ],
      },
      borderRadius: {
        sm: '10px',
        md: '14px',
        lg: '20px',
        xl: '24px',
      },
      boxShadow: {
        card: '0 6px 24px rgba(11, 13, 18, 0.06)',
        pop: '0 20px 60px rgba(11, 13, 18, 0.12)',
      },
      maxWidth: {
        phone: '430px',
      },
    },
  },
  plugins: [],
};

export default config;
