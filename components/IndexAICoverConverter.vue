<template>
  <div class="flex flex-col md:flex-row gap-8">
    <!-- 左侧声音列表容器 -->
    <div class="md:w-[40%] space-y-4 flex flex-col">
      <div class="text-xl font-semibold bg-clip-text text-transparent bg-gradient-to-r from-[#F1AC63] to-[#D76FF4]">
        {{ $t('ai_cover.converter.title') }}
      </div>

      <!-- 模型列表容器 -->
      <div class="flex flex-col flex-1 bg-white overflow-hidden">
        <!-- 分类选择 - 外层包div+纯CSS箭头方案 -->
        <div v-if="Array.isArray(allVoiceModels) && allVoiceModels.length > 0" class="mb-3 lg:mb-4 select-wrapper"
          style="position: relative; width: 100%;">
          <select v-model="selectedCategory"  @change="handleCategoryChange" aria-label="AI Cover category select" class="custom-select">
            <option v-for="model in allVoiceModels" :key="model.catid" :value="model.catid">
              {{ model.catname }} ({{ model.options?.length || 0 }})
            </option>
          </select>
          <span class="select-arrow"></span>
        </div>

        <!-- 加载状态显示 -->
        <div v-if="isLoadingModels" class="flex items-center justify-center min-h-[200px]">
          <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-pink-500"></div>
        </div>

        <!-- 模型列表 -->
        <div class="flex-1 overflow-y-auto border border-gray-200 rounded-xl scrollable-container max-h-[500px]"
          ref="modelListContainer" @click="handleModelListClick" @scroll="handleListScroll">
          <div v-for="model in currentCatModels" :key="model.modelid" :data-model-id="model.modelid"
            :ref="el => { if (model.modelid === selectedModel) selectedModelRef = el }"
            class="flex items-center p-4 cursor-pointer model-list-item transition-optimized hover:bg-gray-50 border-b border-gray-100 last:border-b-0"
            :class="[
              selectedModel === model.modelid
                ? 'bg-pink-50/60'
                : 'bg-white hover:bg-gray-100'
            ]" :style="{ minHeight: '88px', contain: 'layout' }">
            <!-- 单选控件 -->
            <div class="mr-4 flex-shrink-0">
              <div
                class="w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors duration-200 inp-optimized"
                :class="[
                  selectedModel === model.modelid
                    ? 'border-pink-500'
                    : 'border-gray-300'
                ]">
                <div v-if="selectedModel === model.modelid" class="w-3 h-3 rounded-full bg-pink-500 inp-optimized">
                </div>
              </div>
            </div>
            <!-- div class="w-12 h-12 rounded-full flex-shrink-0 overflow-hidden image-container-optimized">
              <img :src="model.modelicon" :alt="model.name" width="48" height="48"
                class="w-full h-full object-cover rounded-full inp-optimized" loading="lazy" />
            </div -->
            <div class="ml-4 flex-grow">
              <div class="font-medium text-gray-900">{{ model.name }}</div>
              <div class="flex items-center text-sm text-gray-500">
                <span>{{ model.gender }}</span>
                <!-- span class="mx-2">@{{ model.author }}</span -->
              </div>
            </div>
            <!-- Preview button -->
            <div class="flex items-center">
              <button @click.stop="playAudioPreview(model, $event)"
                :disabled="audioPlayer.isLoading.value && audioPlayer.audioId.value === `audio-${model.modelid}`"
                class="w-8 h-8 rounded-full flex items-center justify-center audio-preview-button transition-optimized"
                :class="[
                  audioPlayer.isLoading.value && audioPlayer.audioId.value === `audio-${model.modelid}`
                    ? 'bg-black'
                    : isPlayingPreview(model.modelid)
                      ? 'bg-gradient-to-r from-[#E38B72] to-[#C44F98] text-white'
                      : 'bg-black text-white hover:bg-gray-800'
                ]"
                :title="isPlayingPreview(model.modelid) ? $t('ai_cover.converter.buttons.stop') : $t('ai_cover.converter.buttons.preview')">
                <!-- Loading 状态 -->
                <template v-if="audioPlayer.isLoading.value && audioPlayer.audioId.value === `audio-${model.modelid}`">
                  <svg class="animate-spin-optimized w-4 h-4 mx-auto text-white" xmlns="http://www.w3.org/2000/svg"
                    fill="none" viewBox="0 0 24 24" aria-hidden="true">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="3"></circle>
                    <path class="opacity-75" fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z">
                    </path>
                  </svg>
                </template>
                <!-- 播放/暂停状态 - 只保留图标 -->
                <template v-else>
                  <component :is="isPlayingPreview(model.modelid) ? PauseIcon : PlayIcon"
                    class="w-4 h-4 inp-optimized" />
                </template>
                <!-- 屏幕阅读器文本 -->
                <span class="sr-only">
                  {{ isPlayingPreview(model.modelid) ? $t('ai_cover.converter.buttons.stop') :
                    $t('ai_cover.converter.buttons.preview')
                  }}
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 右侧音频处理容器 -->
    <div class="md:w-[60%] space-y-4 flex flex-col">
      <div class="flex-1 flex flex-col" :style="{ minHeight: '350px' }">
        <!-- 音频输入选项 Tabs -->
        <div class="border-t border-l border-r border-purple-100 rounded-t-xl">
          <div class="flex flex-wrap w-full bg-purple-50/80 p-2 rounded-t-xl">
            <button v-for="tab in audioTabs" :key="tab.id" @click="handleTabChange(tab.id)" :class="[
              'flex items-center justify-center w-1/2 md:flex-1 px-4 py-2 rounded-lg text-sm font-medium mb-2 md:mb-0 tab-button-optimized transition-optimized',
              { 'bg-gradient-to-r from-[#E38B72] to-[#C44F98] text-white': currentTab === tab.id },
              { 'text-gray-600 hover:bg-white/60': currentTab !== tab.id },
              { 'md:mx-2': tab.id !== 'sample' }
            ]">
              <component :is="tab.icon" class="w-4 h-4 mr-2 inp-optimized" aria-hidden="true" />
              {{ $t(`ai_cover.converter.tabs.main.${tab.id}`) }}
            </button>
          </div>
        </div>

        <!-- Tab 内容区域 -->
        <div class="bg-white p-6 border border-gray-200 rounded-b-xl flex-1">
          <!-- AI Song Cover Tab -->
          <div v-show="currentTab === 'cover'" class="h-full flex flex-col gap-4">
            <!-- 子标签页导航 -->
            <div class="border-b border-gray-200">
              <div class="flex">
                <button v-for="subTab in coverSubTabs" :key="subTab.id" @click="handleSubTabChange(subTab.id)"
                  class="relative flex items-center justify-center px-4 py-3.5 pb-3 text-sm tab-button-optimized transition-optimized"
                  :class="[
                    currentSubTab === subTab.id
                      ? 'text-transparent bg-clip-text bg-gradient-to-r from-[#E38B72] to-[#C44F98] font-semibold text-base'
                      : 'text-gray-600 hover:text-gray-900 font-medium'
                  ]">
                  <component :is="subTab.icon" class="w-4 h-4 mr-1.5 inp-optimized" :class="[
                    currentSubTab === subTab.id
                      ? 'text-[#C44F98]'
                      : 'text-gray-600'
                  ]" aria-hidden="true" />
                  {{ $t(`ai_cover.converter.tabs.${subTab.id}`) }}
                  <!-- 底部划线 -->
                  <div class="absolute bottom-[-1px] left-0 right-0 transition-all inp-optimized" :class="[
                    currentSubTab === subTab.id
                      ? 'h-[4px] bg-gradient-to-r from-[#E38B72] to-[#C44F98]'
                      : 'h-0 bg-transparent'
                  ]"></div>
                </button>
              </div>
            </div>

            <!-- 子标签页内容 -->
            <div class="flex-1">
              <!-- Sample Audio Tab -->
              <div v-show="currentSubTab === 'sample'" class="h-full">
                <div class="h-full">
                  <div class="overflow-y-auto h-full">
                    <div v-for="sample in sampleAudios" :key="sample.id" @click="selectSampleAudio(sample)"
                      class="flex items-center p-3 transition-all duration-200 cursor-pointer border-t border-b border-transparent"
                      :class="[
                        selectedSample?.id === sample.id
                          ? 'bg-pink-50/60 !border-t-pink-200 !border-b-pink-200'
                          : 'bg-white hover:bg-gray-50'
                      ]">
                      <!-- 单选圆圈 -->
                      <div
                        class="w-4 h-4 rounded-full border-2 flex items-center justify-center transition-colors duration-200 mr-3"
                        :class="[
                          selectedSample?.id === sample.id
                            ? 'border-pink-500'
                            : 'border-gray-300'
                        ]">
                        <div v-if="selectedSample?.id === sample.id" class="w-2 h-2 rounded-full bg-pink-500"></div>
                      </div>

                      <!-- 文本内容 -->
                      <div class="flex-1 min-w-0 mr-4">
                        <div class="text-sm font-medium text-gray-900 truncate">{{ sample.name }}</div>
                        <p class="text-xs text-gray-500">{{ sample.duration }}</p>
                      </div>

                      <!-- 播放按钮 -->
                      <button @click.stop="(e) => playSampleAudio(sample, e)"
                        :disabled="audioPlayer.isLoading.value && audioPlayer.audioId.value === `sample-${sample.id}`"
                        class="w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200"
                        :class="[
                          audioPlayer.isLoading.value && audioPlayer.audioId.value === `sample-${sample.id}`
                            ? 'bg-black'
                            : isPlayingSample(sample.id)
                              ? 'bg-gradient-to-r from-[#E38B72] to-[#C44F98] text-white'
                              : 'bg-black text-white hover:bg-gray-800'
                        ]"
                        :title="isPlayingSample(sample.id) ? $t('ai_cover.converter.buttons.stop') : $t('ai_cover.converter.buttons.preview')">
                        <template
                          v-if="audioPlayer.isLoading.value && audioPlayer.audioId.value === `sample-${sample.id}`">
                          <svg class="animate-spin w-4 h-4 mx-auto text-white" xmlns="http://www.w3.org/2000/svg"
                            fill="none" viewBox="0 0 24 24" aria-hidden="true">
                            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="3">
                            </circle>
                            <path class="opacity-75" fill="currentColor"
                              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z">
                            </path>
                          </svg>
                        </template>
                        <component v-else :is="isPlayingSample(sample.id) ? PauseIcon : PlayIcon" class="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Upload Audio Tab -->
              <div v-show="currentSubTab === 'upload'" class="h-full">
                <div class="h-full p-4">
                  <AudioUploader
                    :uploaded-file="uploadedFile"
                    :model-category="selectedCategory"
                    :model-name="selectedModel"
                    type="audio"
                    :action-type="{ upload: ActionType.UPLOAD_AUDIO }"
                    @upload-success="handleUploadSuccess"
                    @upload-error="handleUploadError"
                    @reset="handleUploadReset"
                    @file-change="handleFileChange"
                    @uploading="handleUploading"
                    ref="audioUploaderRef"
                  />
                </div>
              </div>

              <!-- Record Audio Tab -->
              <div v-show="currentSubTab === 'record'" class="h-full">
                <div class="h-full p-4">
                  <!-- 已录制的音频显示 -->
                  <div v-if="uploadedFile && currentTab === 'cover'" class="h-full flex flex-col">
                    <audio :src="uploadedFileUrl" class="w-full mb-3" controls></audio>
                    <div class="flex items-center justify-between mt-auto">
                      <div class="text-xs text-gray-500">
                        {{ $t('ai_cover.converter.record.preview') }}
                      </div>
                      <button @click="resetUpload"
                        class="flex items-center text-red-500 hover:text-red-600 transition-colors text-sm">
                        <ArrowPathIcon class="w-4 h-4 mr-1" aria-hidden="true" />
                        {{ $t('ai_cover.converter.record.rerecord') }}
                      </button>
                    </div>
                  </div>

                  <!-- 录音按钮和状态显示 -->
                  <div v-else class="h-full flex flex-col items-center justify-center text-center">
                    <!-- 录音进度显示 -->
                    <div v-if="isUploading" class="w-full mb-4">
                      <div class="bg-white rounded-xl border border-gray-200 p-4">
                        <div class="mb-2 flex justify-between items-center">
                          <span class="text-sm text-gray-600">{{ $t('ai_cover.converter.upload.uploading') }}</span>
                        </div>
                        <div class="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                          <div class="h-full bg-red-500 transition-all duration-300 animate-pulse"></div>
                        </div>
                      </div>
                    </div>

                    <!-- 录音按钮 -->
                    <div v-else>
                      <div @click="toggleRecording" class="w-20 h-20 mx-auto mb-4 cursor-pointer group">
                        <div
                          class="w-full h-full rounded-full flex items-center justify-center transition-all duration-200"
                          :class="[
                            isRecording
                              ? 'bg-red-500 animate-pulse'
                              : 'bg-gradient-to-r from-orange-400/90 to-pink-400/90 group-hover:opacity-90'
                          ]">
                          <MicrophoneIcon
                            class="w-8 h-8 text-white transition-transform duration-200 group-hover:scale-110 group-active:scale-95"
                            aria-hidden="true" />
                        </div>
                      </div>
                      <div class="text-base font-medium mb-2">
                        {{ $t('ai_cover.converter.tabs.record') }}
                      </div>
                      <p class="text-sm text-gray-500">
                        {{ isRecording ? $t('ai_cover.converter.record.recording') :
                          $t('ai_cover.converter.record.start')
                        }}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Text to Speech Tab -->
          <div v-show="currentTab === 'tts'" class="h-full flex flex-col gap-6">
            <div
              class="relative border border-gray-200 rounded-lg focus-within:border-pink-200 focus-within:ring-2 focus-within:ring-pink-100 transition-all flex-1 flex flex-col bg-white"
              style="min-height: 350px">
              <!-- 预设文案标签 -->
              <div class="flex flex-wrap gap-2 p-3 border-b border-gray-100 bg-gray-50/50 rounded-t-lg">
                <button v-for="preset in presets_categories" :key="preset.id" @click="handlePresetClick(preset)"
                  aria-label="Preset Text"
                  class="px-3 py-1.5 text-sm font-medium transition-all rounded-full border whitespace-nowrap" :class="selectedPreset === preset.id
                    ? 'bg-pink-100 text-pink-700 border-pink-300'
                    : 'bg-white text-gray-700 border-gray-200 hover:border-gray-300 hover:bg-gray-50'">
                  {{ preset.label }}
                </button>
              </div>

              <!-- 文本输入框容器 -->
              <div class="flex-1 flex flex-col pb-8">
                <textarea v-model="ttsText" :placeholder="$t('tts_generator.input.placeholder')"
                  :maxlength="MAX_TEXT_LENGTH" @input="handleTextInput" class="tts-textarea-optimized"></textarea>
              </div>

              <!-- 字数统计 - 添加颜色变化 -->
              <div class="absolute bottom-3 right-3 text-sm" :class="[
                ttsText.length >= MAX_TEXT_LENGTH ? 'text-red-600' : 'text-gray-600'
              ]">
                {{ ttsText.length }}/{{ MAX_TEXT_LENGTH }}
              </div>
            </div>
          </div>
        </div>

        <!-- 性别选择器 -->
        <div v-if="currentTab === 'cover'" class="mt-4 mb-6">
          <div class="flex flex-col">
            <label class="text-sm font-medium text-gray-700 mb-2">{{ $t('ai_cover.converter.gender.title') }}</label>
            <div class="flex space-x-4">
              <!-- Female 选项 -->
              <div @click="selectedGender = 'female'"
                class="flex-1 flex items-center p-3 border rounded-lg cursor-pointer transition-all duration-200"
                :class="[
                  selectedGender === 'female'
                    ? 'border-pink-300 bg-pink-50/60 shadow-sm'
                    : 'border-gray-200 hover:border-gray-300'
                ]">
                <div class="mr-3">
                  <div
                    class="w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors duration-200"
                    :class="[
                      selectedGender === 'female'
                        ? 'border-pink-500'
                        : 'border-gray-300'
                    ]">
                    <div v-if="selectedGender === 'female'" class="w-3 h-3 rounded-full bg-pink-500"></div>
                  </div>
                </div>
                <div class="flex items-center">
                  <span class="text-sm font-medium">{{ $t('ai_cover.converter.gender.female') }}</span>
                </div>
              </div>

              <!-- Male 选项 -->
              <div @click="selectedGender = 'male'"
                class="flex-1 flex items-center p-3 border rounded-lg cursor-pointer transition-all duration-200"
                :class="[
                  selectedGender === 'male'
                    ? 'border-blue-300 bg-blue-50/60 shadow-sm'
                    : 'border-gray-200 hover:border-gray-300'
                ]">
                <div class="mr-3">
                  <div
                    class="w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors duration-200"
                    :class="[
                      selectedGender === 'male'
                        ? 'border-blue-500'
                        : 'border-gray-300'
                    ]">
                    <div v-if="selectedGender === 'male'" class="w-3 h-3 rounded-full bg-blue-500"></div>
                  </div>
                </div>
                <div class="flex items-center">
                  <span class="text-sm font-medium">{{ $t('ai_cover.converter.gender.male') }}</span>
                </div>
              </div>

              <!-- Duet 选项 -->
              <div @click="selectedGender = 'duet'"
                class="flex-1 flex items-center p-3 border rounded-lg cursor-pointer transition-all duration-200"
                :class="[
                  selectedGender === 'duet'
                    ? 'border-purple-300 bg-purple-50/60 shadow-sm'
                    : 'border-gray-200 hover:border-gray-300'
                ]">
                <div class="mr-3">
                  <div
                    class="w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors duration-200"
                    :class="[
                      selectedGender === 'duet'
                        ? 'border-purple-500'
                        : 'border-gray-300'
                    ]">
                    <div v-if="selectedGender === 'duet'" class="w-3 h-3 rounded-full bg-purple-500"></div>
                  </div>
                </div>
                <div class="flex items-center">
                  <span class="text-sm font-medium">{{ $t('ai_cover.converter.gender.duet') }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 转换按钮 -->
        <button @click="handleConvert" :disabled="isConverting" :class="[
          'w-full py-3 px-4 bg-gradient-to-r from-[#F1AC63] to-[#D76FF4] text-white rounded-lg font-medium ai-generate-btn',
          currentTab === 'cover' ? 'mt-4' : 'mt-4'  // 统一使用更大的上边距
        ]">
          <template v-if="isConverting">
            <svg class="animate-spin w-5 h-5 mx-auto text-white" xmlns="http://www.w3.org/2000/svg" fill="none"
              viewBox="0 0 24 24" aria-hidden="true">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="3"></circle>
              <path class="opacity-75" fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z">
              </path>
            </svg>
          </template>
          <template v-else>
            {{ $t('ai_cover.converter.buttons.create') }}
          </template>
        </button>

        <!-- 生成成功后的音频控制组件 -->
        <div v-if="convertedAudio" class="mt-6 flex gap-4">
          <div class="w-full" style="margin-left: 10px">
            <div class="vue-audio-player__wrapper">
              <VueAudioPlayer :audio-list="audioList" />
              <div class="vue-audio-player__download" @click="handleDownload">
                <slot name="play-start">
                  <svg xmlns="http://www.w3.org/2000/svg" width="1080" height="1080" viewBox="0 0 1080 1080"
                    xml:space="preserve" aria-hidden="true">
                    <defs>
                      <linearGradient :id="downloadGradientId" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stop-color="#F1AC63" />
                        <stop offset="100%" stop-color="#D76FF4" />
                      </linearGradient>
                    </defs>
                    <path transform="translate(28 28)"
                      d="M512 8.98c277.815 0 503.02 225.205 503.02 503.02S789.816 1015.02 512 1015.02 8.98 789.816 8.98 512 234.184 8.98 512 8.98"
                      :fill="`url(#${downloadGradientId})`" />
                    <path style="stroke:#fff;stroke-width:2" transform="translate(277.92 277.92)scale(21.84)"
                      d="M21 21H3m15-10-6 6m0 0-6-6m6 6V3" stroke-linecap="round" />
                  </svg>
                </slot>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- 引入 LoginModal 组件 -->
  <LoginModal :showModal="showModal" @loginSuccess="handleLoginSuccess" />
  <PayModal 
    :show="showPayModal" 
    :uid="uid" 
    :email="userEmail" 
    :quota-exhausted="quotaExhaustedComputed"
    :quota-type="quotaTypeComputed"
    @close="handlePayModalClose" 
  />
  <CommonModal :show="showCommonModal" title="Daily Limit Reached"
    message="You've reached today's free conversion limit. Come back tomorrow or upgrade to Premium for unlimited access."
    @close="showCommonModal = false" />
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, nextTick, watch } from 'vue';
import { CheckIcon } from '@heroicons/vue/20/solid'
import {
  PlayIcon,
  PauseIcon,
  LinkIcon,
  ArrowPathIcon,
  ChatBubbleLeftIcon,
  MicrophoneIcon,
  CloudArrowDownIcon,
  MusicalNoteIcon
} from '@heroicons/vue/24/solid';
import { useToast } from 'vue-toastification/dist/index.mjs'
import { useUserStore } from '~/store/user'
import { useAuth } from '~/composables/useAuth'
import { useQuotaCheck, QuotaType } from '~/composables/useQuotaCheck'
import { useActionReporter, ActionType } from '~/composables/actionReporter'
import { useErrorReporter } from '~/composables/errorReporter'
import { useAudioPlayer } from '~/composables/useAudioPlayer'
import LoginModal from '~/components/LoginModal.vue'
import PayModal from '~/components/PayModal.vue'
import CommonModal from '~/components/CommonModal.vue'
import VueAudioPlayer from '~/components/VueAudioPlayer.vue'
import AudioUploader from '~/components/AudioUploader.vue'
import { useGoogleSearchKeyword } from '~/composables/useGoogleSearchKeyword'
import { useRequestEvent } from '#app'
import { config } from '~/config/config'
import { usePageErrorHandler } from '~/composables/usePageErrorHandler';
import { useRoute, useRouter } from 'vue-router';
import type { Model, VoiceModel, Category } from '~/types';
import { getCharacterPresets, VOICE_PRESETS } from '~/constants/voicePresets'

const toast = useToast()
const { t, rt, tm, locale } = useI18n()
const host = config.host
const cdnHost = config.cdnHost
const apiHost = config.apiHost

const audioPlayer = useAudioPlayer()

const userStore = useUserStore()
const { reportError } = useErrorReporter()
const { getUserInfo, updateUserCounter, updateUsageCount, getOrCreateUid } = useAuth()
const { trackAction, actionCounts } = useActionReporter()
const { searchKeyword, getGoogleSearchKeyword } = useGoogleSearchKeyword()

const uid = ref(getOrCreateUid())
const isLoggedIn = computed(() => !!userStore.user)
const userEmail = computed(() => userStore.user?.email || '')
const userSubscript = ref(0)
const pageUrl = computed(() => {
  if (process.client) {
    return window.location.href
  }
  return ''
})

// 通过 props 接收数据
const props = defineProps({
  voiceModels: {
    type: Array as () => Category[],
    default: () => []
  },
  defaultCategory: {
    type: String,
    default: ''
  },
  defaultModel: {
    type: String,
    default: ''
  },
  isLoading: {
    type: Boolean,
    default: true
  }
})

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

// 获取用户订阅信息的函数
const fetchUserSubscription = async () => {
  if (isLoggedIn.value) {
    try {
      const userinfo = await getUserInfo(userEmail.value)
      if (userinfo?.userinfo) {
        userSubscript.value = userinfo.userinfo.user_subscript
      }
    } catch (err) {
      reportError(err, `Fetch user subscription failed - pageUrl: ${pageUrl.value}`, uid.value, userEmail.value)
    }
  } else {
    userSubscript.value = 0
  }
}

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

// state management
const isConverting = ref(false)
const convertedAudio = ref(null)
const audioList = ref([])
const uploadedAudioList = ref([])
const selectedGender = ref('') // 移除默认选择

const selectedLanguage = ref('english')

// 生成唯一的渐变 ID，避免多个实例冲突
const downloadGradientId = ref(`download-gradient-${Math.random().toString(36).substr(2, 9)}`)

// 修改 allVoiceModels 计算属性
const allVoiceModels = computed<Category[]>(() => {
  return Array.isArray(props.voiceModels) ? props.voiceModels : [];
});

// 使用缓存Map优化分类查找
const categoryMap = computed(() => {
  const map = new Map();
  allVoiceModels.value.forEach(model => {
    map.set(model.catid, model);
  });
  return map;
});

// 优化的分类名称计算
const currentCategoryName = computed(() => {
  const category = categoryMap.value.get(selectedCategory.value);
  if (category) {
    return `${category.catname} (${category.options?.length || 0})`;
  }
  return 'Select a category';
});

// 计算当前分类下的模型 - 使用缓存提高性能
const currentCatModels = computed(() => {
  if (!selectedCategory.value) {
    return []
  }
  const currentModel = categoryMap.value.get(selectedCategory.value);
  return currentModel?.options || []
})

const selectedCategory = ref('')
const selectedModel = ref(null)

// 添加初始化状态
const isInitialized = ref(false)

// 同步初始化函数，确保在模板渲染之前执行（服务端和客户端都会执行）
const initializeFromProps = () => {
  if (props.voiceModels && Array.isArray(props.voiceModels) && props.voiceModels.length > 0) {
    // 如果有默认分类和模型，直接设置
    if (props.defaultCategory && props.defaultModel) {
      selectedCategory.value = props.defaultCategory
      selectedModel.value = props.defaultModel
      isInitialized.value = true
      return
    }
    
    // 如果没有默认值，使用第一个分类和模型
    const firstCategory = props.voiceModels[0]
    if (firstCategory && firstCategory.catid) {
      selectedCategory.value = firstCategory.catid
      if (firstCategory.options && firstCategory.options.length > 0) {
        selectedModel.value = firstCategory.options[0].modelid
        isInitialized.value = true
      }
    }
  }
}

// 立即执行初始化（在服务端和客户端都会执行，确保在模板渲染之前完成）
initializeFromProps()

// 将加载状态改为计算属性，确保服务端和客户端状态一致
const isLoadingModels = computed(() => {
  // 如果 voiceModels 为空或未定义，显示加载状态
  if (!Array.isArray(props.voiceModels) || props.voiceModels.length === 0) {
    return true
  }
  // 如果有数据但还未设置分类和模型，显示加载状态
  // 这样不依赖 isInitialized，直接基于实际数据状态判断，避免服务端和客户端状态不一致
  return !selectedCategory.value || !selectedModel.value
})

// 修改 watch 逻辑，添加滚动到可见区域的功能
watch(
  [() => props.defaultCategory, () => props.defaultModel, () => props.voiceModels],
  ([newDefaultCategory, newDefaultModel, newModels]) => {
    // 确保有模型数据后再进行初始化
    if (!newModels || newModels.length === 0) {
      return
    }
    
    // 如果已经初始化过且值没有变化，跳过（避免重复初始化）
    const expectedCategory = newDefaultCategory || newModels[0]?.catid
    const expectedModel = newDefaultModel || newModels[0]?.options?.[0]?.modelid
    if (isInitialized.value && 
        selectedCategory.value === expectedCategory &&
        selectedModel.value === expectedModel) {
      return
    }
    
    try {
      // 如果没有默认分类，使用第一个分类
      if (!newDefaultCategory && newModels.length > 0) {
        selectedCategory.value = newModels[0].catid
        if (newModels[0].options?.length > 0) {
          selectedModel.value = newModels[0].options[0].modelid
        }
      } else if (newDefaultCategory) {
        selectedCategory.value = newDefaultCategory

        const currentCategory = categoryMap.value.get(newDefaultCategory);

        if (currentCategory?.options?.length) {
          if (newDefaultModel) {
            const defaultVoiceInCategory = currentCategory.options.find(
              option => option.modelid === newDefaultModel
            )
            selectedModel.value = defaultVoiceInCategory?.modelid || currentCategory.options[0].modelid
          } else {
            selectedModel.value = currentCategory.options[0].modelid
          }
        }
      }

      // 标记为已初始化，isLoadingModels 计算属性会自动更新
      isInitialized.value = true

      // 直接定位到选中项，不使用滚动动画
      nextTick(() => {
        if (selectedModelRef.value && modelListContainer.value) {
          (selectedModelRef.value as HTMLElement).scrollIntoView({
            block: 'nearest'
          })
        }
      })
    } catch (err) {
      reportError(err, `Models watch failed - pageUrl: ${pageUrl.value}`, uid.value, userEmail.value)
    }
  },
  { immediate: true }
)



// 修改分类变化的 watch
watch(() => selectedCategory.value, (newCategory, oldCategory) => {
  // 只在确实发生分类改变时才重置
  if (newCategory && oldCategory && newCategory !== oldCategory) {
    const currentCategory = categoryMap.value.get(newCategory);
    const firstVoice = currentCategory?.options?.[0]
    if (firstVoice) {
      selectedModel.value = firstVoice.modelid
    }
  }
})

watch(() => selectedModel.value, () => {
  convertedAudio.value = null
  if (audioPlayer.isPlaying.value) {
    audioPlayer.pauseAudio()
  }
})

// audio tabs
const currentTab = ref('tts')
const currentSubTab = ref('upload')

const defaultAudioTabs = [
  { id: 'tts', name: 'Text to Speech', icon: ChatBubbleLeftIcon },
  { id: 'cover', name: 'AI Song Cover', icon: MusicalNoteIcon },
]

const audioTabs = computed(() => {
  if (!selectedModel.value) {
    return [
      { id: 'tts', name: 'Text to Speech', icon: ChatBubbleLeftIcon },
    ]
  }

  const selectedModelData = allVoiceModels.value
    .flatMap((m: Category) => m.options)
    .find((m: Model) => m.modelid === selectedModel.value)

  if (!selectedModel.value || !selectedModelData || !selectedModelData.cover_modelname) {
    return [
      { id: 'tts', name: 'Text to Speech', icon: ChatBubbleLeftIcon },
    ]
  }
  return defaultAudioTabs;
});

watch(() => audioTabs.value, (newAudioTabs) => {
  if (!newAudioTabs.some(tab => tab.id === currentTab.value)) {
    currentTab.value = 'tts'
  }
}, { immediate: true })

const handleTabChange = (tabId) => {
  currentTab.value = tabId; // 立刻切换UI
  setTimeout(() => {
    convertedAudio.value = null;
    isConverting.value = false;
    if (tabId === 'cover') {
      currentSubTab.value = 'upload';
      resetUpload();
      if (audioPlayer.isPlaying.value) {
        audioPlayer.pauseAudio();
      }
    }
  }, 0);
}

// sample audio
const sampleAudios = ref([
  {
    id: 1,
    name: 'Last Night - Morgan Wallen(Male)',
    duration: '0:15',
    url: `${cdnHost}/outimage/wavplay/cover/sampleaudio/en/lastnight-morgan-male.mp3`,
    uploadedurl: '/uploads/samples/20250222161810_1.1.1.1_997.mp3',
    gender: 'male'
  },
  {
    id: 2,
    name: 'Last Dance With Mary Jane - Snoop Dogg(Male)',
    duration: '0:15',
    url: `${cdnHost}/outimage/wavplay/cover/sampleaudio/en/lastdance-snoopdogg-male.mp3`,
    uploadedurl: '/uploads/samples/20250222161810_1.1.1.1_996.mp3',
    gender: 'male'
  },
  {
    id: 3,
    name: 'APT. - ROSÉ(Female)',
    duration: '0:15',
    url: `${cdnHost}/outimage/wavplay/cover/sampleaudio/en/apt-rose-female.mp3`,
    uploadedurl: '/uploads/samples/20250222161810_1.1.1.1_998.mp3',
    gender: 'female'
  },
  {
    id: 4,
    name: 'Cruel Summer - Taylor Swift(Female)',
    duration: '0:15',
    url: `${cdnHost}/outimage/wavplay/cover/sampleaudio/en/cruelsummer-taylor-female.mp3`,
    uploadedurl: '/uploads/samples/20250222161810_1.1.1.1_999.mp3',
    gender: 'female'
  }
])

const selectedSample = ref<any>(null)
// select sample audio
const selectSampleAudio = (sample: any) => {
  selectedSample.value = sample
  if (sample && sample.gender) {
    selectedGender.value = sample.gender
  }
}

// watch currentTab 和 currentSubTab
watch(
  [() => currentTab.value, () => currentSubTab.value],
  ([newTab, newSubTab]) => {
    if (newTab === 'cover' && newSubTab === 'sample') {
      if (!selectedSample.value && sampleAudios.value.length > 0) {
        selectedSample.value = sampleAudios.value[0]
      }

      if (selectedSample.value) {
        selectedGender.value = selectedSample.value.gender
      }
    } else if (newTab === 'cover' && newSubTab === 'upload') {
      selectedGender.value = ''
    } else if (newTab === 'cover' && newSubTab === 'record') {
      selectedGender.value = ''
    }
  },
  { immediate: true }
)

watch(() => selectedSample.value, () => {
  convertedAudio.value = null
  if (audioPlayer.isPlaying.value) {
    audioPlayer.pauseAudio()
  }
})
// play sample audio
const playSampleAudio = async (sample: any, event: any) => {
  if (event) {
    event.preventDefault()
    event.stopPropagation()
  }

  // 添加参数验证
  if (!sample || !sample.url || typeof sample.url !== 'string') {
    reportError(
      new Error(`Invalid sample or sample.url: ${JSON.stringify(sample)}`),
      'playSampleAudio parameter validation failed',
      uid.value,
      userEmail.value
    )
    return
  }

  if (!sample.id) {
    reportError(
      new Error(`Invalid sample.id: ${sample.id}`),
      `Play sample audio failed - invalid sample.id - pageUrl: ${pageUrl.value}`,
      uid.value,
      userEmail.value
    )
    return
  }

  const audioId = `sample-${sample.id}`

  // 使用 requestAnimationFrame 优化音频播放操作，减少 INP
  requestAnimationFrame(async () => {
    try {
      // 如果当前正在播放这个音频，则停止播放
      if (audioPlayer.audioId.value === audioId && audioPlayer.isPlaying.value) {
        await audioPlayer.pauseAudio()
        return
      }

      // 如果有其他音频在播放，先停止它
      if (audioPlayer.isPlaying.value) {
        await audioPlayer.pauseAudio()
      }

      // 延迟播放新音频，避免阻塞UI
      requestAnimationFrame(async () => {
        try {
          await audioPlayer.playAudio(sample.url, audioId, cdnHost)
        } catch (err) {
          reportError(err, `Play sample audio failed - pageUrl: ${pageUrl.value}`, uid.value, userEmail.value)
        }
      })
    } catch (err) {
      reportError(err, `Play sample audio failed - pageUrl: ${pageUrl.value}`, uid.value, userEmail.value)
    }
  })
}
// play sample audio
const isPlayingSample = (sampleId: any) => {
  const audioId = `sample-${sampleId}`
  return audioPlayer.audioId.value === audioId && audioPlayer.isPlaying.value
}

// upload audio
const uploadedFile = ref(null)
const uploadedFileUrl = ref(null)
const upresurl = ref(null)
const isUploading = ref(false)
const audioUploaderRef = ref<InstanceType<typeof AudioUploader> | null>(null)

// AudioUploader 事件处理函数
const handleUploadSuccess = (response: any) => {
  if (response && response.url) {
    uploadedFile.value = response.file
    upresurl.value = response.url
    // uploadedAudioList 由 AudioUploader 内部管理，这里不需要设置
    if (response.file) {
      uploadedFileUrl.value = URL.createObjectURL(response.file)
      uploadedAudioList.value.length = 0
      uploadedAudioList.value.push(URL.createObjectURL(response.file))
    }
    // trackAction 已在 AudioUploader 内部调用，这里不需要重复调用
  }
}

const handleUploadError = (msg: string) => {
  toast.error(msg, {
    position: 'top-right',
    duration: 3000
  })
}

const handleUploadReset = () => {
  uploadedFile.value = null
  uploadedFileUrl.value = null
  upresurl.value = null
  convertedAudio.value = null
  if (uploadedFileUrl.value) {
    URL.revokeObjectURL(uploadedFileUrl.value)
    uploadedFileUrl.value = null
  }
  uploadedAudioList.value.length = 0
}

const handleFileChange = (file: File) => {
  // 文件选择时的处理，可以在这里添加额外的逻辑
}

const handleUploading = (val: boolean) => {
  isUploading.value = val
}

// reset upload
const resetUpload = () => {
  // 调用 AudioUploader 的 reset 方法
  if (audioUploaderRef.value && typeof audioUploaderRef.value.onReset === 'function') {
    audioUploaderRef.value.onReset()
  }
  uploadedFile.value = null
  uploadedFileUrl.value = null
  upresurl.value = null
  convertedAudio.value = null
  if (uploadedFileUrl.value) {
    URL.revokeObjectURL(uploadedFileUrl.value)
    uploadedFileUrl.value = null
  }
  uploadedAudioList.value.length = 0
}

// record audio
const isRecording = ref(false)
const mediaRecorder = ref(null)
const audioChunks = ref([])
// 删除未使用的 recordedAudioUrl
// const recordedAudioUrl = ref(null) // 添加 recordedAudioUrl ref

// toggle recording
const toggleRecording = async () => {
  if (!isRecording.value) {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      mediaRecorder.value = new MediaRecorder(stream)
      audioChunks.value = []

      mediaRecorder.value.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunks.value.push(event.data)
        }
      }

      mediaRecorder.value.onstop = () => {
        const audioBlob = new Blob(audioChunks.value, { type: 'audio/wav' })
        // 创建录音文件并通过 AudioUploader 上传
        const recordedFile = new File([audioBlob], 'recorded-audio.wav', { type: 'audio/wav' })
        
        // 通过 AudioUploader 的 ref 访问其内部的 BaseFileUploader 来上传文件
        if (audioUploaderRef.value) {
          const baseFileUploader = audioUploaderRef.value.$refs?.baseFileUploaderRef
          if (baseFileUploader) {
            // 触发 file-change 事件
            handleFileChange(recordedFile)
            // 通过 BaseFileUploader 的内部方法上传
            if (baseFileUploader.handleFileUpload) {
              const event = { target: { files: [recordedFile] } }
              baseFileUploader.handleFileUpload(event)
            }
          }
        }
        
        trackAction({
          email: userEmail.value,
          action: ActionType.RECORD_AUDIO,
          domain: 'aivoicelab.net',
          modelcat: selectedCategory.value,
          modelname: selectedModel.value,
          uid: uid.value
        })
      }
      mediaRecorder.value.start()
      isRecording.value = true
    } catch (err) {
      const msg = t('ai_cover.converter.errors.microphoneAccess')
      toast.error(msg, {
        position: 'top-right',
        duration: 3000
      })
      reportError(err, `Recording audio failed - pageUrl: ${pageUrl.value}, msg: ${msg}`, uid.value, userEmail.value)
    }
  } else {
    try {
      mediaRecorder.value.stop()
      // 停止所有音轨
      mediaRecorder.value.stream.getTracks().forEach(track => track.stop())
      isRecording.value = false
    } catch (err) {
      reportError(err, `Record audio stop failed - pageUrl: ${pageUrl.value}`, uid.value, userEmail.value)
    }
  }
}

// 新增 tts 相关的响应式变量
const ttsText = ref('')

// 预设文案相关
const selectedPreset = ref('')

// 根据模型 ID 精确匹配获取角色预设
const getCharacterPresetsForModel = (modelId) => {
  if (!modelId) return []
  
  // 直接用模型 ID 查询，精确匹配
  const presets = getCharacterPresets(modelId, selectedLanguage.value)
  if (presets && presets.length > 0) return presets
  
  // 兜底：如果找不到对应的预设，返回默认文案
  return [
    { id: 'greetings', label: 'Greetings', text: " Hello, how are you today?\n Good morning, everyone!\n Welcome to my channel!" },
    { id: 'emotions', label: 'Emotions', text: " I'm so happy to see you!\n That's really amazing!\n This is absolutely incredible!" },
    { id: 'actions', label: 'Actions', text: " Don't forget to like and subscribe!\n Check out the link in description!\n Follow me for more content!" },
    { id: 'stories', label: 'Stories', text: " Once upon a time...\n Let me tell you a story...\n Here's something interesting..." }
  ]
}

// 根据当前选择的模型生成预设分类
const presets_categories = computed(() => {
  const selectedModelData = currentCatModels.value.find(m => m.modelid === selectedModel.value)
  if (!selectedModelData) return []

  const presets = getCharacterPresetsForModel(selectedModelData.modelid)
  return presets.map(preset => ({
    id: preset.id,
    label: preset.label
  }))
})

// 根据当前选择的模型生成预设文本
const presets_category_texts = computed(() => {
  const selectedModelData = currentCatModels.value.find(m => m.modelid === selectedModel.value)
  if (!selectedModelData) return []

  const presets = getCharacterPresetsForModel(selectedModelData.modelid)
  return presets.map(preset => [preset.id, preset.text])
})

// 监听模型选择变化，更新预设
watch(
  [() => selectedModel.value, () => selectedLanguage.value],
  ([newModel, newLanguage]) => {
    if (newModel && presets_categories.value.length > 0) {
      // 保持当前选中的预设类型，如果不存在则选择第一个
      const currentPresetId = selectedPreset.value
      const availablePresetIds = presets_categories.value.map(p => p.id)

      if (availablePresetIds.includes(currentPresetId)) {
        // 保持当前预设，只更新文本
        const currentPreset = presets_category_texts.value.find(item => item[0] === currentPresetId)
        if (currentPreset) {
          ttsText.value = currentPreset[1] || ''
        }
      } else {
        // 选择第一个预设
        selectedPreset.value = presets_categories.value[0]?.id || ''
        const firstPreset = presets_category_texts.value.find(item => item[0] === selectedPreset.value)
        if (firstPreset) {
          ttsText.value = firstPreset[1] || ''
        }
      }
    }
  },
  { immediate: true }
)

const handlePresetClick = (preset) => {
  selectedPreset.value = preset.id
  convertedAudio.value = null
  const selectedPresetData = presets_category_texts.value.find(item => item[0] === preset.id)
  if (selectedPresetData) {
    ttsText.value = selectedPresetData[1] || ''
  }
}

// 添加子标签页配置
const coverSubTabs = [
  { id: 'sample', name: 'Sample' },
  { id: 'upload', name: 'Upload' },
  { id: 'record', name: 'Record' }
]

const handleSubTabChange = (subTabid) => {
  // 立即更新关键状态
  currentSubTab.value = subTabid

  // 使用 scheduler.postTask 批处理其他状态更新
  if (typeof scheduler !== 'undefined' && scheduler.postTask) {
    scheduler.postTask(() => {
      convertedAudio.value = null
      isConverting.value = false

      // 根据不同的子标签页进行相应的状态重置
      switch (subTabid) {
        case 'sample':
          selectedSample.value = sampleAudios.value[0]
          break
        case 'upload':
          resetUpload()
          break
        case 'record':
          if (isRecording.value) {
            toggleRecording()
          }
          resetUpload()
          break
      }

      // 进一步延迟音频操作
      scheduler.postTask(() => {
        if (audioPlayer.isPlaying.value) {
          audioPlayer.pauseAudio()
        }
      }, { priority: 'background' })
    }, { priority: 'user-blocking' })
  } else {
    // 降级处理
    requestAnimationFrame(() => {
      convertedAudio.value = null
      isConverting.value = false

      switch (subTabid) {
        case 'sample':
          selectedSample.value = sampleAudios.value[0]
          break
        case 'upload':
          resetUpload()
          break
        case 'record':
          if (isRecording.value) {
            toggleRecording()
          }
          resetUpload()
          break
      }

      requestAnimationFrame(() => {
        if (audioPlayer.isPlaying.value) {
          audioPlayer.pauseAudio()
        }
      })
    })
  }
}

const handleCover = async () => {
  let ret = 0
  let msg = t('ai_cover.converter.generate.success')

  const selectedModelData = currentCatModels.value.find(m => m.modelid === selectedModel.value)
  if (!selectedModelData || !selectedModelData.cover_modelname) {
    ret = 1
    msg = t('ai_cover.converter.model.selectError')
    return [ret, msg]
  }
  if (!selectedGender.value || !['female', 'male', 'duet'].includes(selectedGender.value)) {
    ret = 1
    msg = t('ai_cover.converter.gender.selectError')
    return [ret, msg]
  }

  const formData = new FormData()
  let tmpConvertUrl = ''
  // 根据不同类型设置 converturl
  switch (currentSubTab.value) {
    case 'sample':
      if (!selectedSample.value) {
        ret = 1
        msg = t('ai_cover.converter.errors.selectSample')
        return [ret, msg]
      }
      tmpConvertUrl = selectedSample.value.uploadedurl
      formData.append('converturl', selectedSample.value.uploadedurl)
      break

    case 'upload':
      if (!upresurl.value) {
        ret = 1
        msg = t('ai_cover.converter.errors.uploadFile')
        return [ret, msg]
      }
      tmpConvertUrl = upresurl.value
      formData.append('converturl', upresurl.value)
      break

    case 'record':
      if (!upresurl.value) {
        ret = 1
        msg = t('ai_cover.converter.errors.recordAudio')
        return [ret, msg]
      }
      tmpConvertUrl = upresurl.value
      formData.append('converturl', upresurl.value)
      break

    default:
      ret = 1
      msg = t('ai_cover.converter.errors.invalidSubTab')
      return [ret, msg]
  }

  // 生成 UTC 时间戳（精确到秒）
  const tstamp = Math.floor(Date.now() / 1000)
  const { generateCoverSignature } = useSignature()
  const snature = generateCoverSignature(tmpConvertUrl, tstamp)

  formData.append('modelname', selectedModelData.cover_modelname)
  formData.append('modelcat', selectedModelData.cover_catid)
  formData.append('modelgender', selectedModelData.gender)
  formData.append('tabtype', currentSubTab.value)
  formData.append('lang', selectedLanguage.value)
  formData.append('email', userEmail.value)
  formData.append('uid', uid.value)
  formData.append('subscript', userSubscript.value)
  formData.append('upgender', selectedGender.value) // 添加性别参数
  formData.append('tstamp', tstamp)
  formData.append('snature', snature)
  formData.append('domain', 'aivoicelab.net')

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 180000)   // 3分钟超时
  try {
    // 发送转换请求
    const response = await fetch(`${apiHost}/coverapi/cover`, {
      method: 'POST',
      body: formData,
      signal: controller.signal
    })
    clearTimeout(timeoutId);

    if (!response.ok) {
      ret = 1
      msg = t('ai_cover.converter.errors.serverBusy')
      reportError(new Error(`HTTP error! status: ${response.status}`), `Cover Convert failed - pageUrl: ${pageUrl.value}`, uid.value, userEmail.value)
      return [ret, msg]
    }

    const result = await response.json()

    if (result.ret === 0) {
      let action = ActionType.COVER_SONG_GENERATE
      if (currentSubTab.value === 'sample') {
        // sample的cover不计入cover次数
        action = ActionType.COVER_SAMPLE_GENERATE
      }
      convertedAudio.value = result.uri
      audioList.value.length = 0
      audioList.value.push(host + result.uri)
      
      // 更新用户使用次数（仅在登录状态下，且不是sample模式）
      if (currentSubTab.value !== 'sample' && isLoggedIn.value && userEmail.value) {
        try {
          updateUsageCount(userEmail.value, ActionType.COVER_SONG_GENERATE)
        } catch (err) {
          reportError(err, `Error updating cover usage count - pageUrl: ${pageUrl.value}`, uid.value, userEmail.value)
        }
      }
      
      // 记录行为
      trackAction({
        email: userEmail.value,
        action: action,
        domain: 'aivoicelab.net',
        modelcat: selectedCategory.value,
        modelname: selectedModel.value,
        uid: uid.value
      })
    } else {
      ret = result.ret
      msg = result.msg
      reportError(new Error(result.msg), `Cover song Convert failed - pageUrl: ${pageUrl.value}`, uid.value, userEmail.value)
    }
  } catch (err) {
    ret = 1
    msg = t('ai_cover.converter.errors.serverBusy')
    reportError(
      err,
      `Cover Convert request failed - pageUrl: ${pageUrl.value}`,
      uid.value,
      userEmail.value
    )
    return [ret, msg]
  } finally {
    clearTimeout(timeoutId)  // 确保超时计时器被清除
  }
  return [ret, msg]
}

// 定义响应式文本长度限制
const MAX_TEXT_LENGTH = ref(500)

// 监听用户订阅状态，动态调整文本长度限制
watch(userSubscript, (newValue) => {
  if (newValue === 1) {
    // 订阅用户可以使用更长的文本
    MAX_TEXT_LENGTH.value = 600
  } else {
    // 非订阅用户使用默认长度
    MAX_TEXT_LENGTH.value = 500
  }
}, { immediate: true })

const handleTextInput = (event) => {
  // 使用防抖来延迟处理
  if (ttsText.value.length > MAX_TEXT_LENGTH.value) {
    nextTick(() => {
      ttsText.value = ttsText.value.slice(0, MAX_TEXT_LENGTH.value)
    })
  }
}

const handleTTS = async () => {
  let ret = 0
  let msg = t('ai_cover.converter.generate.success')

  if (ttsText.value === '') {
    ret = 1
    msg = t('ai_cover.converter.inputText')
    return [ret, msg]
  }

  // 添加长度检查和截断
  if (ttsText.value.length > MAX_TEXT_LENGTH.value) {
    ttsText.value = ttsText.value.slice(0, MAX_TEXT_LENGTH.value)
  }

  try {
    // 生成 UTC 时间戳（精确到秒）
    const tstamp = Math.floor(Date.now() / 1000)
    const { generateSignature } = useSignature()
    const snature = generateSignature(ttsText.value, tstamp)

    const data = await $fetch(`${apiHost}/api/genaudio`, {
      method: 'POST',
      timeout: 180000, // 3分钟超时
      body: {
        modelcat: selectedCategory.value,
        modelname: selectedModel.value,
        // modellang: selectedLanguage.value,  // 首页支持多语言，不用传递 modellang
        text: ttsText.value,
        subscript: userSubscript.value,
        email: userEmail.value,
        userid: uid.value,
        t: 1,
        tstamp,
        snature,
        domain: 'aivoicelab.net'
      }
    })

    if (data?.ret === 0 && data?.uri) {
      // 直接保存完整的 URI
      convertedAudio.value = data.uri
      audioList.value.length = 0
      audioList.value.push(host + data.uri)
      
      // 更新用户字符计数（仅在登录状态下）
      if (isLoggedIn.value && userEmail.value) {
        try {
          updateUserCounter(userEmail.value, ttsText.value.length)
        } catch (err) {
          reportError(err, `Error updating user counter - pageUrl: ${pageUrl.value}`, uid.value, userEmail.value)
        }
      }
      
      // 记录行为
      trackAction({
        email: userEmail.value,
        action: ActionType.TTS_GENERATE,
        domain: 'aivoicelab.net',
        modelcat: selectedCategory.value,
        modelname: selectedModel.value,
        uid: uid.value
      })
    } else if (data?.ret === 2) {
      ret = data.ret
      msg = t('ai_cover.converter.errors.tts.limitExceeded')
      return [ret, msg]
    } else {
      ret = data.ret
      msg = data?.msg
      reportError(new Error(data?.msg), `TTS Generation failed - pageUrl: ${pageUrl.value}`)
      return [ret, msg]
    }
    return [ret, msg]
  } catch (err) {
    ret = 1
    msg = t('ai_cover.converter.errors.serverBusy')
    reportError(err, `TTS Generation failed - pageUrl: ${pageUrl.value}`, uid.value, userEmail.value)
    return [ret, msg]
  }
}

// 修改 handleConvert 函数，确保生成后播放的是最新音频
const handleConvert = async () => {

  if (!selectedModel.value || !selectedCategory.value) {
    toast.error(t('ai_cover.converter.model.selectError'), {
      position: 'top-right',
      duration: 3000
    })
    return
  }

  isConverting.value = true

  let ret = 0
  let msg = t('ai_cover.converter.generate.success')
  try {
    // 清除之前的音频状态，确保不会播放旧的音频
    if (audioPlayer.isPlaying.value) {
      await audioPlayer.pauseAudio()
    }

    // 重置音频状态
    convertedAudio.value = null
    // 不使用不存在的 resetAudio 方法
    // 而是使用 cleanup 方法，它会重置所有音频状态
    audioPlayer.cleanup()

    if (currentTab.value === 'cover') {
      if (!selectedGender.value) {
        toast.error(t('ai_cover.converter.gender.selectError'), {
          position: 'top-right',
          duration: 3000
        })
        return
      }
      // 翻唱转化时，必须登录, sample除外
      if (!isLoggedIn.value && currentSubTab.value !== 'sample') {
        showLoginModal()
        trackAction({
          email: userEmail.value,
          action: ActionType.COVER_SONG_GENPOP_LOGIN,
          domain: 'aivoicelab.net',
          modelcat: selectedCategory.value,
          modelname: selectedModel.value,
          uid: uid.value
        })
        return
      }
      const { dayCount, monthCount } = await actionCounts({
        email: userEmail.value,
        uid: uid.value,
        action: ActionType.COVER_SONG_GENERATE,
        domain: 'aivoicelab.net'
      })
      // 需要先判断是否订阅， sample时不用判断了
      if (currentSubTab.value !== 'sample') {
        if (userSubscript.value === 1) {
          // 订阅用户：检查剩余次数
          const { checkQuota } = useQuotaCheck()
          const quotaResult = await checkQuota(QuotaType.COVER, () => {
            // 设置 quotaTypeForModal，watch 会自动触发显示弹窗
            quotaTypeForModal.value = 'cover'
          })
          if (!quotaResult.canUse) {
            showPayModal.value = true
            return
          }
        } else {
          // 未订阅用户：使用原有的次数限制逻辑
          if (dayCount >= 1 || monthCount >= 3) {
            showPayModal.value = true
            trackAction({
              email: userEmail.value,
              action: ActionType.COVER_SONG_GENPOP_SUBSCRIPT,
              domain: 'aivoicelab.net',
              modelcat: selectedCategory.value,
              modelname: selectedModel.value,
              uid: uid.value
            })
            return
          }
        }
      }

      const result = await handleCover()
      ret = result[0]
      msg = result[1]
    } else if (currentTab.value === 'tts') {
      const { dayCount, monthCount } = await actionCounts({
        email: userEmail.value,
        uid: uid.value,
        action: ActionType.TTS_GENERATE,
        domain: 'aivoicelab.net'
      })
      if (!isLoggedIn.value) {
        // 当未登录时，当天生成4次，当月生成8次时，需要登录
        if (dayCount >= 4 || monthCount >= 8) {
          showLoginModal()
          trackAction({
            email: userEmail.value,
            action: ActionType.TTS_GENPOP_LOGIN,
            domain: 'aivoicelab.net',
            modelcat: selectedCategory.value,
            modelname: selectedModel.value,
            uid: uid.value
          })
          return
        }
      } else {
        // 当已登录时, 检查剩余字符数（对于订阅用户）
        if (userSubscript.value === 1) {
          // 订阅用户：检查剩余字符数
          const { checkQuota } = useQuotaCheck()
          const quotaResult = await checkQuota(QuotaType.TTS, () => {
            // 设置 quotaTypeForModal，watch 会自动触发显示弹窗
            quotaTypeForModal.value = 'tts'
          })
          if (!quotaResult.canUse) {
            showPayModal.value = true
            return
          }
        } else {
          // 未订阅用户：使用原有的次数限制逻辑
          if (dayCount >= 5 || monthCount >= 10) {
            showPayModal.value = true
            trackAction({
              email: userEmail.value,
              action: ActionType.TTS_GENPOP_SUBSCRIPT,
              domain: 'aivoicelab.net',
              modelcat: selectedCategory.value,
              modelname: selectedModel.value,
              uid: uid.value
            })
            return
          }
        }
      }

      const result = await handleTTS()
      ret = result[0]
      msg = result[1]
    }
    if (ret === 0) {
      toast.success(msg, {
        position: 'top-right',
        duration: 1000
      })
    } else if (ret === 2) {
      showPayModal.value = true
      let action = ActionType.TTS_GENPOP_SUBSCRIPT
      if (currentTab.value === 'cover') {
        action = ActionType.COVER_SONG_GENPOP_SUBSCRIPT
      }
      trackAction({
        email: userEmail.value,
        action: action,
        domain: 'aivoicelab.net',
        modelcat: selectedCategory.value,
        modelname: selectedModel.value,
        uid: uid.value
      })
    } else {
      toast.error(msg, {
        position: 'top-right',
        duration: 3000
      })
      reportError(new Error(msg), `Cover Convert failed, ret:${ret} - pageUrl: ${pageUrl.value}`, uid.value, userEmail.value)
    }
  } catch (err) {
    msg = t('ai_cover.converter.errors.serverBusy')
    toast.error(msg, {
      position: 'top-right',
      duration: 3000
    })
    reportError(err, `Cover Convert failed - pageUrl: ${pageUrl.value}`, uid.value, userEmail.value)
  } finally {
    isConverting.value = false
  }
}

// 修改下载音频的处理函数
const handleDownload = async () => {
  if (!convertedAudio.value) {
    toast.error(t('ai_cover.converter.download.noAudio'), {
      position: 'top-right',
      duration: 3000
    })
    return
  }

  // 添加参数验证
  if (typeof convertedAudio.value !== 'string') {
    reportError(
      new Error(`Invalid convertedAudio.value type: ${typeof convertedAudio.value}, value: ${convertedAudio.value}`),
      `Download failed - invalid convertedAudio.value - pageUrl: ${pageUrl.value}`,
      uid.value,
      userEmail.value
    )
    toast.error(t('ai_cover.converter.download.invalidAudio'), {
      position: 'top-right',
      duration: 3000
    })
    return
  }

  if (!isLoggedIn.value) {
    showLoginModal()
    let action = ActionType.TTS_DOWNLOAD_LOGIN
    if (currentTab.value === 'cover') {
      action = ActionType.COVER_SONG_DOWNLOAD_LOGIN
    }
    trackAction({
      email: userEmail.value,
      action: action,
      domain: 'aivoicelab.net',
      modelcat: selectedCategory.value,
      modelname: selectedModel.value,
      uid: uid.value
    })
    return
  }

  if (userSubscript.value !== 1) {
    try {
      // cover下载必须付费
      if (currentTab.value === 'cover') {
        showPayModal.value = true
        trackAction({
          email: userEmail.value,
          action: ActionType.COVER_SONG_DOWNPOP_SUBSCRIPT,
          domain: 'aivoicelab.net',
          modelcat: selectedCategory.value,
          modelname: selectedModel.value,
          uid: uid.value
        })
        return
      }
      const { dayCount, monthCount } = await actionCounts({
        email: userEmail.value,
        uid: uid.value,
        action: ActionType.TTS_DOWNLOAD,
        domain: 'aivoicelab.net',
      })
      // tts下载当天免费1次，当月免费2次
      if (dayCount >= 1 || monthCount >= 2) {
        showPayModal.value = true
        trackAction({
          email: userEmail.value,
          action: ActionType.TTS_DOWNPOP_SUBSCRIPT,
          domain: 'aivoicelab.net',
          modelcat: selectedCategory.value,
          modelname: selectedModel.value,
          uid: uid.value
        })
        return
      }
    } catch (err) {
      reportError(err as Error, (err as any).message || `Action counts check failed - pageUrl: ${pageUrl.value}`, uid.value, userEmail.value)
    }
  }

  try {
    // 修复 URL 重复问题，安全地处理 convertedAudio.value
    const audioUrl = convertedAudio.value.includes('http')
      ? convertedAudio.value
      : convertedAudio.value.startsWith('/')
        ? `${host}${convertedAudio.value}`
        : `${host}/${convertedAudio.value}`

    // 上报调整到download之前，在手机端下载后会导致安全级别变化，而导致无法上报
    let action = ActionType.TTS_DOWNLOAD
    if (currentTab.value === 'cover') {
      action = ActionType.COVER_SONG_DOWNLOAD
    }
    await trackAction({
      email: userEmail.value,
      action: action,
      domain: 'aivoicelab.net',
      modelcat: selectedCategory.value,
      modelname: selectedModel.value,
      uid: uid.value
    })

    // 生成文件名
    const filename = `tts-${Date.now()}.mp3`
    await audioPlayer.downloadAudio(audioUrl, filename)


    toast.success(t('ai_cover.converter.download.success'), {
      position: 'top-right',
      duration: 2000
    })
  } catch (err) {
    toast.error(t('ai_cover.converter.download.failed'), {
      position: 'top-right',
      duration: 3000
    })
    reportError(err, `Cover ${currentTab.value} Download failed - pageUrl: ${pageUrl.value}`, uid.value, userEmail.value)
  }
}

// 修改判断播放状态的方法
const isPlayingPreview = (modelId) => {
  const audioId = `audio-${modelId}`
  return audioPlayer.audioId.value === audioId &&
    audioPlayer.isPlaying.value &&
    !audioPlayer.isLoading.value
}

// play audio preview
const playAudioPreview = async (model, event) => {
  event.preventDefault()

  // 添加参数验证
  if (!model || !model.exampleAudio || typeof model.exampleAudio !== 'string') {
    reportError(
      new Error(`Invalid model or model.exampleAudio: ${JSON.stringify(model)}`),
      `Play audio preview failed - invalid model - pageUrl: ${pageUrl.value}`,
      uid.value,
      userEmail.value
    )
    return
  }

  if (!model.modelid) {
    reportError(
      new Error(`Invalid model.modelid: ${model.modelid}`),
      `Play audio preview failed - invalid model.modelid - pageUrl: ${pageUrl.value}`,
      uid.value,
      userEmail.value
    )
    return
  }

  const audioId = `audio-${model.modelid}`

  // 使用 requestAnimationFrame 优化音频预览播放，减少 INP
  requestAnimationFrame(async () => {
    try {
      // 如果当前正在播放这个音频，则停止播放
      if (audioPlayer.audioId.value === audioId && audioPlayer.isPlaying.value) {
        await audioPlayer.pauseAudio()
        return
      }

      // 如果有其他音频在播放，先停止它
      if (audioPlayer.isPlaying.value) {
        await audioPlayer.pauseAudio()
      }

      // 延迟播放新音频，避免阻塞UI
      requestAnimationFrame(async () => {
        try {
          await audioPlayer.playAudio(model.exampleAudio, audioId, cdnHost)
        } catch (err) {
          reportError(err, `Play audio preview failed - pageUrl: ${pageUrl.value}`, uid.value, userEmail.value)
        }
      })
    } catch (err) {
      reportError(err, `Play audio preview failed - pageUrl: ${pageUrl.value}`, uid.value, userEmail.value)
    }
  })
}

onErrorCaptured((err, instance, info) => {
  // 上报错误
  reportError(err, `Global error in AICoverConverter - pageUrl: ${pageUrl.value}, errorInfo: ${info}`, uid.value, userEmail.value)

  // 返回 false 阻止错误继续传播
  return false
})

onMounted(() => {
  // 将用户状态初始化移到 mounted 钩子中
  nextTick(() => {
    userStore.initUserState()
    isInitialized.value = true
    fetchUserSubscription()
  })

  getGoogleSearchKeyword(pageUrl.value)

  if (process.client) {
    window.addEventListener('unhandledrejection', handleUnhandledRejection)
    window.addEventListener('error', handleError)
  }
})

// 注意：服务端数据预取已由同步初始化函数 initializeFromProps() 处理
// 该函数在 props 定义后立即执行，确保服务端和客户端状态一致

const modelListContainer = ref(null)
const selectedModelRef = ref(null)

// 添加性能优化相关的变量
const scrollTimeout = ref(null)

// 模态框相关
// const showCategoryModal = ref(false)

watch(() => selectedModel.value, (newValue) => {
  if (newValue) {
    nextTick(() => {
      if (selectedModelRef.value && modelListContainer.value) {
        selectedModelRef.value.scrollIntoView({
          behavior: 'auto',
          block: 'nearest'
        })
      }
    })
  }
})

// 修改错误处理函数，添加更多上下文信息
const handleUnhandledRejection = (event) => {
  const errorDetails = {
    message: event.reason?.message || String(event.reason),
    stack: event.reason?.stack,
    type: event.type,
    timestamp: new Date().toISOString(),
    url: pageUrl.value,
    componentState: {
      currentTab: currentTab.value,
      currentSubTab: currentSubTab.value,
      isConverting: isConverting.value,
      isUploading: isUploading.value,
      isRecording: isRecording.value
    }
  }


  reportError(
    event.reason,
    `Unhandled Promise rejection in AICoverConverter - pageUrl: ${pageUrl.value}, Details: ${JSON.stringify(errorDetails)}`,
    uid.value,
    userEmail.value
  )
}

const handleError = (event) => {
  const errorDetails = {
    message: event.message,
    filename: event.filename,
    lineno: event.lineno,
    colno: event.colno,
    stack: event.error?.stack,
    type: event.type,
    timestamp: new Date().toISOString(),
    url: pageUrl.value,
    componentState: {
      currentTab: currentTab.value,
      currentSubTab: currentSubTab.value,
      isConverting: isConverting.value,
      isUploading: isUploading.value,
      isRecording: isRecording.value
    }
  }


  reportError(
    event.error || new Error(event.message),
    `Runtime error in AICoverConverter - pageUrl: ${pageUrl.value}, Details: ${JSON.stringify(errorDetails)}`,
    uid.value,
    userEmail.value
  )
}

// handleFileDrop 已移除，AudioUploader 组件内部已处理拖拽上传

// 在组件卸载时清理事件监听器
onUnmounted(() => {
  try {
    // 确保所有资源都被正确清理
    if (audioPlayer.audioElement) {
      audioPlayer.audioElement.src = ''
      audioPlayer.audioElement.load()
    }

    // 清理 URL 对象
    if (uploadedFileUrl.value) {
      URL.revokeObjectURL(uploadedFileUrl.value)
      uploadedFileUrl.value = null
      uploadedAudioList.value.length = 0
    }

    // 停止所有正在进行的操作
    if (mediaRecorder.value) {
      if (isRecording.value) {
        try {
          mediaRecorder.value.stop()
          mediaRecorder.value.stream?.getTracks().forEach(track => track.stop())
        } catch (err) {
          reportError(err, `Stop media recorder failed - pageUrl: ${pageUrl.value}`, uid.value, userEmail.value)
        }
      }
      mediaRecorder.value = null
    }

    // 清理事件监听器
    if (process.client) {
      window.removeEventListener('unhandledrejection', handleUnhandledRejection)
      window.removeEventListener('error', handleError)
    }

    // 重置所有状态
    isConverting.value = false
    isUploading.value = false
    isRecording.value = false
    convertedAudio.value = null
    uploadedFile.value = null
    audioChunks.value = []
    audioList.value.length = 0
    uploadedAudioList.value.length = 0

  } catch (err) {
    reportError(err as Error, (err as any).message || `Cleanup failed - pageUrl: ${pageUrl.value}`, uid.value, userEmail.value)
  }
})

// 添加性能监控
const performanceMetrics = ref({
  categoryChangeTime: 0,
  modelSelectTime: 0,
  lastInteractionTime: 0
})

// 优化的分类选择处理函数
const handleCategorySelectOptimized = (catid) => {
  const startTime = performance.now()

  // 立即更新关键状态以响应用户交互
  selectedCategory.value = catid

  // 使用时间切片处理副作用，分批处理任务
  const performBatchUpdates = () => {
    // 第一批：立即处理关键状态
    convertedAudio.value = null
    isConverting.value = false

    // 第二批：在下一个微任务中处理音频相关操作
    Promise.resolve().then(() => {
      if (audioPlayer.isPlaying.value) {
        audioPlayer.pauseAudio()
      }

      // 记录性能指标
      performanceMetrics.value.categoryChangeTime = performance.now() - startTime
    })
  }

  // 优先使用 scheduler.postTask（最新的浏览器API）
  if (typeof scheduler !== 'undefined' && scheduler.postTask) {
    // 高优先级任务：立即响应用户
    scheduler.postTask(performBatchUpdates, { priority: 'user-blocking' })
  } else if ('requestIdleCallback' in window) {
    // 降级方案1：使用 requestIdleCallback
    requestIdleCallback(performBatchUpdates, { timeout: 16 }) // 一帧的时间
  } else {
    // 降级方案2：使用 setTimeout(0)
    setTimeout(performBatchUpdates, 0)
  }
}

// 优化的模型选择处理函数
const handleModelSelectOptimized = (modelId) => {
  const startTime = performance.now()
  // 立即更新关键状态，不阻塞UI
  selectedModel.value = modelId

  // 优化滚动处理，使用节流而不是防抖
  if (scrollTimeout.value) {
    clearTimeout(scrollTimeout.value)
  }

  // 使用较短的延迟提高响应性
  scrollTimeout.value = setTimeout(() => {
    // 分离DOM查询和滚动操作
    const performScroll = () => {
      const element = selectedModelRef.value
      const container = modelListContainer.value

      if (element && container && !isElementInViewport(element, container)) {
        // 使用passive scrolling避免阻塞
        element.scrollIntoView({
          behavior: 'auto', // 移除smooth动画减少计算开销
          block: 'nearest'
        })
      }

      // 记录性能指标
      performanceMetrics.value.modelSelectTime = performance.now() - startTime
    }

    // 使用 scheduler 或 requestAnimationFrame 确保在合适的时机执行
    if (typeof scheduler !== 'undefined' && scheduler.postTask) {
      scheduler.postTask(() => {
        nextTick(performScroll)
      }, { priority: 'background' })
    } else {
      requestAnimationFrame(() => {
        nextTick(performScroll)
      })
    }

    scrollTimeout.value = null
  }, 8) // 减少延迟从10ms到8ms
}

// 使用事件代理的模型选择处理器
const handleModelListClick = (event) => {
  const target = event.target.closest('[data-model-id]')
  if (target) {
    const modelId = target.getAttribute('data-model-id')
    if (modelId) {
      handleModelSelectOptimized(modelId)
    }
  }
}

// 滚动处理函数 - 节流处理
let scrollThrottleTimeout = null
const handleListScroll = (event) => {
  if (scrollThrottleTimeout) return

  scrollThrottleTimeout = setTimeout(() => {
    // 可以在这里添加虚拟滚动逻辑
    // 或其他滚动相关的性能优化
    scrollThrottleTimeout = null
  }, 16) // 60fps
}

// 检查元素是否在容器可视区域内的工具函数
const isElementInViewport = (element: HTMLElement, container: HTMLElement): boolean => {
  if (!element || !container) return false

  const elementRect = element.getBoundingClientRect()
  const containerRect = container.getBoundingClientRect()

  // 检查元素是否在容器的可视区域内
  return (
    elementRect.top >= containerRect.top &&
    elementRect.bottom <= containerRect.bottom &&
    elementRect.left >= containerRect.left &&
    elementRect.right <= containerRect.right
  )
}

// 处理分类变化的函数
const handleCategoryChange = () => {
  // 当分类改变时，重置相关状态
  convertedAudio.value = null
  isConverting.value = false

  // 停止当前播放的音频
  if (audioPlayer.isPlaying.value) {
    audioPlayer.pauseAudio()
  }

  // 选择新分类下的第一个模型
  if (selectedCategory.value) {
    const currentCategory = categoryMap.value.get(selectedCategory.value)
    if (currentCategory?.options?.length > 0) {
      selectedModel.value = currentCategory.options[0].modelid
    }
  }
}

// 在组件卸载时清理
onUnmounted(() => {
  if (scrollTimeout.value) {
    clearTimeout(scrollTimeout.value)
  }
  if (scrollThrottleTimeout) {
    clearTimeout(scrollThrottleTimeout)
  }
})

// 在开发环境下输出性能指标
if (process.dev) {
  watch(performanceMetrics, (newMetrics) => {
    if (newMetrics.categoryChangeTime > 50) {
      console.warn(`Category change took ${newMetrics.categoryChangeTime.toFixed(2)}ms`)
    }
    if (newMetrics.modelSelectTime > 30) {
      console.warn(`Model select took ${newMetrics.modelSelectTime.toFixed(2)}ms`)
    }
  }, { deep: true })
}

</script>

<style scoped>
/* 优化的INP性能样式 */
.inp-optimized {
  will-change: transform, background-color;
  transform: translate3d(0, 0, 0);
  /* 强制硬件加速 */
  contain: layout style paint;
  backface-visibility: hidden;
  /* 减少复合层开销 */
  isolation: isolate;
}

.model-list-item {
  will-change: background-color;
  transform: translate3d(0, 0, 0);
  contain: layout style paint;
  backface-visibility: hidden;
  /* 优化内容可见性 */
  content-visibility: auto;
  contain-intrinsic-size: auto 88px;
  /* 设置固定高度避免布局抖动 */
  /* 减少鼠标事件处理开销 */
  pointer-events: auto;
}

.transition-optimized {
  /* 简化transition，只处理关键属性 */
  transition: background-color 0.08s ease-out;
  will-change: background-color;
}

.tab-button-optimized {
  will-change: background, color;
  transform: translate3d(0, 0, 0);
  contain: layout style paint;
  backface-visibility: hidden;
  /* 减少合成层创建 */
  content-visibility: auto;
  /* 优化点击响应 */
  touch-action: manipulation;
}

.category-button-optimized {
  will-change: background-color, border-color;
  transform: translate3d(0, 0, 0);
  contain: layout style paint;
  backface-visibility: hidden;
  content-visibility: auto;
  touch-action: manipulation;
}

.audio-preview-button {
  will-change: background;
  transform: translate3d(0, 0, 0);
  contain: layout style paint;
  backface-visibility: hidden;
  /* 优化点击响应 */
  touch-action: manipulation;
  user-select: none;
  /* 减少repaint */
  border-radius: 50%;
  overflow: hidden;
}

/* 列表容器优化 */
.scrollable-container {
  contain: layout style;
  will-change: scroll-position;
  transform: translate3d(0, 0, 0);
  /* 使用更快的滚动 */
  scroll-behavior: auto;
  /* 启用硬件加速滚动 */
  -webkit-overflow-scrolling: touch;
  /* 优化滚动性能 */
  overflow: auto;
  /* 减少不必要的重绘 */
  isolation: isolate;
}

/* 减少列表项的重排重绘 */
.model-list-item:hover {
  /* 避免创建新的合成层 */
  background-color: rgb(249 250 251);
  /* 使用具体颜色值避免计算 */
}

/* Listbox 优化 */
.listbox-option-optimized {
  will-change: background-color;
  transform: translate3d(0, 0, 0);
  contain: layout style;
  backface-visibility: hidden;
  touch-action: manipulation;
  user-select: none;
  /* 优化点击区域 */
  cursor: pointer;
  /* 减少样式计算开销 */
  position: relative;
}

/* 减少动画开销 */
.animate-spin-optimized {
  will-change: transform;
  transform: translate3d(0, 0, 0);
  contain: layout style;
  /* 使用 CSS 动画而不是 JS 动画 */
  animation: spin-optimized 1s linear infinite;
}

/* 优化的旋转动画 */
@keyframes spin-optimized {
  from {
    transform: translate3d(0, 0, 0) rotate(0deg);
  }

  to {
    transform: translate3d(0, 0, 0) rotate(360deg);
  }
}

/* 优化图片加载 */
.image-container-optimized img {
  will-change: auto;
  /* 移除不必要的will-change */
  transform: translate3d(0, 0, 0);
  /* 避免图片导致的重排 */
  object-fit: cover;
  object-position: center;
  /* 优化图片渲染 */
  image-rendering: -webkit-optimize-contrast;
  image-rendering: optimizeQuality;
}


/* 优化transition效果 */
.vue-enter-active,
.vue-leave-active {
  transition: opacity 0.1s ease-out;
  will-change: opacity;
}

.vue-enter-from,
.vue-leave-to {
  opacity: 0;
}

/* 减少CSS计算开销 */
* {
  /* 统一box-sizing避免重复计算 */
  box-sizing: border-box;
}

/* 优化渐变背景计算 */
.bg-gradient-to-r {
  /* 缓存渐变结果 */
  background-image: linear-gradient(to right, var(--tw-gradient-stops));
  background-attachment: local;
}

.scrollbar-hide {
  -ms-overflow-style: none;
  scrollbar-width: none;
}

.scrollbar-hide::-webkit-scrollbar {
  display: none;
}

.voice-categories {
  scroll-behavior: auto;
}

.divide-y> :not([hidden])~ :not([hidden]) {
  --tw-divide-y-reverse: 0;
  border-top-width: calc(1px * calc(1 - var(--tw-divide-y-reverse)));
  border-bottom-width: calc(1px * var(--tw-divide-y-reverse));
}

.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.2s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.voice-categories-wrapper {
  position: relative;
}

.voice-categories-wrapper .flex {
  -ms-overflow-style: none;
  scrollbar-width: none;
}

.voice-categories-wrapper .flex::-webkit-scrollbar {
  display: none;
}

.vue-audio-player__wrapper {
  display: flex;
}

.vue-audio-player__download {
  margin: 0 6px;
  cursor: pointer;
  touch-action: none;
  user-select: none;
  -webkit-user-drag: none;
  width: 45px;
  ;
}

.vue-audio-player__download svg {
  display: block;
  width: 45px;
  height: 45px;
}

.vue-audio-player__download svg path {
  /* 不覆盖 SVG 内部的 fill 属性，让渐变填充正常显示 */
}

.scrollable-container {
  scrollbar-width: thin;
  scrollbar-color: #d1d5db #f9fafb;
}

.scrollable-container::-webkit-scrollbar {
  width: 8px;
}

.scrollable-container::-webkit-scrollbar-track {
  background: #f9fafb;
}

.scrollable-container::-webkit-scrollbar-thumb {
  background-color: #d1d5db;
  border-radius: 4px;
}

.scrollable-container::-webkit-scrollbar-thumb:hover {
  background-color: #9ca3af;
}

.transition-optimized {
  transition: background-color 0.2s ease-in-out, border-color 0.2s ease-in-out;
}

.image-container-optimized {
  border: 1px solid rgba(0, 0, 0, 0.05);
}

.model-list-item:hover .image-container-optimized {
  border-color: rgba(0, 0, 0, 0.1);
}

.inp-optimized {
  transform: translateZ(0);
  /* 硬件加速 */
}

.animate-spin-optimized {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }

  to {
    transform: rotate(360deg);
  }
}

.tab-button-optimized {
  will-change: background-color, color;
}

.voice-select {
  width: 100%;
  padding: 0.75rem 2.5rem 0.75rem 1rem;
  border-radius: 0.75rem;
  border: 2px solid transparent;
  background:
    linear-gradient(white, white) padding-box,
    linear-gradient(90deg, #F1AC63, #D76FF4) border-box;
  font-size: 1rem;
  color: #222;
  appearance: none;
  transition: box-shadow 0.2s, border-color 0.2s;
  box-shadow: 0 2px 8px rgba(215, 111, 244, 0.08);
  position: relative;
}

.voice-select:focus {
  outline: none;
  border-color: #D76FF4;
  box-shadow: 0 0 0 2px #F1AC6333;
}

.voice-select:hover {
  border-color: #F1AC63;
}

.voice-select option {
  color: #222;
  background: #fff;
}

.voice-select:disabled {
  background: #f5f5f5;
  color: #aaa;
}

.voice-select::-ms-expand {
  display: none;
}

.voice-select-wrapper {
  position: relative;
}

.voice-select-wrapper svg {
  position: absolute;
  right: 1rem;
  top: 50%;
  transform: translateY(-50%);
  pointer-events: none;
  width: 1.25rem;
  height: 1.25rem;
  color: #D76FF4;
}

.custom-select {
  width: 100%;
  padding: 0.4rem 2rem 0.4rem 0.5rem;
  border-radius: 0.5rem;
  border: 1.5px solid #d1d5db;
  font-size: 0.95rem;
  color: #222;
  background: #fff;
  box-sizing: border-box;
  line-height: 1.5;
  min-height: 2.2rem;
  appearance: none;
  -webkit-appearance: none;
  -moz-appearance: none;
}

.custom-select:focus {
  outline: none !important;
  box-shadow: none !important;
  border-color: #d1d5db !important;
}

.custom-select:hover {
  border-color: #45a049 !important;
}

.select-arrow {
  content: '';
  position: absolute;
  right: 10px;
  top: 50%;
  width: 0;
  height: 0;
  border-left: 5px solid transparent;
  border-right: 5px solid transparent;
  border-top: 5px solid #666;
  transform: translateY(-50%);
  pointer-events: none;
  z-index: 2;
}

/* textarea INP性能优化 - 解决288ms问题 */
.tts-textarea-optimized {
  flex: 1;
  width: 100%;
  padding: 1rem;
  resize: none;
  border: 0;
  overflow-y: auto;
  border-radius: 0 0 0.5rem 0.5rem;
  outline: none;
  /* 硬件加速 - 关键优化 */
  transform: translate3d(0, 0, 0);
  will-change: transform;
  /* 减少重排重绘 - 关键优化 */
  contain: layout style paint;
  backface-visibility: hidden;
  /* 优化字体渲染 */
  font-display: optional;
  /* 减少合成层创建 */
  isolation: isolate;
  /* 优化滚动 */
  -webkit-overflow-scrolling: touch;
  /* 安卓虚拟键盘优化 */
  touch-action: manipulation;
  /* 防止键盘弹出时的视口变化 */
  position: relative;
  z-index: 1;
}

/* 桌面端高度 */
@media screen and (min-width: 769px) {
  .tts-textarea-optimized {
    height: 280px;
    min-height: 250px;
    max-height: 350px;
  }
}

/* 移动端高度优化 */
@media screen and (max-width: 768px) {
  .tts-textarea-optimized {
    /* 移动端更大的高度，提升用户体验 */
    height: 200px;
    min-height: 180px;
    /* 移除max-height限制，让textarea自由伸缩 */
    /* 减少重排 */
    contain: layout style paint;
    /* 优化触摸响应 */
    touch-action: manipulation;
    /* 防止键盘弹出时的布局变化 */
    position: relative;
  }

  /* 移动端容器优化 */
  .textarea-container {
    /* 更大的容器高度 */
    min-height: 350px;
    /* 减少重排 */
    contain: layout style;
    /* 防止键盘弹出时的视口变化 */
    position: relative;
  }
}

/* 小屏手机特殊优化 */
@media screen and (max-width: 480px) {
  .tts-textarea-optimized {
    height: 160px;
    min-height: 140px;
    /* 移除max-height限制 */
    padding: 0.75rem;
  }
}

/* 焦点状态优化 */
.textarea-container:focus-within {
  border-color: #ec4899;
  box-shadow: 0 0 0 2px rgba(236, 72, 153, 0.1);
  transition: border-color 0.1s ease-out, box-shadow 0.1s ease-out;
}
</style>
