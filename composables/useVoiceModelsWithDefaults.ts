import { ref, watch } from 'vue'
import { useAsyncData, useRequestEvent } from '#app'

interface VoiceModelOption {
  modelid: string
  [key: string]: any
}

interface VoiceModel {
  catid: string
  options?: VoiceModelOption[]
  [key: string]: any
}

export function useVoiceModelsWithDefaults(
  apiEndpoint: string = '/api/voice-models',
  cacheKey: string = 'voiceModels',
  initialDefaultCategory: string = '',
  initialDefaultModel: string = ''
) {
  // 默认分类和模型
  const defaultCategory = ref(initialDefaultCategory)
  const defaultModel = ref(initialDefaultModel)
  
  console.log('defaultCategory', defaultCategory.value)
  console.log('defaultModel', defaultModel.value)
  console.log('initialDefaultCategory', initialDefaultCategory)
  console.log('initialDefaultModel', initialDefaultModel)
  // 使用 ref 存储数据
  const voiceModelsData = ref<VoiceModel[]>([])

  // 优化数据获取逻辑
  const { data: voiceModels, error, pending } = useAsyncData<VoiceModel[]>(
    cacheKey,
    async () => {
      try {
        // 服务端渲染时优先使用上下文数据
        if (process.server) {
          const event = useRequestEvent()
          if (event?.context?.voiceModels) {
            voiceModelsData.value = event.context.voiceModels
            return event.context.voiceModels
          }
        }

        // 客户端或服务端无数据时发起请求
        const response = await fetch(apiEndpoint)
        const data = await response.json()
        voiceModelsData.value = data
        return data
      } catch (error) {
        console.error('Error fetching voice models:', error)
        return []
      }
    },
    {
      lazy: false,
      server: true,
      immediate: true,
      transform: (data) => {
        // 确保返回的是数组
        return Array.isArray(data) ? data : []
      }
    }
  )

  // 监听数据变化，设置默认值
  watch(() => voiceModels.value, (newValue) => {
    console.log('newValue', newValue)
    if (newValue && Array.isArray(newValue) && newValue.length > 0) {
      console.log('initialDefaultCategory 11', initialDefaultCategory)
      console.log('defaultCategory.value 11', defaultCategory.value)
      console.log('initialDefaultModel 11', initialDefaultModel)
      console.log('defaultModel.value 11', defaultModel.value)
      // 只有在没有传入初始值时才自动设置默认分类和模型
      if (!initialDefaultCategory && !defaultCategory.value && newValue[0]) {
        defaultCategory.value = newValue[0].catid
        if (newValue[0].options && newValue[0].options.length > 0) {
          defaultModel.value = newValue[0].options[0].modelid
        }
      }
      else if (initialDefaultCategory && !initialDefaultModel && !defaultModel.value) {
        const targetCategory = newValue.find(cat => cat.catid === initialDefaultCategory)
        if (targetCategory && targetCategory.options && targetCategory.options.length > 0) {
          defaultModel.value = targetCategory.options[0].modelid
        }
        console.log('initialDefaultCategory 22', initialDefaultCategory)
        console.log('defaultCategory.value 22', defaultCategory.value)
        console.log('initialDefaultModel 22', initialDefaultModel)
        console.log('defaultModel.value 22', defaultModel.value)
      }
    }
    console.log('defaultCategory 33', defaultCategory.value)
    console.log('defaultModel 33', defaultModel.value)
  }, { immediate: true })

  return {
    voiceModels,
    voiceModelsData,
    defaultCategory,
    defaultModel,
    error,
    pending
  }
} 