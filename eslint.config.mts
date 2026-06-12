import js from '@eslint/js';
import globals from 'globals';
import tseslint from 'typescript-eslint';
import { defineConfig } from 'eslint/config';

export default defineConfig([
  {
    ignores: ['package-lock.json', 'playwright-report/**', 'test-results/**'],
  },
  {
    files: ['**/*.{ts}'],
    plugins: { js },
    extends: ['js/recommended'],
    languageOptions: { globals: globals.node },
  },
  {
    rules: {
      'no-console': 'error',
    },
  },
  tseslint.configs.recommended,
]);
