<template>
  <div class="min-h-screen bg-white px-6 py-8">
    <!-- 顶部 header -->
    <div class="max-w-6xl mx-auto text-center mb-8">
      <h1 class="text-4xl font-bold mb-4 flex items-center justify-center gap-3 text-gray-800">
        🎧 {{ pageHeading.title }}
      </h1>
      <h2 class="text-lg text-gray-500 max-w-4xl mx-auto text-ellipsis">{{ pageHeading.subtitle }}</h2>
    </div>

    <!-- 音效展示区域 -->
    <div class="max-w-6xl mx-auto min-h-screen">
      <!-- AI音效生成器区域 -->
      <AISoundEffectGenerator class="mt-6" />

      <SoundEffectSamplesSection
        :current-playing="currentPlaying"
        :is-loading-sample="isLoadingSample"
        @play-sample="playSample"
        @category-change="stopCurrentAudio"
      />

      <!-- 优势介绍组件 -->
      <AdvantagesSection
        v-if="!isLoggedIn"
        :title="advantagesTitle"
        :advantages="advantages"
      />

      <!-- FAQ 区域 -->
      <FAQSection
        v-if="!isLoggedIn"
        :title="faqsTitle"
        :faqs="faqs"
      />
      
    </div>
    
    <audio ref="audio" style="display:none"></audio>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, onErrorCaptured } from 'vue'
import { useToast } from 'vue-toastification/dist/index.mjs'
import { config } from '~/config/config'
import AISoundEffectGenerator from '@/components/AISoundEffectGenerator.vue'
import SoundEffectSamplesSection, { type SoundEffectSampleItem } from '@/components/SoundEffectSamplesSection.vue'
import AdvantagesSection from '~/components/AdvantagesSection.vue'
import FAQSection from '~/components/FAQSection.vue'
import { useErrorReporter } from '~/composables/errorReporter'
import { useUserStore } from '~/store/user'
import { useAuth } from '~/composables/useAuth'
import { usePageErrorHandler } from '~/composables/usePageErrorHandler'
import { useI18n } from 'vue-i18n'
import { useRequestEvent } from '#app'

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

const props = defineProps<{
  /** 与翻译 JSON 根键、路由 path、SEO slug 一致，如 sound-effect */
  pageKey: string
}>()

/** vue-i18n 消息前缀，与 pageKey 一致 */
const pageNs = computed(() => props.pageKey)

const { t, tm, locale: i18nLocale } = useI18n()
const { reportError } = useErrorReporter()
const { getOrCreateUid } = useAuth()
const toast = useToast()
const uid = ref(getOrCreateUid())
const userStore = useUserStore()
const isLoggedIn = computed(() => !!userStore.user)
const userEmail = computed(() => userStore.user?.email || '')
const event = useRequestEvent()
const lang = useState('lang', () => event?.context?.lang || 'en')

const pageHeading = computed(() => {
  void i18nLocale.value
  const k = pageNs.value
  return {
    title: t(`${k}.title`),
    subtitle: t(`${k}.subtitle`)
  }
})

const advantagesTitle = computed(() => t(`${pageNs.value}.advantages.title`))
const faqsTitle = computed(() => t(`${pageNs.value}.faqs.title`))

// SEO Meta Tags（随语言与 pageKey 绑定更新）
useHead(
  computed(() => {
    void i18nLocale.value
    const slug = pageNs.value
    const p = pageNs.value
    return {
      htmlAttrs: {
        lang: lang.value
      },
      title: t(`${p}.seo.title`),
      meta: [
        { name: 'description', content: t(`${p}.seo.description`) },
        { name: 'keywords', content: t(`${p}.seo.keywords`) },
        { property: 'og:type', content: 'website' },
        { property: 'og:title', content: t(`${p}.seo.title`) },
        { property: 'og:description', content: t(`${p}.seo.description`) },
        { property: 'og:url', content: 'https://aivoicelab.net' },
        { property: 'og:image', content: 'https://cdn.aivoicelab.net/img/aivoicelab-fbtw.webp' },
        { name: 'twitter:card', content: 'summary_large_image' },
        { name: 'twitter:title', content: t(`${p}.seo.title`) },
        { name: 'twitter:description', content: t(`${p}.seo.description`) },
        { name: 'twitter:site', content: 'https://aivoicelab.net' },
        { name: 'twitter:image', content: 'https://cdn.aivoicelab.net/img/aivoicelab-fbtw.webp' }
      ],
      link: [
        { rel: 'preconnect', href: host },
        { rel: 'dns-prefetch', href: host },
        { rel: 'canonical', href: `${host}/${lang.value}/${slug}` },
        { rel: 'alternate', hreflang: 'x-default', href: `${host}/en/${slug}` },
        { rel: 'alternate', hreflang: 'en', href: `${host}/en/${slug}` },
        { rel: 'alternate', hreflang: 'zh', href: `${host}/zh/${slug}` },
        { rel: 'alternate', hreflang: 'zh-tw', href: `${host}/zh-tw/${slug}` },
        { rel: 'alternate', hreflang: 'es', href: `${host}/es/${slug}` },
        { rel: 'alternate', hreflang: 'ja', href: `${host}/ja/${slug}` },
        { rel: 'alternate', hreflang: 'fr', href: `${host}/fr/${slug}` }
      ]
    }
  })
)

const currentPlaying = ref('')
const audio = ref<HTMLAudioElement | null>(null)
const isLoadingSample = ref('')
const currentAudioUrl = ref<string | null>(null)

// 优势特性数据
const advantages = computed(() => {
  const advantagesItems = tm(`${pageNs.value}.advantages.items`) || []
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
  const raw = tm(`${pageNs.value}.faqs.items`) || []
  // 确保 raw 是数组
  const items = Array.isArray(raw) ? raw : []
  const p = pageNs.value
  // 用 t 获取每一项的字符串
  return items.map((_, idx) => ({
    question: t(`${p}.faqs.items.${idx}.question`),
    answer: t(`${p}.faqs.items.${idx}.answer`)
  }))
})

// 控制展开/收起状态
const openFaq = ref<number | null>(null)

// 切换FAQ展开/收起
const toggleFaq = (index: number) => {
  openFaq.value = openFaq.value === index ? null : index
}

// 停止当前播放的音频
const stopCurrentAudio = () => {
  if (audio.value) {
    audio.value.pause()
    audio.value.currentTime = 0
    audio.value.src = ''
    currentPlaying.value = ''
    if (currentAudioUrl.value) {
      URL.revokeObjectURL(currentAudioUrl.value)
      currentAudioUrl.value = null
    }
  }
}

// 添加错误消息的本地化处理
const errorMessages = computed(() => ({
  loadFailed: t(`${pageNs.value}.msg_example_load_failed`),
  playFailed: t(`${pageNs.value}.msg_example_play_failed`)
}))

// 播放样本
async function playSample(sample: SoundEffectSampleItem) {
  if (isLoadingSample.value || currentPlaying.value === sample.id) {
    stopCurrentAudio()
    return
  }
  
  stopCurrentAudio() // 播放新音频前停止当前播放
  isLoadingSample.value = sample.id
  try {
    const response = await fetch(sample.url)
    if (!response.ok) {
      reportError(new Error(errorMessages.value.loadFailed), 'sound play sample load failed', uid.value, userEmail.value)
      toast.error(errorMessages.value.loadFailed, {
        position: 'top-right',
        duration: 3000
      })
      return 
    }
    const blob = await response.blob()
    const url = URL.createObjectURL(blob)
    currentAudioUrl.value = url
    
    if (audio.value) {
      audio.value.src = url
      await audio.value.play()
      currentPlaying.value = sample.id
      audio.value.onended = () => {
        currentPlaying.value = ''
        URL.revokeObjectURL(url)
        currentAudioUrl.value = null
      }
    }
  } catch (err) {
    reportError(err, 'sound play sample play failed', uid.value, userEmail.value)
    toast.error(errorMessages.value.playFailed, {
      position: 'top-right',
      duration: 3000
    })
    return 
  } finally {
    isLoadingSample.value = ''
  }
}

// 组件卸载时清理资源
onUnmounted(() => {
  stopCurrentAudio()
  if (audio.value) {
    audio.value = null
  }
})

// 在 onMounted 中初始化 audio ref
onMounted(() => {
  audio.value = new Audio()
})

const pageUrl = computed(() => {
  if (process.client) {
    return window.location.href
  }
  return ''
})

const { onPageError } = usePageErrorHandler(props.pageKey, uid.value, userEmail.value)
onErrorCaptured(onPageError)

</script>

<style scoped>
.max-h-0 {
  max-height: 0;
}
.max-h-[500px] {
  max-height: 500px;
}
</style>