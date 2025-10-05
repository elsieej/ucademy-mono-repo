import eslint from '@eslint/js'
import tseslint from 'typescript-eslint'
import prettierConfig from 'eslint-config-prettier'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import eslintPluginPrettier from 'eslint-plugin-prettier'
import globals from 'globals'

const sharedRules = {
  ...prettierConfig.rules,
  '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_', varsIgnorePattern: '^_' }],
  '@typescript-eslint/restrict-template-expressions': ['warn', { allowNumber: true, allowBoolean: true }],
  'prettier/prettier': [
    'warn',
    {
      arrowParens: 'always',
      semi: false,
      trailingComma: 'none',
      tabWidth: 2,
      endOfLine: 'auto',
      useTabs: false,
      singleQuote: true,
      printWidth: 120,
      jsxSingleQuote: true
    }
  ]
}

export default [
  {
    ignores: ['**/node_modules/**', '**/dist/**', '**/assets/**']
  },
  eslint.configs.recommended,
  ...tseslint.configs.recommended,
  /* Client package (React) */
  {
    files: ['packages/client/src/**/*.{ts,tsx}'],
    languageOptions: {
      ecmaVersion: 2020,
      parser: tseslint.parser,
      parserOptions: {
        project: './packages/client/tsconfig.app.json',
        tsconfigRootDir: import.meta.dirname
      },
      globals: globals.browser
    },
    plugins: {
      '@typescript-eslint': tseslint.plugin,
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
      prettier: eslintPluginPrettier
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      ...sharedRules
    }
  },
  {
    files: ['packages/client/*.{ts,js}', 'packages/client/*.config.{ts,js}'],
    languageOptions: {
      ecmaVersion: 2020,
      parser: tseslint.parser,
      parserOptions: {
        project: './packages/client/tsconfig.node.json',
        tsconfigRootDir: import.meta.dirname
      },
      globals: globals.node
    },
    plugins: {
      '@typescript-eslint': tseslint.plugin,
      prettier: eslintPluginPrettier
    },
    rules: sharedRules
  },
  /* Node.js packages (server, models) */
  {
    files: ['packages/{server,models}/**/*.{js,mjs,cjs,ts}'],
    languageOptions: {
      ecmaVersion: 2021,
      parser: tseslint.parser,
      parserOptions: { project: true, tsconfigRootDir: import.meta.dirname },
      globals: globals.node
    },
    plugins: {
      '@typescript-eslint': tseslint.plugin,
      prettier: eslintPluginPrettier
    },
    rules: sharedRules
  }
]
