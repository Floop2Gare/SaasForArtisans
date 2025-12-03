import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    fontSize: {
      xs: ['12px', '18px'],
      sm: ['14px', '22px'],
      base: ['18px', '28px'],
      lg: ['20px', '30px'],
      xl: ['24px', '34px'],
      '2xl': ['28px', '38px'],
      '3xl': ['32px', '42px'],
    },
    extend: {
      colors: {
        primary: '#0049ac',
        'primary-muted': '#0b5fc4',
        canvas: '#f7f8fb',
        ink: '#141820',
        'ink-soft': '#2a2f38',
        border: '#e5e7eb',
      },
      borderRadius: {
        xl: '18px',
      },
      boxShadow: {
        soft: '0 10px 30px rgba(0, 73, 172, 0.07)',
      },
    },
  },
  plugins: [],
}
export default config
