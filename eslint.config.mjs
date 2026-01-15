import js from '@eslint/js';
import tseslint from '@typescript-eslint/eslint-plugin';
import tsParser from '@typescript-eslint/parser';

export default [
  {
    ignores: ['dist/**', 'node_modules/**']
  },
  js.configs.recommended,
  {
    files: ['**/*.ts'],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        sourceType: 'module',
        ecmaVersion: 2022
      }
    },
    plugins: {
      '@typescript-eslint': tseslint
    },
    rules: {
      '@typescript-eslint/member-ordering': [
        'error',
        {
          default: [
            'public-static-field',
            'public-static-method',
            'public-instance-field',
            'public-instance-method',
            'protected-static-field',
            'protected-static-method',
            'protected-instance-field',
            'protected-instance-method',
            'private-static-field',
            'private-static-method',
            'private-instance-field',
            'private-instance-method'
          ]
        }
      ],
      '@typescript-eslint/no-explicit-any': 'error',
      'no-var': 'error',
      'prefer-const': 'error',
      'indent': ['error', 2, { SwitchCase: 1 }],
      'block-spacing': ['error', 'always'],
      'no-duplicate-imports': 'error',
      'object-shorthand': 'error',
      'prefer-template': 'error',
      'prefer-arrow-callback': 'error',
      'arrow-body-style': ['error', 'as-needed'],
      'no-useless-constructor': 'off',
      '@typescript-eslint/no-useless-constructor': 'error',
      'no-dupe-class-members': 'off',
      '@typescript-eslint/no-dupe-class-members': 'error',
      'no-class-assign': 'error',
      'no-const-assign': 'error',
      'no-this-before-super': 'error',
      'constructor-super': 'error',
      'no-new-symbol': 'error',
      'symbol-description': 'error',
      'no-useless-computed-key': 'error'
    }
  }
];

