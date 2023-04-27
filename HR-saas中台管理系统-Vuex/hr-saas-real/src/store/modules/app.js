import Cookies from 'js-cookie'

const state = {
  sidebar: {
    opened: Cookies.get('sidebarStatus') ? (!!+Cookies.get('sidebarStatus')) : true,
    withoutAnimation: false
  },
  device: 'desktop'
}

// reducers
const mutations = {
  TOGGLE_SIDEBAR: state => {
    state.sidebar.opened = !state.sidebar.opened
    state.sidebar.withoutAnimation = false
    if (state.sidebar.opened) {
      Cookies.set('sidebarStatus', 1)
    } else {
      Cookies.set('sidebarStatus', 0)
    }
  },
  CLOSE_SIDEBAR: (state, withoutAnimation) => {
    Cookies.set('sidebarStatus', 0)
    state.sidebar.opened = false
    state.sidebar.withoutAnimation = withoutAnimation
  },
  TOGGLE_DEVICE: (state, device) => {
    state.device = device
  }
}

// action
const actions = {
  // desktop时+mobile时
  toggleSideBar({ commit }) {
    // console.log("toggleSideBar")
    commit('TOGGLE_SIDEBAR')
  },
  // mobile时，
  closeSideBar({ commit }, { withoutAnimation }) {
    // console.log("closeSideBar")
    commit('CLOSE_SIDEBAR', withoutAnimation)
  },
  // 切换 desktop / mobile
  toggleDevice({ commit }, device) {
    commit('TOGGLE_DEVICE', device)
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
