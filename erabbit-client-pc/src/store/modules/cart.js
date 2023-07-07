import { checkAllCart, deleteCart, findCart, getNewCartGoods, insertCart, mergeCart, updateCart } from '@/api/cart'

// 购物车模块
export default {
    namespaced: true,
    state() {
        return {
            list: [] // 购物车商品列表
        }
    },
    // TODO: 1、组件中获取getters：$store.getters['cart/isCheckAll']
    // TODO: 2、组件中循环getters：<tr v-for="goods in $store.getters['cart/validList']" :key="goods.skuId"></tr>
    getters: {
        // 有效商品列表
        validList(state) {
            // 有效商品：库存大于0  stock  商品有效标识为  true  isEffective
            // console.log('validList', JSON.parse(JSON.stringify(state))) // FIXME: {list: Array(4)}
            return state.list.filter(goods => goods.stock > 0 && goods.isEffective)
        },
        // 有效商品(总件数)
        validTotal(state, getters) {
            return getters.validList.reduce((prev, curr) => prev + curr.count, 0)
        },
        // 有效商品(总金额)
        validAmount(state, getters) {
            // return (getters.validList.reduce((p, c) => p + c.nowPrice * 100 * c.count, 0) / 100).toFixed(2)
            return getters.validList.reduce((prev, curr) => prev + Math.round(curr.nowPrice * 100) * curr.count, 0) / 100
        },
        // 无效商品列表
        invalidList(state) {
            return state.list.filter(goods => goods.stock <= 0 || !goods.isEffective)
        },
        // 已选商品列表
        selectedList(state, getters) {
            return getters.validList.filter(item => item.selected) // Item selected is true / false
        },
        // 已选商品(总件数)
        selectedTotal(state, getters) {
            return getters.selectedList.reduce((prev, curr) => prev + curr.count, 0)
        },
        // 已选商品(总金额)
        selectedAmount(state, getters) {
            return getters.selectedList.reduce((prev, curr) => prev + Math.round(curr.nowPrice * 100) * curr.count, 0) / 100
        },
        // 是否全选 ()
        isCheckAll(state, getters) {
            return getters.validList.length !== 0 && getters.selectedList.length === getters.validList.length
        }
    },
    // TODO: mutations
    mutations: {
        // 加入购物车
        insertCart(state, payload) {
            // 约定加入购物车字段必须和后端保持一致 payload对象 的字段
            // 它们是：id skuId name attrsText picture price nowPrice selected stock count isEffective
            // 插入数据规则：
            // 1. 先找下是否有相同商品
            // 2. 如果有相同的商品，查询它的数量，累加到payload上，再保存最新位置，原来商品需要删除
            // 3. 如果没有相同商品，保存在最新位置即可
            const sameIndex = state.list.findIndex(goods => goods.skuId === payload.skuId)
            if (sameIndex > -1) {
                const count = state.list[sameIndex].count
                payload.count += count
                    // 删除原来
                state.list.splice(sameIndex, 1)
            }
            // 追加新的
            state.list.unshift(payload)
        },
        // 修改购物车商品
        updateCart(state, goods) {
            // goods 商品信息：nowPrice stock isEffective
            // goods 商品对象的字段不固定，对象中有哪些字段就改哪些字段，字段的值合理才改
            // goods 商品对象 必需有SKUID
            // console.log(state)
            // console.log(goods)
            const updateGoods = state.list.find(item => item.skuId === goods.skuId)
                // console.log(updateGoods) // {skuId: '300287220', attrsText: '颜色：卡其绿 尺码：XL',  name: '瑜伽裸感女式运动训练紧身裤', …}
            for (const key in goods) {
                // console.log('key', key) // skuId, selected
                // console.log('key', key) // skuId, count
                if (goods[key] !== undefined && goods[key] !== null && goods[key] !== '') {
                    updateGoods[key] = goods[key]
                }
            }
        },
        // 删除购物车商品
        deleteCart(state, skuId) {
            const index = state.list.findIndex(item => item.skuId === skuId)
            state.list.splice(index, 1)
        },
        // 设置购物车
        setCart(state, payload) {
            // payload 为空数组，清空。为又值数组，设置。
            state.list = payload
        }
    },
    // TODO: actions
    actions: {
        // 合并购物车
        async mergeCart(ctx) {
            // 准备合并的参数
            const cartList = ctx.state.list.map(goods => {
                return {
                    skuId: goods.skuId,
                    selected: goods.selected,
                    count: goods.count
                }
            })
            await mergeCart(cartList)
                // 合并成功，清空本地购物车
            ctx.commit('setCart', [])
        },
        // 修改规格
        updateCartSku(ctx, { oldSkuId, newSku }) {
            // skuId, newSku: 300287226  {skuId: '300287218', price: '83.90', oldPrice: '149.90', specsText: '颜色：卡其绿 尺码：M'}
            return new Promise((resolve, reject) => {
                if (ctx.rootState.user.profile.token) {
                    // 已登录
                    // 1. 找出旧的商品信息
                    // 2. 删除旧商品数据
                    // 3. 原先商品的数量+新skuId
                    // 4. 添加新的商品
                    const oldGoods = ctx.state.list.find(item => item.skuId === oldSkuId)
                    deleteCart([oldGoods.skuId]).then(() => {
                        return insertCart({ skuId: newSku.skuId, count: oldGoods.count })
                    }).then(() => {
                        return findCart()
                    }).then(data => {
                        ctx.commit('setCart', data.result)
                        resolve()
                    })
                } else {
                    // 未登录
                    // 1. 找出旧的商品信息
                    // 2. 删除旧商品数据
                    // 3. 根据新的sku信息和旧的商品信息，合并成一条新的购物车商品数据
                    // 4. 添加新的商品
                    const oldGoods = ctx.state.list.find(item => item.skuId === oldSkuId)
                    ctx.commit('deleteCart', oldSkuId)
                    const { skuId, price: nowPrice, specsText: attrsText, inventory: stock } = newSku
                    const newGoods = {...oldGoods, skuId, nowPrice, attrsText, stock }
                    ctx.commit('insertCart', newGoods)
                    resolve()
                }
            })
        },
        // 批量删除
        batchDeleteCart(ctx, isClear) { // isClear: Boolean
            return new Promise((resolve, reject) => {
                if (ctx.rootState.user.profile.token) {
                    // 已登录
                    const ids = ctx.getters[isClear ? 'invalidList' : 'selectedList'].map(item => item.skuId)
                    deleteCart(ids).then(() => {
                        return findCart()
                    }).then(data => {
                        ctx.commit('setCart', data.result)
                        resolve()
                    })
                } else {
                    // 未登录
                    // 找出选中的商品列表，遍历调用删除的mutations
                    // isClear 未 true  删除失效商品列表，否则事选中的商品列表
                    ctx.getters[isClear ? 'invalidList' : 'selectedList'].forEach(item => {
                            ctx.commit('deleteCart', item.skuId)
                        })
                        // ctx.getters['invalidList']
                    resolve()
                }
            })
        },
        // 全选与取消全选
        checkAllCart(ctx, selected) { // FIXME: selected: Boolean
            return new Promise((resolve, reject) => {
                if (ctx.rootState.user.profile.token) {
                    // 已登录
                    const ids = ctx.getters.validList.map(item => item.skuId)
                    checkAllCart({ selected, ids }).then(() => {
                        return findCart()
                    }).then(data => {
                        ctx.commit('setCart', data.result)
                        resolve()
                    })
                } else {
                    // 未登录
                    ctx.getters.validList.forEach(goods => {
                        ctx.commit('updateCart', { skuId: goods.skuId, selected })
                    })
                    resolve()
                }
            })
        },
        // 修改购物车（选中状态，数量）
        updateCart(ctx, payload) { // FIXME: payload 需要：必需有skuId  可能：selected  count
            // console.log(payload) // Gouxuan: {skuId: '300287220', selected: true}
            // console.log(payload) // Shuliang: {skuId: '300287220', count: 4}
            return new Promise((resolve, reject) => {
                if (ctx.rootState.user.profile.token) {
                    // 已登录
                    updateCart(payload).then(() => {
                        return findCart()
                    }).then(data => {
                        ctx.commit('setCart', data.result)
                        resolve()
                    })
                } else {
                    // 未登录
                    ctx.commit('updateCart', payload)
                    resolve()
                }
            })
        },
        // 删除购物车
        deleteCart(ctx, payload) { // 单条删除 payload 现在  就是skuId
            return new Promise((resolve, reject) => {
                if (ctx.rootState.user.profile.token) {
                    // 已登录
                    deleteCart([payload]).then(() => { return findCart() }).then(data => {
                        ctx.commit('setCart', data.result)
                        resolve()
                    })
                } else {
                    // 未登录
                    // 单条删除 payload 现在  就是skuId
                    ctx.commit('deleteCart', payload)
                    resolve()
                }
            })
        },
        // 加入购物车
        insertCart(ctx, payload) {
            return new Promise((resolve, reject) => {
                if (ctx.rootState.user.profile.token) {
                    // 已登录
                    insertCart({ skuId: payload.skuId, count: payload.count }).then(() => {
                        return findCart()
                    }).then(data => {
                        ctx.commit('setCart', data.result)
                        resolve()
                    })
                } else {
                    // 未登录
                    ctx.commit('insertCart', payload)
                    resolve()
                }
            })
        },
        // 获取商品列表
        findCart(ctx) {
            return new Promise((resolve, reject) => {
                if (ctx.rootState.user.profile.token) {
                    // 已登录
                    findCart().then(data => {
                        ctx.commit('setCart', data.result)
                        resolve()
                    })
                } else {
                    // 未登录
                    // 同时发送请求（有几个商品发几个请求）等所有请求成功，一并去修改本地数据。
                    // Promise.all(promise数组).then((dataList)=>{})  同时发请求，所有请求成功，得到所有成功结果
                    // Promise.resolve() Promise.reject() new Promise()
                    // Promise.race(promise数组).then((data)=>{}) 同时发请求，最快的请求成功，得到成功结果
                    const promiseArr = ctx.state.list.map(goods => {
                            return getNewCartGoods(goods.skuId)
                        })
                        // dataList成功结果的集合，数据顺序和promiseArr顺序一致，它又是根据state.list而来
                    Promise.all(promiseArr).then(dataList => {
                        // 更新本地购物车
                        dataList.forEach((data, i) => {
                                ctx.commit('updateCart', { skuId: ctx.state.list[i].skuId, ...data.result })
                            })
                            // 调用resolve代表操作成功
                        resolve()
                    })
                }
            })
        }
    }
}