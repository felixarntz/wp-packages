import { defineConfig } from 'eslint/config';
import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';
import prettierConfig from 'eslint-config-prettier';
import importPlugin from 'eslint-plugin-import';
import jsxA11yPlugin from 'eslint-plugin-jsx-a11y';
import jsdocPlugin from 'eslint-plugin-jsdoc';
import tsdocPlugin from 'eslint-plugin-tsdoc';
import prettierPlugin from 'eslint-plugin-prettier';
import wordpressPlugin from '@wordpress/eslint-plugin';
import globals from 'globals';

export default defineConfig(
  {
    // Global ignores.
    ignores: [
      'node_modules/*',
      'eslint.config.js',
      'packages/**/build/**',
      'packages/**/build-module/**',
      'packages/**/build-style/**',
      'packages/**/build-types/**',
	  'typings/*',
    ],
  },
  eslint.configs.recommended,
  tseslint.configs.recommended,

  // General overrides and rules for the project (TS/TSX files).
  {
    files: ['packages/*/src/**/*.{ts,tsx}'],
    plugins: {
      import: importPlugin,
	  'jsx-a11y': jsxA11yPlugin,
      jsdoc: jsdocPlugin,
      tsdoc: tsdocPlugin,
	  prettier: prettierPlugin,
	  '@wordpress': wordpressPlugin,
    },
    settings: {
      'import/resolver': {
        typescript: true,
        node: true,
      },
    },
    languageOptions: {
      globals: {
        ...globals.node,
        ...globals.es2021,
      },
    },
    rules: {
      // TypeScript best practices.
      '@typescript-eslint/array-type': ['error', { default: 'array-simple' }],
      'arrow-body-style': ['error', 'as-needed'],
      curly: ['error', 'multi-line'],
      eqeqeq: ['error', 'always', { null: 'ignore' }],
      '@typescript-eslint/consistent-type-assertions': [
        'error',
        { assertionStyle: 'as' },
      ],
      '@typescript-eslint/explicit-member-accessibility': [
        'error',
        { accessibility: 'no-public' },
      ],
      '@typescript-eslint/no-explicit-any': 'error',
      '@typescript-eslint/no-inferrable-types': [
        'error',
        { ignoreParameters: true, ignoreProperties: true },
      ],
      '@typescript-eslint/consistent-type-imports': [
        'error',
        { disallowTypeAnnotations: false },
      ],
      '@typescript-eslint/no-namespace': ['error', { allowDeclarations: true }],
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
          caughtErrorsIgnorePattern: '^_',
        },
      ],

      // Import rules.
      ...importPlugin.configs.recommended.rules,
      ...importPlugin.configs.typescript.rules,
      'import/namespace': 'off', // Unnecessary with TS, and causing incorrect errors.
      'import/no-default-export': 'error',
      //'import/no-internal-modules': 'error',
      'import/no-relative-packages': 'error',
      'import/order': 'error',

	  // JSX A11Y rules.
	  ...jsxA11yPlugin.configs.recommended.rules,

      // Inline documentation requirements.
      'jsdoc/require-jsdoc': [
        'error',
        {
          require: {
            FunctionDeclaration: true,
            MethodDefinition: true,
            ClassDeclaration: true,
            ArrowFunctionExpression: false,
            FunctionExpression: true,
          },
        },
      ],
      'jsdoc/require-description': 'error',
      'jsdoc/require-param': 'error',
      'jsdoc/require-param-description': 'error',
      'jsdoc/require-param-name': 'error',
      'jsdoc/require-param-type': 'off',
      'jsdoc/require-returns-check': 'error',
      'jsdoc/require-returns-description': 'error',
      'jsdoc/require-returns-type': 'off',
      'jsdoc/require-returns': 'error',
      'tsdoc/syntax': 'error',

	  // Prettier integration.
	  ...prettierPlugin.configs.recommended.rules,

	  // WordPress specific rules.
	  ...wordpressPlugin.configs.recommended.rules,

      // General best practices.
      'no-cond-assign': 'error',
      'no-debugger': 'error',
      'no-duplicate-case': 'error',
      'no-restricted-syntax': [
        'error',
        {
          selector: 'CallExpression[callee.name="require"]',
          message: 'Avoid using require(). Use ES6 imports instead.',
        },
        {
          selector: 'ThrowStatement > Literal:not([value=/^\\w+Error:/])',
          message:
            'Do not throw string literals or non-Error objects. Throw new Error("...") instead.',
        },
        {
          selector:
            'ImportDeclaration[source.value=/\\.(js|jsx|ts|tsx)$/]:not([source.value=/node_modules/])',
          message:
            'Do not use file extensions in local imports. Use "from \'./file\'" instead of "from \'./file.js\'".',
        },
      ],
      'no-unsafe-finally': 'error',
      'no-unused-expressions': 'off', // Disable base rule to use TS version.
      '@typescript-eslint/no-unused-expressions': 'error',
      'no-var': 'error',
      'object-shorthand': 'error',
      'one-var': ['error', 'never'],
      'prefer-arrow-callback': 'error',
      'prefer-const': ['error', { destructuring: 'all' }],
      radix: 'error',
    },
  },

  // Other TS/TSX/JS files outside of packages.
  {
    files: ['./**/*.{tsx,ts,js}'],
    plugins: {
      import: importPlugin,
    },
    rules: {
      'import/enforce-node-protocol-usage': ['error', 'always'],
    },
  },

  // Prettier config must be last.
  prettierConfig,
);
