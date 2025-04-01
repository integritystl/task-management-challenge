module.exports = {
  root: true,
  extends: ['next/core-web-vitals', 'plugin:@typescript-eslint/recommended', 'prettier'],
  plugins: ['react-hooks', '@typescript-eslint', 'prettier', 'react'],
  rules: {
    '@typescript-eslint/no-unused-vars': [
      'warn',
      {
        varsIgnorePattern: '^[A-Z_]',
        args: 'after-used',
        ignoreRestSiblings: true,
        destructuredArrayIgnorePattern: '^_',
        caughtErrors: 'none',
      },
    ],
    'prettier/prettier': 'warn',
    'react/jsx-uses-react': 'error',
    'react/jsx-uses-vars': 'error',
  },
  ignorePatterns: ['build', 'dist', 'coverage', 'node_modules', 'public', '.next'],
  settings: {
    next: {
      rootDir: '.',
    },
    react: {
      version: 'detect',
    },
  },
};
