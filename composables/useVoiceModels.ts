import { ref, watch } from 'vue'
import { useAsyncData, useRequestEvent, useNuxtApp } from '#app'
import { useErrorReporter } from './errorReporter'
import { useRoute } from 'vue-router'

/**
 * 通用的 voiceModels 获取 composable
 * 解决客户端导航时缓存数据为空的问题
 */
export function useVoiceModels(options?: {
  pageUrl?: () => string
  onError?: (error: Error, message: string) => void
}) {
  const isLoading = ref(true)
  const { reportError } = useErrorReporter()
  const nuxtApp = useNuxtApp()
  const route = useRoute()
  
  const pageUrl = options?.pageUrl || (() => {
    if (process.client) {
      return window.location.href
    }
    return ''
  })

  const errorHandler = options?.onError || ((err: Error, msg: string) => {
    reportError(err, { component: 'useVoiceModels', action: 'fetchVoiceModels', message: msg })
  })

  // 通用的 voiceModels 获取逻辑，包含缓存处理
  const { data: voiceModels, refresh: refreshVoiceModels } = useAsyncData(
    'voiceModels',
    async () => {
      try {
        // 服务端渲染时优先使用上下文数据
        if (process.server) {
          const event = useRequestEvent()
          if (event?.context?.voiceModels) {
            isLoading.value = false
            return event.context.voiceModels
          }
        }
        
        // 客户端或服务端无数据时发起请求
        const response = await fetch('/api/voice-models')
        const data = await response.json()
        isLoading.value = false
        return data
      } catch (err) {
        const error = err instanceof Error ? err : new Error(String(err))
        errorHandler(error, `Error fetching voice models in url:${pageUrl()}`)
        isLoading.value = false
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

  return {
    voiceModels,
    isLoading,
    refreshVoiceModels
  }
}

