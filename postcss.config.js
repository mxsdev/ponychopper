const tailwindcss = require('tailwindcss');
const nested = require("postcss-nested")

module.exports = {
  plugins: [
    'postcss-preset-env',
    nested,
    tailwindcss
  ],
};