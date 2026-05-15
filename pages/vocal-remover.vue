<template>
  <div class="bg-white px-6 py-8">
    <!-- 1. 优化标题区域的渲染性能 -->
    <div class="text-center mb-8">
      <h1 data-allow-mismatch="style"
        class="text-4xl font-bold mb-4 gradient-text"
        fetchpriority="high"
        style="visibility: visible; content-visibility: visible;"
        v-once
      >
        🎤 {{ pageTitle.title || defaultTitle }}
      </h1>
      <h2
        class="text-gray-600 font-medium text-xl lcp-title will-change-auto contain-content"
        fetchpriority="high"
        style="content-visibility: visible; contain-intrinsic-size: auto 32px; min-height: 32px; visibility: visible;"
        v-once
      > {{ pageTitle.subtitle || defaultSubtitle}} </h2>
    </div>

    <UploadPanel
      :result-title="$t('vocal_remover.result_title')"
      :process-button-text="$t('vocal_remover.process_button')"
      message-namespace="vocal_remover"
      telemetry-model-slug="vocal-remover"
      model-category="vocal remover"
      model-name="vocal remover"
      api-endpoint="/coverapi/instrument"
      :action-type="actionTypes"
    />
    <!-- 优势介绍组件 -->
    <AdvantagesSection
      v-if="!isLoggedIn"
      :title="t('vocal_remover.advantages.title')"
      :advantages="advantages"
    />
    <!-- FAQ 区域 -->
    <FAQSection
      v-if="!isLoggedIn"
      :title="$t('vocal_remover.faqs.title')"
      :faqs="faqs"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRequestEvent } from '#app'
import { config } from '~/config/config'
import { getPageTitle } from '~/constants/pageTitle'
import UploadPanel from '~/components/UploadPanel.vue'
import AdvantagesSection from '~/components/AdvantagesSection.vue'
import FAQSection from '~/components/FAQSection.vue'
import { useErrorReporter } from '~/composables/errorReporter'
import { useUserStore } from '~/store/user'
import { useAuth } from '~/composables/useAuth'
import { usePageErrorHandler } from '~/composables/usePageErrorHandler'
import { useActionReporter, ActionType } from '~/composables/actionReporter'
import {
  SparklesIcon,
  MusicalNoteIcon,
  CpuChipIcon,
  AdjustmentsHorizontalIcon,
  ArrowDownTrayIcon,
  WrenchScrewdriverIcon,
  UserGroupIcon,
  BeakerIcon
} from '@heroicons/vue/24/outline'

const host = config.host
const cdn_host = config.cdnHost

const { t, tm, locale } = useI18n()
const { reportError } = useErrorReporter()
const { getOrCreateUid } = useAuth()
const uid = ref(getOrCreateUid())
const userStore = useUserStore()
const isLoggedIn = computed(() => !!userStore.user)
const userEmail = computed(() => userStore.user?.email || '')
const event = useRequestEvent()
const lang = useState('lang', () => event?.context?.lang || 'en')

definePageMeta({
  layout: 'footerlink'
})

// Define action types for this page
const actionTypes = {
  extract: ActionType.VOCAL_REMOVE,
  login: ActionType.VOCAL_REMOVE_LOGIN,
  subscript: ActionType.VOCAL_REMOVE_SUBSCRIPT,
  download: ActionType.VOCAL_REMOVE_DOWNLOAD,
  downloadLogin: ActionType.VOCAL_REMOVE_DOWNLOAD_LOGIN,
  downloadSubscript: ActionType.VOCAL_REMOVE_DOWNLOAD_SUBSCRIPT,
  upload: ActionType.VOCAL_REMOVE_UPLOAD
}

// SEO Meta Tags
useHead({
  htmlAttrs: {
    lang: lang.value
  },
  title: t('vocal_remover.seo.title'),
  meta: [
    { name: 'description', content: t('vocal_remover.seo.description') },
    { name: 'keywords', content: t('vocal_remover.seo.keywords') },
    { property: 'og:type', content: 'website' },
    { property: 'og:title', content: t('vocal_remover.seo.title') },
    { property: 'og:description', content: t('vocal_remover.seo.description') },
    { property: 'og:url', content: 'https://aivoicelab.net' },
    { property: 'og:image', content: 'https://cdn.aivoicelab.net/img/aivoicelab-fbtw.webp'},
    { name: 'twitter:card', content: 'summary_large_image' },
    { name: 'twitter:title', content: t('vocal_remover.seo.title') },
    { name: 'twitter:description', content: t('vocal_remover.seo.description') },
    { name: 'twitter:site', content: 'https://aivoicelab.net' },
    { name: 'twitter:image', content: 'https://cdn.aivoicelab.net/img/aivoicelab-fbtw.webp' }
  ],
  link: [
    { rel: 'preconnect', href: host },
    { rel: 'dns-prefetch', href: host },
    { rel: 'canonical', href: `${host}/${lang.value}/vocal-remover`},
    { rel: 'alternate', hreflang: 'x-default', href: `${host}/en/vocal-remover` },
    { rel: 'alternate', hreflang: 'en', href: `${host}/en/vocal-remover` },
    { rel: 'alternate', hreflang: 'zh', href: `${host}/zh/vocal-remover` },
    { rel: 'alternate', hreflang: 'zh-tw', href: `${host}/zh-tw/vocal-remover` },
    { rel: 'alternate', hreflang: 'es', href: `${host}/es/vocal-remover` },
    { rel: 'alternate', hreflang: 'ja', href: `${host}/ja/vocal-remover` },
    { rel: 'alternate', hreflang: 'fr', href: `${host}/fr/vocal-remover` },
  ]
})

const pageKey = 'vocal-remover'
const defaultTitle = 'Best AI Vocal Remover Online'
const defaultSubtitle = 'Instantly remove vocals from a song, music, audio or video anytime, anywhere'
const pageTitle = ref<Title>({
    title: defaultTitle,
    subtitle: defaultSubtitle,
  })

// 监听语言变化
watch(() => lang.value, async (newLang) => {
  try {
    const title = getPageTitle(pageKey, newLang)[0]
    if (title) {
      pageTitle.value = title
    }
  } catch (error) {
    reportError(
      error,
      `Error updating page title - lang: ${newLang}`,
      uid.value,
      userEmail.value
    )
  }
}, { immediate: true }) // 添加 immediate: true 确保组件初始化时执行

// 优势特性数据
const advantages = computed(() => {
  const advantagesItems = tm('vocal_remover.advantages.items') || []
  // 确保 advantagesItems 是数组
  const items = Array.isArray(advantagesItems) ? advantagesItems : []
  const icons = [
    SparklesIcon,          // 专业品质
    MusicalNoteIcon,       // 丰富音色库
    CpuChipIcon,          // AI快速生成
    AdjustmentsHorizontalIcon,  // 多种音乐风格
    ArrowDownTrayIcon,     // 高质量输出
    WrenchScrewdriverIcon, // 高级调整工具
    UserGroupIcon,         // AI合唱和二重唱
    BeakerIcon            // 自定义声音训练
  ]
  return items.map((item, index) => ({
    ...item,
    icon: icons[index] || SparklesIcon // 提供一个默认图标，以防数组越界
  }))
})

const faqs = computed(() => {
  // 先拿到原始数组，目的是获取长度
  const raw = tm('vocal_remover.faqs.items') || []
  // 确保 raw 是数组
  const items = Array.isArray(raw) ? raw : []
  // 用 t 获取每一项的字符串
  return items.map((_, idx) => ({
    question: t(`vocal_remover.faqs.items.${idx}.question`),
    answer: t(`vocal_remover.faqs.items.${idx}.answer`)
  }))
})

onMounted(() => {
  const title = getPageTitle(pageKey, lang.value)[0]
  if (title) {
    pageTitle.value = title
  }
})

const pageUrl = computed(() => {
  if (process.client) {
    return window.location.href
  }
  return ''
})

const { onPageError } = usePageErrorHandler("vocal-remover", uid.value, userEmail.value)
onErrorCaptured(onPageError)
</script>

<style scoped>
.border-dashed {
  border-style: dashed;
}
</style> 