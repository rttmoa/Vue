<template>
  <button class="h-btn" :class="[sizeClass,typeClass]" @click="clickHandler">
    <slot></slot>
  </button>
</template>

<script>
export default {
  props: {
    type: {
      type: String,
     
    },
    size: {
      type: String,
      validator: function (value) {
        return ['small','large'].includes(value)
      }
    }
  },
  computed: {
    typeClass() {
      return `h-btn-${this.type}`
    },
    sizeClass() {
      return `h-btn-${this.size}`
    }
  },
  methods: {
    clickHandler(e) {
      this.$emit('click', e)
    }
  }
}
</script>

<style scoped lang="less">
// 默认背景色 默认大小
.h-btn {
  line-height: 1.499;
  position: relative;
  display: inline-block;
  font-weight: 400;
  white-space: nowrap;
  text-align: center;
  background-image: none;
  box-shadow: 0 2px 0 rgba(0, 0, 0, 0.015);
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.645, 0.045, 0.355, 1);
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
  touch-action: manipulation;
  padding: 5px 10px;
  font-size: 14px;
  border-radius: 4px;
  color: rgba(0, 0, 0, 0.65);
  background-color: #fff;
  border: 1px solid #d9d9d9;
}
.h-btn:focus {
  outline: 0;
}
// primary 确定样式
.h-btn-primary {
  color: #fff;
  background-color: #1890ff;
  border-color: #1890ff;
  text-shadow: 0 -1px 0 rgba(0, 0, 0, 0.12);
  box-shadow: 0 2px 0 rgba(0, 0, 0, 0.045);
}
// danger 危险样式
.h-btn-danger {
  color: #fff;
  background-color: #ff4d4f;
  border-color: #ff4d4f;
  text-shadow: 0 -1px 0 rgba(0, 0, 0, 0.12);
  box-shadow: 0 2px 0 rgba(0, 0, 0, 0.045);
}

// size:small
.h-btn-small {
  padding: 4px 8px;
  font-size: 12px;
}
// size:large
.h-btn-large {
  padding: 6px 12px;
  font-size: 16px;
}
</style>