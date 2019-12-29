module.exports = {
  root: true,
  env: {
    node: true,
  },
  extends: [
    'plugin:vue/essential',
    '@vue/airbnb',
  ],
  rules: {
    'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
        'no-tabs': 0,
    'no-mixed-spaces-and-tabs': 0,
    'max-len': 0,
    'template-curly-spacing': 0,
    indent: 0,
    'no-restricted-syntax': 0,
    'import/no-cycle': 0,
  },
  parserOptions: {
    parser: 'babel-eslint',
  },
};
