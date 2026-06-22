import js from '@eslint/js';
import eslintPluginPlaywright from 'eslint-plugin-playwright';
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended';
import { defineConfig } from 'eslint/config';
import globals from 'globals';
import tseslint from 'typescript-eslint';

export default defineConfig([
  { ignores: ['package-lock.json', 'playwright-report/**', 'test-results/**'] },
  {
    files: ['**/*.ts'],
    plugins: { js },
    extends: ['js/recommended'],
    languageOptions: {
      globals: globals.node,
      parserOptions: {
        warnOnUnsupportedTypeScriptVersion: false,
      },
    },
  },
  tseslint.configs.recommended,
  {
    rules: {
      'no-console': 'warn',
    },
  },
  {
    rules: {
      '@typescript-eslint/explicit-function-return-type': 'error',
    },
  },
  eslintPluginPlaywright.configs['flat/recommended'],
  {
    rules: {
      'playwright/no-nested-step': 'off',
    },
    settings: {
      playwright: {
        globalAliases: {
          test: ['setup'],
        },
      },
    },
  },
  eslintPluginPrettierRecommended,
  {
    rules: {
      'prettier/prettier': ['warn', { importOrderSortSpecifiers: true }],
    },
  },
]);
