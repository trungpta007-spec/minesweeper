import type { Config } from 'tailwindcss';

export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      boxShadow: {
        soft: '0 10px 30px rgba(15, 23, 42, 0.08)',
        lift: '0 18px 45px rgba(15, 23, 42, 0.16)',
      },
      backgroundImage: {
        'radial-fade': 'radial-gradient(circle at top, rgba(99, 102, 241, 0.10), transparent 35%), radial-gradient(circle at bottom right, rgba(59, 130, 246, 0.10), transparent 30%)',
      },
      keyframes: {
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        floaty: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-8px)' },
        },
        boardIn: {
          '0%': { opacity: '0', transform: 'scale(0.96) translateY(8px)' },
          '100%': { opacity: '1', transform: 'scale(1) translateY(0px)' },
        },
      },
      animation: {
        shimmer: 'shimmer 1.4s linear infinite',
        floaty: 'floaty 5s ease-in-out infinite',
        boardIn: 'boardIn 320ms ease-out',
      },
    },
  },
  plugins: [],
} satisfies Config;
