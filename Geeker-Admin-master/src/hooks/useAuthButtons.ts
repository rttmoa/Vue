/* eslint-disable @typescript-eslint/no-unused-vars */
import { computed, toRaw } from "vue";
import { useRoute } from "vue-router";
import { useAuthStore } from "@/stores/modules/auth";

/**
 * @description 页面按钮权限
 * */
export const useAuthButtons = () => {
  const route = useRoute();
  const authStore = useAuthStore();
  const authButtons = authStore.authButtonListGet[route.name as string] || [];
  // console.log(route.name); // authButton
  // console.log(toRaw(authStore)); // {$id: 'geeker-auth', $onAction: ƒ, $patch: ƒ, $reset: ƒ, $subscribe: ƒ, …}
  // console.log(authButtons); // ['add', 'edit', 'delete', 'import', 'export']

  const BUTTONS = computed(() => {
    let currentPageAuthButton: { [key: string]: boolean } = {};
    authButtons.forEach(item => (currentPageAuthButton[item] = true));
    return currentPageAuthButton;
  });
  // console.log(toRaw(BUTTONS.value)); // {add: true, edit: true, delete: true, import: true, export: true}
  return {
    BUTTONS
  };
};
