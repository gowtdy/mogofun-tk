import { getIndexVoiceModels } from '@/lib/indexVoiceModels'

export default defineEventHandler(async (event) => {

  try {
    const indexVoiceModels = await getIndexVoiceModels()
    return indexVoiceModels
  } catch (error) {
    console.error(`Failed to get index voice models:`, error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to get index voice models'
    })
  }
})

// 客户端使用时，
// const lang = 'fr' // 或者从用户输入获取
// const { data: voiceModels } = await useFetch(`/api/voice-models?lang=${lang}`)