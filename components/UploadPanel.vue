<template>
  <div
    class="max-w-4xl mx-auto bg-white rounded-2xl border border-gray-100 shadow-md p-6 mb-8 min-h-[530px] flex flex-col items-center justify-center relative upload-panel-outer"
    :class="{ 'drag-over': isDragOver }" @dragover.prevent="handleDragOver" @dragenter.prevent="handleDragEnter"
    @dragleave.prevent="handleDragLeave" @drop.prevent="handleDrop">
    <!-- Upload Area -->
    <div class="w-full min-h-[300px] flex flex-col items-center justify-center">
      <AudioUploader ref="audioUploaderRef" :uploaded-file="uploadedFile" :model-category="modelCategory"
        :model-name="modelName" :type="mediaType" :action-type="actionType"
        @file-change="handleFileChange"
        @upload-success="handleUploadSuccess" @upload-error="handleUploadError" @reset="handleUploadReset"
        @uploading="handleUploading" />
    </div>

    <!-- Separation Result -->
    <div v-if="separationResults" class="w-full border border-gray-100 rounded-lg p-8 mt-4">
      <h2 class="text-xl font-medium mb-4 bg-gradient-to-r from-[#EC4141] to-[#D76FF4] bg-clip-text text-transparent">{{
        resultTitle }}</h2>
      <div class="space-y-6">
        <div class="flex items-center gap-4">
          <div class="flex-1">
            <VueAudioPlayer :audio-list="[blobUrl]" v-if="blobUrl" />
          </div>
          <div class="vue-audio-player__download" @click="downloadAudio" v-if="blobUrl">
            <!-- Download Icon -->
            <svg class="w-[42px] h-[42px] cursor-pointer hover:opacity-90 transition-all" xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 1080 1080" xml:space="preserve" aria-hidden="true">
              <defs>
                <linearGradient id="gradient2" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stop-color="#F1AC63" />
                  <stop offset="100%" stop-color="#D76FF4" />
                </linearGradient>
              </defs>
              <path transform="translate(28 28)"
                d="M512 8.98c277.815 0 503.02 225.205 503.02 503.02S789.816 1015.02 512 1015.02 8.98 789.816 8.98 512 234.184 8.98 512 8.98"
                fill="url(#gradient2)" />
              <path style="stroke:#fff;stroke-width:2" transform="translate(277.92 277.92)scale(21.84)"
                d="M21 21H3m15-10-6 6m0 0-6-6m6 6V3" stroke-linecap="round" />
            </svg>
          </div>
        </div>
      </div>
    </div>

    <!-- Action Buttons -->
    <div class="max-w-4xl mx-auto mt-8 flex gap-4 justify-center h-[50px]">
      <template v-if="uploadedFile && !isUploading">
        <button v-if="!separationResults" @click="processAudio" :disabled="isProcessing"
          class="flex items-center justify-center gap-2 px-6 py-2 bg-gradient-to-r from-[#F1AC63] to-[#D76FF4] text-white rounded-full shadow hover:opacity-90 transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed">
          <svg v-if="isProcessing" class="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg"
            fill="none" viewBox="0 0 24 24" aria-hidden="true">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z">
            </path>
          </svg>
          <ScissorsIcon v-else class="h-5 w-5 text-white" />
          <span>{{ isProcessing ? t(`separation_common.messages.processing_${jobVariant}`) : processButtonText }}</span>
        </button>
        <!-- button @click="handleUploadReset"
          class="flex items-center justify-center gap-2 px-6 py-2 bg-gradient-to-r from-[#F1AC63] to-[#D76FF4] text-white rounded-full shadow hover:opacity-90 transition duration-300"
          type="button" :disabled="isProcessing">
          <svg class="h-5 w-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24" aria-hidden="true">
            <path stroke-linecap="round" stroke-linejoin="round"
              d="M4 4v5h.582M20 20v-5h-.581M5.635 19.364A9 9 0 104.582 9.582" />
          </svg>
          <span>{{ t('comm.upload.reset') }}</span>
        </button -->
      </template>
      <div v-else class="h-[50px]"><!-- placeholder --></div>
    </div>
  </div>

  <!-- Import LoginModal Component -->
  <LoginModal :showModal="showModal" @loginSuccess="handleLoginSuccess" />
  <PayModal 
    :show="showPayModal" 
    :quota-exhausted="quotaExhaustedComputed"
    :quota-type="quotaTypeComputed"
    @close="handlePayModalClose" 
  />
  <CommonModal :show="showCommonModal" title="Daily Limit Reached"
    message="You've reached today's free conversion limit. Come back tomorrow or upgrade to Premium for unlimited access."
    @close="showCommonModal = false" />
</template>

<script setup lang="ts">
import { ref, watch, onMounted, onUnmounted, nextTick, computed } from 'vue'
import AudioUploader from '~/components/AudioUploader.vue'
import VueAudioPlayer from '~/components/VueAudioPlayer.vue'
import { config } from '~/config/config'
import { useToast } from 'vue-toastification/dist/index.mjs'
import { useErrorReporter } from '~/composables/errorReporter'
import { useActionReporter, ActionType } from '~/composables/actionReporter'
import { useAuth } from '~/composables/useAuth'
import { useQuotaCheck, QuotaType } from '~/composables/useQuotaCheck'
import { useSignature } from '~/composables/useSignature'
import { ScissorsIcon } from '@heroicons/vue/24/solid'
import { useI18n } from 'vue-i18n'
import { useUserStore } from '~/store/user'
import LoginModal from '~/components/LoginModal.vue'
import PayModal from '~/components/PayModal.vue'
import CommonModal from '~/components/CommonModal.vue'
import { useRoute } from 'vue-router'

const props = defineProps({
  resultTitle: { type: String, default: 'Vocal' },
  processButtonText: { type: String, default: 'Start Separation' },
  modelCategory: { type: String, default: 'upload' },
  modelName: { type: String, default: 'upload' },
  mediaType: { type: String, default: 'audio' },
  apiEndpoint: { type: String, required: true },
  /** slug for analytics modelcat/modelname (hyphenated path segment) */
  telemetryModelSlug: { type: String, default: 'vocal-isolator' },
  /** which separation_common success/failed_* variant to use for result toasts */
  jobVariant: { type: String, default: 'isolation' },
  actionType: {
    type: Object,
    required: false,
    default: () => ({
      // Default action types if not provided
      extract: ActionType.VOCAL_EXTRACT,
      login: ActionType.VOCAL_EXTRACT_LOGIN,
      subscript: ActionType.VOCAL_EXTRACT_SUBSCRIPT,
      download: ActionType.VOCAL_DOWNLOAD,
      downloadLogin: ActionType.VOCAL_DOWNLOAD_LOGIN,
      downloadSubscript: ActionType.VOCAL_DOWNLOAD_SUBSCRIPT,
      upload: ActionType.VOCAL_EXTRACT_UPLOAD
    })
  }
})

const route = useRoute()
const { getOrCreateUid, getUserInfo } = useAuth()
const { generateCoverSignature } = useSignature()

const host = config.host
const domain = config.domain
const userStore = useUserStore()

const isLoggedIn = computed(() => !!userStore.user)
const userEmail = computed(() => userStore.user?.email || '')
const uid = ref(getOrCreateUid())

const pageUrl = computed(() => {
  if (process.client) {
    return window.location.href
  }
  return ''
})

const userSubscript = ref(0)
const audioUploaderRef = ref(null)
const uploadedFile = ref(null)
const upresurl = ref('')
const separationResults = ref(null)
const isProcessing = ref(false)
const toast = useToast()
const { reportError } = useErrorReporter()
const { trackAction, actionCounts } = useActionReporter()
const isUploading = ref(false)
const { t, locale } = useI18n()
const blobUrl = ref('')
const isDragOver = ref(false)

const fetchUserSubscription = async () => {
  if (isLoggedIn.value) {
    try {
      const userinfo = await getUserInfo(userEmail.value)
      if (userinfo?.userinfo) {
        userSubscript.value = userinfo.userinfo.user_subscript
      }
    } catch (err) {
      reportError(err, `Fetch user subscription failed - pageUrl: ${pageUrl}`, uid.value, userEmail.value)
    }
  } else {
    userSubscript.value = 0
  }
}

// Watch for login state changes
watch(() => isLoggedIn.value, (newValue) => {
  fetchUserSubscription()
})

// Watch for language changes
watch(() => locale.value, () => {
  // Ensure state consistency when language changes
  if (isLoggedIn.value) {
    fetchUserSubscription()
  }
})

// Initialize on component mount
onMounted(() => {
  // Initialize user state
  if (isLoggedIn.value) {
    fetchUserSubscription()
  }

  // Add global error handlers
  if (process.client) {
    window.addEventListener('unhandledrejection', handleUnhandledRejection)
    window.addEventListener('error', handleError)
  }
})

const handleFileChange = (file) => {
  // 文件选择时，先不设置 uploadedFile，等上传成功后再设置
  // 这样可以确保在上传过程中只显示上传进度，不显示视频和按钮
  upresurl.value = ''
  separationResults.value = null
}

const handleUploading = (val) => {
  isUploading.value = val
}

// Upload success
const handleUploadSuccess = ({ url, file }) => {
  // 上传成功后才设置 uploadedFile，此时才会显示视频和按钮
  if (file) {
    uploadedFile.value = file
  }
  upresurl.value = url
  separationResults.value = null
}
// Upload error
const handleUploadError = (error) => {
  toast.error(error, { position: 'top-right', duration: 3000 })
  uploadedFile.value = null
  upresurl.value = ''
  separationResults.value = null
  // 确保文件上传组件被重置
  handleUploadReset()
}

// Reset upload
const handleUploadReset = () => {
  uploadedFile.value = null
  upresurl.value = ''
  separationResults.value = null
}

const showPayModal = ref(false)
const showCommonModal = ref(false)
const showModal = ref(false)
const quotaTypeForModal = ref('') // 用于存储当前配额类型，传递给 PayModal

// 使用 computed 确保响应式更新
const quotaExhaustedComputed = computed(() => {
  return userSubscript.value === 1 && quotaTypeForModal.value !== ''
})

const quotaTypeComputed = computed(() => {
  return quotaTypeForModal.value
})

// 使用 watch 监听 quotaTypeForModal，当它被设置且用户是订阅用户时，自动显示弹窗
// 这比双重 nextTick 更优雅和可靠
watch(quotaTypeForModal, (newVal) => {
  if (newVal !== '' && userSubscript.value === 1 && !showPayModal.value) {
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

// Process audio separation
const processAudio = async () => {
  if (!uploadedFile.value) {
    toast.error(t(`separation_common.pages.${props.telemetryModelSlug}.messages.upload_first`), { position: 'top-right', duration: 3000 })
    return
  }
  isProcessing.value = true
  try {
    // Check user action counts
    const { dayCount, monthCount } = await actionCounts({
      email: userEmail.value,
      uid: uid.value,
      action: props.actionType.extract,
      domain: domain
    })

    // Determine whether to continue based on user status and action counts
    if (!isLoggedIn.value) {
      // 5 attempts per day, 10 per month
      if (dayCount >= 5 || monthCount >= 10) {
        showLoginModal()
        trackAction({
          email: userEmail.value,
          action: props.actionType.login,
          domain: domain,
          uid: uid.value
        })
        return
      }
    } else {
      // Check subscription status first
      if (userSubscript.value === 1) {
        // 订阅用户：检查剩余次数
        const { checkQuota } = useQuotaCheck()
        
        // 根据 actionType.extract 确定 QuotaType
        let quotaType: QuotaType
        if (props.actionType.extract === ActionType.VOCAL_EXTRACT) {
          quotaType = QuotaType.VOCALISOLATE
        } else if (props.actionType.extract === ActionType.VOCAL_REMOVE) {
          quotaType = QuotaType.VOCALREMOVER
        } else if (props.actionType.extract === ActionType.AUDIO_EXTRACT) {
          quotaType = QuotaType.AUDIOEXTRACTOR
        } else {
          // 默认使用 VOCALISOLATE
          quotaType = QuotaType.VOCALISOLATE
        }
        
        const quotaResult = await checkQuota(quotaType, () => {
          // 根据 quotaType 设置对应的字符串值
          if (quotaType === QuotaType.VOCALISOLATE) {
            quotaTypeForModal.value = 'vocalisolate'
          } else if (quotaType === QuotaType.VOCALREMOVER) {
            quotaTypeForModal.value = 'vocalremover'
          } else if (quotaType === QuotaType.AUDIOEXTRACTOR) {
            quotaTypeForModal.value = 'audioextractor'
          }
          // 设置 quotaTypeForModal，watch 会自动触发显示弹窗
        })
        if (!quotaResult.canUse) {
          isProcessing.value = false
          showPayModal.value = true
          return
        }
      } else {
        // 未订阅用户：使用原有的次数限制逻辑
        // 6 attempts per day, 15 per month
        if (dayCount >= 6 || monthCount >= 15) {
          showPayModal.value = true
          trackAction({
            email: userEmail.value,
            action: props.actionType.subscript,
            domain: domain,
            uid: uid.value
          })
          isProcessing.value = false
          return
        }
      }
    }

    const formData = new FormData()
    formData.append('upurl', upresurl.value)
    formData.append('uid', uid.value)
    formData.append('email', userEmail.value)
    formData.append('subscript', userSubscript.value)
    formData.append('domain', domain)
    const tstamp = Math.floor(Date.now() / 1000)
    const snature = generateCoverSignature(upresurl.value, tstamp)
    formData.append('tstamp', tstamp)
    formData.append('snature', snature)
    const response = await fetch(`${host}${props.apiEndpoint}`, {
      method: 'POST',
      body: formData,
      headers: {
        'Cache-Control': 'no-cache',
        'Pragma': 'no-cache'
      },
    })
    if (!response.ok) {
      throw new Error(`Upload spleeter HTTP error! status: ${response.status}`)
    }
    const result = await response.json()
    if (result.ret === 0) {
      separationResults.value = { uri: result.uri, reqid: result.reqid }
      
      // 更新用户使用次数（仅在登录状态下）
      if (isLoggedIn.value && userEmail.value) {
        try {
          const { updateUsageCount } = useAuth()
          // 直接使用 actionType.extract 作为 action_type
          updateUsageCount(userEmail.value, props.actionType.extract)
        } catch (err) {
          reportError(err, `Error updating usage count - pageUrl: ${pageUrl.value}`, uid.value, userEmail.value)
        }
      }
      
      // 记录行为
      await trackAction({
        email: userEmail.value,
        action: props.actionType.extract,
        domain: domain,
        uid: uid.value
      })
      toast.success(t(`separation_common.messages.success_${props.jobVariant}`), { position: 'top-right', duration: 2000 })
    } else if (result.ret === 2) {
      showPayModal.value = true
      //toast.error(t('separation_common.messages.quota_exhausted'), { position: 'top-right', duration: 3000 })
      trackAction({
        email: userEmail.value,
        action: props.actionType.subscript,
        domain: domain,
        modelcat: props.telemetryModelSlug,
        modelname: props.telemetryModelSlug,
        uid: uid.value
      })
    } else {
      const failedLabel = t(`separation_common.messages.failed_${props.jobVariant}`)
      toast.error(result.msg || failedLabel, { position: 'top-right', duration: 3000 })
      reportError(new Error(result.msg || failedLabel), `Vocal extraction failed - pageUrl: ${window.location.href}`, uid.value, userEmail.value)
    }
  } catch (error) {
    toast.error(t('separation_common.messages.server_busy'), { position: 'top-right', duration: 3000 })
    reportError(error, `Vocal extraction failed - pageUrl: ${window.location.href}`, uid.value, userEmail.value)
  } finally {
    isProcessing.value = false
  }
}

// Download audio
const downloadAudio = async () => {
  if (!separationResults.value) return
  if (!isLoggedIn.value) {
    showLoginModal()
    trackAction({
      email: userEmail.value,
      action: props.actionType.downloadLogin,
      domain: domain,
      modelcat: 'sounds-effect',
      modelname: 'sounds-effect',
      uid: uid.value
    })
    return
  }
  try {
    // Check download action counts
    const { dayCount, monthCount } = await actionCounts({
      email: userEmail.value,
      uid: uid.value,
      action: props.actionType.download,
      domain: domain
    })
    // Check subscription status first
    if (userSubscript.value !== 1) {
      // 1 attempt per day, 3 per month
      if (dayCount >= 1 || monthCount >= 3) {
        showPayModal.value = true
        trackAction({
          email: userEmail.value,
          action: props.actionType.downloadSubscript,
          domain: domain,
          uid: uid.value
        })
        return
      }
    }

    const response = await fetch(`${host}${separationResults.value.uri}`)
    if (!response.ok) {
      const msg = 'Audio download failed, Please try again later!'
      reportError(new Error(`${msg} status: ${response.status}`), 'downloadVocal', uid.value, userEmail.value);
      toast.error(msg, {
        position: 'top-right',
        duration: 3000
      })
      return;
    }
    // Record download action
    await trackAction({
      email: userEmail.value,
      action: props.actionType.download,
      domain: domain,
      modelcat: 'vocal-extract',
      modelname: 'vocal-extract',
      uid: uid.value
    })
    const blob = await response.blob()
    const downloadUrl = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = downloadUrl

    // Get filename from current route
    let fileName = 'vocal-isolator'
    if (route && route.name) {
      // Use route name as filename
      fileName = route.name.toString().replace(/[^a-zA-Z0-9-_]/g, '')
    } else if (route && route.path) {
      // Use last part of route path as filename
      const pathParts = route.path.split('/')
      const lastPart = pathParts[pathParts.length - 1] || pathParts[pathParts.length - 2] || ''
      if (lastPart) {
        fileName = lastPart.replace(/[^a-zA-Z0-9-_]/g, '')
      }
    }

    a.download = `${fileName}-${Date.now()}.mp3`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    window.URL.revokeObjectURL(downloadUrl)

    toast.success('Download successful', {
      position: 'top-right',
      duration: 2000
    })
  } catch (error) {
    toast.error(t('separation_common.messages.download_failed'), { position: 'top-right', duration: 3000 })
    reportError(error, `Vocal Download failed - pageUrl: ${pageUrl.value}`, uid.value, userEmail.value)
  }
}

// Handle uncaught Promise exceptions
const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
  const errorDetails = {
    message: event.reason?.message || String(event.reason),
    stack: event.reason?.stack,
    type: event.type,
    timestamp: new Date().toISOString(),
  }

  reportError(
    event.reason,
    `Unhandled Promise rejection in UploadPanel - Details: ${JSON.stringify(errorDetails)}`,
    uid.value,
    userEmail.value
  )
}

// Handle runtime errors
const handleError = (event: ErrorEvent) => {
  const errorDetails = {
    message: event.message,
    filename: event.filename,
    lineno: event.lineno,
    colno: event.colno,
    stack: event.error?.stack,
    type: event.type,
    timestamp: new Date().toISOString(),
  }

  reportError(
    event.error || new Error(event.message),
    `Runtime error in UploadPanel - Details: ${JSON.stringify(errorDetails)}`,
    uid.value,
    userEmail.value
  )
}

watch(() => separationResults.value, async (val, oldVal) => {
  if (!val || !val.uri) {
    if (blobUrl.value) {
      URL.revokeObjectURL(blobUrl.value)
      blobUrl.value = ''
    }
    return
  }
  try {
    const res = await fetch(host + val.uri)
    const blob = await res.blob()
    if (blobUrl.value) URL.revokeObjectURL(blobUrl.value)
    blobUrl.value = URL.createObjectURL(blob)
  } catch (e) {
    blobUrl.value = ''
  }
})

onUnmounted(() => {
  if (blobUrl.value) URL.revokeObjectURL(blobUrl.value)
})

const handleDragOver = (e) => {
  isDragOver.value = true
}
const handleDragEnter = (e) => {
  isDragOver.value = true
}
const handleDragLeave = (e) => {
  isDragOver.value = false
}
const handleDrop = (e) => {
  isDragOver.value = false
  const files = e.dataTransfer?.files
  if (files && files.length > 0 && audioUploaderRef.value) {
    // 直接调用AudioUploader内部的file input上传逻辑
    const fileInput = audioUploaderRef.value.$el.querySelector('input[type=file]')
    if (fileInput) {
      const dt = new DataTransfer()
      dt.items.add(files[0])
      fileInput.files = dt.files
      fileInput.dispatchEvent(new Event('change', { bubbles: true }))
    }
  }
}
</script>

<style scoped>
.upload-panel-outer.drag-over {
  border: 2px dashed #d76ff4 !important;
  background: rgba(215, 111, 244, 0.08) !important;
}
</style>