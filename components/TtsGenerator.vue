<template>
  <div class="relative">
    <!-- 渐变背景 -->
    <div class="absolute -inset-1.5 rounded-[20px] bg-gradient-to-r from-[#F1AC63] to-[#D76FF4] opacity-[0.08] blur-2xl"></div>

    <!-- 主容器 -->
    <div class="bg-white rounded-lg border border-gray-100 shadow-[0_8px_24px_0_rgba(0,0,0,0.08)] p-4 sm:p-6 lg:p-8 relative overflow-hidden">
      
      <!-- 内容区域 -->
      <div class="flex flex-col lg:flex-row gap-4 lg:gap-6 content-wrapper relative" :class="{'has-action-buttons': isGenerated && generatedAudioUrl}">
        <!-- 声音选择区域 -->
        <div class="flex flex-col flex-1 min-h-0 voice-section">
          <!-- 语言选择 -->
          <div class="mb-3 lg:mb-4">
            <div class="relative language-select">
              <select
                v-model="selectedLanguage"
                @change="handleLanguageChange"
                aria-label="Language Selection"
                class="w-full h-10 pl-3 pr-8 rounded-lg border border-gray-200 bg-gray-50 appearance-none cursor-pointer"
              >
                <option v-for="lang in languages" :key="lang.code" :value="lang.code">
                  {{ lang.name }}
                </option>
              </select>
              <div class="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-4 h-4 text-gray-500" aria-hidden="true">
                  <path stroke-linecap="round" stroke-linejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
                </svg>
              </div>
            </div>
          </div>

          <!-- 声音分类和列表容器 -->
          <div class="voice-list-container flex-1 flex flex-col min-h-0">
            <!-- 分类标签容器 -->
            <div class="voice-categories-wrapper" v-if="Array.isArray(allVoiceModels)">
              <div class="voice-categories">
                <div class="flex flex-nowrap">
                  <button
                    v-for="(model, index) in allVoiceModels"
                    :key="model.catid"
                    @click="selectedCategory = model.catid"
                    aria-label="Voice Category"
                    class="category-tab"
                    :class="[
                      selectedCategory === model.catid ?
                        'bg-pink-100 text-pink-600 border-pink-200 relative z-10' :
                        'bg-gray-50 text-gray-600 hover:bg-gray-100',
                      index === 0 && 'rounded-tl-lg',
                      index === allVoiceModels.length - 1 && 'rounded-tr-lg'
                    ]"
                  >
                    <span>{{ model.catname }}</span>
                    <span class="text-xs opacity-60">({{ model.options?.length || 0 }})</span>
                  </button>
                </div>
              </div>
            </div>

            <!-- 声音列表 -->
            <div class="flex-1 overflow-y-auto bg-gray-100 rounded-b-lg voice-list border border-gray-200 -mt-[1px] scroll-smooth scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent hover:scrollbar-thumb-gray-400">
              <div class="min-h-[240px]">
                <div v-for="voice in currentCatVoices"
                     :key="voice.modelid"
                     class="transition-all duration-200 cursor-pointer"
                     :class="[
                       selectedVoice === voice.modelid ? 'bg-pink-50/90 hover:bg-pink-50/90 ring-2 ring-pink-200 shadow-sm relative z-10' : 'hover:bg-gray-100 bg-white',
                     ]"
                     @click="selectedVoice = voice.modelid"
                >
                  <div class="flex items-center justify-between px-4 py-3">
                    <div class="flex items-center gap-3">
                      <input
                        type="radio"
                        :name="voiceGroup"
                        aria-label="Voice Selection"
                        :id="voice.modelid"
                        :value="voice.modelid"
                        v-model="selectedVoice"
                        class="relative appearance-none w-5 h-5 rounded-full border-2 border-gray-300 transition-all duration-200 cursor-pointer checked:border-pink-500 checked:border-[6px] checked:bg-white hover:border-pink-500/50"
                      >
                      <div class="w-10 h-10 rounded-full overflow-hidden bg-gray-100 flex-shrink-0">
                        <img
                          :src="voice.modelicon"
                          :alt="voice.name"
                          class="w-full h-full object-cover"
                          loading="lazy"
                        >
                      </div>
                      <div>
                        <div class="font-medium text-gray-900">{{ voice.name }}</div>
                        <div class="text-sm text-gray-500">{{ voice.gender }} | @{{ voice.author }}</div>
                      </div>
                    </div>
                    <button
                      type="button"
                      @click.stop="(e) => playPreviewAudio(voice, e)"
                      aria-label="Play Preview"
                      class="flex items-center justify-center gap-1.5 px-2 sm:px-3 py-1.5 rounded-md text-white text-xs font-medium transition-all disabled:opacity-50 min-w-[32px] sm:min-w-[72px]"
                      :class="[
                        isVoicePlaying(voice) ? 'bg-gray-600 hover:bg-gray-500' : 'bg-gray-900 hover:bg-gray-800'
                      ]"
                      :disabled="isLoading === voice.exampleAudio"
                    >
                      <div class="flex items-center justify-center gap-1.5">
                        <template v-if="isLoading === voice.exampleAudio">
                          <LoadingSpinner class="h-4 w-4" />
                        </template>
                        <template v-else>
                          <div class="w-4 h-4 flex items-center justify-center">
                            <PlayIcon v-if="!isVoicePlaying(voice)" />
                            <PauseIcon v-else />
                          </div>
                          <span class="hidden sm:inline">{{ $t('tts_generator.voice.preview') }}</span>
                        </template>
                      </div>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 文本输入区域 -->
        <div class="flex flex-col w-full lg:w-[48%] input-container">
          <div class="relative border border-gray-200 rounded-lg focus-within:border-pink-200 focus-within:ring-2 focus-within:ring-pink-100 transition-all h-full flex flex-col input-section">
            <!-- 预设文案标签 -->
            <div class="flex flex-wrap gap-2 p-3 border-b border-gray-100 bg-gray-50/50 preset-tags">
              <button
                v-for="preset in presets_categories"
                :key="preset.id"
                @click="handlePresetClick(preset)"
                aria-label="Preset Text"
                class="px-3 py-1.5 text-sm font-medium transition-all rounded-full border whitespace-nowrap"
                :class="selectedPreset === preset.id ?
                  'bg-pink-50 text-pink-600 border-pink-200' :
                  'bg-white text-gray-600 border-gray-200 hover:border-gray-300 hover:bg-gray-50'"
              >
                {{ preset.label }}
              </button>
            </div>

            <!-- 文本输入框 -->
            <textarea
              v-model="inputText"
              :placeholder="$t('tts_generator.input.placeholder')"
              class="flex-1 w-full p-4 bg-white rounded-b-lg resize-none focus:outline-none focus:ring-0 border-0 min-h-[200px] text-input"
              :maxlength="maxCharacters"
            ></textarea>

            <!-- 字数统计 -->
            <div class="absolute bottom-3 right-3 text-sm text-gray-400">
              {{ inputText.length }}/{{ maxCharacters }}
            </div>
          </div>
        </div>

        <!-- 按钮区域 -->
        <div class="button-container">
          <!-- 生成按钮 -->
          <button
            @click="generateVoice"
            aria-label="Generate Voice"
            :disabled="isGenerating || !inputText || !selectedVoice"
            class="w-full h-12 rounded-lg bg-gradient-to-r from-[#F1AC63] to-[#D76FF4] text-white font-medium disabled:opacity-50 transition-all hover:opacity-90 flex items-center justify-center"
          >
            <LoadingSpinner v-if="isGenerating" class="h-5 w-5" />
            <span v-else>{{ $t(isGenerating ? 'tts_generator.buttons.generating' : 'tts_generator.buttons.generate') }}</span>
          </button>

          <!-- 生成成功后的按钮 -->
          <div v-if="isGenerated && generatedAudioUrl" class="mt-4">
            <div class="flex gap-2">
              <button
                @click="downloadAudio"
                aria-label="Download Voice"
                class="flex-1 h-12 rounded-lg border-2 border-gray-900 text-gray-900 font-medium hover:bg-gray-900 hover:text-white transition-all"
              >
                <span>{{ $t(isDownloading ? 'tts_generator.buttons.downloading' : 'tts_generator.buttons.download') }}</span>
              </button>
              <button
                @click="playGeneratedAudio"
                aria-label="Play Generated Voice"
                class="flex-1 h-12 rounded-lg bg-gray-900 text-white font-medium hover:opacity-90 transition-all"
              >
                {{ isGeneratedPlaying() ? $t('tts_generator.buttons.pause') : $t('tts_generator.buttons.play') }}
              </button>
            </div>
          </div>

          <!-- 错误提示放在这里 -->
          <div v-if="error" class="text-red-500 text-sm mt-3">{{ error }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onUnmounted, onMounted } from 'vue'
import { PlayIcon, PauseIcon, LoadingSpinner } from '~/components/icons'
import { useI18n } from 'vue-i18n'
import { useVoiceModels } from '~/composables/useVoiceModels'
import { getCharacterPresets } from '~/constants/voicePresets'
import { useAudioPlayer } from '~/composables/useAudioPlayer'
import { useErrorReporter } from '~/composables/errorReporter'

const { t, tm, locale } = useI18n()
const { voiceModels, setLang } = useVoiceModels()
const { reportError } = useErrorReporter()

// Props定义
const props = defineProps({
  initText: {
    type: String,
    default: ''
  },
  maxCharacters: {
    type: Number,
    default: 300
  },
  apiHost: {
    type: String,
    required: true
  },
  models: {
    type: Array,
    default: () => []
  },
  defaultCategory: {
    type: String,
    default: ''
  }
})

// Emits定义
const emit = defineEmits(['generation-complete', 'error'])
// 状态管理
const inputText = ref('')
const selectedVoice = ref(null)
const selectedCategory = ref('')
const selectedLanguage = ref('english')
const selectedPreset = ref('')
const isGenerated = ref(false)
const isGenerating = ref(false)
const isLoading = ref(null)
const isDownloading = ref(false)
const error = ref(null)
const generatedAudioUrl = ref(null)
const voiceGroup = 'voice-selection'

// language options
const languages = [
  { code: 'english', name: 'English(US)' }
]

// use real data in computed property
const allVoiceModels = computed(() => {
  return Array.isArray(props.models) ? props.models : []
})

// watch models and default category
watch([() => props.models, () => props.defaultCategory], 
  ([newModels, newDefaultCategory]) => {
    try {
      const models = Array.isArray(newModels) ? newModels : []
      if (models.length) {
        // set default category
        if (!selectedCategory.value) {
          selectedCategory.value = newDefaultCategory || models[0]?.catid
        }

        // set default voice
        if (!selectedVoice.value) {
          const currentCategory = models.find(m => m.catid === selectedCategory.value)
          const defaultVoice = currentCategory?.options?.[0]
          if (defaultVoice?.modelid) {
            selectedVoice.value = defaultVoice.modelid
          }
        }
      }
    } catch (err) {
      reportError(err, 'Error in models watch--watchModels')
    }
  }, 
  { immediate: true }
)

// when category changed, reset voice selection
watch(() => selectedCategory.value, (newCategory) => {
  if (newCategory) {
    const currentCategory = props.models.find(m => m.catid === newCategory)
    const firstVoice = currentCategory?.options?.[0]
    if (firstVoice) {
      selectedVoice.value = firstVoice.modelid
    }
  }
})

// 监听 locale 变化
watch(locale, (newLocale) => {
  selectedLanguage.value = newLocale
})

// current category voices
const currentCatVoices = computed(() => {
  if (!selectedCategory.value || !allVoiceModels.value) return []
  
  const currentModel = allVoiceModels.value.find(model => 
    model.catid === selectedCategory.value
  )
  return currentModel?.options || []
})

const categories = tm('tts_generator.input.presets.categories') || {}
const presets_categories = Object.entries(categories).map(([id, label]) => ({
  id,
  label
}))

const category_texts = tm('tts_generator.input.presets.texts') || {}

const handlePresetClick = (preset) => {
  selectedPreset.value = preset.id
  inputText.value = Array.isArray(category_texts[preset.id]) 
    ? category_texts[preset.id].join('\n') 
    : category_texts[preset.id] || ''
}

const audioPlayer = useAudioPlayer(props.apiHost)

const playPreviewAudio = async (voice, event) => {
  event.preventDefault()
  if (!voice) return
  await audioPlayer.playAudio(voice.exampleAudio, `preview-${voice.modelid}`)
}

const playGeneratedAudio = async () => {
  if (!generatedAudioUrl.value) return
  await audioPlayer.playAudio(generatedAudioUrl.value, 'generated')
}

// 在模板中判断播放状态时
const isVoicePlaying = (voice) => {
  return audioPlayer.audioId.value === `preview-${voice.modelid}` && audioPlayer.isPlaying.value
}

const isGeneratedPlaying = () => {
  return audioPlayer.audioId.value === 'generated' && audioPlayer.isPlaying.value
}

const generateVoice = async () => {
  if (!selectedVoice.value || !inputText.value) {
    error.value = t('tts_generator.messages.select_voice')
    return
  }

  isGenerating.value = true
  isGenerated.value = false
  error.value = null
  generatedAudioUrl.value = null

  try {
    const { data } = await useFetch(`${props.apiHost}/api/genaudio`, {
      method: 'POST',
      body: {
        modelcat: selectedCategory.value,
        modelname: selectedVoice.value,
        modellang: selectedLanguage.value,
        text: inputText.value,
        subscript: 0,
        userid: 0,
        t: 1
      }
    })

    if (data.value?.ret === 0 && data.value?.uri) {
      generatedAudioUrl.value = data.value.uri
      isGenerated.value = true
      emit('generation-complete', data.value.uri)
    } else {
      throw new Error(data.value?.msg || 'Generation failed')
    }
  } catch (err) {
    error.value = err.message
    emit('error', err.message)
  } finally {
    isGenerating.value = false
  }
}

const downloadAudio = async () => {
  if (!generatedAudioUrl.value) {
    error.value = 'No audio file to download'
    return
  }

  if (isDownloading.value) return

  isDownloading.value = true

  try {
    const response = await fetch(`${props.apiHost}${generatedAudioUrl.value}`)
    if (!response.ok) throw new Error('Download failed')

    const blob = await response.blob()
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `generated-voice-${Date.now()}.mp3`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    window.URL.revokeObjectURL(url)
  } catch (err) {
    error.value = 'Download failed, please try again'
    emit('error', 'Download failed')
  } finally {
    isDownloading.value = false
  }
}

const resetState = () => {
  isGenerated.value = false
  generatedAudioUrl.value = null
  error.value = null
  inputText.value = ''
  selectedPreset.value = ''
}

// 组件卸载时清理
onUnmounted(() => {
  audioPlayer.cleanup()
  resetState()
})

// 暴露方法给父组件
defineExpose({
  playGeneratedAudio,
  downloadAudio,
  resetState
})

const handleLanguageChange = () => {
  //locale.value = selectedLanguage.value
  //setLang(selectedLanguage.value)
  // 更新预设文本
  //updatePresets()
  return
}

onMounted(() => {
  inputText.value = props.initText || ''
})

</script>

<style scoped>
.content-wrapper {
  @apply flex gap-4;
}

.voice-list {
  @apply transition-all duration-200;
}

/* 响应式布局 */
@media screen and (max-width: 768px) {
  .content-wrapper {
    @apply flex-col;
  }

  .voice-section { @apply order-1 w-full; }
  .input-container { @apply order-2 w-full; }
  .button-container { @apply order-3 w-full; }

  .voice-list {
    @apply max-h-[200px];
  }
}

@media screen and (min-width: 769px) and (max-width: 1023px) {
  .content-wrapper {
    @apply flex-col gap-6;
  }

  .voice-section,
  .input-container,
  .button-container {
    @apply w-full;
  }

  .voice-list {
    @apply max-h-[400px];
  }
}

@media screen and (min-width: 1024px) {
  .content-wrapper {
    @apply relative;
    min-height: 461px;
  }

  .voice-section {
    @apply order-2 relative;
    width: calc(52% - 1rem);
    display: flex;
    flex-direction: column;
  }

  .input-container {
    @apply order-1 flex-[0_0_48%] h-full;
  }

  .button-container {
    @apply order-3;
    position: absolute;
    width: calc(52% - 1rem);
    left: calc(48% + 1rem);
    bottom: 0;
    background: white;
    z-index: 10;
  }

  .voice-list-container {
    @apply flex-1 flex flex-col min-h-0;
    min-height: 340px; /* 确保flex-1生效 */

  }

  .voice-list {
    @apply flex-1 overflow-y-auto;
  }

  .text-input {
    @apply min-h-[400px];
    height: 461px;
  }

  .language-select {
    flex-shrink: 0;
    height: 40px;
    margin-bottom: 8px;
  }
}

/* 分类标签样式 */
.voice-categories-wrapper {
  @apply relative bg-gray-50 rounded-t-lg border border-gray-200;
  overflow: hidden;
  width: 100%;
}

.voice-categories {
  @apply relative;
  overflow-x: auto;
  width: 100%;
  scrollbar-width: none;
  -ms-overflow-style: none;
  mask-image: linear-gradient(
    to right,
    black calc(100% - 48px),
    transparent 100%
  );
  -webkit-mask-image: linear-gradient(
    to right,
    black calc(100% - 48px),
    transparent 100%
  );
}

.voice-categories > div {
  @apply flex flex-nowrap;
  padding-right: 48px;
  justify-content: flex-start;
}

.voice-categories::-webkit-scrollbar {
  display: none;
}

.category-tab {
  @apply flex items-center gap-2 px-4 py-2 text-sm font-medium whitespace-nowrap border border-gray-200 -ml-[1px] first:ml-0 transition-all;
  flex: 0 0 auto;
}

/* 滚动指示器 */
.voice-categories-wrapper::after {
  content: '';
  @apply absolute right-0 top-0 bottom-0;
  width: 48px;
  background: linear-gradient(
    to right,
    rgba(249, 250, 251, 0) 0%,
    rgba(249, 250, 251, 1) 100%
  );
  pointer-events: none;
  z-index: 1;
}

/* 动作按钮出现时的样式 */
.content-wrapper.has-action-buttons  {
  padding-bottom: 80px; /* 为下载和播放按钮预留空间 */
}
</style>

