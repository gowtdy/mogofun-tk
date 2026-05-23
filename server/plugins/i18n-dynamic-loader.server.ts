import { defineNitroPlugin } from 'nitropack/runtime/plugin'
import { readFileSync, existsSync, statSync } from 'fs'
import { join, resolve, dirname } from 'path'
import { fileURLToPath } from 'url'
import { getRequiredTranslationFiles, BASE_TRANSLATION_FILES, validLanguages } from '../../config/i18nConfig'
import { shouldSkipLog } from '../utils/shouldSkipLog'

// 已加载的翻译文件缓存（按语言和文件路径）
// 存储文件内容和修改时间，用于开发环境的热重载
const loadedFiles = new Map<string, { content: any; mtime: number }>()

// 缓存项目根目录
let projectRoot: string | null = null

/**
 * 获取项目根目录（考虑部署环境）
 * 部署后，server 文件在 server/chunks/ 中，需要向上查找找到项目根目录
 */
function getProjectRoot(): string {
  if (projectRoot) {
    return projectRoot
  }
  
  // 方法1: 从当前文件位置计算（最可靠）
  try {
    const currentFileUrl = import.meta.url
    const currentFilePath = fileURLToPath(currentFileUrl)
    const currentDir = dirname(currentFilePath)
    
    // 部署后路径可能是: server/chunks/xxx.js 或 server/plugins/xxx.js
    // 需要向上查找找到项目根目录（包含 i18n 目录的目录）
    let searchDir = currentDir
    const maxDepth = 10 // 最多向上查找 10 层
    
    for (let i = 0; i < maxDepth; i++) {
      const i18nPath = join(searchDir, 'public', 'i18n', 'locales')
      if (existsSync(i18nPath)) {
        projectRoot = searchDir
        return projectRoot
      }
      
      const parentDir = resolve(searchDir, '..')
      if (parentDir === searchDir) {
        // 已到达根目录
        break
      }
      searchDir = parentDir
    }
  } catch (e) {
    // 继续尝试其他方法
  }
  
  // 方法2: 使用 process.cwd() 作为后备（开发环境通常有效）
  const cwd = process.cwd()
  const i18nPath = join(cwd, 'public', 'i18n', 'locales')
  if (existsSync(i18nPath)) {
    projectRoot = cwd
    return projectRoot
  }
  
  // 方法3: 如果都失败，至少返回 cwd（可能会失败，但总比没有好）
  projectRoot = cwd
  return projectRoot
}

/**
 * 深度合并对象（原地修改 target）
 */
function deepMerge(target: Record<string, any>, source: Record<string, any>): void {
  for (const key in source) {
    if (source.hasOwnProperty(key)) {
      const sourceValue = source[key]
      const targetValue = target[key]
      
      // 如果源值是普通对象（不是数组、null、Date等），进行深度合并
      if (sourceValue && typeof sourceValue === 'object' && !Array.isArray(sourceValue) && sourceValue.constructor === Object) {
        // 如果目标值也是普通对象，递归合并；否则用空对象
        if (targetValue && typeof targetValue === 'object' && !Array.isArray(targetValue) && targetValue.constructor === Object) {
          deepMerge(targetValue, sourceValue)
        } else {
          target[key] = deepMergeReturn({}, sourceValue)
        }
      } else {
        // 对于基本类型、数组、null等，直接赋值
        target[key] = sourceValue
      }
    }
  }
}

/**
 * 深度合并对象（返回新对象，用于需要返回值的场景）
 */
function deepMergeReturn(target: Record<string, any>, source: Record<string, any>): Record<string, any> {
  const result = { ...target }
  deepMerge(result, source)
  return result
}

/**
 * 加载翻译文件（服务端）
 * @returns 包含翻译数据和已加载文件列表的对象
 */
function loadTranslationFilesSync(
  locale: string,
  routePath: string
): { translations: Record<string, any>; loadedFiles: string[]; projectRoot: string } {
  const translations: Record<string, any> = {}
  const loadedFileList: string[] = []
  
  // 获取项目根目录
  const root = getProjectRoot()
  
  // 基础语言文件：对所有请求都必须加载
  // 根据路由路径获取需要加载的具体文件列表（不包含基础文件）
  const routeFiles = getRequiredTranslationFiles(routePath)
  
  // 合并基础文件和路由文件，去重
  const allFiles = [...new Set([...BASE_TRANSLATION_FILES, ...routeFiles])]
  
  // 检查是否为开发环境
  const isDev = process.env.NODE_ENV !== 'production'
  
  // 加载每个需要的翻译文件
  for (const file of allFiles) {
    const cacheKey = `${locale}/${file}`

    try {
      // 使用项目根目录构建文件路径
      const filePath = join(root, 'public', 'i18n', 'locales', locale, file)
      
      // 检查文件是否存在
      if (!existsSync(filePath)) {
        if (import.meta.dev && file === 'index.json') {
          console.warn(`[i18n-nitro] Missing translation file (needed for comm.*): ${filePath}`)
        }
        continue
      }
      
      // 获取文件修改时间
      const stats = statSync(filePath)
      const fileMtime = stats.mtimeMs
      
      // 检查缓存
      const cached = loadedFiles.get(cacheKey)
      
      // 在开发环境中，如果文件已更新，清除缓存
      if (isDev && cached && cached.mtime < fileMtime) {
        loadedFiles.delete(cacheKey)
        console.log(`[i18n-dynamic-loader.server] File updated, clearing cache: ${cacheKey}`)
      }
      
      // 如果缓存有效且文件未更新，使用缓存
      if (cached && (!isDev || cached.mtime >= fileMtime)) {
        deepMerge(translations, cached.content)
        loadedFileList.push(file)
        continue
      }

      // 读取并解析文件
      const fileContent = readFileSync(filePath, 'utf-8')
      const translationData = JSON.parse(fileContent)
      
      // 使用深度合并，确保多个文件的翻译数据能够正确合并
      // 例如：多个文件都有 meta 和 character 键时，需要合并内部的键，而不是覆盖
      const fileTranslations: Record<string, any> = {}
      deepMerge(fileTranslations, translationData)
      
      // 缓存已加载的翻译（包含修改时间）
      loadedFiles.set(cacheKey, {
        content: deepMergeReturn({}, fileTranslations),
        mtime: fileMtime
      })
      deepMerge(translations, fileTranslations)
      loadedFileList.push(file)
    } catch (error: any) {
      // 静默处理错误，某些文件可能不存在
      const errorMessage = error?.message || String(error)
      // 只记录 JSON 解析错误和文件不存在错误
      if (errorMessage.includes('JSON') || errorMessage.includes('parse') || errorMessage.includes('ENOENT')) {
        console.warn(`[i18n-dynamic-loader.server] Failed to load ${locale}/${file}: ${errorMessage}`)
      }
    }
  }
  
  return { translations, loadedFiles: loadedFileList, projectRoot: root }
}

export default defineNitroPlugin((nitroApp) => {
  // 使用统一的语言配置
  const validLangs = [...validLanguages];
  
  nitroApp.hooks.hook('request', (event) => {
    // 获取当前路由路径
    const url = event.req.url || ''
    const routePath = url.split('?')[0] // 移除查询参数
    
    if (shouldSkipLog(routePath ?? '')) {
      return
    }
    
    // 直接从 URL 解析语言（不依赖 language-detector，确保执行顺序不影响）
    // 优先从 URL 路径解析语言，因为这是最可靠的来源
    let locale: string = 'en' // 默认语言
    const urlLang = routePath ? routePath.split('/')[1] : ''
    if (urlLang && validLangs.includes(urlLang as any)) {
      locale = urlLang
    } else if (event.context.lang && validLangs.includes(event.context.lang as any)) {
      // 如果 URL 中没有语言，但 event.context.lang 已设置且有效，使用它
      locale = event.context.lang
    }
    
    // 确保 event.context.lang 被设置（覆盖之前可能错误的设置）
    event.context.lang = locale
    
    // 加载翻译文件（根据路由路径确定具体需要的文件）
    const { translations, loadedFiles: loadedFileList, projectRoot: resolvedRoot } = loadTranslationFilesSync(
      locale,
      routePath || ''
    )

    const topKeys = Object.keys(translations)
    const hasComm = typeof translations.comm === 'object' && translations.comm !== null
    if (!hasComm && routePath && !routePath.match(/\.(js|mjs|css|map|ico|png|jpg|jpeg|gif|webp|svg|woff2?|ttf|eot)$/i)) {
      console.warn('[i18n-nitro] Loaded translations have no comm.* object — intlify will warn. route=', routePath, 'locale=', locale, 'loadedFiles=', loadedFileList, 'root=', resolvedRoot)
    }
    
    // 将翻译数据添加到事件上下文，供 Nuxt 插件使用
    event.context.i18nTranslations = translations
    
    // 将已加载的文件列表也添加到事件上下文，供客户端使用（避免重复加载）
    event.context.i18nLoadedFiles = loadedFileList
    
    // 将语言信息也添加到事件上下文，供后续使用
    event.context.i18nLocale = locale
  })
})

