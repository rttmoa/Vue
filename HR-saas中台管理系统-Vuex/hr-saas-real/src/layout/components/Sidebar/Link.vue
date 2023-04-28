<!-- component动态组件 -->
<!-- https://blog.csdn.net/Ma_programmer/article/details/120742570 -->
<template>
  <component :is="type" v-bind="linkProps(to)">
    <slot />
  </component>
</template>




<script>
import { isExternal } from '@/utils/validate'

export default {
  props: {
    to: {
      type: String,
      required: true
    }
  },
  computed: {
    isExternal() {
      return isExternal(this.to)
    },
    // TODO: 组件的类型是 a 还是 router-link
    type() {
      // console.log("type", this.isExternal)
      if (this.isExternal) {
        return 'a'
      }
      return 'router-link'
    }
  },
  methods: {
    linkProps(to) {
      // console.log("to", to) ////  /dashboard || /setting || /permission
      if (this.isExternal) {
        return {
          href: to,
          target: '_blank',
          rel: 'noopener'
        }
      }
      return {
        to: to
      }
    }
  }
}
</script>
