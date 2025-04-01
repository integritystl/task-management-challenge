module.exports = {
  root: true,
  extends: ['next/core-web-vitals', 'plugin:@typescript-eslint/recommended', 'prettier'],
  plugins: ['react-hooks', '@typescript-eslint', 'prettier'],
  rules: {
    '@typescript-eslint/no-unused-vars': ['error', { varsIgnorePattern: '^[A-Z_]' }],
    'prettier/prettier': 'warn',
  },
  ignorePatterns: ['build', 'dist', 'coverage', 'node_modules', 'public', '.next'],
  settings: {
    next: {
      rootDir: '.',
    },
  },
};
