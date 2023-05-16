/* eslint-disable prettier/prettier */
import { createApp } from "vue";
import App from "./App.vue";
// reset style sheet
import "@/styles/reset.scss";               // reset css
// CSS common style sheet
import "@/styles/common.scss";              // common css
// iconfont css
import "@/assets/iconfont/iconfont.scss";   // iconfont css
// font css
import "@/assets/fonts/font.scss";          // font css
// element css
import "element-plus/dist/index.css";       // element-plus css
// element dark css
import "element-plus/theme-chalk/dark/css-vars.css"; // css
// custom element dark css
import "@/styles/theme/element-dark.scss";  // theme css
// custom element css
import "@/styles/element.scss";             // theme css
// svg icons
import "virtual:svg-icons-register";                  // svg
// element plus
import ElementPlus from "element-plus";               // element-plus
// element icons
import * as Icons from "@element-plus/icons-vue";     // icon
// custom directives
import directives from "@/directives/index";          // directives 自定义指令
// vue Router
import router from "@/routers";                       // router
// vue i18n
import I18n from "@/languages/index";                 // I18n
// pinia store
import pinia from "@/stores";                         // store
// errorHandler
import errorHandler from "@/utils/errorHandler";      // errorHandler 错误捕捉

const app = createApp(App);

app.config.errorHandler = errorHandler;

// register the element Icons component
Object.keys(Icons).forEach(key => {
  app.component(key, Icons[key as keyof typeof Icons]);
});

app.use(ElementPlus).use(directives).use(router).use(I18n).use(pinia).mount("#app");
