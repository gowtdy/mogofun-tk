// plugins/init-fetch.client.ts
// 确保 $fetch 在应用初始化时可用，避免 $fetch is not defined 错误
// 这个插件必须在其他插件之前执行，确保 Nuxt 内部代码（如 app manifest 获取）可以使用 $fetch
import { $fetch as ofetchFetch } from 'ofetch'

export default defineNuxtPlugin({
  name: 'init-fetch',
  enforce: 'pre', // 最高优先级，在其他插件之前执行
  setup(nuxtApp) {
    if (process.client) {
      // 确保 $fetch 在应用初始化时可用
      // 如果 Nuxt 的 $fetch 还没有注入，使用 ofetch 作为 fallback
      if (!nuxtApp.$fetch) {
        // 与其它模块一致使用静态 ofetch，避免与全站静态依赖混用 dynamic import 触发 Rollup 告警
        nuxtApp.$fetch = ofetchFetch
        if (typeof window !== 'undefined') {
          (window as any).$fetch = ofetchFetch
        }
      } else {
        // 如果 $fetch 已经存在，也设置到全局，确保全局访问
        if (typeof window !== 'undefined') {
          (window as any).$fetch = nuxtApp.$fetch
        }
      }
    }
  }
})

