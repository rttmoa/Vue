"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _cart = require("@/api/cart");

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(source, true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(source).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var _default = {
  namespaced: true,
  state: function state() {
    return {
      // 购物车商品列表
      list: []
    };
  },
  getters: {
    // 有效商品列表
    validList: function validList(state) {
      // 有效商品：库存大于0  stock  商品有效标识为  true  isEffective
      return state.list.filter(function (goods) {
        return goods.stock > 0 && goods.isEffective;
      });
    },
    // 有效商品总件数
    validTotal: function validTotal(state, getters) {
      return getters.validList.reduce(function (p, c) {
        return p + c.count;
      }, 0);
    },
    // 有效商品总金额
    validAmount: function validAmount(state, getters) {
      // return (getters.validList.reduce((p, c) => p + c.nowPrice * 100 * c.count, 0) / 100).toFixed(2)
      return getters.validList.reduce(function (p, c) {
        return p + Math.round(c.nowPrice * 100) * c.count;
      }, 0) / 100;
    },
    // 无效商品列表
    invalidList: function invalidList(state) {
      return state.list.filter(function (goods) {
        return goods.stock <= 0 || !goods.isEffective;
      });
    },
    // 已选商品列表
    selectedList: function selectedList(state, getters) {
      return getters.validList.filter(function (item) {
        return item.selected;
      });
    },
    // 已选商品总件数
    selectedTotal: function selectedTotal(state, getters) {
      return getters.selectedList.reduce(function (p, c) {
        return p + c.count;
      }, 0);
    },
    // 已选商品总金额
    selectedAmount: function selectedAmount(state, getters) {
      return getters.selectedList.reduce(function (p, c) {
        return p + Math.round(c.nowPrice * 100) * c.count;
      }, 0) / 100;
    },
    // 是否全选
    isCheckAll: function isCheckAll(state, getters) {
      return getters.validList.length !== 0 && getters.selectedList.length === getters.validList.length;
    }
  },
  mutations: {
    // 加入购物车
    insertCart: function insertCart(state, payload) {
      // 约定加入购物车字段必须和后端保持一致 payload对象 的字段
      // 它们是：id skuId name attrsText picture price nowPrice selected stock count isEffective
      // 插入数据规则：
      // 1. 先找下是否有相同商品
      // 2. 如果有相同的商品，查询它的数量，累加到payload上，再保存最新位置，原来商品需要删除
      // 3. 如果没有相同商品，保存在最新位置即可
      var sameIndex = state.list.findIndex(function (goods) {
        return goods.skuId === payload.skuId;
      });

      if (sameIndex > -1) {
        var count = state.list[sameIndex].count;
        payload.count += count; // 删除原来

        state.list.splice(sameIndex, 1);
      } // 追加新的


      state.list.unshift(payload);
    },
    // 修改购物车商品
    updateCart: function updateCart(state, goods) {
      // goods 商品信息：nowPrice stock isEffective
      // goods 商品对象的字段不固定，对象中有哪些字段就改哪些字段，字段的值合理才改
      // goods 商品对象 必需有SKUID
      var updateGoods = state.list.find(function (item) {
        return item.skuId === goods.skuId;
      });

      for (var key in goods) {
        if (goods[key] !== undefined && goods[key] !== null && goods[key] !== '') {
          updateGoods[key] = goods[key];
        }
      }
    },
    // 删除购物车商品
    deleteCart: function deleteCart(state, skuId) {
      var index = state.list.findIndex(function (item) {
        return item.skuId === skuId;
      });
      state.list.splice(index, 1);
    },
    // 设置购物车
    setCart: function setCart(state, payload) {
      // payload 为空数组，清空。为又值数组，设置。
      state.list = payload;
    }
  },
  actions: {
    // 合并购物车
    mergeCart: function mergeCart(ctx) {
      var cartList;
      return regeneratorRuntime.async(function mergeCart$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              // 准备合并的参数
              cartList = ctx.state.list.map(function (goods) {
                return {
                  skuId: goods.skuId,
                  selected: goods.selected,
                  count: goods.count
                };
              });
              _context.next = 3;
              return regeneratorRuntime.awrap((0, _cart.mergeCart)(cartList));

            case 3:
              // 合并成功，清空本地购物车
              ctx.commit('setCart', []);

            case 4:
            case "end":
              return _context.stop();
          }
        }
      });
    },
    // 修改规格
    updateCartSku: function updateCartSku(ctx, _ref) {
      var oldSkuId = _ref.oldSkuId,
          newSku = _ref.newSku;
      return new Promise(function (resolve, reject) {
        if (ctx.rootState.user.profile.token) {
          // 已登录
          // 1. 找出旧的商品信息
          // 2. 删除旧商品数据
          // 3. 原先商品的数量+新skuId
          // 4. 添加新的商品
          var oldGoods = ctx.state.list.find(function (item) {
            return item.skuId === oldSkuId;
          });
          (0, _cart.deleteCart)([oldGoods.skuId]).then(function () {
            return (0, _cart.insertCart)({
              skuId: newSku.skuId,
              count: oldGoods.count
            });
          }).then(function () {
            return (0, _cart.findCart)();
          }).then(function (data) {
            ctx.commit('setCart', data.result);
            resolve();
          });
        } else {
          // 未登录
          // 1. 找出旧的商品信息
          // 2. 删除旧商品数据
          // 3. 根据新的sku信息和旧的商品信息，合并成一条新的购物车商品数据
          // 4. 添加新的商品
          var _oldGoods = ctx.state.list.find(function (item) {
            return item.skuId === oldSkuId;
          });

          ctx.commit('deleteCart', oldSkuId);
          var skuId = newSku.skuId,
              nowPrice = newSku.price,
              attrsText = newSku.specsText,
              stock = newSku.inventory;

          var newGoods = _objectSpread({}, _oldGoods, {
            skuId: skuId,
            nowPrice: nowPrice,
            attrsText: attrsText,
            stock: stock
          });

          ctx.commit('insertCart', newGoods);
          resolve();
        }
      });
    },
    // 批量删除
    batchDeleteCart: function batchDeleteCart(ctx, isClear) {
      return new Promise(function (resolve, reject) {
        if (ctx.rootState.user.profile.token) {
          // 已登录
          var ids = ctx.getters[isClear ? 'invalidList' : 'selectedList'].map(function (item) {
            return item.skuId;
          });
          (0, _cart.deleteCart)(ids).then(function () {
            return (0, _cart.findCart)();
          }).then(function (data) {
            ctx.commit('setCart', data.result);
            resolve();
          });
        } else {
          // 未登录
          // 找出选中的商品列表，遍历调用删除的mutations
          // isClear 未 true  删除失效商品列表，否则事选中的商品列表
          ctx.getters[isClear ? 'invalidList' : 'selectedList'].forEach(function (item) {
            ctx.commit('deleteCart', item.skuId);
          });
          resolve();
        }
      });
    },
    // 全选与取消全选
    checkAllCart: function checkAllCart(ctx, selected) {
      return new Promise(function (resolve, reject) {
        if (ctx.rootState.user.profile.token) {
          // 已登录
          var ids = ctx.getters.validList.map(function (item) {
            return item.skuId;
          });
          (0, _cart.checkAllCart)({
            selected: selected,
            ids: ids
          }).then(function () {
            return (0, _cart.findCart)();
          }).then(function (data) {
            ctx.commit('setCart', data.result);
            resolve();
          });
        } else {
          // 未登录
          ctx.getters.validList.forEach(function (goods) {
            ctx.commit('updateCart', {
              skuId: goods.skuId,
              selected: selected
            });
          });
          resolve();
        }
      });
    },
    // 修改购物车（选中状态，数量）
    updateCart: function updateCart(ctx, payload) {
      // payload 需要：必需有skuId  可能：selected  count
      return new Promise(function (resolve, reject) {
        if (ctx.rootState.user.profile.token) {
          // 已登录
          (0, _cart.updateCart)(payload).then(function () {
            return (0, _cart.findCart)();
          }).then(function (data) {
            ctx.commit('setCart', data.result);
            resolve();
          });
        } else {
          // 未登录
          ctx.commit('updateCart', payload);
          resolve();
        }
      });
    },
    // 删除购物车
    deleteCart: function deleteCart(ctx, payload) {
      return new Promise(function (resolve, reject) {
        if (ctx.rootState.user.profile.token) {
          // 已登录
          (0, _cart.deleteCart)([payload]).then(function () {
            return (0, _cart.findCart)();
          }).then(function (data) {
            ctx.commit('setCart', data.result);
            resolve();
          });
        } else {
          // 未登录
          // 单条删除 payload 现在  就是skuId
          ctx.commit('deleteCart', payload);
          resolve();
        }
      });
    },
    // 加入购物车
    insertCart: function insertCart(ctx, payload) {
      return new Promise(function (resolve, reject) {
        if (ctx.rootState.user.profile.token) {
          // 已登录
          (0, _cart.insertCart)({
            skuId: payload.skuId,
            count: payload.count
          }).then(function () {
            return (0, _cart.findCart)();
          }).then(function (data) {
            ctx.commit('setCart', data.result);
            resolve();
          });
        } else {
          // 未登录
          ctx.commit('insertCart', payload);
          resolve();
        }
      });
    },
    // 获取商品列表
    findCart: function findCart(ctx) {
      return new Promise(function (resolve, reject) {
        if (ctx.rootState.user.profile.token) {
          // 已登录
          (0, _cart.findCart)().then(function (data) {
            ctx.commit('setCart', data.result);
            resolve();
          });
        } else {
          // 未登录
          // 同时发送请求（有几个商品发几个请求）等所有请求成功，一并去修改本地数据。
          // Promise.all(promise数组).then((dataList)=>{})  同时发请求，所有请求成功，得到所有成功结果
          // Promise.resolve() Promise.reject() new Promise()
          // Promise.race(promise数组).then((data)=>{}) 同时发请求，最快的请求成功，得到成功结果
          var promiseArr = ctx.state.list.map(function (goods) {
            return (0, _cart.getNewCartGoods)(goods.skuId);
          }); // dataList成功结果的集合，数据顺序和promiseArr顺序一致，它又是根据state.list而来

          Promise.all(promiseArr).then(function (dataList) {
            // 更新本地购物车
            dataList.forEach(function (data, i) {
              ctx.commit('updateCart', _objectSpread({
                skuId: ctx.state.list[i].skuId
              }, data.result));
            }); // 调用resolve代表操作成功

            resolve();
          });
        }
      });
    }
  }
};
exports["default"] = _default;