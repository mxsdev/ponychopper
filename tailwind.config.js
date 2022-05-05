module.exports = {
  content: [
    './app/**/*.html',
    './app/**/*.tsx',
    './app/**/*.ts',
    './app/**/*.jsx',
    './app/**/*.js',
  ],
  mode: 'jit',
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
