module.exports = {
  env: {
    browser: true,
    es2021: true,
    node: true,
  },
  extends: ['eslint:recommended', 'plugin:@typescript-eslint/recommended'],
  overrides: [],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  plugins: ['@typescript-eslint'],
  rules: {
    quotes: ['error', 'single'],
    'no-console': 1,
    'no-var': 'error',
    'prefer-const': 'error',
    '@typescript-eslint/no-namespace': 'off',
  },
  ignorePatterns: ['/dist/*'],
};
