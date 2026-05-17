<template>
  <CharacterPageLayout
    :character-slug="characterConfig.slug"
    :header-image="`${cdnHost}${characterConfig.headerImage}`"
    :preload-image="`${cdnHost}${characterConfig.headerImage}`"
    :author="characterConfig.author"
    :views="characterConfig.views"
    :description="$t(`character.${characterConfig.slug}.description`)"
    :voice-models="voiceModels"
    :default-category="characterConfig.defaultCategory"
    :default-model="characterConfig.defaultModel"
    :is-logged-in="isLoggedIn"
    :intro-sections="introSections"
    :faqs="faqs"
    :faq-title="$t(`character.${characterConfig.slug}.faqs.title`)"
  />
</template>

<script setup lang="ts">
import { onErrorCaptured, onMounted, computed, withDefaults, watch } from 'vue'
import { useAsyncData, useNuxtApp, createError } from '#app'
import { useRoute } from 'vue-router'
import CharacterPageLayout from '~/components/CharacterPageLayout.vue'
import { useCharacterPage } from '~/composables/useCharacterPage'
import { useErrorReporter } from '~/composables/errorReporter'
import { useRequestEvent } from '#app'
import { config } from '~/config/config'
import { useWebVitals } from '~/composables/reportWebVital'
import { getCharacterConfig } from '~/config/characterConfigs'

interface Props {
  characterSlug: string
  dir?: string
}

const props = withDefaults(defineProps<Props>(), {
  dir: ''
})

// 添加web vitals监控
const { reportWebVital, startLCPReporting } = useWebVitals()
const { reportError } = useErrorReporter()

const pageUrl = computed(() => {
  if (process.client) {
    return window.location.href
  }
  return ''
})

// 获取角色配置
const characterConfig = getCharacterConfig(props.characterSlug)
if (!characterConfig) {
  reportError(new Error(`Character config not found for slug: ${props.characterSlug}`), 
        `Error in url:${pageUrl.value}`)
}

// const cdnHost = config.cdnHost
const cdnHost = process.dev ? config.localHost : config.cdnHost
const isServer = process.server
const event = useRequestEvent()

const {
  isLoggedIn,
  faqs,
  introSections,
  onPageError,
  initPage
} = useCharacterPage(characterConfig.slug, props.dir)

onErrorCaptured(onPageError)

onMounted(() => {
  // 使用requestAnimationFrame优先处理关键UI渲染
  requestAnimationFrame(() => {
    // 关键内容渲染完成后，才初始化其他非关键内容
    requestIdleCallback(() => {
      initPage()
    }, { timeout: 2000 })
  })
})

// 优化数据获取逻辑 - 使用 getCachedData 在客户端导航时强制刷新
const nuxtApp = useNuxtApp()
const route = useRoute()
const { data: voiceModels, refresh: refreshVoiceModels } = await useAsyncData(
  'voiceModels',
  async () => {
    try {
      // 服务端渲染时优先使用上下文数据
      if (process.server) {
        if (event?.context?.voiceModels) {
          return event.context.voiceModels
        }
      }

      // 客户端或服务端无数据时发起请求
      const response = await fetch('/api/voice-models')
      const data = await response.json()
      return data
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err))
      reportError(error, `Error in url:${pageUrl.value} - ${error.message}`)
      return []
    }
  },
  {
    lazy: false,
    server: true,
    immediate: true,
    // 在客户端导航时，如果数据为空或无效，返回 undefined 强制重新获取
    getCachedData: (key) => {
      if (process.client) {
        // 客户端导航时，如果缓存的数据为空数组，返回 undefined 强制刷新
        const cached = nuxtApp.payload.data[key]
        if (cached && Array.isArray(cached) && cached.length > 0) {
          return cached
        }
        // 如果缓存数据无效，返回 undefined 强制重新获取
        return undefined
      }
      // 服务端直接使用缓存
      return nuxtApp.payload.data[key]
    },
    transform: (data) => {
      // 确保返回的是数组
      return Array.isArray(data) ? data : []
    }
  }
)

// 监听路由变化，确保客户端导航时刷新数据
watch(() => route.fullPath, async (newPath, oldPath) => {
  // 只在客户端且路由确实变化时刷新
  if (process.client && newPath !== oldPath) {
    // 如果数据为空或无效，刷新数据
    if (!voiceModels.value || !Array.isArray(voiceModels.value) || voiceModels.value.length === 0) {
      await refreshVoiceModels()
    }
  }
}, { immediate: false })
</script> 