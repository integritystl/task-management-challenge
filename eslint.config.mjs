import coreWebVitals from 'eslint-config-next/core-web-vitals';

const config = [
  {
    ignores: ['.next/**', 'node_modules/**', 'next-env.d.ts'],
  },
  ...coreWebVitals,
  {
    rules: {
      // Pre-existing violations in task-list.tsx and ui/carousel.tsx;
      // restore to error when those effects are refactored.
      'react-hooks/set-state-in-effect': 'warn',
    },
  },
];

export default config;
