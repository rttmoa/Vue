import { defineStore } from "pinia";
import { UserState } from "@/stores/interface";
import piniaPersistConfig from "@/config/piniaPersist";

export const useUserStore = defineStore({
  id: "geeker-user",
  state: (): UserState => ({
    token: "",
    userInfo: { name: "Geeker" }
  }),
  getters: {},
  actions: {
    // Set Token
    setToken(token: string) {
      this.token = token;
    },
    // Set setUserInfo
    // TODO: 传参userInfo类型为：UserState下userinfo属性
    setUserInfo(userInfo: UserState["userInfo"]) {
      this.userInfo = userInfo;
    }
  },
  persist: piniaPersistConfig("geeker-user")
});
