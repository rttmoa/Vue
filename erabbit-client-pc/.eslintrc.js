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
        'eol-last': 0, // 取消最后一个空行的规则校验
        // "indent": 0, // 12:1  error  Expected indentation of 2 spaces but found 4
        // "space-before-function-paren": 0, // error Missing space before function parentheses space-before-function-paren
        // "no-unused-vars": ["error", { "vars": "all", "args": "none", "ignoreRestSiblings": true }],
        // 'indent': ['off', 2],
        // 'object-curly-spacing': ["error", "never", { "arraysInObjects": true }]
        'no-console': 'off',
        'no-irregular-whitespace': 'off',
        "space-before-function-paren": "off", //取消函数前的空格
        "object-curly-spacing": "off", //取消括号内的间距一致
        'indent': 'off', //取消对每行前空格的检测（该换行还是要换的）

    }
}