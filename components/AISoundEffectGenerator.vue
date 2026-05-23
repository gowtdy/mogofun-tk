<template>
  <div class="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mb-12" :class="$attrs.class">
    <p class="text-gray-500 text-base mb-4 text-center">{{ generatorSubtitle }}</p>
    
    <!-- 标签示例 -->
    <div class="flex flex-wrap gap-2 justify-center mb-6">
      <button
        v-for="(prompt, idx) in promptExamples"
        :key="idx"
        class="px-5 py-1.5 rounded-full border text-sm transition-all duration-200 font-medium tracking-wide"
        :class="description === prompt.key
          ? 'bg-gradient-to-r from-[#F1AC63] to-[#D76FF4] text-white border-transparent shadow-sm'
          : 'border-gray-200 text-gray-500 bg-white hover:border-[#F1AC63] hover:text-[#F1AC63]'"
        @click="selectPrompt(prompt.key)"
      >
        {{ $t(prompt.display) }}
      </button>
    </div>

    <!-- 输入框区域 -->
    <div class="relative mb-6">
      <textarea
        v-model="description"
        class="w-full p-4 bg-white border border-gray-200 rounded-xl resize-none focus:ring-2 focus:ring-[#F1AC63]/20 focus:border-[#F1AC63] outline-none transition-all duration-200 text-gray-800 placeholder-gray-400"
        maxlength="100"
        rows="3"
        :placeholder="$t('soundeffect_common.input_placeholder')"
      ></textarea>
      <div class="absolute right-4 bottom-4 text-xs text-gray-700">
        {{ description.length }}/100
      </div>
    </div>

    <!-- 生成按钮 -->
    <button
      :disabled="isGenerating"
      @click="generateSound"
      class="max-w-md mx-auto py-3 px-8 rounded-xl bg-gradient-to-r from-[#F1AC63] to-[#D76FF4] text-white font-medium flex items-center justify-center hover:opacity-90 transition-all duration-200 shadow-sm"
    >
      <svg v-if="isGenerating" class="animate-spin mr-2 w-5 h-5" viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M12,4V2A10,10 0 0,0 2,12H4A8,8 0 0,1 12,4Z"/></svg>
      <span>{{ isGenerating ? $t('soundeffect_common.generating_button') : $t('soundeffect_common.generate_button') }}</span>
    </button>

    <!-- 音频播放器 -->
    <div v-if="generatedSound" class="mt-6">
      <div class="vue-audio-player__wrapper rounded-xl bg-white border border-gray-200">
        <VueAudioPlayer
          class="vue-audio-player--sound-effect"
          :audio-list="audioList"
          :is-loop="false"
          theme-color="#D76FF4"
          @ended="handleAudioEnded"
        />
        <button
          type="button"
          class="vue-audio-player__download shrink-0 cursor-pointer hover:opacity-90 transition-all duration-200"
          @click="downloadSound"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" aria-hidden="true">
            <defs>
              <linearGradient id="downloadGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stop-color="#F1AC63"/>
                <stop offset="100%" stop-color="#D76FF4"/>
              </linearGradient>
            </defs>
            <circle cx="12" cy="12" r="11" fill="url(#downloadGradient)"/>
            <path d="M8 12l4 4 4-4M12 16V8" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
          </svg>
        </button>
      </div>
    </div>
  </div>
  <!-- 引入 LoginModal 组件 -->
  <LoginModal :showModal="showModal" @loginSuccess="handleLoginSuccess" />
  <PayModal
      :show="showPayModal"
      :quota-exhausted="quotaExhaustedComputed"
      :quota-type="quotaTypeComputed"
      @close="handlePayModalClose"
    />
  <CommonModal
      :show="showCommonModal"
      title="Daily Limit Reached"
      message="You've reached today's free conversion limit. Come back tomorrow or upgrade to Premium for unlimited access."
      @close="showCommonModal = false"
    />
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, nextTick, watch } from 'vue'
import { useSignature } from '~/composables/useSignature'
import { useUserStore } from '~/store/user'
import { useAuth } from '~/composables/useAuth'
import { config } from '~/config/config'
import VueAudioPlayer from '~/components/VueAudioPlayer.vue'
import { useErrorReporter } from '~/composables/errorReporter'
import { useActionReporter, ActionType } from '~/composables/actionReporter'
import { useQuotaCheck, QuotaType } from '~/composables/useQuotaCheck'
import { useToast } from 'vue-toastification/dist/index.mjs'
import LoginModal from '~/components/LoginModal.vue'
import PayModal from '~/components/PayModal.vue'
import CommonModal from '~/components/CommonModal.vue'
import { useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useSoundEffectPrompts } from '~/composables/useSoundEffectPrompts'

// 添加组件定义
defineOptions({
  name: 'AISoundEffectGenerator',
  inheritAttrs: true
})

const props = defineProps<{
  /** i18n prefix matching the page locale JSON root key (e.g. sound-effect) */
  pageKey: string
}>()

const { t, tm, locale } = useI18n()

const generatorSubtitle = computed(() => {
  void locale.value
  return t(`${props.pageKey}.generator_subtitle`)
})

const { promptExamples, presetDescription } = useSoundEffectPrompts(
  () => props.pageKey,
)
const { getOrCreateUid, getUserInfo } = useAuth()
const { reportError } = useErrorReporter()
const { trackAction, actionCounts } = useActionReporter()
const { generateSoundSignature } = useSignature()
const toast = useToast()

const domain = config.domain
const host = config.host
const apiHost = config.apiHost

const userStore = useUserStore()
const isLoggedIn = computed(() => !!userStore.user)
const userEmail = computed(() => userStore.user?.email || '')
const uid = ref(getOrCreateUid())


const route = useRoute()
const pageUrl = computed(() => {
  if (process.client) {
    return window.location.href
  }
  return ''
})

interface SoundEffectResponse {
  ret: number
  audioUrl?: string
  uri?: string
  msg?: string
}

const description = ref('')
const isGenerating = ref(false)
const generatedSound = ref('')
const isPlaying = ref(false)
const isPlayLoading = ref(false)
const audio = ref<HTMLAudioElement | null>(null)
const audio_main = ref<HTMLAudioElement | null>(null)
const email = ref('') // 当前用户邮箱
const user_subscript = ref(0) // 订阅状态
const tkuid = ref('') // 用户ID
const audioList = ref<string[]>([])

// 监听登录状态变化
watch(() => isLoggedIn.value, (newValue) => {
  fetchUserSubscription()
})

// 监听语言变化
watch(() => locale.value, () => {
  // 确保在语言切换时保持状态一致
  if (isLoggedIn.value) {
    fetchUserSubscription()
  }
})

// 在组件挂载时初始化
onMounted(() => {
  description.value = presetDescription.value

  // 初始化用户状态
  if (isLoggedIn.value) {
    fetchUserSubscription()
  }

  // 添加全局错误处理
  if (process.client) {
    window.addEventListener('unhandledrejection', handleUnhandledRejection)
    window.addEventListener('error', handleError)
  }

  audio.value = audio_main.value
})

// 在组件卸载时清理
onUnmounted(() => {
  try {
    // 清理音频列表
    audioList.value.length = 0
    generatedSound.value = ''

    // 清理事件监听器
    if (process.client) {
      window.removeEventListener('unhandledrejection', handleUnhandledRejection)
      window.removeEventListener('error', handleError)
    }

    // 重置所有状态
    isGenerating.value = false
    isPlaying.value = false
    isPlayLoading.value = false

  } catch (err) {
    reportError(err, `Cleanup failed in AISoundEffectGenerator`, uid.value, userEmail.value)
  }
})

// 获取用户订阅信息的函数
const fetchUserSubscription = async () => {
  if (isLoggedIn.value) {
    try {
      const userinfo = await getUserInfo(userEmail.value)
      if (userinfo?.userinfo) {
        user_subscript.value = userinfo.userinfo.user_subscript
      }
    } catch (err) {
      reportError(err, `Fetch user subscription failed(sound)`, uid.value, userEmail.value)
    }
  } else {
    user_subscript.value = 0
  }
}

// 处理未捕获的 Promise 异常
const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
  const errorDetails = {
    message: event.reason?.message || String(event.reason),
    stack: event.reason?.stack,
    type: event.type,
    timestamp: new Date().toISOString(),
    componentState: {
      isGenerating: isGenerating.value,
      isPlaying: isPlaying.value,
      isPlayLoading: isPlayLoading.value
    }
  }

  reportError(
    event.reason,
    `Unhandled Promise rejection in AISoundEffectGenerator - Details: ${JSON.stringify(errorDetails)}`,
    uid.value,
    userEmail.value
  )
}

// 处理运行时错误
const handleError = (event: ErrorEvent) => {
  const errorDetails = {
    message: event.message,
    filename: event.filename,
    lineno: event.lineno,
    colno: event.colno,
    stack: event.error?.stack,
    type: event.type,
    timestamp: new Date().toISOString(),
    componentState: {
      isGenerating: isGenerating.value,
      isPlaying: isPlaying.value,
      isPlayLoading: isPlayLoading.value
    }
  }

  reportError(
    event.error || new Error(event.message),
    `Runtime error in AISoundEffectGenerator - Details: ${JSON.stringify(errorDetails)}`,
    uid.value,
    userEmail.value
  )
}

const showPayModal = ref(false)
const showCommonModal = ref(false)
const showModal = ref(false)
const quotaTypeForModal = ref('') // 用于存储当前配额类型，传递给 PayModal

// 使用 computed 确保响应式更新
const quotaExhaustedComputed = computed(() => {
  return user_subscript.value === 1 && quotaTypeForModal.value !== ''
})

const quotaTypeComputed = computed(() => {
  return quotaTypeForModal.value
})

// 使用 watch 监听 quotaTypeForModal，当它被设置且用户是订阅用户时，自动显示弹窗
// 这比双重 nextTick 更优雅和可靠
watch(quotaTypeForModal, (newVal) => {
  if (newVal !== '' && user_subscript.value === 1 && !showPayModal.value) {
    showPayModal.value = true
  }
})

// 处理 PayModal 关闭事件
const handlePayModalClose = () => {
  showPayModal.value = false
  quotaTypeForModal.value = ''
}

const showLoginModal = () => {
  showModal.value = true
}

const handleLoginSuccess = () => {
  showModal.value = false
}

// 生成音效
async function generateSound() {
  if (isGenerating.value) return
  if (!description.value.trim()) {
    toast.error(t('soundeffect_common.msg_notext'), {
      position: 'top-right',
      duration: 3000
    })
    return
  }

  // 暂停当前音频
  if (audio.value && !audio.value.paused) {
    audio.value.pause()
    audio.value.currentTime = 0
  }

  isGenerating.value = true
  isPlaying.value = false
  generatedSound.value = ''

  try {
    const { dayCount, monthCount } = await actionCounts({
        email: userEmail.value,
        uid: uid.value,
        action: ActionType.SOUND_GENERATE,
        domain: domain
      })
    
    if (!isLoggedIn.value) {
        // 当未登录时
        // 当天生成6次，当月生成15次时，需要登录
        if (dayCount >= 4 || monthCount >= 8) {
          showLoginModal()
          trackAction({
            email: userEmail.value,
            action: ActionType.SOUND_GENPOP_LOGIN,
            domain: domain,
            modelcat: 'soundeffect',
            modelname: 'soundeffect',
            uid: uid.value
          })
          return
        }
      } else {
        // 当已登录时, 检查剩余次数（对于订阅用户）
        if (user_subscript.value === 1) {
          // 订阅用户：检查剩余次数
          const { checkQuota } = useQuotaCheck()
          const quotaResult = await checkQuota(QuotaType.SOUND, () => {
            // 设置 quotaTypeForModal，watch 会自动触发显示弹窗
            quotaTypeForModal.value = 'sound'
          })
          if (!quotaResult.canUse) {
            isGenerating.value = false
            showPayModal.value = true
            return
          }
        } else {
          // 未订阅用户：使用原有的次数限制逻辑
          if (dayCount >= 5 || monthCount >= 12) {
            showPayModal.value = true
            trackAction({
              email: userEmail.value,
              action: ActionType.SOUND_GENPOP_SUBSCRIPT,
              domain: domain,
              modelcat: 'soundeffect',
              modelname: 'soundeffect',
              uid: uid.value
            })
            isGenerating.value = false
            return
          }
        }
      }

    // 生成签名等参数
    const tstamp = Math.floor(Date.now() / 1000)
    const snature = generateSoundSignature(description.value, tstamp)

    const formData = new FormData();
    formData.append('text', description.value);
    formData.append('userid', uid.value);
    formData.append('email', userEmail.value);
    formData.append('subscript', String(user_subscript.value));
    formData.append('domain', domain);
    formData.append('tstamp', String(tstamp));
    formData.append('snature', snature);

    // 调用后端生成接口
    const response = await fetch(`${apiHost}/sapi/gensound`, {
      method: 'POST',
      timeout: 180000, // 3分钟超时
      body: formData,
      headers: {
              'Cache-Control': 'no-cache',
              'Pragma': 'no-cache'
            },
    })

    if (!response.ok){
      throw new Error(`Generate sound HTTP error! status: ${response.status}`)
    }
    const result: SoundEffectResponse = await response.json()

    // 处理返回
    if (result.ret === 0 && (result.audioUrl || result.uri)) {
      generatedSound.value = result.audioUrl || result.uri || ''
      audioList.value.length = 0
      audioList.value.push(host + (result.audioUrl || result.uri))
      
      // 更新用户使用次数（仅在登录状态下）
      if (isLoggedIn.value && userEmail.value) {
        try {
          const { updateUsageCount } = useAuth()
          updateUsageCount(userEmail.value, ActionType.SOUND_GENERATE)
        } catch (err) {
          reportError(err, `Error updating sound usage count - pageUrl: ${pageUrl.value}`, uid.value, userEmail.value)
        }
      }
      
      // 记录行为
      await trackAction({
        email: userEmail.value,
        action: ActionType.SOUND_GENERATE,
        domain: domain,
        modelcat: 'soundeffect',
        modelname: 'soundeffect',
        uid: uid.value
      })
      const msg = "Generate Succeed!"
      toast.success(msg, {
        position: 'top-right',
        duration: 1000
      })
    } else if (result.ret === 2) {
      showPayModal.value = true
      trackAction({
        email: userEmail.value,
        action: ActionType.SOUND_GENPOP_SUBSCRIPT,
        domain: domain,
        modelcat: 'soundeffect',
        modelname: 'soundeffect',
        uid: uid.value
      })
    } else {
      const msg = result.msg || 'The server is busy, please try again later!'
      toast.error(msg, {
        position: 'top-right',
        duration: 3000
      })
      reportError(new Error(msg), `Sound generator failed else - pageUrl: ${pageUrl.value}`, uid.value, userEmail.value)
    }
  } catch (err) {
    const msg = "The server is busy, please try again later!"
    toast.error(msg, {
      position: 'top-right',
      duration: 3000
    })
    reportError(err, `Sound Generator failed catch - pageUrl: ${pageUrl.value}`, uid.value, userEmail.value)
  } finally {
    isGenerating.value = false
  }
}

// 下载
async function downloadSound() {
  if (!generatedSound.value) {
    toast.error(t('soundeffect_common.download.noAudio'), {
      position: 'top-right',
      duration: 3000
    })
    return
  }

  if (!isLoggedIn.value) {
    showLoginModal()
    trackAction({
      email: userEmail.value,
      action: ActionType.SOUND_DOWNLOAD_LOGIN,
      domain: domain,
      modelcat: 'soundeffect',
      modelname: 'soundeffect',
      uid: uid.value
    })
    return
  }

  if (user_subscript.value !== 1) {
    try {
      const { dayCount, monthCount } = await actionCounts({
        email: userEmail.value,
        uid: uid.value,
        action: ActionType.SOUND_DOWNLOAD,
        domain: domain,
      })
      if (dayCount >= 1 || monthCount >= 3) {
        showPayModal.value = true
        trackAction({
          email: userEmail.value,
          action: ActionType.SOUND_DOWNPOP_SUBSCRIPT,
          domain: domain,
          modelcat: 'soundeffect',
          modelname: 'soundeffect',
          uid: uid.value
        })
        return
      }
    } catch (err) {
      reportError(err, `Sound download Action counts check failed - pageUrl: ${pageUrl.value}`, uid.value, userEmail.value)
    }
  }
  
  try {
    const response = await fetch(`${host}${generatedSound.value}`)
    if (!response.ok) {
      const msg = t('soundeffect_common.download.fetchFailed')
      reportError(new Error(`${msg} status: ${response.status}`), 'downloadSound');
      toast.error(msg, {
        position: 'top-right',
        duration: 3000
      })
      return;
    }
    
    await trackAction({
      email: userEmail.value,
      action: ActionType.SOUND_DOWNLOAD,
      domain: domain,
      modelcat: 'soundeffect',
      modelname: 'soundeffect',
      uid: uid.value
    })
    const blob = await response.blob()
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `generated-sound-${Date.now()}.mp3`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    window.URL.revokeObjectURL(url)

    toast.success(t('soundeffect_common.download.success'), {
      position: 'top-right',
      duration: 2000
    })
  } catch (err) {
    toast.error(t('soundeffect_common.download.failed'), {
      position: 'top-right',
      duration: 3000
    })
    reportError(err, `Sound Download failed - pageUrl: ${pageUrl.value}`, uid.value, userEmail.value)
  }
}

// 标签选择
function selectPrompt(key: string) {
  const prompt = promptExamples.value.find(p => p.key === key)
  if (prompt) {
    description.value = prompt.key
  }
}

// 在 script setup 部分添加 handleAudioEnded 函数
const handleAudioEnded = () => {
  // 音频播放结束时的处理
  isPlaying.value = false
}
</script>

<style scoped>
.vue-audio-player__wrapper {
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
  min-height: 64px;
  padding: 0.75rem;
  background: white;
}

:deep(.vue-audio-player--sound-effect) {
  display: flex;
  flex: 1;
  align-items: flex-start;
  gap: 0.75rem;
  min-width: 0;
  padding: 0;
}

:deep(.vue-audio-player--sound-effect .vue-audio-player__btn-wrap) {
  flex-shrink: 0;
  flex-direction: row;
  height: 42px;
  align-items: center;
}

:deep(.vue-audio-player--sound-effect .vue-audio-player__play-start),
:deep(.vue-audio-player--sound-effect .vue-audio-player__play-pause),
:deep(.vue-audio-player--sound-effect .vue-audio-player__play-loading) {
  flex: none;
  margin: 0;
  width: 42px;
  height: 42px;
}

:deep(.vue-audio-player--sound-effect .vue-audio-player__play-start svg),
:deep(.vue-audio-player--sound-effect .vue-audio-player__play-pause svg),
:deep(.vue-audio-player--sound-effect .vue-audio-player__play-loading svg) {
  display: block;
  width: 42px;
  height: 42px;
}

:deep(.vue-audio-player--sound-effect .vue-audio-player__progress-timer-wrap) {
  flex: 1;
  min-width: 0;
  display: grid;
  grid-template-rows: 42px auto;
  align-items: center;
}

:deep(.vue-audio-player--sound-effect .vue-audio-player__progress-wrap) {
  grid-row: 1;
  align-self: center;
  margin-top: 0;
  height: 6px;
  background: #e5e7eb;
  border-radius: 3px;
}

:deep(.vue-audio-player--sound-effect .vue-audio-player__progress) {
  background: linear-gradient(to right, #F1AC63, #D76FF4) !important;
  border-radius: 3px;
}

:deep(.vue-audio-player--sound-effect .vue-audio-player__time-wrap) {
  grid-row: 2;
  margin-top: 4px;
}

:deep(.vue-audio-player--sound-effect .vue-audio-player__current-time),
:deep(.vue-audio-player--sound-effect .vue-audio-player__duration) {
  color: #6B7280;
  font-size: 0.875rem;
}

.vue-audio-player__download {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 42px;
  height: 42px;
  padding: 0;
  border: none;
  background: transparent;
  flex-shrink: 0;
}

.vue-audio-player__download svg {
  display: block;
  width: 42px;
  height: 42px;
}
</style>