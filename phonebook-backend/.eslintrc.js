module.exports = {
    "env": {
        "node": true,
        "commonjs": true,
        "es2021": true
    },
    "extends": [
        "eslint:recommended",
        "plugin:react/recommended"
    ],
    "parserOptions": {
        "ecmaFeatures": {
            "jsx": true
        },
        "ecmaVersion": 15
    },
    "plugins":
        [
            "react",
            '@stylistic/js',
        ],
    "rules": {
        '@stylistic/js/indent': [
            'error',
            4
        ],
        '@stylistic/js/linebreak-style': 'off',
        // '@stylistic/js/linebreak-style': [
        //     'error',
        //     'windows'
        // ],
        // '@stylistic/js/quotes': [
        //     'error',
        //     'single'
        // ],
        '@stylistic/js/semi': [
            'error',
            'never'
        ],
        'eqeqeq': 'error',
        'no-trailing-spaces': [
            "error",
            { "ignoreComments": true },
            { "skipBlankLines": true }
        ],
        'object-curly-spacing': [
            'error', 'always'
        ],
        'arrow-spacing': [
            'error', { 'before': true, 'after': true }
        ],
        'no-console': 0
    }
}
