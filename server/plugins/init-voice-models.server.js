import { defineNitroPlugin } from 'nitropack/runtime/plugin'
import { getIndexVoiceModels } from '@/lib/indexVoiceModels'

export default defineNitroPlugin(async (nitroApp) => {
  // 在插件初始化时预加载项目根目录和文件路径，避免第一次请求时的路径解析问题
  try {
    // 预初始化 serverUtils，确保路径解析功能可用
    if (typeof process !== 'undefined' && process.server) {
      const { serverUtils } = await import('../utils/fileUtils.js')
      // 预加载项目根目录
      const projectRoot = await serverUtils.getProjectRoot()
      if (projectRoot) {
        // 验证数据目录是否存在
        const { join } = await import('node:path')
        const dataDir = join(projectRoot, 'data')
        const fs = await import('node:fs')
        if (fs.existsSync(dataDir)) {
          console.log(`init-voice-models, Project root resolved: ${projectRoot}`)
        }
      }
    }
  } catch (error) {
    // 预初始化失败不影响功能，会在第一次请求时重试
    console.warn('init-voice-models, Pre-initialization warning:', error.message)
  }

  // 在应用启动时预加载 voice models，避免第一次请求时的延迟
  let preloadedIndexVoiceModels = null
  let preloadPromise = null

  // 预加载函数
  const preloadVoiceModels = async () => {
    if (preloadPromise) {
      return preloadPromise
    }
    preloadPromise = (async () => {
      try {
        preloadedIndexVoiceModels = await getIndexVoiceModels()
        console.log('init-voice-models, Voice models preloaded successfully')
      } catch (error) {
        console.error('init-voice-models, Failed to preload voice models:', error)
      }
    })()
    return preloadPromise
  }

  // 在应用就绪时预加载
  nitroApp.hooks.hook('ready', async () => {
    await preloadVoiceModels()
  })

  nitroApp.hooks.hook('request', async (event) => {
    if (!event.context.voiceModels) {
      try {
        // 如果已经预加载，直接使用预加载的数据
        if (preloadedIndexVoiceModels) {
          event.context.indexVoiceModels = preloadedIndexVoiceModels
        } 
      } catch (error) {
        console.error('init-voice-models, Failed to initialize voice models:', error)
      }
    }
  })
})