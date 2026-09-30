const chevalPreset = require('@chevalrouting/cheval-ui/tailwind-preset')
module.exports = {
  presets: [chevalPreset],
  content: [
    './index.html',
    './src/**/*.{ts,tsx}',
    '../src/**/*.{ts,tsx}',
    './node_modules/@chevalrouting/cheval-ui/dist/**/*.{js,mjs}',
  ],
}
