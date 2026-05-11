/**
 * usePageTitle Composable
 * 
 * 用于处理页面标题的初始化和语言切换逻辑的可复用组合函数
 * 
 * @example
 * ```typescript
 * // 在页面组件中使用
 * const { pageTitle, lang } = usePageTitle({
 *   pageKey: 'index',
 *   defaultTitle: 'AI Voice Generator',
 *   defaultSubtitle: 'Create amazing AI voices'
 * })
 * 
 * // 在模板中使用
 * <h1>{{ pageTitle.title }}</h1>
 * <h2>{{ pageTitle.subtitle }}</h2>
 * ```
 * 
 * @param options 配置选项
 * @param options.pageKey 页面标识键，用于从 constants/pageTitle 中获取对应的标题数据
 * @param options.defaultTitle 默认标题，当获取不到翻译数据时使用
 * @param options.defaultSubtitle 默认副标题，当获取不到翻译数据时使用
 * 
 * @returns 返回响应式的页面标题对象和语言状态
 */

import { ref, watch, computed, readonly } from 'vue'
import { getPageTitle } from '~/constants/pageTitle'
import { useErrorReporter } from '~/composables/errorReporter'
import { useAuth } from '~/composables/useAuth'
import { useUserStore } from '~/store/user'
import { useRequestEvent } from '#app'

interface PageTitleOptions {
  pageKey: string
  defaultTitle?: string
  defaultSubtitle?: string
}

export const usePageTitle = (options: PageTitleOptions) => {
  const { pageKey, defaultTitle = 'Best AI Cover & AI Voice Over', defaultSubtitle = 'Easily create AI covers and AI voice overs with your favorite voices anytime, anywhere' } = options
  
  const { reportError } = useErrorReporter()
  const { getOrCreateUid } = useAuth()
  const userStore = useUserStore()
  
  const uid = ref(getOrCreateUid())
  const userEmail = computed(() => userStore.user?.email || '')
  
  // 1. 优化语言状态获取，确保SSR/CSR一致性
  const event = useRequestEvent()
  const serverLang = event?.context?.lang || 'en'
  
  // 使用统一的语言状态，避免hydration不匹配
  const lang = useState('page-lang', () => {
    if (process.server) {
      return serverLang
    }
    // 客户端优先使用localStorage，然后是URL，最后是默认值
    if (process.client) {
      const urlLang = window.location.pathname.split('/')[1]
      const validLangs = ['en', 'zh', 'ja', 'fr', 'es', 'zh-tw']
      return validLangs.includes(urlLang) ? urlLang : 'en'
    }
    return 'en'
  })

  // 2. 同步标题初始化 - 确保服务端渲染时就有稳定内容
  const getInitialPageTitle = (currentLang: string) => {
    try {
      const titleData = getPageTitle(pageKey, currentLang)[0]
      return {
        title: titleData?.title || defaultTitle,
        subtitle: titleData?.subtitle || defaultSubtitle,
      }
    } catch (error) {
      // 静默处理错误，使用默认值
      return {
        title: defaultTitle,
        subtitle: defaultSubtitle,
      }
    }
  }

  const pageTitle = ref(getInitialPageTitle(lang.value))

  // 3. 优化语言变化监听 - 减少不必要的更新
  let isInitialized = false
  
  watch(() => lang.value, async (newLang, oldLang) => {
    // 跳过初始化时的调用
    if (!isInitialized) {
      isInitialized = true
      return
    }
    
    // 仅在客户端且语言确实变化时更新
    if (process.client && newLang !== oldLang && newLang) {
      try {
        const newTitleData = getInitialPageTitle(newLang)
        
        // 只有当内容真的不同时才更新
        if (newTitleData.title !== pageTitle.value.title || 
            newTitleData.subtitle !== pageTitle.value.subtitle) {
          pageTitle.value = newTitleData
        }
      } catch (error) {
        reportError(
          error,
          `Error updating page title - pageKey: ${pageKey}, lang: ${newLang}`,
          uid.value,
          userEmail.value
        )
      }
    }
  }, { immediate: false })

  return {
    pageTitle: readonly(pageTitle),
    lang: readonly(lang)
  }
} 