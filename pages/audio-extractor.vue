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
        🎵 {{ pageTitle.title || defaultTitle }}
      </h1>
      <h2
        class="text-gray-600 font-medium text-xl lcp-title will-change-auto contain-content"
        fetchpriority="high"
        style="content-visibility: visible; contain-intrinsic-size: auto 32px; min-height: 32px; visibility: visible;"
        v-once
      >{{ pageTitle.subtitle || defaultSubtitle}}</h2>
    </div>

    <UploadPanel
      :result-title="t('audio_extractor.result_title')"
      :process-button-text="t('audio_extractor.process_button')"
      mediaType="video"
      model-category="audio extractor"
      model-name="audio extractor"
      api-endpoint="/upapi/extractaudio"
      :action-type="actionTypes"
    />
    <!-- 优势介绍组件 -->
    <AdvantagesSection
      v-if="!isLoggedIn"
      :title="t('audio_extractor.advantages.title')"
      :advantages="advantages"
    />
    <!-- FAQ 区域 -->
    <FAQSection
      v-if="!isLoggedIn"
      :title="t('audio_extractor.faqs.title')"
      :faqs="faqs"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
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
  ShieldCheckIcon,
  CurrencyDollarIcon,
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
  extract: ActionType.AUDIO_EXTRACT,
  login: ActionType.AUDIO_EXTRACT_LOGIN,
  subscript: ActionType.AUDIO_EXTRACT_SUBSCRIPT,
  download: ActionType.AUDIO_DOWNLOAD,
  downloadLogin: ActionType.AUDIO_DOWNLOAD_LOGIN,
  downloadSubscript: ActionType.AUDIO_DOWNLOAD_SUBSCRIPT,
  upload: ActionType.AUDIO_EXTRACT_UPLOAD
}

// SEO Meta Tags
useHead({
  htmlAttrs: {
    lang: lang.value
  },
  title: t('audio_extractor.seo.title'),
  meta: [
    { name: 'description', content: t('audio_extractor.seo.description') },
    { name: 'keywords', content: t('audio_extractor.seo.keywords') },
    { property: 'og:type', content: 'website' },
    { property: 'og:title', content: t('audio_extractor.seo.title') },
    { property: 'og:description', content: t('audio_extractor.seo.description') },
    { property: 'og:url', content: 'https://aivoicelab.net' },
    { property: 'og:image', content: 'https://cdn.aivoicelab.net/img/aivoicelab-fbtw.webp'},
    { name: 'twitter:card', content: 'summary_large_image' },
    { name: 'twitter:title', content: t('audio_extractor.seo.title') },
    { name: 'twitter:description', content: t('audio_extractor.seo.description') },
    { name: 'twitter:site', content: 'https://aivoicelab.net' },
    { name: 'twitter:image', content: 'https://cdn.aivoicelab.net/img/aivoicelab-fbtw.webp' }
  ],
  link: [
    { rel: 'preconnect', href: host },
    { rel: 'dns-prefetch', href: host },
    { rel: 'canonical', href: `${host}/${lang.value}/audio-extractor`},
    { rel: 'alternate', hreflang: 'x-default', href: `${host}/en/audio-extractor` },
    { rel: 'alternate', hreflang: 'en', href: `${host}/en/audio-extractor` },
    { rel: 'alternate', hreflang: 'zh', href: `${host}/zh/audio-extractor` },
    { rel: 'alternate', hreflang: 'zh-tw', href: `${host}/zh-tw/audio-extractor` },
    { rel: 'alternate', hreflang: 'es', href: `${host}/es/audio-extractor` },
    { rel: 'alternate', hreflang: 'ja', href: `${host}/ja/audio-extractor` },
    { rel: 'alternate', hreflang: 'fr', href: `${host}/fr/audio-extractor` },
  ]
})

const pageKey = 'audio-extractor'
const defaultTitle = 'Audio Extractor'
const defaultSubtitle = 'Online audio extractor to extract audio from your uploaded video'
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
  const advantagesItems = tm('audio_extractor.advantages.items') || []
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
  const raw = tm('audio_extractor.faqs.items') || []
  // 确保 raw 是数组
  const items = Array.isArray(raw) ? raw : []
  // 用 t 获取每一项的字符串
  return items.map((_, idx) => ({
    question: t(`audio_extractor.faqs.items.${idx}.question`),
    answer: t(`audio_extractor.faqs.items.${idx}.answer`)
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

const { onPageError } = usePageErrorHandler("audio-extractor", uid.value, userEmail.value)
onErrorCaptured((err: Error, instance, info) => {
  return onPageError(err, info)
})
</script>

<style scoped>
.border-dashed {
  border-style: dashed;
}
</style>