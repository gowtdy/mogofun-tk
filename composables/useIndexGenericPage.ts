import { ref, computed, onMounted, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRoute } from 'vue-router'
import { useUserStore } from '~/store/user'
import { useAuth } from '~/composables/useAuth'
import { useAdvancedPageErrorHandler } from '~/composables/useAdvancedPageErrorHandler'
import { useErrorReporter } from '~/composables/errorReporter'
import { useFAQs } from '~/composables/useFAQs'
import { usePageSeoMeta } from '~/composables/usePageSeoMeta'
import { useNuxtApp } from '#app'
import { resolveVoiceCategory, resolveVoiceModel } from '~/config/localeToVoiceCategory'

interface UseIndexGenericPageOptions {
  pageKey: string
  defaultCategory?: string
  defaultModel?: string
  hrefPath?: string
  enableAdvantages?: boolean
  enableFAQs?: boolean
}

export function useIndexGenericPage(options: UseIndexGenericPageOptions) {
  const { t, locale } = useI18n()
  const { reportError } = useErrorReporter()
  const route = useRoute()

  const { getOrCreateUid } = useAuth()
  const uid = ref(getOrCreateUid())

  const userStore = useUserStore()
  const isLoggedIn = computed(() => !!userStore.user)
  const userEmail = computed(() => userStore.user?.email || '')

  const pageTitle = computed(() => {
    return {
      title: t(`${options.pageKey}.hero.title`),
      subtitle: t(`${options.pageKey}.hero.subtitle`)
    }
  })

  const lang = computed(() => {
    return locale.value
  })

  // SEO in setup so title/meta are present in SSR HTML for crawlers
  usePageSeoMeta({
    locale: lang,
    pathSlug: () => options.hrefPath?.replace(/^\//, '') || '',
    isHome: () => options.hrefPath === '/' || options.hrefPath === '' || !options.hrefPath,
    watchDeps: locale,
    getContent: () => ({
      title: t(`${options.pageKey}.meta.title`),
      description: t(`${options.pageKey}.meta.description`),
      keywords: t(`${options.pageKey}.meta.keywords`),
    }),
  })

  // 默认分类和模型（页面配置原始值）
  const pageDefaultCategory = options.defaultCategory || 'english'
  const pageDefaultModel = options.defaultModel || 'voice-lady-female'

  const resolvedDefaultCategory = computed(() => {
    const models = voiceModels.value
    if (!Array.isArray(models) || models.length === 0) {
      return pageDefaultCategory
    }
    return resolveVoiceCategory(locale.value, models, pageDefaultCategory)
  })

  const resolvedDefaultModel = computed(() => {
    const models = voiceModels.value
    if (!Array.isArray(models) || models.length === 0) {
      return pageDefaultModel
    }
    return resolveVoiceModel(resolvedDefaultCategory.value, models, pageDefaultModel)
  })

  // 语音模型数据 - 使用 getCachedData 在客户端导航时强制刷新
  const nuxtApp = useNuxtApp()
  const { data: voiceModels, refresh: refreshVoiceModels } = useAsyncData(
    'indexVoiceModels',
    async () => {
      try {
        // 服务端渲染时优先使用上下文数据
        if (process.server) {
          const event = useRequestEvent()
          if (event?.context?.indexVoiceModels) {
            return event.context.indexVoiceModels
          }
        }
        
        // 客户端或服务端无数据时发起请求
        const response = await fetch('/api/index-voice-models')
        const data = await response.json()
        return data
      } catch (err) {
        const error = err instanceof Error ? err : new Error(String(err))
        reportError(error, `Error in url:${route.fullPath} - ${error.message}`)
        return []
      }
    },
    {
      lazy: false,
      server: true,
      immediate: true,
      // 在客户端导航时，如果数据为空或无效，返回 undefined 强制重新获取
      getCachedData: (key) => {
        if (process.client) {
          // 客户端导航时，如果缓存的数据为空数组，返回 undefined 强制刷新
          const cached = nuxtApp.payload.data[key]
          if (cached && Array.isArray(cached) && cached.length > 0) {
            return cached
          }
          // 如果缓存数据无效，返回 undefined 强制重新获取
          return undefined
        }
        // 服务端直接使用缓存
        return nuxtApp.payload.data[key]
      },
      transform: (data) => {
        return Array.isArray(data) ? data : []
      }
    }
  )

  // 监听路由变化，确保客户端导航时刷新数据
  watch(() => route.fullPath, async (newPath, oldPath) => {
    // 只在客户端且路由确实变化时刷新
    if (process.client && newPath !== oldPath) {
      // 如果数据为空或无效，刷新数据
      if (!voiceModels.value || !Array.isArray(voiceModels.value) || voiceModels.value.length === 0) {
        await refreshVoiceModels()
      }
    }
  }, { immediate: false })

  // FAQ
  const { faqs } = useFAQs(
    `${options.pageKey}.faq.items`,
  )

  // 错误处理
  const { reportPageError } = useAdvancedPageErrorHandler({
    pageName: options.pageKey,
    uid,
    userEmail,
    enableGlobalHandlers: true
  })

  // 在 composable 的顶层注册 onMounted，确保在 setup 阶段执行
  onMounted(() => {
    setTimeout(() => {
      if (process.client) {
        // @ts-ignore - initUserState exists in store actions
        userStore.initUserState()
      }
    }, 0)
  })

  return {
    // 数据
    pageTitle,
    voiceModels,
    resolvedDefaultCategory,
    resolvedDefaultModel,
    faqs,
    isLoggedIn,
    
    // 方法
    reportPageError,
    
    // 计算属性
    faqTitle: computed(() => t(`${options.pageKey}.faq.title`))
  }
}
