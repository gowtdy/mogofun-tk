// plugins/init-fetch.client.ts
// 确保 $fetch 在应用初始化时可用，避免 $fetch is not defined 错误
// 这个插件必须在其他插件之前执行，确保 Nuxt 内部代码（如 app manifest 获取）可以使用 $fetch
export default defineNuxtPlugin({
  name: 'init-fetch',
  enforce: 'pre', // 最高优先级，在其他插件之前执行
  async setup(nuxtApp) {
    if (process.client) {
      // 确保 $fetch 在应用初始化时可用
      // 如果 Nuxt 的 $fetch 还没有注入，使用 ofetch 作为 fallback
      if (!nuxtApp.$fetch) {
        try {
          // 尝试从 ofetch 导入
          const { $fetch } = await import('ofetch')
          nuxtApp.$fetch = $fetch
          // 也设置到全局，确保 Nuxt 内部代码可以访问
          if (typeof window !== 'undefined') {
            (window as any).$fetch = $fetch
          }
        } catch (err) {
          // 如果 ofetch 也不可用，创建一个基于原生 fetch 的包装
          nuxtApp.$fetch = async (url: string, options?: any) => {
            const response = await fetch(url, {
              ...options,
              headers: {
                'Content-Type': 'application/json',
                ...options?.headers,
              },
            })
            
            if (options?.responseType === 'json' || !options?.responseType) {
              return response.json()
            }
            
            if (options?.responseType === 'text') {
              return response.text()
            }
            
            return response
          }
          
          if (typeof window !== 'undefined') {
            (window as any).$fetch = nuxtApp.$fetch
          }
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

