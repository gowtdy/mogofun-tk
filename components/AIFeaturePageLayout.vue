<template>
  <div class="bg-white">
    <div class="container mx-auto px-4 pt-4 pb-6">
      <!-- 标题区域 -->
      <div class="text-center mb-6">
        <h1 
          data-allow-mismatch="style"
          class="text-4xl font-bold mb-4 gradient-text"
          fetchpriority="high"
          style="visibility: visible;"
        >
          {{ $t(`${pageKey}.hero.title`) }}
        </h1>
        <h2
          class="text-gray-600 font-medium text-xl lcp-title"
          fetchpriority="high"
          style="content-visibility: visible; contain-intrinsic-size: auto 32px; min-height: 32px;"
          v-once
        >
          {{ $t(`${pageKey}.hero.subtitle`) }}
        </h2>
      </div>

      <!-- 主体内容区域 -->
      <div class="max-w-[1400px] mx-auto bg-white rounded-2xl p-6 shadow-[0_2px_24px_rgba(0,0,0,0.08)]">
        <!-- AI转换器组件 -->
        <AICoverConverter
          :key="route.fullPath"
          :voice-models="voiceModels"
          :default-category="defaultCategory"
          :default-model="defaultModel"
        />
      </div>

      <!-- 优势介绍组件 -->
      <AdvantagesSection
        v-if="!isLoggedIn"
        :title="$t(`${pageKey}.advantages.title`)"
        :advantages="advantages"
      />

      <!-- FAQ 区域 -->
      <FAQSection
        v-if="!isLoggedIn"
        :title="$t(`${pageKey}.faqs.title`)"
        :faqs="faqs"
      />

    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, onUnmounted } from 'vue'
import { useRoute } from 'vue-router'
import FAQSection from '~/components/FAQSection.vue'
import AdvantagesSection from '~/components/AdvantagesSection.vue'
import AICoverConverter from '~/components/AICoverConverter.vue'
import { useI18n } from 'vue-i18n'
import { useUserStore } from '~/store/user'
import { useAuth } from '~/composables/useAuth'
import { useAdvancedPageErrorHandler } from '~/composables/useAdvancedPageErrorHandler'
import { useAdvantages } from '~/composables/useAdvantages'
import { useFAQs } from '~/composables/useFAQs'
import { useRequestEvent, useRuntimeConfig, useAsyncData, useHead, useNuxtApp } from '#app'

interface Props {
  pageKey?: string
  pagePath?: string
  defaultCategory?: string
  defaultModel?: string
}

const props = withDefaults(defineProps<Props>(), {
  pageKey: '',
  pagePath: '',
  defaultCategory: '',
  defaultModel: ''
})

// 内部数据获取逻辑
const { t, locale } = useI18n()
const userStore = useUserStore()

// 用户认证和错误处理
const { getOrCreateUid } = useAuth()
const uid = ref(getOrCreateUid())
// 获取用户登录状态
const isLoggedIn = computed(() => !!userStore.user)
const userEmail = computed(() => userStore.user?.email || '')

// 使用新的高级页面错误处理 composable
const { reportPageError } = useAdvancedPageErrorHandler({
  pageName: props.pageKey || 'AIFeaturePage',
  uid,
  userEmail,
  enableGlobalHandlers: true
})

// 确保 locale 有默认值
const currentLocale = computed(() => {
  try {
    return locale.value || 'en'
  } catch (error) {
    reportPageError(error, 'Error in currentLocale computation')
    return 'en'
  }
})

// 获取配置
const { config } = useRuntimeConfig()
const host = config?.host || 'https://aivoicelab.net'
const cdnHost = config?.cdnHost || 'https://cdn.aivoicelab.net'

// SEO Meta Tags
useHead({
  htmlAttrs: {
    lang: currentLocale.value
  },
  title: () => props.pageKey ? t(`${props.pageKey}.seo.title`) : '',
  meta: [
    { name: 'description', content: () => props.pageKey ? t(`${props.pageKey}.seo.description`) : ''},
    { name: 'keywords', content: () => props.pageKey ? t(`${props.pageKey}.seo.keywords`) : ''},
    { name: 'robots', content: 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1'},
    { property: 'og:title', content: () => props.pageKey ? t(`${props.pageKey}.meta.og.title`) : ''},
    { property: 'og:description', content: () => props.pageKey ? t(`${props.pageKey}.meta.og.description`) : ''},
    { property: 'og:type', content: 'website'},
    { property: 'og:url', content: 'https://aivoicelab.net' },
    { property: 'og:image', content: `${cdnHost}/img/aivoicelab-fbtw.webp`},
    { name: 'twitter:card', content: 'summary_large_image'},
    { name: 'twitter:title', content: () => props.pageKey ? t(`${props.pageKey}.meta.twitter.title`) : ''},
    { name: 'twitter:description', content: () => props.pageKey ? t(`${props.pageKey}.meta.twitter.description`) : ''},
    { name: 'twitter:site', content: 'https://aivoicelab.net' },
    { name: 'twitter:image', content: `${cdnHost}/img/aivoicelab-fbtw.webp` },
  ],
  link: () => {
    if (!props.pagePath) return []
    
    return [
      { rel: 'canonical', href: `${host}/${locale.value}/${props.pagePath}`},
      { rel: 'alternate', hreflang: 'x-default', href: `${host}/en/${props.pagePath}`},
      { rel: 'alternate', hreflang: 'en', href: `${host}/en/${props.pagePath}`},
      { rel: 'alternate', hreflang: 'zh', href: `${host}/zh/${props.pagePath}`},
      { rel: 'alternate', hreflang: 'zh-tw', href: `${host}/zh-tw/${props.pagePath}`},
      { rel: 'alternate', hreflang: 'ja', href: `${host}/ja/${props.pagePath}`},
      { rel: 'alternate', hreflang: 'fr', href: `${host}/fr/${props.pagePath}`},
      { rel: 'alternate', hreflang: 'es', href: `${host}/es/${props.pagePath}`},
    ]
  }
})

// 内部状态
const internalDefaultCategory = ref('')
const internalDefaultModel = ref('')

// 获取路由和 nuxtApp
const route = useRoute()
const nuxtApp = useNuxtApp()

// 获取语音模型数据 - 使用 getCachedData 在客户端导航时强制刷新
const { data: voiceModels, refresh: refreshVoiceModels } = await useAsyncData(
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
      reportPageError(error, 'Error fetching voice models')
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
    try {
      // 优先使用 props 传递的参数
      if (props.defaultCategory) {
        internalDefaultCategory.value = props.defaultCategory
        // 如果传递了 defaultModel，直接使用
        if (props.defaultModel) {
          internalDefaultModel.value = props.defaultModel
        } else {
          // 如果没有传递 defaultModel，在指定分类中找第一个模型
          const category = newValue.find(cat => cat.catid === props.defaultCategory)
          if (category?.options?.length > 0) {
            internalDefaultModel.value = category.options[0].modelid
          }
        }
      } else {
        // 如果没有传递 defaultCategory，使用第一个分类和第一个模型
        if (!internalDefaultCategory.value && newValue[0]) {
          internalDefaultCategory.value = newValue[0].catid
          if (newValue[0].options?.length > 0) {
            internalDefaultModel.value = newValue[0].options[0].modelid
          }
        }
      }
    } catch (error) {
      reportPageError(error, 'Error setting default voice model values')
    }
  }
}, { immediate: true })

// 使用内部数据
const defaultCategory = computed(() => internalDefaultCategory.value)
const defaultModel = computed(() => internalDefaultModel.value)

// 获取优势和FAQ数据
const { advantages } = props.pageKey ? useAdvantages(`${props.pageKey}.advantages.items`) : { advantages: computed(() => []) }
const { faqs } = props.pageKey ? useFAQs(`${props.pageKey}.faqs.items`) : { faqs: computed(() => []) }

// 初始化函数
const initPage = () => {
  try {
    userStore.initUserState()
  } catch (error) {
    reportPageError(error, 'Error initializing user state')
  }
}

// 组件挂载时的初始化
onMounted(() => {
  // 延迟初始化非关键功能
  setTimeout(() => {
    initPage()
  }, 0)
})

</script> 