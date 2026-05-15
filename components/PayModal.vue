<template>
  <div v-if="show" class="fixed inset-0 bg-black bg-opacity-70 backdrop-blur-[2px] flex items-center justify-center z-50 px-4 py-6 overflow-y-auto" @click.self="$emit('close')">
    <div class="bg-white p-3 sm:p-5 rounded-2xl shadow-2xl w-full max-w-[380px] relative mx-auto my-auto transform">
      <!-- 关闭按钮 -->
      <button @click="$emit('close')" class="absolute right-2 sm:right-2.5 top-2 sm:top-2.5 bg-gray-200 rounded-full p-1.5 text-gray-500 hover:text-gray-600 hover:bg-gray-300 transition-colors touch-manipulation focus:outline-none focus:ring-2 focus:ring-gray-300">
        <svg class="w-3 h-3" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
          <path d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" />
        </svg>
      </button>

      <!-- Logo -->
      <div class="flex items-center justify-center mb-3 sm:mb-4">
        <img :src="cdnHost + logoImage" alt="Free AI Cover Logo" width="40" height="35" class="h-7 sm:h-8" loading="lazy">
        <img :src="cdnHost + wordImage" alt="Free AI Voice Over Logo word" width="90" height="20" class="h-7 sm:h-8" loading="lazy">
      </div>

      <h2 class="text-base sm:text-lg font-bold text-center mb-3 sm:mb-4 px-3 text-gray-800">{{ $t('paymodal.title') }}</h2>

      <!-- 功能列表 -->
      <div class="space-y-2 sm:space-y-3 mb-3 sm:mb-4">
        <div v-for="feature in features" :key="feature.id" 
             class="flex items-start p-1.5 rounded-lg transition-colors duration-200 active:bg-gray-100"
             :class="{'sm:hover:bg-gray-50': !isMobile}">
          <div class="flex-shrink-0 w-5 h-5 sm:w-6 sm:h-6 bg-orange-100 rounded-lg flex items-center justify-center mr-2">
            <svg class="w-3 h-3 sm:w-3.5 sm:h-3.5 text-orange-500" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
              <path :d="getFeatureIcon(feature.id)" stroke="currentColor" fill="none"
                    stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </div>
          <div class="flex items-center min-h-[1.25rem] sm:min-h-[1.5rem]">
            <h3 class="font-medium text-gray-800 text-sm leading-tight">{{ rt(feature.text) }}</h3>
          </div>
        </div>
      </div>

      <!-- 价格显示或配额用完提示 -->
      <div v-if="!quotaExhaustedComputed" class="rounded-xl p-3 sm:p-4 mb-3 sm:mb-4 text-center relative overflow-hidden bg-orange-50">
        <div class="text-base sm:text-xl font-extrabold text-orange-500 relative z-10">
          {{ $t('paymodal.lowas') }} 
          <span class="text-red-500">$4.9</span> 
          <span class="text-xs text-gray-500 font-medium">{{ $t('paymodal.period') }}</span>
        </div>
      </div>
      
      <!-- 配额用完提示（订阅用户） -->
      <div v-else class="rounded-xl p-3 sm:p-4 mb-3 sm:mb-4 text-center relative overflow-hidden bg-gradient-to-br from-orange-50 to-purple-50 border border-orange-200">
        <div class="flex items-center justify-center">
          <svg class="w-5 h-5 sm:w-6 sm:h-6 text-orange-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
          <div class="text-base sm:text-lg font-semibold bg-clip-text text-transparent bg-gradient-to-r from-orange-500 to-purple-500 relative z-10">
            {{ getQuotaExhaustedMessage() }}
          </div>
        </div>
      </div>

      <!-- 按钮 -->
      <div class="relative">
        <button 
          @click="handleUpgradeClick"
          class="block w-full bg-gradient-to-r from-[#F1AC63] to-[#D76FF4] text-white py-3.5 sm:py-4 rounded-xl font-semibold 
                 active:opacity-90 transition-opacity text-center text-sm sm:text-base shadow-md 
                 touch-manipulation focus:outline-none focus:ring-2 focus:ring-orange-500"
        >
          {{ $t('paymodal.btn') }}
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* 移除复杂动画，保留基础过渡效果 */
.modal-enter-active, .modal-leave-active {
  transition: opacity 0.3s ease;
}

.modal-enter-from, .modal-leave-to {
  opacity: 0;
}

/* 针对移动端优化触摸反馈 */
@media (hover: none) {
  .touch-manipulation {
    touch-action: manipulation;
    -webkit-tap-highlight-color: transparent;
  }
}

/* 优化移动端性能 */
@media (max-width: 640px) {
  .backdrop-blur-[2px] {
    backdrop-filter: none;
  }
}
</style>

<script setup>
import { computed, ref, onMounted, toRaw } from 'vue'
import { useRequestEvent } from '#app'
import { useI18n } from 'vue-i18n'
import { config } from '~/config/config'
import { useActionReporter, ActionType } from '~/composables/actionReporter'
import { useErrorReporter } from '~/composables/errorReporter'

const cdnHost = config.cdnHost
const logoImage = config.logoImage
const wordImage = config.wordImage
const { t, tm, rt } = useI18n()
const event = useRequestEvent()
const lang = useState('lang', () => event?.context?.lang || 'en')
const isMobile = ref(false)

onMounted(() => {
  // 检测是否为移动设备
  isMobile.value = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
})

const props = defineProps({
  show: {
    type: Boolean,
    default: false
  },
  uid: {
    type: String,
    default: ''
  },
  email: {
    type: String,
    default: ''
  },
  quotaExhausted: {
    type: Boolean,
    default: false
  },
  quotaType: {
    type: String,
    default: '' // 'tts', 'cover', 'sound', 'vocalisolate', 'vocalremover', 'audioextractor'
  }
})

// 计算属性来获取最新的响应式值
const currentUid = computed(() => props.uid)
const currentEmail = computed(() => props.email)

// Props 本身就是响应式的，可以直接使用
// 但使用 computed 可以让意图更明确，保留也没问题
const quotaExhaustedComputed = computed(() => props.quotaExhausted)
const quotaTypeComputed = computed(() => props.quotaType)

const emit = defineEmits(['close'])
const pricing_href = computed(() => {
  return '/' + lang.value + '/pricing'
})

const { trackAction } = useActionReporter()
const { reportError } = useErrorReporter()

// 处理升级按钮点击
const handleUpgradeClick = () => {
  try {
    // 数据上报
    trackAction({
      email: currentEmail.value,
      action: ActionType.PAYMODAL_UPGRADE,
      domain: config.domain,
      modelcat: "paymodal",
      modelname: "paymodal",
      uid: currentUid.value
    })
    
    // 根据设备类型决定跳转方式
    if (isMobile.value) {
      // 移动端：当前窗口跳转
      window.location.href = pricing_href.value
    } else {
      // 桌面端：新窗口打开
      // 现代浏览器默认会设置 noopener，COOP 响应头已通过服务器中间件配置
      const newWindow = window.open(pricing_href.value, '_blank')
      // 如果新窗口被阻止（例如被浏览器弹窗阻止器），则回退到当前窗口跳转
      if (!newWindow) {
        window.location.href = pricing_href.value
      }
    }
  } catch (error) {
    reportError(error, "paymodal click failed!", currentUid.value, currentEmail.value)
  }
}

// 定义图标路径（viewBox 0 0 24 24，描边图标）
const FEATURE_ICONS = {
  // 文档 + 文本行：TTS
  tts: "M7 3h8l4 4v14a2 2 0 01-2 2H7a2 2 0 01-2-2V5a2 2 0 012-2zM9 9h6M9 13h6M9 17h4",
  // 扬声器 + 声波
  sound: "M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z",
  // 麦克风：人声 / vocal
  vocal: "M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z",
  // 音符：乐器（Heroicons 风格单路径）
  instrument: "M9 9h10.5a2.25 2.25 0 0 0 0-4.5H9V18a3 3 0 0 0 3 3h3a3 3 0 0 0 3-3v-1.5A2.25 2.25 0 0 0 15.75 12H9V9Z",
  download: "M4 16V17C4 19.2091 5.79086 21 8 21H16C18.2091 21 20 19.2091 20 17V16M16 12L12 16M12 16L8 12M12 16V4"
}

const getFeatureIcon = (featureId) => {
  return FEATURE_ICONS[featureId] || FEATURE_ICONS.tts
}

// 列表项索引 → 图标类型（与 paymodal.features.items 顺序对应）
const FEATURE_TYPES = {
  0: 'tts',
  1: 'sound',
  2: 'vocal',
  3: 'instrument',
  4: 'download'
}

// 修改 features 的计算属性
const features = computed(() => {
  const featureItems = tm('paymodal.features').items
  return featureItems.map((text, index) => {
    return {
      id: FEATURE_TYPES[index] ?? 'tts',
      text
    }
  })
})

// 获取配额用完的消息
const getQuotaExhaustedMessage = () => {
  const quotaMessages = {
    'tts': t('paymodal.quotaExhausted.tts'),
    'sound': t('paymodal.quotaExhausted.sound'),
    'vocalisolate': t('paymodal.quotaExhausted.vocalisolate'),
    'vocalremover': t('paymodal.quotaExhausted.vocalremover'),
    'audioextractor': t('paymodal.quotaExhausted.audioextractor')
  }
  return quotaMessages[props.quotaType] || t('paymodal.quotaExhausted.default')
}

</script>
