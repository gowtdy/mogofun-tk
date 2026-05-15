<template>
  <div class="bg-gradient-to-b from-blue-50 to-white">
    <nav class="bg-white shadow-sm">
      <div class="container mx-auto px-4 py-3 flex items-center justify-between">
        <!-- 左侧Logo部分 -->
        <div class="flex items-center">
          <NuxtLink 
            :to="localizedPath('/')" 
            class="flex items-center"
            title="Free AI Cover & AI Voice Over - home"
          >
            <img :src="cdnHost + '/img/mogofun_logo.svg'" alt="Free AI Cover Logo" width="55" height="50" class="h-12 w-auto mr-3" />
            <img :src="cdnHost + '/img/mogofun_word.svg'" alt="Free AI Voice Over Logo word" width="115" height="30" class="h-8 w-auto" />
            <span class="sr-only">Free AI Cover & AI Voice Over</span>
          </NuxtLink>
        </div>
        
        <!-- 中间导航链接部分 -->
        <div class="hidden md:flex items-center space-x-8">
          <NuxtLink 
            :to="localizedPath('/')" 
            title="AI Cover" 
            class="text-gray-700 hover:text-primary transition duration-300 font-medium router-link-active:shadow-md px-2"
          >{{ $t('comm.home') }}</NuxtLink>
          <!-- 音频下拉框 -->
          <div class="relative" @mouseenter="handleAudioMenuEnter" @mouseleave="handleAudioMenuLeave">
            <div class="flex items-center cursor-pointer group px-2">
              <button class="text-gray-700 hover:text-primary transition duration-300 font-medium">
                {{ $t('comm.audio') }}
              </button>
              <svg 
                class="w-4 h-4 ml-1 transition-transform duration-300" 
                :class="{ 'rotate-180': showAudioMenu }"
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
              </svg>
            </div>
            <div 
              v-show="showAudioMenu" 
              class="absolute bg-white border mt-2 rounded shadow-lg w-48 z-50"
              @mouseenter="handleAudioMenuEnter"
              @mouseleave="handleAudioMenuLeave"
            >
              <NuxtLink 
                :to="localizedPath('/sound-effect')" 
                class="block px-4 py-2 hover:bg-gray-100 text-gray-700"
                title="AI Sound Effect Generator"
                @click="showAudioMenu = false"
              >{{ $t('comm.soundEffects') }}</NuxtLink>
              <NuxtLink 
                :to="localizedPath('/vocal-isolator')" 
                class="block px-4 py-2 hover:bg-gray-100 text-gray-700"
                title="Vocal Isolator"
                @click="showAudioMenu = false"
              >{{ $t('comm.vocalIsolation') }}</NuxtLink>
              <NuxtLink 
                :to="localizedPath('/vocal-remover')" 
                class="block px-4 py-2 hover:bg-gray-100 text-gray-700"
                title="Vocal Remover"
                @click="showAudioMenu = false"
              >{{ $t('comm.vocalRemover') }}</NuxtLink>
            </div>
          </div>
          <!-- 视频下拉框 -->
          <div class="relative" @mouseenter="handleVideoMenuEnter" @mouseleave="handleVideoMenuLeave">
            <div class="flex items-center cursor-pointer group">
              <button class="text-gray-700 hover:text-primary transition duration-300 font-medium">
                {{ $t('comm.video') }}
              </button>
              <svg 
                class="w-4 h-4 ml-1 transition-transform duration-300" 
                :class="{ 'rotate-180': showVideoMenu }"
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
              </svg>
            </div>
            <div 
              v-show="showVideoMenu" 
              class="absolute bg-white border mt-2 rounded shadow-lg w-48 z-50"
              @mouseenter="handleVideoMenuEnter"
              @mouseleave="handleVideoMenuLeave"
            >
              <NuxtLink :to="localizedPath('/audio-extractor')" class="block px-4 py-2 hover:bg-gray-100 text-gray-700">{{ $t('comm.audioExtraction') }}</NuxtLink>
            </div>
          </div>
          <!-- More下拉框 -->
          <div class="relative" @mouseenter="handleMoreMenuEnter" @mouseleave="handleMoreMenuLeave">
            <div class="flex items-center cursor-pointer group">
              <button class="text-gray-700 hover:text-primary transition duration-300 font-medium">
                {{ $t('comm.more') }}
              </button>
              <svg 
                class="w-4 h-4 ml-1 transition-transform duration-300" 
                :class="{ 'rotate-180': showMoreMenu }"
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
              </svg>
            </div>
            <div 
              v-show="showMoreMenu" 
              class="absolute bg-white border mt-2 rounded shadow-lg w-48 z-50"
              @mouseenter="handleMoreMenuEnter"
              @mouseleave="handleMoreMenuLeave"
            >
              <NuxtLink 
                :to="localizedPath('/pricing')" 
                class="block px-4 py-2 hover:bg-gray-100 text-gray-700"
                @click="showMoreMenu = false"
              >{{ $t('comm.pricing') }}</NuxtLink>
              <NuxtLink 
                :to="localizedPath('/settings')" 
                class="block px-4 py-2 hover:bg-gray-100 text-gray-700"
                @click="showMoreMenu = false"
              > {{ $t('comm.settings') }} </NuxtLink>
            </div>
          </div>
        </div>
        
        <!-- 右侧功能按钮部分 -->
        <div class="hidden md:flex items-center space-x-4">
          <LanguageSelector />
          <LoginButton class="h-10" />
        </div>
        
        <!-- 移动端菜单按钮 -->
        <div class="md:hidden">
          <button @click="isMenuOpen = !isMenuOpen" aria-label="AI Voice Over Menu" class="text-gray-500 hover:text-gray-700 focus:outline-none">
            <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </div>
    </nav>
    <!-- Mobile menu -->
    <Teleport to="body">
      <div v-if="isMenuOpen" class="fixed inset-0 z-50 bg-black bg-opacity-50" @click="isMenuOpen = false">
        <div class="fixed right-0 top-0 bottom-0 w-64 bg-white shadow-lg" @click.stop>
          <div class="p-4 space-y-4">
            <NuxtLink 
              :to="localizedPath('/')" 
              title="AI Voice Generator" 
              class="block text-gray-700 hover:text-primary transition duration-300 font-medium router-link-active:shadow-md" 
              @click="isMenuOpen = false"
            >{{ $t('comm.home') }}</NuxtLink>
            <div class="space-y-2">
              <div class="font-medium text-gray-700">{{ $t('comm.audio') }}</div>
              <NuxtLink 
                :to="localizedPath('/sound-effect')" 
                title="Sound Effects" 
                class="block pl-4 text-gray-700 hover:text-primary transition duration-300"
                @click="isMenuOpen = false"
              >{{ $t('comm.soundEffects') }}</NuxtLink>
              <NuxtLink 
                :to="localizedPath('/vocal-isolator')" 
                class="block px-4 py-2 hover:bg-gray-100 text-gray-700"
                title="Vocal Isolator"
                @click="showAudioMenu = false"
              >{{ $t('comm.vocalIsolation') }}</NuxtLink>
              <NuxtLink 
                :to="localizedPath('/vocal-remover')" 
                class="block px-4 py-2 hover:bg-gray-100 text-gray-700"
                title="Vocal Remover"
                @click="showAudioMenu = false"
              >{{ $t('comm.vocalRemover') }}</NuxtLink>
            </div>
            <div class="space-y-2">
              <div class="font-medium text-gray-700">{{ $t('comm.video') }}</div>
              <NuxtLink 
                :to="localizedPath('/audio-extractor')" 
                class="block pl-4 text-gray-700 hover:text-primary transition duration-300"
                title="Audio Extraction"
                @click="isMenuOpen = false"
              >{{ $t('comm.audioExtraction') }}</NuxtLink>
            </div>
            <div class="space-y-2">
              <div class="font-medium text-gray-700">{{ $t('comm.more') }}</div>
              <NuxtLink 
                :to="localizedPath('/pricing')" 
                class="block pl-4 text-gray-700 hover:text-primary transition duration-300"
                @click="isMenuOpen = false"
              >{{ $t('comm.pricing') }}</NuxtLink>
              <NuxtLink 
                :to="localizedPath('/settings')" 
                class="block pl-4 text-gray-700 hover:text-primary transition duration-300"
                @click="isMenuOpen = false"
              > {{ $t('comm.settings') }} </NuxtLink>
            </div>
            <LanguageSelector />
            <LoginButton class="w-full" />
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useUserStore } from '~/store/user'
import { config } from '~/config/config'
import { useI18n } from 'vue-i18n'

const cdnHost = config.cdnHost
const isMenuOpen = ref(false)
const showVoiceMenu = ref(false)
const showAudioMenu = ref(false)
const showVideoMenu = ref(false)
const showMoreMenu = ref(false)
let voiceMenuTimer = null
let audioMenuTimer = null
let videoMenuTimer = null
let moreMenuTimer = null

const userStore = useUserStore()
const isLoggedIn = computed(() => !!userStore.user)
const { locale } = useI18n()

// 处理音频菜单的鼠标进入事件
const handleVoiceMenuEnter = () => {
  clearTimeout(voiceMenuTimer)
  showVoiceMenu.value = true
}

// 处理音频菜单的鼠标离开事件
const handleVoiceMenuLeave = () => {
  voiceMenuTimer = setTimeout(() => {
    showVoiceMenu.value = false
  }, 300)
}

// 处理音频菜单的鼠标进入事件
const handleAudioMenuEnter = () => {
  clearTimeout(audioMenuTimer)
  showAudioMenu.value = true
}

// 处理音频菜单的鼠标离开事件
const handleAudioMenuLeave = () => {
  audioMenuTimer = setTimeout(() => {
    showAudioMenu.value = false
  }, 300)
}

// 处理视频菜单的鼠标进入事件
const handleVideoMenuEnter = () => {
  clearTimeout(videoMenuTimer)
  showVideoMenu.value = true
}

// 处理视频菜单的鼠标离开事件
const handleVideoMenuLeave = () => {
  videoMenuTimer = setTimeout(() => {
    showVideoMenu.value = false
  }, 300)
}

// 处理More菜单的鼠标进入事件
const handleMoreMenuEnter = () => {
  clearTimeout(moreMenuTimer)
  showMoreMenu.value = true
}

// 处理More菜单的鼠标离开事件
const handleMoreMenuLeave = () => {
  moreMenuTimer = setTimeout(() => {
    showMoreMenu.value = false
  }, 300)
}

// 清除定时器
const clearTimers = () => {
  if (voiceMenuTimer) clearTimeout(voiceMenuTimer)
  if (audioMenuTimer) clearTimeout(audioMenuTimer)
  if (videoMenuTimer) clearTimeout(videoMenuTimer)
  if (moreMenuTimer) clearTimeout(moreMenuTimer)
}

// 生成本地化路径的函数
const localizedPath = (path) => {
  // 如果是首页且语言是英文，直接返回 '/'
  if (path === '/' && locale.value === 'en') {
    return '/'
  }
  return `/${locale.value}${path}`
}

onMounted(() => {
  userStore.initUserState()
})

// 组件卸载时清除定时器
onUnmounted(() => {
  clearTimers()
})
</script>

<style>
.rotate-180 {
  transform: rotate(180deg);
}
</style>
