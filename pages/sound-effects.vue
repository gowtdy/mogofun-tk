<template>
  <div class="min-h-screen bg-white px-6 py-8">
    <!-- 顶部 header -->
    <div class="max-w-6xl mx-auto text-center mb-8">
      <h1 class="text-4xl font-bold mb-4 flex items-center justify-center gap-3 text-gray-800">
        🎧 {{ pageTitle.title || defaultTitle }}
      </h1>
      <h2 class="text-lg text-gray-500 max-w-4xl mx-auto text-ellipsis">{{ pageTitle.subtitle || defaultSubtitle}}</h2>
    </div>

    <!-- 音效展示区域 -->
    <div class="max-w-6xl mx-auto min-h-screen">
      <div class="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mb-4">
        <h2 class="text-2xl font-medium mb-6 text-center bg-gradient-to-r from-[#F1AC63] to-[#D76FF4] bg-clip-text text-transparent">{{ $t('soundeffect.display_title') }}</h2>
        
        <!-- 分类标签 -->
        <div class="flex flex-wrap justify-center gap-2 mb-5">
          <button
            v-for="cat in categories"
            :key="cat.id"
            @click="handleCategoryChange(cat.id)"
            class="px-5 py-1.5 rounded-full border text-sm transition-all duration-200 font-medium tracking-wide"
            :class="currentCategory === cat.id
              ? 'bg-gradient-to-r from-[#F1AC63] to-[#D76FF4] text-white border-transparent shadow-sm'
              : 'border-gray-200 text-gray-500 bg-white hover:border-pink-200 hover:text-pink-500'"
          >
            {{ $t(cat.name) }}
          </button>
        </div>

        <!-- 音效卡片网格 -->
        <div class="grid grid-cols-2 sm:grid-cols-5 gap-3">
          <div
            v-for="sample in currentSamples"
            :key="sample.id"
            class="flex items-center gap-3 px-4 py-3 border rounded-xl bg-gradient-to-r from-pink-50/40 to-purple-50/40 cursor-pointer transition-all duration-200 hover:shadow-md group min-w-0"
            :class="[
              currentPlaying === sample.id 
                ? 'border-[#D76FF4] shadow-md bg-gradient-to-r from-pink-100/50 to-purple-100/50' 
                : 'border-gray-200 hover:border-pink-300'
            ]"
            @click="playSample(sample)"
          >
            <div class="text-2xl">{{ sample.emoji }}</div>
            <div class="flex-grow text-left text-sm text-gray-600 font-medium">{{ $t(sample.name) }}</div>
            <button
              class="flex-shrink-0 transition-all duration-200 w-9 h-9 rounded-full flex items-center justify-center"
              :class="[
                currentPlaying === sample.id 
                  ? 'bg-gradient-to-r from-[#F1AC63] to-[#D76FF4] text-white shadow-sm' 
                  : 'bg-gradient-to-r from-[#F1AC63]/10 to-[#D76FF4]/10 text-[#D76FF4] group-hover:from-[#F1AC63]/20 group-hover:to-[#D76FF4]/20'
              ]"
              :aria-label="sample.id"
              :disabled="isLoadingSample === sample.id"
            >
              <!-- 加载中状态 -->
              <svg v-if="isLoadingSample === sample.id" class="loading-icon animate-spin w-6 h-6" viewBox="0 0 24 24">
                <path fill="currentColor" d="M12,4V2A10,10 0 0,0 2,12H4A8,8 0 0,1 12,4Z"/>
              </svg>
              <!-- 播放/暂停状态 -->
              <svg v-else-if="currentPlaying === sample.id" class="pause-icon w-6 h-6" viewBox="0 0 24 24">
                <path fill="currentColor" d="M8 6h3v12H8V6zm5 0h3v12h-3V6z"/>
              </svg>
              <!-- 默认状态 -->
              <svg v-else class="play-icon w-6 h-6" viewBox="0 0 24 24">
                <path fill="currentColor" d="M7 6v12l10-6z"/>
              </svg>
            </button>
          </div>
        </div>
      </div>

      <!-- AI音效生成器区域 -->
      <AISoundEffectGenerator class="mt-6" />

      <!-- 优势介绍组件 -->
      <AdvantagesSection
        v-if="!isLoggedIn"
        :title="t('soundeffect.advantages.title')"
        :advantages="advantages"
      />

      <!-- FAQ 区域 -->
      <FAQSection
        v-if="!isLoggedIn"
        :title="$t('soundeffect.faqs.title')"
        :faqs="faqs"
      />
      
    </div>
    
    <audio ref="audio" style="display:none"></audio>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useToast } from 'vue-toastification/dist/index.mjs'
import { config } from '~/config/config'
import { getPageTitle } from '~/constants/pageTitle'
import AISoundEffectGenerator from '@/components/AISoundEffectGenerator.vue'
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
const cdn_host = config.cdnHost

const { t, tm, locale } = useI18n()
const { reportError } = useErrorReporter()
const { getOrCreateUid } = useAuth()
const toast = useToast()
const uid = ref(getOrCreateUid())
const userStore = useUserStore()
const isLoggedIn = computed(() => !!userStore.user)
const userEmail = computed(() => userStore.user?.email || '')
const event = useRequestEvent()
const lang = useState('lang', () => event?.context?.lang || 'en')

// SEO Meta Tags
useHead({
  htmlAttrs: {
    lang: lang.value
  },
  title: t('soundeffect.seo.title'),
  meta: [
    { name: 'description', content: t('soundeffect.seo.description') },
    { name: 'keywords', content: t('soundeffect.seo.keywords') },
    { property: 'og:type', content: 'website' },
    { property: 'og:title', content: t('soundeffect.seo.title') },
    { property: 'og:description', content: t('soundeffect.seo.description') },
    { property: 'og:url', content: 'https://aivoicelab.net' },
    { property: 'og:image', content: 'https://cdn.aivoicelab.net/img/aivoicelab-fbtw.webp'},
    { name: 'twitter:card', content: 'summary_large_image' },
    { name: 'twitter:title', content: t('soundeffect.seo.title') },
    { name: 'twitter:description', content: t('soundeffect.seo.description') },
    { name: 'twitter:site', content: 'https://aivoicelab.net' },
    { name: 'twitter:image', content: 'https://cdn.aivoicelab.net/img/aivoicelab-fbtw.webp' }
  ],
  link: [
    { rel: 'preconnect', href: host },
    { rel: 'dns-prefetch', href: host },
    { rel: 'canonical', href: `${host}/${lang.value}/sound-effects`},
    { rel: 'alternate', hreflang: 'x-default', href: `${host}/en/sound-effects` },
    { rel: 'alternate', hreflang: 'en', href: `${host}/en/sound-effects` },
    { rel: 'alternate', hreflang: 'zh', href: `${host}/zh/sound-effects` },
    { rel: 'alternate', hreflang: 'zh-tw', href: `${host}/zh-tw/sound-effects` },
    { rel: 'alternate', hreflang: 'es', href: `${host}/es/sound-effects` },
    { rel: 'alternate', hreflang: 'ja', href: `${host}/ja/sound-effects` },
    { rel: 'alternate', hreflang: 'fr', href: `${host}/fr/sound-effects` },
  ]
})

const pageKey = 'sound-effects'
const defaultTitle = 'Best AI Cover & AI Voice Over'
const defaultSubtitle = 'Easily create AI covers and AI voice overs with your favorite voices anytime, anywhere'
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

const categories = [
  { id: 'nature' as CategoryType, name: 'soundeffect.prompt_nature.name' },
  { id: 'special' as CategoryType, name: 'soundeffect.prompt_special.name' },
  { id: 'instrument' as CategoryType, name: 'soundeffect.prompt_instruments.name' },
  { id: 'human' as CategoryType, name: 'soundeffect.prompt_human.name' },
  { id: 'ambient' as CategoryType, name: 'soundeffect.prompt_ambient.name' }
]
type CategoryType = 'nature' | 'special' | 'instrument' | 'human' | 'ambient'
const currentCategory = ref<CategoryType>('nature')
const currentPlaying = ref('')
const audio = ref<HTMLAudioElement | null>(null)
const isLoadingSample = ref('')
const currentAudioUrl = ref<string | null>(null)

interface SampleItem {
  id: string
  emoji: string
  url: string
  name: string
}

const samples: Record<CategoryType, SampleItem[]> = {
  nature: [
    { id: 'rain', emoji: '🌧️', url: `${cdn_host}/outimage/wavplay/sounds/nature/rain.mp3`, name: 'soundeffect.prompt_nature.rain' },
    { id: 'ocean', emoji: '🌊', url: `${cdn_host}/outimage/wavplay/sounds/nature/ocean.mp3`, name: 'soundeffect.prompt_nature.ocean_waves' },
    { id: 'water', emoji: '💧', url: `${cdn_host}/outimage/wavplay/sounds/nature/water.mp3`, name: 'soundeffect.prompt_nature.flowing_water' },
    { id: 'thunder', emoji: '⚡', url: `${cdn_host}/outimage/wavplay/sounds/nature/thunder.mp3`, name: 'soundeffect.prompt_nature.thunder' },
    { id: 'insect', emoji: '🦗', url: `${cdn_host}/outimage/wavplay/sounds/nature/insect.mp3`, name: 'soundeffect.prompt_nature.insect_sounds' }
  ],
  special: [
    { id: 'fireworks', emoji: '🎆', url: `${cdn_host}/outimage/wavplay/sounds/special/fireworks.mp3`, name: 'soundeffect.prompt_special.fireworks' },
    { id: 'glass', emoji: '💥', url: `${cdn_host}/outimage/wavplay/sounds/special/glass.mp3`, name: 'soundeffect.prompt_special.glass_shattering' },
    { id: 'magic', emoji: '✨', url: `${cdn_host}/outimage/wavplay/sounds/special/magic.mp3`, name: 'soundeffect.prompt_special.magic_spell' },
    { id: 'spaceship', emoji: '🚀', url: `${cdn_host}/outimage/wavplay/sounds/special/spaceship.mp3`, name: 'soundeffect.prompt_special.spaceship' },
    { id: 'action', emoji: '💫', url: `${cdn_host}/outimage/wavplay/sounds/special/action.mp3`, name: 'soundeffect.prompt_special.action' }
  ],
  instrument: [
    { id: 'piano', emoji: '🎹', url: `${cdn_host}/outimage/wavplay/sounds/instrument/piano.mp3`, name: 'soundeffect.prompt_instruments.piano' },
    { id: 'guitar', emoji: '🎸', url: `${cdn_host}/outimage/wavplay/sounds/instrument/guitar.mp3`, name: 'soundeffect.prompt_instruments.electric_guitar' },
    { id: 'violin', emoji: '🎻', url: `${cdn_host}/outimage/wavplay/sounds/instrument/violin.mp3`, name: 'soundeffect.prompt_instruments.violin' },
    { id: 'keyboard', emoji: '🎹', url: `${cdn_host}/outimage/wavplay/sounds/instrument/keyboard.mp3`, name: 'soundeffect.prompt_instruments.keyboard' },
    { id: 'pipes', emoji: '🎵', url: `${cdn_host}/outimage/wavplay/sounds/instrument/pipes.mp3`, name: 'soundeffect.prompt_instruments.irish_pipes' }
  ],
  human: [
    { id: 'baby', emoji: '👶', url: `${cdn_host}/outimage/wavplay/sounds/human/baby.mp3`, name: 'soundeffect.prompt_human.baby_laughing' },
    { id: 'clap', emoji: '👏', url: `${cdn_host}/outimage/wavplay/sounds/human/clap.mp3`, name: 'soundeffect.prompt_human.clapping' },
    { id: 'celebrate', emoji: '🎉', url: `${cdn_host}/outimage/wavplay/sounds/human/celebrate.mp3`, name: 'soundeffect.prompt_human.celebrate' },
    { id: 'footsteps', emoji: '👣', url: `${cdn_host}/outimage/wavplay/sounds/human/footsteps.mp3`, name: 'soundeffect.prompt_human.footsteps' },
    { id: 'burp', emoji: '😮', url: `${cdn_host}/outimage/wavplay/sounds/human/burp.mp3`, name: 'soundeffect.prompt_human.burp' }
  ],
  ambient: [
    { id: 'typing', emoji: '⌨️', url: `${cdn_host}/outimage/wavplay/sounds/ambient/typing.mp3`, name: 'soundeffect.prompt_ambient.typing' },
    { id: 'restaurant', emoji: '🍽️', url: `${cdn_host}/outimage/wavplay/sounds/ambient/restaurant.mp3`, name: 'soundeffect.prompt_ambient.noisy_restaurant' },
    { id: 'doorbell', emoji: '🔔', url: `${cdn_host}/outimage/wavplay/sounds/ambient/doorbell.mp3`, name: 'soundeffect.prompt_ambient.doorbell_ring' },
    { id: 'tv', emoji: '📺', url: `${cdn_host}/outimage/wavplay/sounds/ambient/tv.mp3`, name: 'soundeffect.prompt_ambient.tv_on' },
    { id: 'cooking', emoji: '🍳', url: `${cdn_host}/outimage/wavplay/sounds/ambient/cooking.mp3`, name: 'soundeffect.prompt_ambient.cooking' }
  ]
}
const currentSamples = computed(() => samples[currentCategory.value])

// 优势特性数据
const advantages = computed(() => {
  const advantagesItems = tm('soundeffect.advantages.items') || []
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
  const raw = tm('soundeffect.faqs.items') || []
  // 确保 raw 是数组
  const items = Array.isArray(raw) ? raw : []
  // 用 t 获取每一项的字符串
  return items.map((_, idx) => ({
    question: t(`soundeffect.faqs.items.${idx}.question`),
    answer: t(`soundeffect.faqs.items.${idx}.answer`)
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

// 切换分类时停止当前播放
const handleCategoryChange = (category: CategoryType) => {
  stopCurrentAudio()
  currentCategory.value = category
}

// 添加错误消息的本地化处理
const errorMessages = computed(() => ({
  loadFailed: t('soundeffect.msg_example_load_failed'),
  playFailed: t('soundeffect.msg_example_play_failed')
}))

// 播放样本
async function playSample(sample: SampleItem) {
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
  const title = getPageTitle(pageKey, lang.value)[0]
  if (title) {
    pageTitle.value = title
  }
  audio.value = new Audio()
})

const pageUrl = computed(() => {
  if (process.client) {
    return window.location.href
  }
  return ''
})

const { onPageError } = usePageErrorHandler("sound-effects", uid.value, userEmail.value)
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