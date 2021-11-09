module.exports = {
  purge: [
    './app/**/*.html',
    './app/**/*.tsx',
    './app/**/*.ts',
    './app/**/*.jsx',
    './app/**/*.js',
  ],
  mode: 'jit',
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      spacing: {
        'spinner': '10em'
      }
    },
    colors: require("./app/app_colors.js").app_colors
  },
  variants: {
    extend: {},
  },
  plugins: [],
}
