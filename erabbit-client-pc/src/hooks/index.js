// 提供复用逻辑的函数（钩子）
import { useIntersectionObserver, useIntervalFn } from '@vueuse/core'
import { ref, onUnmounted } from 'vue'
import dayjs from 'dayjs'

/**
 * TODO: 数据懒加载函数
 * @param {Element} target - Dom对象
 * @param {Function} apiFn - API函数
 */
// 表示: 如果Dom盒子进入可视区后，调用api()函数后，使用ref挂载接口数据后，返回ref数据
export const useLazyData = (apiFn) => {
    const result = ref([])
    const target = ref(null)
    // stop 停止观察                  // 监听的目标元素
    const { stop } = useIntersectionObserver(target, ([{ isIntersecting }], observerElement) => {
            // isIntersecting 是否进入可视区
            if (isIntersecting) {
              stop()
              // 调用API函数获取数据
              apiFn().then(data => {
                result.value = data.result
              })
            }
        },
        // 配置选项，相交的比例大于0就触发
        { threshold: 0 }
    )
    return { result, target }
}

/**
 * TODO: 支付倒计时函数
 */
export const usePayTime = () => {
  // 倒计时逻辑
  const time = ref(0)
  const timeText = ref('')
  const { pause, resume } = useIntervalFn(() => {
    time.value--
    timeText.value = dayjs.unix(time.value).format('mm分ss秒')
    if (time.value <= 0) pause()
  }, 1000, false)
  onUnmounted(() => {
    pause()
  })

  // 开启定时器 countdown 倒计时时间
  const start = (countdown) => {
    time.value = countdown
    timeText.value = dayjs.unix(time.value).format('mm分ss秒')
    resume()
  }
  return {
    start,
    timeText
  }
}