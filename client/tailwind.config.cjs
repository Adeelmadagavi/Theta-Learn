/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        // Design tokens -- picked deliberately for a bright, playful kids' learning app,
        // distinct from the generic cream+terracotta AI-app palette.
        ink: '#1B1B3A',       // app chrome / dark text
        cloud: '#F6F7FB',     // page background
        coral: '#FF6F59',     // primary accent (CTAs, streak flame)
        sunshine: '#FFC857',  // XP / coins / rewards
        mint: '#06D6A0',      // success / correct states
        sky: '#4EA8DE',       // maths subject accent
        grape: '#8E6BC1'      // science subject accent
      },
      fontFamily: {
        display: ['"Baloo 2"', 'system-ui', 'sans-serif'],
        body: ['"Inter"', 'system-ui', 'sans-serif']
      },
      borderRadius: {
        xl2: '1.25rem'
      }
    }
  },
  plugins: []
};
