<template>
  <div class="drop-area">
    <div @click="triggerFileInput"
      class="w-20 h-20 mx-auto mt-4 mb-4 cursor-pointer group flex items-center justify-center">
      <slot name="icon">
        <div
          class="w-full h-full rounded-full flex items-center justify-center transition-all duration-200 bg-gradient-to-r from-orange-400/90 to-pink-400/90 group-hover:opacity-90">
          <ArrowUpTrayIcon class="w-8 h-8 text-white" />
        </div>
      </slot>
    </div>
    <input type="file" :accept="accept" class="hidden" ref="fileInput" @change="handleFileUpload" />
    <slot />
    <div v-if="isUploading" class="w-full max-w-2xl mx-auto mt-4">
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
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { ArrowUpTrayIcon } from '@heroicons/vue/24/solid'
import { config } from '~/config/config'
import { useActionReporter, ActionType } from '~/composables/actionReporter'
import { useUserStore } from '@/store/user'
import { useAuth } from '~/composables/useAuth'
import { useChunkedUpload } from '~/composables/useChunkedUpload'

const props = defineProps({
  maxSize: { type: Number, default: 20 * 1024 * 1024 }, // 默认 1GB，支持大文件
  accept: { type: String, default: 'audio/*' },
  action: { type: String, required: true },
  mediaType: { type: String, default: 'audio' }, // 'audio' or 'video'
  messageNamespace: { type: String, default: 'vocal-isolator' }
})

const emit = defineEmits(['uploading', 'progress', 'success', 'error', 'reset', 'file-change'])

const fileInput = ref<HTMLInputElement | null>(null)
const file = ref<File | null>(null)

const { getOrCreateUid } = useAuth()
const userStore = useUserStore()
const userEmail = computed(() => userStore.user?.email || '')
const uid = ref(getOrCreateUid())
const { trackAction } = useActionReporter()

// 使用分片上传 composable
const {
  upload: uploadFile,
  reset: resetUploader,
  isUploading,
  uploadProgress,
  uploadStatus
} = useChunkedUpload({
  maxSize: props.maxSize,
  mediaType: props.mediaType as 'audio' | 'video',
  messageNamespace: props.messageNamespace,
  onProgress: (progress) => {
    emit('progress', progress)
  },
  onSuccess: (response) => {
    trackAction({
      email: userEmail.value,
      action: ActionType.UPLOAD_AUDIO,
      domain: config.domain,
      uid: uid.value
    })
    emit('success', response)
    emit('uploading', false)
  },
  onError: (error) => {
    emit('error', error)
    emit('uploading', false)
  },
  onStatusChange: (status) => {
    emit('uploading', isUploading.value)
  }
})

// 显示进度：限制最大值为98%，避免显示100%后长时间等待
const displayProgress = computed(() => {
  return Math.min(uploadProgress.value, 98)
})

const triggerFileInput = () => {
  fileInput.value && fileInput.value.click()
}

const handleFileUpload = async (event: Event) => {
  const input = event.target as HTMLInputElement
  const f = input.files?.[0]
  if (f) {
    file.value = f
    emit('file-change', f)
    await uploadFile(f)
  }
}

const resetUpload = () => {
  resetUploader()
  file.value = null
  if (fileInput.value) {
    fileInput.value.value = ''
  }
  emit('reset')
}

defineExpose({ resetUpload, isUploading, uploadProgress, file })
</script>

<style scoped>
.drop-area {
  @apply w-full h-full flex flex-col items-center justify-center transition-all duration-200;
}

video {
  max-height: 400px;
  object-fit: contain;
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
