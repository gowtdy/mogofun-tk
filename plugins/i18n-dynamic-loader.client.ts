import { getRequiredTranslationFiles, BASE_TRANSLATION_FILES } from '~/config/i18nConfig'

// 已加载的翻译文件缓存（按语言和文件路径）
const loadedFiles = new Set<string>()

// 正在加载的翻译文件 Promise 缓存（避免重复加载）
const loadingPromises = new Map<string, Promise<void>>()

/**
 * 动态加载翻译文件
 */
async function loadTranslationFiles(
  locale: string,
  routePath: string,
  i18n: any,
  reportError?: (err: any, context: any, uid?: string, email?: string) => Promise<void>
): Promise<void> {
  if (!i18n) {
    const errorMsg = '[i18n-dynamic-loader] i18n instance not found'
    //console.warn('[i18n-dynamic-loader] loadTranslationFiles: i18n instance not found', { locale, routePath })
    if (reportError) {
      // 延迟调用 reportError，确保 $fetch 已经初始化
      setTimeout(() => {
        //console.warn('[i18n-dynamic-loader] loadTranslationFiles: Reporting error...')
        reportError(
          new Error(errorMsg),
          { locale, routePath, function: 'loadTranslationFiles' }
        ).catch((err) => {
          console.warn('[i18n-dynamic-loader] loadTranslationFiles: Failed to report error:', err)
        })
      }, 0)
    }
    return
  }

  // 基础语言文件：对所有请求都必须加载
  // 根据路由路径获取需要加载的具体文件列表（不包含基础文件）
  const routeFiles = getRequiredTranslationFiles(routePath)
  
  // 合并基础文件和路由文件，去重
  const files = [...new Set([...BASE_TRANSLATION_FILES, ...routeFiles])]
  
  // 创建所有文件的加载 Promise
  const loadPromises = files.map(async (file) => {
    const cacheKey = `${locale}/${file}`
    
    // 如果已经加载过，跳过
    if (loadedFiles.has(cacheKey)) {
      return
    }

    // 如果正在加载，等待加载完成
    if (loadingPromises.has(cacheKey)) {
      await loadingPromises.get(cacheKey)
      return
    }

    // 创建加载 Promise
    const loadPromise = (async () => {
      try {
        // 直接请求静态 JSON 文件（性能更好，可以利用浏览器缓存）
        // 文件应该在 public/i18n/locales 目录下
        // 路径格式: /i18n/locales/{locale}/{file}
        const filePath = `/i18n/locales/${locale}/${file}`
        const response = await fetch(filePath)
        
        if (!response.ok) {
          throw new Error(`Failed to load translation file: ${response.status} ${response.statusText}`)
        }
        
        const translationModule = await response.json()
        
        // 合并翻译内容到 i18n
        if (translationModule) {
          i18n.mergeLocaleMessage(locale, translationModule)
        }
        
        // 标记为已加载
        loadedFiles.add(cacheKey)
      } catch (error) {
        // 某些文件可能不存在，但仍需要上报错误
        const errorMsg = `[i18n-dynamic-loader] Failed to load translation file: ${locale}/${file}`
        //console.warn('[i18n-dynamic-loader] Failed to load translation file:', { locale, file, error })
        if (reportError) {
          // 延迟调用 reportError，确保 $fetch 已经初始化
          setTimeout(() => {
            // console.warn('[i18n-dynamic-loader] Reporting translation file load error...', { locale, file })
            reportError(
              error instanceof Error ? error : new Error(String(error)),
              { locale, file, filePath: `/i18n/locales/${locale}/${file}`, routePath, function: 'loadTranslationFiles' }
            ).catch((err) => {
              console.warn('[i18n-dynamic-loader] Failed to report translation file error:', err)
            })
          }, 0)
        }
        // 即使加载失败，也标记为已处理，避免重复尝试
        loadedFiles.add(cacheKey)
      } finally {
        // 清除加载 Promise 缓存
        loadingPromises.delete(cacheKey)
      }
    })()

    // 缓存加载 Promise
    loadingPromises.set(cacheKey, loadPromise)
    await loadPromise
  })

  // 等待所有文件加载完成
  await Promise.all(loadPromises)
}

export default defineNuxtPlugin((nuxtApp) => {
  if (!process.client) return

  //console.warn('[i18n-dynamic-loader] Plugin initializing...')
  const router = useRouter()
  const { reportError } = useErrorReporter()
  const i18n = (nuxtApp as any).$i18n

  if (!i18n) {
    const errorMsg = '[i18n-dynamic-loader] i18n instance not found'
    //console.warn('[i18n-dynamic-loader] i18n instance not found, will report error after delay')
    // 延迟调用 reportError，确保 $fetch 已经初始化
    setTimeout(() => {
      // console.warn('[i18n-dynamic-loader] Reporting i18n not found error...')
      reportError(
        new Error(errorMsg),
        { plugin: 'i18n-dynamic-loader', stage: 'initialization' }
      ).catch((err) => {
        console.warn('[i18n-dynamic-loader] Failed to report error:', err)
      })
    }, 0)
    return
  }

  // 获取当前语言的辅助函数
  const getCurrentLocale = (): string => {
    return (i18n.locale?.value as string) || (i18n.locale as string) || 'en'
  }

  // 优先从 payload 恢复服务端加载的翻译数据（同步，立即生效，在 hydration 之前）
  const currentLocale = getCurrentLocale()
  const payload = nuxtApp.payload as any
  
  if (payload?.i18nTranslations?.[currentLocale]) {
    //console.warn('[i18n-dynamic-loader] Found payload translations for locale:', currentLocale)
    const serverTranslations = payload.i18nTranslations[currentLocale]
    
    // 合并翻译数据到 i18n 实例
    i18n.mergeLocaleMessage(currentLocale, serverTranslations)
    
    // 标记服务器端已加载的文件，避免客户端重复加载
    const serverLoadedFiles = payload?.i18nLoadedFiles?.[currentLocale] || []
    for (const file of serverLoadedFiles) {
      const cacheKey = `${currentLocale}/${file}`
      loadedFiles.add(cacheKey)
    }
    
    // 关键：告诉 i18n 模块翻译已经加载，避免它再次尝试加载
    // 通过检查 i18n 的 messages 或 localeMessages 来判断
    if (i18n.localeMessages && typeof i18n.localeMessages === 'object') {
      // 确保 i18n 模块知道翻译已经存在
      if (!i18n.localeMessages[currentLocale]) {
        i18n.localeMessages[currentLocale] = {}
      }
      // 合并翻译数据
      Object.assign(i18n.localeMessages[currentLocale], serverTranslations)
    }
    
    // 如果 i18n 有 setLocaleMessage 方法，也调用它来确保翻译被注册
    if (typeof i18n.setLocaleMessage === 'function') {
      i18n.setLocaleMessage(currentLocale, serverTranslations)
    }
    
    // 清除 payload 中的数据，避免重复加载
    delete payload.i18nTranslations[currentLocale]
    delete payload.i18nLoadedFiles?.[currentLocale]
  } else {
    // 如果 payload 中没有数据，异步加载翻译文件（作为备用方案）
    const currentPath = router.currentRoute.value.fullPath
    //console.warn('[i18n-dynamic-loader] No payload data, will load translation files after delay', { currentLocale, currentPath })
    // 延迟调用，确保 $fetch 已经初始化
    setTimeout(() => {
      //console.warn('[i18n-dynamic-loader] Loading translation files...', { currentLocale, currentPath })
      loadTranslationFiles(currentLocale, currentPath, i18n, reportError)
        .catch(error => {
          // console.warn('[i18n-dynamic-loader] Failed to load translation files:', error)
          reportError(
            error,
            { locale: currentLocale, path: currentPath, stage: 'initial-load' }
          ).catch((err) => {
            console.warn('[i18n-dynamic-loader] Failed to report load error:', err)
          })
        })
    }, 0)
  }

  // 关键优化：在路由切换前预加载翻译文件
  // 使用 beforeEach 确保翻译在组件渲染前加载完成
  router.beforeEach(async (to, from, next) => {
    // 如果路由没有变化，直接继续
    if (to.fullPath === from.fullPath) {
      next()
      return
    }

    try {
      const currentLocale = getCurrentLocale()
      // 在路由切换前预加载翻译文件
      await loadTranslationFiles(currentLocale, to.fullPath, i18n, reportError)
      // 翻译加载完成后，继续路由导航
      next()
    } catch (error) {
      // 即使加载失败，也继续导航（避免阻塞用户）
      reportError(
        error instanceof Error ? error : new Error(String(error)),
        { locale: currentLocale, routePath: to.fullPath, function: 'router.beforeEach' }
      ).catch((err) => {
        console.warn('[i18n-dynamic-loader] Failed to report preload error:', err)
      })
      next()
    }
  })

  // 保留 afterEach 作为备用（用于处理路由切换后的清理工作）
  router.afterEach(async (to) => {
    // 这里可以做一些清理工作，但翻译应该在 beforeEach 中已经加载完成
    const currentLocale = getCurrentLocale()
    // 确保翻译已加载（作为双重保险）
    await loadTranslationFiles(currentLocale, to.fullPath, i18n, reportError).catch(() => {
      // 静默处理错误，避免重复上报
    })
  })

  // 监听语言切换
  watch(() => i18n.locale?.value || i18n.locale, async (newLocale) => {
    const currentPath = router.currentRoute.value.fullPath
    await loadTranslationFiles(newLocale as string, currentPath, i18n, reportError)
  })
})

