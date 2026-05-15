import { config } from '~/config/config'

export const useErrorReporter = () => {
  const host = config.host

  const reportError = async (err: any, context: any, uid: string = '' , email: string = '') => {
    try {
      const uri = `${host}/lapi/weberrors`
      const formData = new FormData()
      
      formData.append('error', err?.message || String(err))
      formData.append('stack', err?.stack || '')
      formData.append('context', JSON.stringify(context))
      formData.append('url', window?.location?.href || '')
      formData.append('uid', uid)
      formData.append('email', email)

      // 尝试获取 $fetch，如果不可用则使用原生 fetch
      let fetchFn: any = null
      try {
        const nuxtApp = useNuxtApp()
        fetchFn = nuxtApp.$fetch || (globalThis as any).$fetch
      } catch {
        // 如果 useNuxtApp 不可用，尝试从全局获取
        fetchFn = (globalThis as any).$fetch || null
      }

      if (fetchFn) {
        await fetchFn(uri, {
          method: 'POST',
          body: formData
        })
      } else {
        // 使用原生 fetch 作为 fallback
        await fetch(uri, {
          method: 'POST',
          body: formData
        })
      }
    } catch (err) {
      console.debug('Error reporting failed:', err)
    }
  }

  return {
    reportError
  }
}