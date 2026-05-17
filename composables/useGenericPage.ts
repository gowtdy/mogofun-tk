import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import { useHead } from '#imports'
import { useI18n } from 'vue-i18n'
import { useRoute } from 'vue-router'
import { useUserStore } from '~/store/user'
import { useAuth } from '~/composables/useAuth'
import { useAdvancedPageErrorHandler } from '~/composables/useAdvancedPageErrorHandler'
import { useErrorReporter } from '~/composables/errorReporter'
import { useAdvantages } from '~/composables/useAdvantages'
import { useFAQs } from '~/composables/useFAQs'
import { config } from '../config/config.js'
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
  const host = config.host
  const cdnHost = config.cdnHost
  const route = useRoute()

  const ogImage = config.ogImage
  const twitterImage = config.twitterImage

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

  // FAQ
  const { faqs } = useFAQs(
    `${options.pageKey}.faqs.items`,
  )

  // 错误处理
  const { reportPageError } = useAdvancedPageErrorHandler({
    pageName: options.pageKey,
    uid,
    userEmail,
    enableGlobalHandlers: true
  })

  // 构建URL路径的辅助函数
  const buildUrl = (languageCode: string) => {
    const basePath = options.dir ? `${languageCode}/${options.dir}/${options.pageKey}` : `${languageCode}/${options.pageKey}`
    return `${host}/${basePath}`
  }

  // SEO配置
  const setupSEO = () => {
    useHead({
      htmlAttrs: {
        lang: locale.value
      },
      title: () => t(`${options.pageKey}.meta.title`),
      meta: [
        { name: 'description', content: () => t(`${options.pageKey}.meta.description`)},
        { name: 'keywords', content: () => t(`${options.pageKey}.meta.keywords`)}, 
        { name: 'robots', content: 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1'},
        { property: 'og:title', content: () => t(`${options.pageKey}.meta.title`)},
        { property: 'og:description', content: () => t(`${options.pageKey}.meta.description`)},
        { property: 'og:type', content: 'website'},
        { property: 'og:url', content: host },
        { property: 'og:image', content: `${cdnHost}${ogImage}`},
        { name: 'twitter:card', content: 'summary_large_image'},
        { name: 'twitter:title', content: () => t(`${options.pageKey}.meta.title`)},
        { name: 'twitter:description', content: () => t(`${options.pageKey}.meta.description`)},
        { name: 'twitter:site', content: host },
        { name: 'twitter:image', content: `${cdnHost}${twitterImage}` },
      ],
      link: [
        { rel: 'canonical', href: buildUrl(lang.value) },
        { rel: 'alternate', hreflang: 'x-default', href: buildUrl('en')},
        { rel: 'alternate', hreflang: 'en', href: buildUrl('en')},
        { rel: 'alternate', hreflang: 'zh', href: buildUrl('zh')},  
        { rel: 'alternate', hreflang: 'zh-tw', href: buildUrl('zh-tw')},  
        { rel: 'alternate', hreflang: 'ja', href: buildUrl('ja')},  
        { rel: 'alternate', hreflang: 'fr', href: buildUrl('fr')},  
        { rel: 'alternate', hreflang: 'es', href: buildUrl('es')},
      ]
    })
  }

  // 在 composable 的顶层注册 onMounted，确保在 setup 阶段执行
  onMounted(() => {
    setTimeout(() => {
      if (process.client) {
        // @ts-ignore - initUserState exists in store actions
        userStore.initUserState()
      }
    }, 0)
  })

  // 初始化页面
  const initPage = () => {
    setupSEO()
  }

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
    initPage,
    reportPageError,
    
    // 计算属性
    advantagesTitle: computed(() => t(`${options.pageKey}.advantages.title`)),
    faqTitle: computed(() => t(`${options.pageKey}.faqs.title`))
  }
}
