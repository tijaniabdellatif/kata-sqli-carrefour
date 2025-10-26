const { createGlobPatternsForDependencies } = require('@nx/react/tailwind');
const { join } = require('path');

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    join(
      __dirname,
      '{src,pages,components,app}/**/*!(*.stories|*.spec).{ts,tsx,html}',
      
    ),
    ...createGlobPatternsForDependencies(__dirname),
     '../../libs/frontend/ui/src/**/*.{js,jsx,ts,tsx}',
  ],
  presets:[require('../../libs/frontend/ui/tailwind.config.js')],
  theme: {
    extend: {},
  },
  plugins: [],
};
