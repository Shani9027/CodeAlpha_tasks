import forms from '@tailwindcss/forms';

export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      boxShadow: {
        card: '0 20px 45px rgba(15, 23, 42, 0.08)',
      },
    },
  },
  plugins: [forms],
};
