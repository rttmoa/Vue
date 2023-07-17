import store from '@/store'




export const permission = {
  inserted(dom, obj) {
    console.log('/src/directive/indexjs')
    const { value } = obj
    let isPerm = false
    const { userInfo } = store.state.user
    // console.log(userInfo)
    if (userInfo.roles.points && userInfo.roles.points.length) {
      isPerm = userInfo.roles.points.some(item => item === value)
    }
    if (!isPerm) {
      dom.style.display = 'none'
    }
  }
}

export const imgerror = {
  inserted(dom, obj) {
    const { value } = obj
    dom.onerror = function() {
      dom.src = value
    }
  }
}
