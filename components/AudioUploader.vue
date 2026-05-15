<template>
  <div class="h-full w-full" :class="{ 'flex-grow': !(!uploadedFile || isUploading) }">
    <!-- 上传中或未上传状态：显示上传组件和进度 -->
    <div v-if="!uploadedFile?.name || isUploading" class="h-full flex flex-col items-center justify-center text-center">
      <BaseFileUploader ref="baseFileUploaderRef" :max-size="20 * 1024 * 1024" :accept="acceptTypes" :action="uploadAction"
        :media-type="props.type" :message-namespace="messageNamespace" @success="onUploadSuccess" @error="onUploadError" @reset="onReset"
        @file-change="onFileChange" @uploading="onUploading" role="region" aria-label="Audio upload area">
        <h3 class="text-base font-medium mb-2">{{ type === 'video' ? t('comm.videoUpload.title') :
          t('comm.audioUpload.title') }}</h3>
        <p class="text-sm text-gray-600">{{ type === 'video' ? t('comm.videoUpload.drag_drop') :
          t('comm.audioUpload.drag_drop') }}</p>
        <p class="text-xs text-gray-500 mt-2">{{ acceptFormatsText }}</p>
      </BaseFileUploader>
    </div>

    <!-- 上传完成状态：显示视频/音频播放器 -->
    <div v-else-if="uploadedFile?.name && !isUploading" class="h-full flex flex-col border border-gray-100 rounded-lg p-8 mb-8">
      <h2 class="text-xl font-medium mb-4 bg-gradient-to-r from-[#EC4141] to-[#D76FF4] bg-clip-text text-transparent">
        {{ displayType === 'video' ? t('comm.videoUpload.uploaded') : t('comm.audioUpload.uploaded') }}
      </h2>

      <!-- Video Preview -->
      <div v-if="displayType === 'video' && uploadedFile" class="w-full mb-4">
        <video ref="videoPlayer" class="w-full rounded-lg" controls :src="uploadedFileUrl">
          {{ displayType === 'video' ? t('comm.videoUpload.unsupported') : t('comm.audioUpload.unsupported') }}
        </video>
      </div>

      <!-- Audio Player -->
      <VueAudioPlayer v-else :audio-list="uploadedAudioList" />

      <!-- Reset Button -->
      <div class="flex items-center justify-end mt-4">
        <button @click="onReset"
          class="flex items-center text-red-500 hover:text-red-600 transition-colors text-sm">
          <ArrowPathIcon class="w-4 h-4 mr-1" aria-hidden="true" />
          {{ t('comm.upload.reset') }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onBeforeUnmount } from 'vue'
import { ArrowPathIcon } from '@heroicons/vue/24/solid'
import VueAudioPlayer from '~/components/VueAudioPlayer.vue'
import BaseFileUploader from '~/components/BaseFileUploader.vue'
import { config } from '~/config/config'
import { useActionReporter, ActionType } from '~/composables/actionReporter'
import { useErrorReporter } from '~/composables/errorReporter'
import { useI18n } from 'vue-i18n'
import { useUserStore } from '~/store/user'
import { useAuth } from '~/composables/useAuth'

const { getOrCreateUid } = useAuth()
const userStore = useUserStore()

const { t } = useI18n()
const isLoggedIn = computed(() => !!userStore.user)
const userEmail = computed(() => userStore.user?.email || '')
const uid = ref(getOrCreateUid())

interface Props {
  uploadedFile: File | null;
  modelCategory: string;
  modelName?: string | null;
  type: 'audio' | 'video';
  actionType: Record<string, any>;
  /** i18n root for chunked upload status messages */
  messageNamespace?: string;
}

const props = withDefaults(defineProps<Props>(), {
  modelName: '',
  messageNamespace: 'vocal-isolator'
})

const safeModelName = computed(() => props.modelName ?? '')

const emit = defineEmits<{
  (e: 'upload-success', response: any): void;
  (e: 'upload-error', msg: string): void;
  (e: 'reset'): void;
  (e: 'file-change', file: File): void;
  (e: 'uploading', val: boolean): void;
}>()

const uploadedAudioList = ref<string[]>([])
const uploadedFileUrl = ref<string>('')
// 上传时绕开 cloudflare, 防止文件太大超时 
const uploadAction = `${config.apiHost}/upapi/upload`
const isUploading = ref(false)
const videoPlayer = ref<HTMLVideoElement | null>(null)
const currentFile = ref<File | null>(null)
const baseFileUploaderRef = ref<InstanceType<typeof BaseFileUploader> | null>(null)
const { trackAction } = useActionReporter()
const { reportError } = useErrorReporter()

// 根据类型计算接受的文件类型
const acceptTypes = computed(() => {
  return props.type === 'video'
    ? 'video/*'
    : 'audio/*,video/*'
})

// 根据当前文件推断是视频还是音频（用于展示）
function getMediaTypeFromFile(file: File | null): 'audio' | 'video' {
  if (!file?.type) return props.type
  return file.type.startsWith('video/') ? 'video' : 'audio'
}

// 展示用类型：有文件时依实际上传文件类型，否则用 props.type
const displayType = computed(() => {
  const file = currentFile.value || props.uploadedFile
  return file ? getMediaTypeFromFile(file) : props.type
})

// 根据类型计算显示的文件格式文本
const acceptFormatsText = computed(() => {
  return props.type === 'video'
    ? t('comm.videoUpload.formats')
    : t('comm.audioUpload.formats')
})

// Event handlers
const onUploadSuccess = (response: any) => {
  if (response && response.ret === 0) {
    // 上传成功后才设置文件预览
    // 使用 currentFile 而不是 props.uploadedFile，因为 uploadedFile 可能还没有设置
    const fileToPreview = currentFile.value || props.uploadedFile
    const isVideo = fileToPreview ? getMediaTypeFromFile(fileToPreview) === 'video' : false
    if (isVideo && fileToPreview) {
      uploadedFileUrl.value = URL.createObjectURL(fileToPreview)
    } else if (fileToPreview) {
      uploadedAudioList.value = [URL.createObjectURL(fileToPreview)]
    }
    // 确保上传状态已关闭
    isUploading.value = false
    trackAction({
      email: userEmail.value,
      action: props.actionType.upload,
      domain: config.domain,
      modelcat: props.modelCategory,
      modelname: safeModelName.value,
      uid: uid.value
    })
    emit('uploading', false)
    // 通知父组件上传成功，并传递文件对象
    emit('upload-success', { url: response.uri, file: fileToPreview })
  } else {
    // 上传失败，重置状态
    isUploading.value = false
    currentFile.value = null
    const errorObj = new Error(response.msg || 'upload failed')
    reportError(errorObj, {
      context: "upload failed",
      modelcat: props.modelCategory,
      modelname: safeModelName.value,
      ret: response.ret,
      msg: response.msg
    }, uid.value, userEmail.value)
    emit('uploading', false)
    emit('upload-error', response.msg || t('comm.messages.upload_failed'))
  }
}

const onUploadError = (msg: string) => {
  // 上传失败，重置所有状态
  uploadedAudioList.value = []
  uploadedFileUrl.value = ''
  currentFile.value = null
  isUploading.value = false
  if (videoPlayer.value && videoPlayer.value.src) {
    URL.revokeObjectURL(videoPlayer.value.src)
  }
  const errorMsg = msg || t('comm.messages.upload_failed')
  const errorObj = new Error(errorMsg)
  reportError(errorObj, {
    context: "upload error",
    modelcat: props.modelCategory,
    modelname: safeModelName.value,
    msg: errorMsg
  }, uid.value, userEmail.value)
  emit('uploading', false)
  emit('upload-error', errorMsg)
}

const onReset = () => {
  uploadedAudioList.value = []
  currentFile.value = null
  if (uploadedFileUrl.value) {
    URL.revokeObjectURL(uploadedFileUrl.value)
    uploadedFileUrl.value = ''
  }
  emit('reset')
}

const onFileChange = (file: File) => {
  // 保存当前文件对象，但不立即设置 uploadedFile prop
  // 等上传成功后再设置，这样可以确保在上传过程中只显示上传进度
  currentFile.value = file
  emit('file-change', file)
}

const onUploading = (val: boolean) => {
  isUploading.value = val
  emit('uploading', val)
}

// 组件卸载时清理资源
onBeforeUnmount(() => {
  if (uploadedFileUrl.value) {
    URL.revokeObjectURL(uploadedFileUrl.value)
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

video {
  max-height: 400px;
  object-fit: contain;
}
</style>