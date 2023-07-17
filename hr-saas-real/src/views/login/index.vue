<template>
  <div class="login-container">

    <!-- 表单提交验证 -->
    <el-form ref="loginForm" :model="loginForm" :rules="loginRules" class="login-form" auto-complete="on" label-position="left">
      <!-- 标题 -->
      <div class="title-container">
        <h3 class="title">
          <img src="@/assets/common/login-logo.png" alt="" />
        </h3>
      </div>
      <!-- FIXME: 手机号验证 -->
      <el-form-item prop="mobile">
        <span class="svg-container">
          <svg-icon icon-class="user" />
        </span>
        <el-input
          ref="username"
          v-model="loginForm.mobile"
          placeholder="请输入手机号"
          type="text"
          tabindex="1"
          auto-complete="on"
        />
      </el-form-item>
      <!-- FIXME: 密码输入框 -->
      <el-form-item prop="password">
        <span class="svg-container">
          <svg-icon icon-class="password" />
        </span>
        <el-input
          :key="passwordType"
          ref="password"
          v-model="loginForm.password"
          :type="passwordType"
          placeholder="请输入密码"
          name="password"
          tabindex="2"
          auto-complete="on"
          @keyup.enter.native="handleLogin"
        />
        <span class="show-pwd" @click="showPwd">
          <svg-icon :icon-class="passwordType === 'password' ? 'eye' : 'eye-open'" />
        </span>
      </el-form-item>

      <el-button class="loginBtn" :loading="loading" type="primary" style="width:100%; margin-bottom:30px;" @click.native.prevent="handleLogin">
        登录
      </el-button>

      <div class="tips">
        <span style="margin-right:20px;">账号: 13800000002</span>
        <span>密码: 123456</span>
      </div>
    </el-form>

  </div>
</template>

<script>
import { validMobile } from '@/utils/validate'
import { mapActions } from 'vuex'
export default {
  name: 'Login',
  data() {
    return {
      loginForm: { mobile: '13800000002', password: '123456' },
      loginRules: {
        mobile: [{ required: true, trigger: 'blur', message: '请输入手机号' }, {
          trigger: 'blur',
          validator: (rule, value, callback) => {validMobile(value) ? callback() : callback(new Error('手机号格式不正确'))}
        }],
        // min   max  校验的字符串 指的是长度 校验的是数字 校验的大小
        password: [
          { required: true, trigger: 'blur', message: '请输入密码' },
          { min: 6, max: 16, message: '密码长度在6-16位之间', trigger: 'blur' }
        ]
      },
      loading: false,
      passwordType: '', // 显示/隐藏 密码
      redirect: undefined
    }
  },
  // TODO: 监听路由变化
  watch: {
    $route: {
      handler: function(route) {
        // console.log("$route", route) // {name: undefined, meta: {…}, path: '/login', hash: '', query: {…}, …}
        this.redirect = route.query && route.query.redirect
      },
      immediate: true
    }
  },
  methods: {
    ...mapActions(['user/login']),
    showPwd() {
      if (this.passwordType === 'password') {
        this.passwordType = ''
      } else {
        this.passwordType = 'password'
      }
      // TODO: dom元素更新后执行，因此这里能正确打印更改之后的值
      this.$nextTick(() => {
        this.$refs.password.focus() // 鼠标聚焦事件
      })
    },
    // 登录
    handleLogin() {
      this.$refs.loginForm.validate(async isOK => { // 通过 loginRules 校验后
        if (isOK) {
          this.loading = true
          try {
            // console.log(this['user/login'])  // ƒ mappedAction () {}
            // console.log(this.loginForm)      // {mobile: "13800000002, "password: "123456"}
            await this['user/login'](this.loginForm)
            this.$router.push('/')
          } catch (error) {
            console.log("登陆失败", error) // FIXME: 在requestjs中 响应的结果 Promise.reject(new Error(Message))
          } finally {
            this.loading = false
          }
        }
      })
    }
  }
}
</script>

<style lang="scss">
/* 修复input 背景不协调 和光标变色 */
/* Detail see https://github.com/PanJiaChen/vue-element-admin/pull/927 */

$bg:#283443;
$light_gray: #68b0fe;
$cursor: #fff;

@supports (-webkit-mask: none) and (not (cater-color: $cursor)) {
  .login-container .el-input input {
    color: $cursor;
  }
}

/* reset element-ui css */
.login-container {
  background-image: url('~@/assets/common/login.jpg');
  background-position: center;
  .el-input {
    display: inline-block;
    height: 47px;
    width: 85%;

    input {
      background: transparent;
      border: 0px;
      -webkit-appearance: none;
      border-radius: 0px;
      padding: 12px 5px 12px 15px;
      color: $light_gray;
      height: 47px;
      caret-color: $cursor;

      &:-webkit-autofill {
        box-shadow: 0 0 0px 1000px $bg inset !important;
        -webkit-text-fill-color: $cursor !important;
      }
    }
  }

  .el-form-item {
    border: 1px solid rgba(255, 255, 255, 0.1);
    background: rgba(255, 255, 255, 0.7); // 输入登录表单的背景色
    border-radius: 5px;
    color: #454545;
  }
   .el-form-item__error {
    color: #fff
  }
  .loginBtn {
  background: #407ffe;
  height: 64px;
  line-height: 32px;
  font-size: 24px;
}

}
</style>

<style lang="scss" scoped>
$bg:#2d3a4b;
$dark_gray:#889aa4;
$light_gray:#eee;

.login-container {
  min-height: 100%;
  width: 100%;
  background-color: $bg;
  overflow: hidden;

  .login-form {
    position: relative;
    width: 520px;
    max-width: 100%;
    padding: 160px 35px 0;
    margin: 0 auto;
    overflow: hidden;
  }

  .tips {
    font-size: 14px;
    color: #fff;
    margin-bottom: 10px;

    span {
      &:first-of-type {
        margin-right: 16px;
      }
    }
  }

  .svg-container {
    padding: 6px 5px 6px 15px;
    color: $dark_gray;
    vertical-align: middle;
    width: 30px;
    display: inline-block;
  }

  .title-container {
    position: relative;

    .title {
      font-size: 26px;
      color: $light_gray;
      margin: 0px auto 40px auto;
      text-align: center;
      font-weight: bold;
    }
  }

  .show-pwd {
    position: absolute;
    right: 10px;
    top: 7px;
    font-size: 16px;
    color: $dark_gray;
    cursor: pointer;
    user-select: none;
  }
}
</style>
