"use strict";

var _vue = require("vue");

var _App = _interopRequireDefault(require("./App.vue"));

var _router = _interopRequireDefault(require("./router"));

var _store = _interopRequireDefault(require("./store"));

var _library = _interopRequireDefault(require("@/components/library"));

require("normalize.css");

require("@/assets/styles/common.less");

require("@/mock");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

// 路由模块：布局，首页，登陆，支付，购物车 等等
// Store：购物车，用户信息，文章分类
// UrlAddress
// 首页：     http://localhost:8080/#/
// 分类：     http://localhost:8080/#/category/1043000
// 详情分类： http://localhost:8080/#/category/sub/1008006
// 商品详情： http://localhost:8080/#/product/3434008
// 购物车：   http://localhost:8080/#/cart
// 登陆：     http://localhost:8080/#/login
// 联合登陆： http://localhost:8080/#/login/callback
// member未激活
// 详解vue保存自动格式化换行: http://www.js-code.com/javascript/javascript_85271.html
// 导入自己UI组件库(Confirm, Message)
// 1. 重置样式的库
// 2. 自己项目的重置样式和公用样式
// mockjs(假数据)
// TODO: 注册： Appjs、Store、Router、UI
(0, _vue.createApp)(_App["default"]).use(_store["default"]).use(_router["default"]).use(_library["default"]).mount('#app');