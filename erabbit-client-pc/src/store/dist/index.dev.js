"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _vuex = require("vuex");

var _vuexPersistedstate = _interopRequireDefault(require("vuex-persistedstate"));

var _cart = _interopRequireDefault(require("./modules/cart"));

var _user = _interopRequireDefault(require("./modules/user"));

var _category = _interopRequireDefault(require("./modules/category"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

// 持久化存储Store
// 三个模块
var _default = (0, _vuex.createStore)({
  modules: {
    cart: _cart["default"],
    user: _user["default"],
    category: _category["default"]
  },
  // 配置插件
  plugins: [// 默认存储在localStorage
  (0, _vuexPersistedstate["default"])({
    // 本地存储名字
    key: 'erabbit-client-pc-124-store',
    // 指定需要存储的模块
    paths: ['user', 'cart']
  })]
});

exports["default"] = _default;