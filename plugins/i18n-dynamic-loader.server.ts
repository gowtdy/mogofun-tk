export default defineNuxtPlugin({
  name: 'i18n-dynamic-loader-server',
  enforce: 'post', // 确保在其他插件（包括 i18n）之后执行
  async setup(nuxtApp: any) {
    if (process.server) {
      const i18n = nuxtApp.$i18n

      if (!i18n) {
        console.warn('[i18n-dynamic-loader.server] i18n instance not found')
        return
      }

      // 设置语言和合并翻译的函数
      const setupI18n = async () => {
        try {
          const event = useRequestEvent()
          const locale = event?.context?.lang || event?.context?.i18nLocale || 'en'
          
          // 立即设置语言，确保在组件渲染前生效
          setI18nLocale(i18n, locale)
          
          // 如果翻译数据已准备好，立即合并
          if (event?.context?.i18nTranslations) {
            mergeTranslations(i18n, event, nuxtApp)
          } else {
            // 等待翻译数据准备好
            let retries = 0
            const maxRetries = 20
            
            while (retries < maxRetries) {
              await new Promise(resolve => setTimeout(resolve, 10))
              if (event?.context?.i18nTranslations) {
                mergeTranslations(i18n, event, nuxtApp)
                break
              }
              retries++
            }
          }
        } catch (error) {
          // 静默处理错误
        }
      }

      // 立即执行设置
      await setupI18n()

      // 使用 app:beforeMount hook，确保在组件挂载之前设置语言
      nuxtApp.hook('app:beforeMount', async () => {
        await setupI18n()
      })

      // 同时注册 app:created hook 作为备用方案
      nuxtApp.hook('app:created', async () => {
        await setupI18n()
      })
    }
  }
})

// 设置 i18n 语言的辅助函数
function setI18nLocale(i18n: any, locale: string) {
  // 优先使用 setLocale 方法（如果存在），否则直接设置 locale
  if (typeof i18n.setLocale === 'function') {
    try {
      i18n.setLocale(locale)
    } catch (error) {
      console.warn(`[i18n-dynamic-loader.server] Failed to set locale via setLocale:`, error)
    }
  } else if (i18n.locale) {
    if (typeof i18n.locale === 'string') {
      i18n.locale = locale
    } else if (i18n.locale.value !== undefined) {
      i18n.locale.value = locale
    } else if (typeof i18n.locale === 'object' && 'value' in i18n.locale) {
      i18n.locale.value = locale
    } else {
      console.warn(`[i18n-dynamic-loader.server] Unknown locale structure:`, i18n.locale)
    }
  } else {
    console.warn(`[i18n-dynamic-loader.server] i18n.locale is not available`)
  }
  
  // 验证语言是否设置成功
  const currentLocale = typeof i18n.locale === 'string' 
    ? i18n.locale 
    : (i18n.locale?.value || i18n.locale)
  if (currentLocale !== locale) {
    console.warn(`[i18n-dynamic-loader.server] Locale mismatch! Expected: ${locale}, Actual: ${currentLocale}`)
  }
}

// 提取合并翻译的逻辑
function mergeTranslations(i18n: any, event: any, nuxtApp: any) {
  const translations = event.context.i18nTranslations
  const loadedFileList = event.context.i18nLoadedFiles || []
  const locale = event.context.lang || 'en'
  
  if (!translations || Object.keys(translations).length === 0) {
    console.warn(`[i18n-dynamic-loader.server] No translations to merge for locale: ${locale}`)
    return
  }
  
  // 直接合并翻译数据到 i18n 实例
  i18n.mergeLocaleMessage(locale, translations)
  
  // 确保语言设置正确（虽然之前可能已经设置过，但这里再次确认）
  setI18nLocale(i18n, locale)
  
  // 将翻译数据和已加载文件列表序列化到 payload，供客户端 hydration 使用
  if (!nuxtApp.payload.i18nTranslations) {
    nuxtApp.payload.i18nTranslations = {}
  }
  nuxtApp.payload.i18nTranslations[locale] = translations
  
  // 将已加载的文件列表也传递到 payload，供客户端使用
  if (!nuxtApp.payload.i18nLoadedFiles) {
    nuxtApp.payload.i18nLoadedFiles = {}
  }
  nuxtApp.payload.i18nLoadedFiles[locale] = loadedFileList
}

