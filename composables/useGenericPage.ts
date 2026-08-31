import { ref, computed, onMounted, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRoute } from 'vue-router'
import { useUserStore } from '~/store/user'
import { useAuth } from '~/composables/useAuth'
import { useAdvancedPageErrorHandler } from '~/composables/useAdvancedPageErrorHandler'
import { useErrorReporter } from '~/composables/errorReporter'
import { useAdvantages } from '~/composables/useAdvantages'
import { useFAQs } from '~/composables/useFAQs'
import { usePageSeoMeta } from '~/composables/usePageSeoMeta'
import { usePageJsonLd } from '~/composables/useJsonLd'
import { useNuxtApp } from '#app'

interface UseGenericPageOptions {
  pageKey: string
  defaultCategory?: string
  defaultModel?: string
  enableAdvantages?: boolean
  enableFAQs?: boolean
  dir?: string
}

export function useGenericPage(options: UseGenericPageOptions) {
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
    pathSlug: options.pageKey,
    pathPrefix: options.dir || undefined,
    watchDeps: locale,
    getContent: () => ({
      title: t(`${options.pageKey}.meta.title`),
      description: t(`${options.pageKey}.meta.description`),
      keywords: t(`${options.pageKey}.meta.keywords`),
    }),
  })

  // FAQ
  const { faqs } = useFAQs(
    `${options.pageKey}.faqs.items`,
  )

  usePageJsonLd({
    locale: lang,
    pathSlug: options.pageKey,
    pathPrefix: options.dir || undefined,
    watchDeps: locale,
    name: () => t(`${options.pageKey}.meta.title`),
    description: () => t(`${options.pageKey}.meta.description`),
    faqs,
  })

  // 默认分类和模型
  const defaultCategory = ref(options.defaultCategory || 'celebrity')
  const defaultModel = ref(options.defaultModel || 'us-male-snoopdogg')

  // 语音模型数据 - 使用 getCachedData 在客户端导航时强制刷新
  const nuxtApp = useNuxtApp()
  const { data: voiceModels, refresh: refreshVoiceModels } = useAsyncData(
    'voiceModels',
    async () => {
      try {
        // 服务端渲染时优先使用上下文数据
        if (process.server) {
          const event = useRequestEvent()
          if (event?.context?.voiceModels) {
            return event.context.voiceModels
          }
        }
        
        // 客户端或服务端无数据时发起请求
        const response = await fetch('/api/voice-models')
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

  // 监听数据变化，设置默认值
  watch(() => voiceModels.value, (newValue) => {
    if (newValue && Array.isArray(newValue) && newValue.length > 0) {
      if (!defaultCategory.value && newValue[0]) {
        defaultCategory.value = newValue[0].catid
        if (newValue[0].options?.length > 0) {
          defaultModel.value = newValue[0].options[0].modelid
        }
      }
    }
  }, { immediate: true })

  // 优势介绍
  const { advantages } = useAdvantages(
    `${options.pageKey}.advantages.items`,
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
    defaultCategory,
    defaultModel,
    advantages,
    faqs,
    isLoggedIn,
    
    // 方法
    reportPageError,
    
    // 计算属性
    advantagesTitle: computed(() => t(`${options.pageKey}.advantages.title`)),
    faqTitle: computed(() => t(`${options.pageKey}.faqs.title`))
  }
}
