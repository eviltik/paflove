module.exports = {
    env: {
        'browser': true,
        'es6': true,
        'node': true,
        'module': true
    },
    extends: 'eslint:recommended',
    parserOptions: {
        'sourceType': 'module',
    },
    rules: {
        'indent': ['error', 4],
        'linebreak-style': ['error', 'unix'],
        'quotes': ['error', 'single'],
        'semi': ['error', 'always'],
        'no-unused-vars': ['warn', 'all'],
        'no-var': ['warn'],
        'no-console': 'off',
        'object-curly-spacing':['error','always'],
        'space-in-parens':[ 'error','always' ]
    },
    ignorePatterns: [
        'node_modules',
        'src/dist'
    ],
    'globals':{
        'PubSub': true
    }
};

