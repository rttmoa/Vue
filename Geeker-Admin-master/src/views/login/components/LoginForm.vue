<!-- eslint-disable prettier/prettier -->
<template>
  <el-form ref="loginFormRef" :model="loginForm" :rules="loginRules" size="large">
    <el-form-item prop="username">
      <el-input v-model="loginForm.username" placeholder="用户名：admin / user">
        <template #prefix>
          <el-icon class="el-input__icon"><user /></el-icon>
        </template>
      </el-input>
    </el-form-item>
    <el-form-item prop="password">
      <el-input type="password" v-model="loginForm.password" placeholder="密码：123456" show-password autocomplete="new-password">
        <template #prefix>
          <el-icon class="el-input__icon"><lock /></el-icon>
        </template>
      </el-input>
    </el-form-item>
  </el-form>
  <div class="login-btn">
    <el-button :icon="CircleClose" round @click="resetForm(loginFormRef)" size="large">重置</el-button>
    <el-button :icon="UserFilled" round @click="login(loginFormRef)" size="large" type="primary" :loading="loading">登录</el-button>
  </div>
</template>

<script setup lang="ts">
// TODO: 需要查看 import 导入了哪些东西， 什么用途
import { ref, reactive, onMounted } from "vue";
import { useRouter } from "vue-router";
import { HOME_URL } from "@/config";
import { getTimeState } from "@/utils";
import { Login } from "@/api/interface"; // export namespace Login {export interface ReqLoginForm {username: string;password: string;}}
import { ElNotification } from "element-plus";
import { loginApi } from "@/api/modules/login";
import { useUserStore } from "@/stores/modules/user";
import { useTabsStore } from "@/stores/modules/tabs";
import { useKeepAliveStore } from "@/stores/modules/keepAlive";
import { initDynamicRouter } from "@/routers/modules/dynamicRouter";
import { CircleClose, UserFilled } from "@element-plus/icons-vue";
import type { ElForm } from "element-plus";
import md5 from "js-md5";

const router = useRouter();
const userStore = useUserStore();
const tabsStore = useTabsStore();
const keepAliveStore = useKeepAliveStore();
// console.log(router);

type FormInstance = InstanceType<typeof ElForm>;
const loginFormRef = ref<FormInstance>();
// 规则
// 作用：定义一个对象类型的响应式数据（基本类型不要用它，要用ref函数）
// 语法：const 代理对象= reactive(源对象)接收一个对象（或数组），返回一个代理对象（Proxy的实例对象，简称proxy对象）
const loginRules = reactive({
  username: [{ required: true, message: "请输入用户名", trigger: "blur" }],
  password: [{ required: true, message: "请输入密码", trigger: "blur" }]
});

const loading = ref(false);

// 绑定表单值
const loginForm = reactive<Login.ReqLoginForm>({
  username: "",
  password: ""
});

// login
const login = (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  formEl.validate(async valid => {
    if (!valid) return;
    loading.value = true;
    // console.log(valid); // true
    // console.log(loginForm); // Proxy(Object) {username: 'aa', password: 'aa'}
    try {
      // TODO: 1.执行登录接口
      const { data } = await loginApi({ ...loginForm, password: md5(loginForm.password) });
      userStore.setToken(data.access_token);

      // TODO: 2.添加动态路由
      await initDynamicRouter();

      // TODO: 3.清空全部 tabs、keepAlive 数据
      tabsStore.closeMultipleTab();
      keepAliveStore.setKeepAliveName();

      // TODO: 4.跳转到首页
      router.push(HOME_URL);
      ElNotification({
        title: getTimeState(),
        message: "欢迎登录 Geeker-Admin",
        type: "success",
        duration: 3000
      });
    } finally {
      loading.value = false;
    }
  });
};

// resetForm
const resetForm = (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  // console.log(formEl); //  {validate: ƒ, validateField: ƒ, resetFields: ƒ, clearValidate: ƒ, scrollToField: ƒ, …}
  formEl.resetFields();
};

onMounted(() => {
  // 监听 enter 事件（调用登录）
  document.onkeydown = (e: KeyboardEvent) => {
    e = (window.event as KeyboardEvent) || e;
    if (e.code === "Enter" || e.code === "enter" || e.code === "NumpadEnter") {
      if (loading.value) return; // 如果正在加载 return
      // console.log(loginFormRef.value); // {validate: ƒ, validateField: ƒ, resetFields: ƒ, clearValidate: ƒ, scrollToField: ƒ, …}
      login(loginFormRef.value); // 将输入框内数据传递到 login
    }
  };
});
</script>

<style scoped lang="scss">
@import "../index.scss";
</style>
