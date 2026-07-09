// @ts-check
const nextConfig = require('eslint-config-next/core-web-vitals');

/** @type {import('eslint').Linter.Config[]} */
const config = [
  ...nextConfig,
  {
    // Disable React Compiler strict rules that require code written specifically
    // for the React Compiler. These rules were not present in Next.js 14.
    rules: {
      'react-hooks/purity': 'off',
      'react-hooks/set-state-in-effect': 'off',
      'react-hooks/set-state-in-render': 'off',
      'react-hooks/static-components': 'off',
      'react-hooks/use-memo': 'off',
      'react-hooks/preserve-manual-memoization': 'off',
      'react-hooks/immutability': 'off',
      'react-hooks/globals': 'off',
      'react-hooks/refs': 'off',
      'react-hooks/incompatible-library': 'off',
      'react-hooks/unsupported-syntax': 'off',
      'react-hooks/config': 'off',
      'react-hooks/gating': 'off',
      'react-hooks/error-boundaries': 'off',
    },
  },
];

module.exports = config;
