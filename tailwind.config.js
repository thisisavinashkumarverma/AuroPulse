/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#eef5fb', 100: '#d6e8f6', 200: '#aed1ec', 300: '#7fb3dd', 400: '#4a8fc8',
          500: '#1f6aac', 600: '#0F4C81', 700: '#0c3d68', 800: '#0a2f50', 900: '#072238',
        },
        secondary: {
          50: '#f0fdf4', 100: '#dcfce7', 200: '#bbf7d0', 400: '#4ade80', 500: '#22C55E',
          600: '#16a34a', 700: '#15803d', 800: '#166534',
        },
        surface: '#F8FAFC',
      },
    },
  },
  plugins: [],
};
