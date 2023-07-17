# 各个模块

#### 购物车

```
cart-none.vue
显示弹出框，点击弹出框其他部分隐藏：
<div class="cart-sku" ref="target"></div> 
import { onClickOutside } from '@vuese/core' 
const close = () => { visible.value = false } 
const target = ref(null) 
onclickOutside(target, () => { close() })
```

```
index.vue
购物车中：vuex状态管理的使用：
1.表头全选按钮：
<th width="120"> <XtxCheckbox @change="checkAll" :modelValue="$store.getter[`cart/isChectAll`]">全选</XtxCheckbox> </th>
2.表格中遍历getters中有效的数据
<tr v-for="goods in $store.getters[`cart/validList`]" :key="goods.skuId"></tr>
3.购物车数量（输入框）：
<td clsss="tc"> <XtxNumbox @change="$event => updateCount(goods.skuId, $event)" :max="goods.stock" :modelValue="goods.count" /> </td>
4.修改数量（Vuex 单个商品）
const updateCount = (skuId, count) => { store.dispatch('cart/updateCart', {skuId, count})}
```

#### 登陆 / 注册

功能：账户登陆 / 扫码登陆 / 短信登陆 / QQ登陆 / 联合登陆

```
callback-bind.vue
表单数据对象、表单校验规则、验证码倒计时、发送验证码、完善信息
1.表单数据对象
const form = reactive({account:null, mobile:null, code:null, password:null, rePassword: null})
2.表单校验规则 (自定义验证规则 Schema)
const mySchema = { account: schema.accountApi, mobile: schema.mobile, code: schema.code, ....}
3.验证码倒计时 
import { reactive, ref, onUnmounted } from 'vue'
const form = ref(null)
const time = ref(0)
const {pause, resume} = useIntervalFn( () => { 
    time.value--
    if(time.value <= 0) pause()
}, 1000, false)
onUnmounted( () => { pause() })
4.发送验证码
const send = () => {
    const valid = mySchema.mobile(form.mobile)
    if(!valid) return
    if(time.value === 0){
        await userQQPatchCode(form.mobile)
        Message({type: "success", text: "发送成功"})
        time.value = 60
        resume()
    }else  from.value.setFieldError("mobile", valid)
}
5.完善信息
const store = useStore()
const router = useRouter()
const submit = () => {
    if(formCom.value.validate()){
        userQQPatchLogin({ unionId: props.unionId, ...form }).then(data => {
            const {id,account,avatar,mobile,nickname,token} = data.result
            store.commit('user/setUser', {id,account,avatar,mobile,nickname,token})
            store.dispatch('cart/mergeCart').then(() => {
                router.push(store.state.user.redirectURL)
                Message({type: "success", text: "QQ完善信息成功"})
            })
        }).catch(e => {})
    }
}
```
