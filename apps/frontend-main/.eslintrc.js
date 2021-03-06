/* eslint unicorn/prefer-module: 0 */

module.exports = {
    parserOptions: {
        ecmaVersion: 2020,
        ecmaFeatures: {
            jsx: true,
            impliedStrict: true,
        },
    },
    env: {
        browser: true,
        es6: true,
        jest: true,
    },
    settings: {
        react: {
            version: 'detect',
        },
    },
    overrides: [],
    globals: {
        log: 'writable', // This is the "logger" defined in "utilities/logger.js"
    },
    plugins: ['react-redux', 'json'],
    extends: [
        'eslint:recommended',

        'react-app', // From Create-React-App
        'react-app/jest', // From Create-React-App

        'airbnb', // Has rules for both JS & React.
        'airbnb/hooks',

        'plugin:unicorn/recommended', // Various awesome ESLint rules.
        'plugin:react-redux/recommended', // Redux Related Rules.
        'plugin:sonarjs/recommended', // Bug Detection & Code Smell Detection.
        'plugin:promise/recommended', // Promise Related Rules.

        'prettier', // From 'eslint-config-prettier'. To play nice with Prettier. (For Ex. it turns off all ESLint rules that are unnecessary or might conflict with Prettier.). Make sure to put this at last, so it gets the chance to override other configs.
        'plugin:prettier/recommended', // From 'eslint-plugin-prettier'. To Runs Prettier as an ESLint rule and reports differences as individual ESLint issues.)
    ],
    rules: {
        camelcase: 'off',
        'no-console': 'off',
        'no-unused-vars': 'warn',
        'func-names': 'off',
        'no-return-await': 'off',
        'no-else-return': 'off',
        'class-methods-use-this': 'off',

        'jsx-a11y/anchor-is-valid': 'off',
        'jsx-a11y/no-noninteractive-element-interactions': 'off',
        'jsx-a11y/click-events-have-key-events': 'off',

        'react/prop-types': 'off',
        'react/jsx-filename-extension': 'off',
        'react/react-in-jsx-scope': 'off',
        'react/prefer-stateless-function': 'off',
        'react/jsx-props-no-spreading': 'off',
        'react-redux/prefer-separate-component-file': 'off',

        'promise/always-return': 'warn',

        'import/prefer-default-export': 'off',

        'unicorn/no-null': 'off',
        'unicorn/prevent-abbreviations': 'off',
        'unicorn/filename-case': 'off',
        'unicorn/prefer-ternary': 'off',

        'sonarjs/no-duplicate-string': 'off',
        'sonarjs/no-small-switch': 'off',

        'import/order': [
            'error',
            {
                groups: [
                    'builtin',
                    'external',
                    'internal',
                    'parent',
                    'sibling',
                    'index',
                    'object',
                ],
                'newlines-between': 'always',
                alphabetize: {
                    order: 'asc',
                    caseInsensitive: true,
                },
            },
        ],
        'sort-vars': ['warn'],
        'json/*': ['error', { allowComments: true }], // Ability to lint JSON. (NOT Reliable)
    },
};
