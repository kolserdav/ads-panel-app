module.exports = {
  env: {
    browser: true,
    es6: true,
    jest: true,
  },
  parser: 'babel-eslint',
  extends: ['airbnb', 'prettier', 'prettier/react'],
  globals: {
    Atomics: 'readonly',
    SharedArrayBuffer: 'readonly',
  },
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
      modules: true,
    },
    ecmaVersion: 2018,
    sourceType: 'module',
  },
  plugins: ['react', 'prettier'],
  ignorePatterns: ['**/*.d.ts', 'build', 'tmp'],
  rules: {
    'prefer-const': 1,
    'react/jsx-boolean-value': 0,
    'dot-notation': 1,
    'spaced-comment': 1,
    'no-underscore-dangle': 0,
    'no-unused-vars': 1,
    'import/prefer-default-export': 1,
    'prettier/prettier': 'warn',
    'react/jsx-filename-extension': [1, { extensions: ['.js', '.jsx', '.ts', '.tsx'] }],
    'react/forbid-prop-types': [0, { forbid: ['any'] }],
    'react/prop-types': 0,
    'import/extensions': 0,
    'import/no-unresolved': 0,
  },
};
