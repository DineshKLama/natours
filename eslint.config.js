import js from '@eslint/js';
import globals from 'globals';

export default [
  // Apply the default recommended JavaScript rules
  js.configs.recommended,

  {
    // Define files to target
    files: ['**/*.js', '**/*.mjs', '**/*.cjs'],

    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module', // Use "commonjs" if you use require()
      globals: {
        ...globals.browser, // Adds window, document, etc.
        ...globals.node, // Enables Node.js global variables like process or __dirname
      },
    },

    rules: {
      'no-console': 'warn', // Warns when console.log is used
      'prefer-const': 'error', // Forces const over let where possible
      'no-unused-vars': 'error',
      eqeqeq: ['error', 'always'], // Throws errors for unused variables
    },
  },
];
