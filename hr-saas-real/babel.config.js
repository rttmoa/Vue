


module.exports = {
  presets: [
    // https://github.com/vuejs/vue-cli/tree/master/packages/@vue/babel-preset-app
    '@vue/cli-plugin-babel/preset'
  ],
  'env': {
    // TODO: babel-plugin-dynamic-import-node 插件只做一件事，将所有 import() 转换为 require()
    // TODO: 当你有大量页面时，这个插件可以显着提高热更新的速度.
    // TODO: vue-element-admin: https://panjiachen.github.io/vue-element-admin-site/guide/advanced/lazy-loading.html
    'development': {
      'plugins': ['dynamic-import-node']
    }
  }
}
