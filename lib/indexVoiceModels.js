import yaml from 'js-yaml'
import { config } from '../config/config.js'

const isServer = typeof window === 'undefined' || process.server || import.meta.env?.SSR || false
let serverUtils = null
let serverUtilsInitialized = null

// 创建一个服务端专用的工具对象
const serverOnlyUtils = {
  async init() {
    if (!isServer) return
    try {
      const module = await import('../server/utils/fileUtils.js')
      serverUtils = module.serverUtils
      return true
    } catch (error) {
      throw error
    }
  }
}

if (isServer) {
  serverUtilsInitialized = serverOnlyUtils.init()
}

async function resolveServerFilePath() {
  if (!isServer) return null
  
  const isDev = process.env.NODE_ENV !== 'production'
  const configPath = isDev ? config.indexVoiceModels.development : config.indexVoiceModels.production
  
  try {
    // 等待 serverUtils 初始化
    await serverUtilsInitialized
    
    if (!serverUtils) {
      throw new Error('serverUtils is not initialized')
    }
    
    // 获取项目根目录
    const projectRoot = await serverUtils.getProjectRoot()
    const { resolve } = await import('node:path')
    const fs = await import('node:fs')
    
    // 如果是绝对路径（生产环境），直接使用
    if (configPath.startsWith('/')) {
      return configPath
    }
    
    // 开发环境：相对路径，需要基于项目根目录
    // 优先使用项目根目录
    const possiblePaths = []
    
    if (projectRoot) {
      const rootBasedPath = resolve(projectRoot, configPath)
      possiblePaths.push(rootBasedPath)
    }
    
    // 也尝试当前工作目录
    const cwdBasedPath = resolve(process.cwd(), configPath)
    if (cwdBasedPath !== possiblePaths[0]) {
      possiblePaths.push(cwdBasedPath)
    }
    
    // 使用 Node.js fs 直接检查文件（避免 serverUtils.exists 的初始化问题）
    for (const path of possiblePaths) {
      try {
        if (fs.existsSync(path)) {
          if (isDev) {
            console.log(`Found index voice models file at: ${path}`)
          }
          return path
        }
      } catch (e) {
        // 忽略单个路径检查的错误，继续尝试下一个
      }
    }
    
    // 如果都找不到，返回基于项目根目录的绝对路径（用于错误信息）
    if (projectRoot) {
      const fallbackPath = resolve(projectRoot, configPath)
      if (isDev) {
        console.warn(`Index voice models file not found. Tried paths: ${possiblePaths.join(', ')}`)
        console.warn(`Using fallback path: ${fallbackPath}`)
      }
      return fallbackPath
    }
    
    // 最后的后备方案
    const finalPath = resolve(process.cwd(), configPath)
    if (isDev) {
      console.warn(`Using process.cwd() based path: ${finalPath}`)
    }
    return finalPath
  } catch (error) {
    console.warn('Failed to resolve server file path:', error)
    // 即使出错也返回绝对路径
    const { resolve } = await import('node:path')
    return resolve(process.cwd(), configPath)
  }
}

export async function readVoiceModelsFile(filePath) {
  try {
    if (!isServer) {
      return null
    }
    
    await serverUtilsInitialized
    
    if (!filePath) {
      throw new Error('filePath is undefined or null')
    }

    // 直接使用 Node.js fs 模块，避免 serverUtils 的初始化问题
    const fs = await import('node:fs')
    
    if (!fs.existsSync(filePath)) {
      console.warn(`Voice models file not found at ${filePath}, returning empty data`)
      return ''  // 返回空字符串而不是抛出错误
    }

    // 直接使用 fs.promises.readFile，更可靠
    const content = await fs.promises.readFile(filePath, 'utf8')
    return content
  } catch (error) {
    console.warn(`Warning: Failed to read voice models file: ${error.message}`)
    return ''  // 返回空字符串而不是抛出错误
  }
}

let isInitializing = false
let cachedVoiceModels = null
let initializationPromise = null

// 简化解析函数
function parseVoiceModels(content) {
  try {
    if (!content) return []
    
    // 使用导入的 yaml
    const data = yaml.load(content)
    // console.log('parse voice models:', data)
    // 确保返回数组
    // return Array.isArray(data) ? data : []
    return data
  } catch (error) {
    console.warn('parse voice models failed:', error)
    return []
  }
}

export async function getIndexVoiceModels() {
  try {
    // 如果已经有缓存，直接返回
    if (cachedVoiceModels) {
      return cachedVoiceModels
    }

    // 如果正在初始化，等待现有的初始化完成
    if (initializationPromise) {
      return initializationPromise
    }

    // 在客户端通过 API 获取数据
    if (!isServer) {
      initializationPromise = fetch('/api/index-voice-models')
        .then(res => res.json())
        .then(data => {
          cachedVoiceModels = data
          return cachedVoiceModels
        })
      return initializationPromise
    }

    // 服务端逻辑
    initializationPromise = (async () => {
      const filePath = await resolveServerFilePath()
      const fileCont = await readVoiceModelsFile(filePath)
      const cdnHost = config.cdnHost
      
      let allVoiceModels = []
      const data = parseVoiceModels(fileCont)
      // 这里需要检查 data 是否为空
      if (!data || !data['models']) {
        console.warn('No valid data found in voice models file')
        return []
      }
      
      const models_yaml = data['models']
      
      for (const catid in models_yaml) {
        let langModels = {}
        const items = models_yaml[catid]
        
        let models = []
        let catName = catid
        for (const item of items) {
          catName = item.catname
          //let modelicon = `/img/${catid}/${item.modelicon.trim()}`
          const [gender, name] = item.display.split('-');
          // console.log("api voice models, items:", item)
          models.push({
            name: name.trim(),
            gender: gender.trim(),
            //author: item.author.trim(),
            author: '',
            modelid: item.name.trim(),
            //modelicon: cdnHost + modelicon,
            modelicon: '',
            exampleAudio: cdnHost + item.wavplay || '',
            cover_catid: item.cover_catid,
            cover_modelname: item.cover_modelname
          });
        }
        // 按名称排序
        models.sort((a, b) => a.name.localeCompare(b.name))
        // langModels['language'] = catName
        // langModels['languageid'] = catid
        langModels['catname'] = catName
        langModels['catid'] = catid
        langModels['options'] = models
        allVoiceModels.push(langModels)
      }
      
      cachedVoiceModels = allVoiceModels
      return cachedVoiceModels
    })()

    return initializationPromise

  } catch (error) {
    console.warn('get voice models failed:', error)
    return []
  } finally {
    initializationPromise = null
  }
}

