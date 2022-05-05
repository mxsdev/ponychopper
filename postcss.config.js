const tailwindcss = require('tailwindcss');
const autoprefixer = require('autoprefixer')
// const nested = require("postcss-nested")

module.exports = {
  plugins: {
    'postcss-preset-env': {},
    'tailwindcss/nesting': 'postcss-nested',
    tailwindcss: {},
    autoprefixer: {}
  },
};