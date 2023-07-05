module.exports = {
    root: true,
    env: {
        node: true
    },
    extends: [
        'plugin:vue/vue3-essential',
        '@vue/standard'
    ],
    parserOptions: {
        parser: 'babel-eslint'
    },
    rules: {
        'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
        'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
        // "eslint no-multiple-empty-lines": ["error", { "max": 8, "maxEOF": 0 }],
        'no-multiple-empty-lines': [2, { 'max': 8 }],
        'eol-last': 0, // 取消最后一个空行的规则校验
        "indent": 0, // 12:1  error  Expected indentation of 2 spaces but found 4
        "space-before-function-paren": 0, // error Missing space before function parentheses space-before-function-paren
    }
}