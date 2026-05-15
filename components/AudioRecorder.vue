<template>
  <div class="h-full w-full" :class="{ 'flex-grow': !(recordedFile || isRecording || isUploading) }">
    <!-- 未录音或录音中或上传中状态：显示录音组件 -->
    <div v-if="!recordedFile || isRecording || isUploading" class="h-full flex flex-col items-center justify-center text-center">
      <!-- 录音按钮和状态 -->
      <div class="flex flex-col items-center gap-4">
        <!-- 录音按钮 -->
        <button
          @click="toggleRecording"
          :disabled="isUploading"
          class="w-20 h-20 rounded-full flex items-center justify-center transition-all duration-200 cursor-pointer group relative"
          :class="[
            isRecording
              ? 'bg-gradient-to-r from-red-300 to-red-400'
              : isUploading
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-gradient-to-r from-orange-400/90 to-pink-400/90 hover:opacity-90'
          ]"
          :style="isRecording ? 'opacity: 1; visibility: visible; box-shadow: 0 0 20px rgba(252, 165, 165, 0.4);' : 'opacity: 1; visibility: visible;'"
          :aria-label="isRecording ? t('ai_cover.converter.record.stop') : t('ai_cover.converter.record.start')"
          style="opacity: 1; visibility: visible;"
        >
          <MicrophoneIcon v-if="!isRecording" class="w-8 h-8 text-white z-10 relative" style="opacity: 1;" />
          <!-- 停止图标：使用 StopIcon，确保在红色背景上可见 -->
          <StopIcon v-else class="w-8 h-8 text-white z-10 relative" style="opacity: 1;" fill="white" />
        </button>

        <!-- 状态文本 -->
        <div class="text-sm font-medium text-gray-700">
          <span v-if="isRecording">{{ t('ai_cover.converter.record.recording') }}</span>
          <span v-else-if="isUploading">{{ t('comm.upload.uploading') }}</span>
          <span v-else>{{ t('ai_cover.converter.record.start') }}</span>
        </div>

        <!-- 录音时长显示 -->
        <div v-if="isRecording" class="text-lg font-semibold text-gray-900">
          {{ formatDuration(recordingDuration) }}
        </div>
      </div>

      <!-- 上传进度 - 移出内部容器以匹配 BaseFileUploader 的宽度 -->
      <div v-if="isUploadingComputed" class="w-full max-w-2xl mx-auto mt-4">
        <div class="relative h-3 bg-gray-100 rounded-full overflow-hidden shadow-inner">
          <div 
            class="h-full bg-gradient-to-r from-orange-400 via-pink-400 to-purple-500 transition-all duration-300 ease-out rounded-full relative overflow-hidden"
            :style="{ width: `${displayProgress}%` }">
            <div class="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer"></div>
          </div>
        </div>
        <div class="flex items-center justify-between mt-2">
          <div class="text-sm font-medium text-gray-700">{{ displayProgress }}%</div>
          <div v-if="uploadStatus" class="text-xs text-gray-500">{{ uploadStatus }}</div>
        </div>
      </div>
    </div>

    <!-- 录音完成并上传成功状态：显示音频播放器 -->
    <div v-else-if="recordedFile && !isRecording && !isUploading" class="h-full flex flex-col border border-gray-100 rounded-lg p-8 mb-8">
      <h2 class="text-xl font-medium mb-4 bg-gradient-to-r from-[#EC4141] to-[#D76FF4] bg-clip-text text-transparent">
        {{ t('comm.record.uploaded') }}
      </h2>

      <!-- Audio Player -->
      <VueAudioPlayer :audio-list="recordedAudioList" />

      <!-- Reset Button -->
      <div class="flex items-center justify-end mt-4">
        <button @click="onReset"
          class="flex items-center text-red-500 hover:text-red-600 transition-colors text-sm">
          <ArrowPathIcon class="w-4 h-4 mr-1" aria-hidden="true" />
          {{ t('ai_cover.converter.record.rerecord') }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onBeforeUnmount } from 'vue'
import { MicrophoneIcon, ArrowPathIcon } from '@heroicons/vue/24/solid'
import { StopIcon } from '@heroicons/vue/24/solid'
import VueAudioPlayer from '~/components/VueAudioPlayer.vue'
import { config } from '~/config/config'
import { useActionReporter, ActionType } from '~/composables/actionReporter'
import { useErrorReporter } from '~/composables/errorReporter'
import { useI18n } from 'vue-i18n'
import { useUserStore } from '~/store/user'
import { useAuth } from '~/composables/useAuth'
import { useChunkedUpload } from '~/composables/useChunkedUpload'

const { getOrCreateUid } = useAuth()
const userStore = useUserStore()

const { t } = useI18n()
const isLoggedIn = computed(() => !!userStore.user)
const userEmail = computed(() => userStore.user?.email || '')
const uid = ref(getOrCreateUid())

interface Props {
  recordedFile: File | null;
  modelCategory: string;
  modelName: string;
  actionType: Record<string, any>;
}

const props = defineProps<Props>()

const emit = defineEmits<{
  (e: 'record-success', response: any): void;
  (e: 'record-error', msg: string): void;
  (e: 'reset'): void;
  (e: 'recording', val: boolean): void;
}>()

const recordedAudioList = ref<string[]>([])
const recordedFileUrl = ref<string>('')
// 上传时绕开 cloudflare, 防止文件太大超时 
const uploadAction = `${config.apiHost}/upapi/upload`
const isRecording = ref(false)
const isUploading = ref(false)
const mediaRecorder = ref<MediaRecorder | null>(null)
const mediaStream = ref<MediaStream | null>(null)
const audioChunks = ref<Blob[]>([])
const recordingDuration = ref(0)
const recordingTimer = ref<number | null>(null)
const currentFile = ref<File | null>(null)
const { trackAction } = useActionReporter()
const { reportError } = useErrorReporter()

// 使用分片上传 composable
const {
  upload: uploadFile,
  reset: resetUploader,
  isUploading: isChunkedUploading,
  uploadProgress,
  uploadStatus
} = useChunkedUpload({
  maxSize: 20 * 1024 * 1024, // 20MB
  mediaType: 'audio',
  onProgress: () => {
    // Progress handled by composable
  },
  onSuccess: (response) => {
    handleUploadSuccess(response)
  },
  onError: (error) => {
    handleUploadError(error)
  },
  onStatusChange: (status) => {
    isUploading.value = isChunkedUploading.value
    emit('recording', isChunkedUploading.value)
  }
})

// 统一使用 isChunkedUploading 来确保状态同步
const isUploadingComputed = computed(() => isChunkedUploading.value || isUploading.value)

// 显示进度：限制最大值为98%，避免显示100%后长时间等待
const displayProgress = computed(() => {
  const progress = uploadProgress.value || 0
  return Math.min(Math.max(progress, 0), 98)
})

// 格式化录音时长
const formatDuration = (seconds: number): string => {
  const mins = Math.floor(seconds / 60)
  const secs = Math.floor(seconds % 60)
  return `${mins}:${secs.toString().padStart(2, '0')}`
}

// 开始/停止录音
const toggleRecording = async () => {
  if (isRecording.value) {
    // 停止录音
    stopRecording()
  } else {
    // 开始录音
    await startRecording()
  }
}

// 开始录音
const startRecording = async () => {
  try {
    // 请求麦克风权限
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
    mediaStream.value = stream
    audioChunks.value = []
    recordingDuration.value = 0

    // 创建 MediaRecorder
    const mimeType = MediaRecorder.isTypeSupported('audio/webm') 
      ? 'audio/webm' 
      : MediaRecorder.isTypeSupported('audio/mp4')
        ? 'audio/mp4'
        : 'audio/wav'
    
    mediaRecorder.value = new MediaRecorder(stream, {
      mimeType: mimeType
    })

    mediaRecorder.value.ondataavailable = (event) => {
      if (event.data && event.data.size > 0) {
        audioChunks.value.push(event.data)
      }
    }

    mediaRecorder.value.onstop = async () => {
      // 停止所有音频轨道
      if (mediaStream.value) {
        mediaStream.value.getTracks().forEach(track => track.stop())
        mediaStream.value = null
      }

      // 创建音频 Blob
      const audioBlob = new Blob(audioChunks.value, { 
        type: mediaRecorder.value?.mimeType || 'audio/webm' 
      })

      // 创建 File 对象
      const fileExtension = mimeType.includes('webm') ? 'webm' : mimeType.includes('mp4') ? 'm4a' : 'wav'
      const fileName = `recorded-audio-${Date.now()}.${fileExtension}`
      const recordedFile = new File([audioBlob], fileName, { 
        type: mediaRecorder.value?.mimeType || 'audio/webm' 
      })

      currentFile.value = recordedFile
      
      // 自动上传录音文件
      isUploading.value = true
      emit('recording', true)
      await uploadFile(recordedFile)
    }

    // 开始录音
    mediaRecorder.value.start()
    isRecording.value = true

    // 启动计时器
    recordingTimer.value = window.setInterval(() => {
      recordingDuration.value += 1
    }, 1000)

    // 上报录音开始
    trackAction({
      email: userEmail.value,
      action: props.actionType.record,
      domain: config.domain,
      modelcat: props.modelCategory,
      modelname: props.modelName,
      uid: uid.value
    })
  } catch (err) {
    isRecording.value = false
    const errorMsg = t('ai_cover.converter.errors.microphoneAccess') || 'Failed to access microphone'
    reportError(err as Error, {
      context: "recording start failed",
      modelcat: props.modelCategory,
      modelname: props.modelName,
      error: (err as Error).message
    }, uid.value, userEmail.value)
    emit('record-error', errorMsg)
  }
}

// 停止录音
const stopRecording = () => {
  if (mediaRecorder.value && isRecording.value) {
    mediaRecorder.value.stop()
    isRecording.value = false

    // 清除计时器
    if (recordingTimer.value) {
      clearInterval(recordingTimer.value)
      recordingTimer.value = null
    }
  }
}

// 上传成功处理
const handleUploadSuccess = (response: any) => {
  if (response && response.ret === 0) {
    // 上传成功后才设置文件预览
    const fileToPreview = currentFile.value || props.recordedFile
    if (fileToPreview) {
      recordedFileUrl.value = URL.createObjectURL(fileToPreview)
      recordedAudioList.value = [recordedFileUrl.value]
    }
    
    // 确保上传状态已关闭
    isUploading.value = false
    emit('recording', false)
    
    // 通知父组件录音并上传成功，并传递文件对象
    emit('record-success', { url: response.uri, file: fileToPreview })
  } else {
    // 上传失败，重置状态
    isUploading.value = false
    currentFile.value = null
    const errorObj = new Error(response.msg || 'upload failed')
    reportError(errorObj, {
      context: "upload failed",
      modelcat: props.modelCategory,
      modelname: props.modelName,
      ret: response.ret,
      msg: response.msg
    }, uid.value, userEmail.value)
    emit('recording', false)
    emit('record-error', response.msg || t('comm.messages.upload_failed'))
  }
}

// 上传错误处理
const handleUploadError = (error: string) => {
  // 上传失败，重置所有状态
  recordedAudioList.value = []
  recordedFileUrl.value = ''
  currentFile.value = null
  isUploading.value = false
  const errorMsg = error || t('comm.messages.upload_failed')
  const errorObj = new Error(errorMsg)
  reportError(errorObj, {
    context: "upload error",
    modelcat: props.modelCategory,
    modelname: props.modelName,
    msg: errorMsg
  }, uid.value, userEmail.value)
  emit('recording', false)
  emit('record-error', errorMsg)
}

// 重置
const onReset = () => {
  // 停止录音（如果正在录音）
  if (isRecording.value) {
    stopRecording()
  }

  // 停止媒体流
  if (mediaStream.value) {
    mediaStream.value.getTracks().forEach(track => track.stop())
    mediaStream.value = null
  }

  // 清理资源
  recordedAudioList.value = []
  currentFile.value = null
  if (recordedFileUrl.value) {
    URL.revokeObjectURL(recordedFileUrl.value)
    recordedFileUrl.value = ''
  }

  // 重置上传器
  resetUploader()

  // 清除计时器
  if (recordingTimer.value) {
    clearInterval(recordingTimer.value)
    recordingTimer.value = null
  }

  recordingDuration.value = 0
  audioChunks.value = []

  emit('reset')
}

// 组件卸载时清理资源
onBeforeUnmount(() => {
  // 停止录音
  if (isRecording.value) {
    stopRecording()
  }

  // 停止媒体流
  if (mediaStream.value) {
    mediaStream.value.getTracks().forEach(track => track.stop())
    mediaStream.value = null
  }

  // 清理 URL 对象
  if (recordedFileUrl.value) {
    URL.revokeObjectURL(recordedFileUrl.value)
  }

  // 清除计时器
  if (recordingTimer.value) {
    clearInterval(recordingTimer.value)
    recordingTimer.value = null
  }
})

// 暴露需要的方法给父组件
defineExpose({
  onReset
})
</script>

<style scoped>
.drop-area {
  @apply w-full h-full flex flex-col items-center justify-center;
}

@keyframes shimmer {
  0% {
    transform: translateX(-100%);
  }
  100% {
    transform: translateX(100%);
  }
}

.animate-shimmer {
  animation: shimmer 2s infinite;
}
</style>
