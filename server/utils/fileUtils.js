// 缓存项目根目录，避免重复计算
let cachedProjectRoot = null

// 验证路径是否为有效的项目根目录
async function isValidProjectRoot(path) {
  if (!path) return false
  try {
    const fs = await import('node:fs')
    const { join } = await import('node:path')
    // 检查是否存在 package.json 和 nuxt.config.ts（或 nuxt.config.js）
    const packageJsonPath = join(path, 'package.json')
    const nuxtConfigPath = join(path, 'nuxt.config.ts')
    const nuxtConfigJsPath = join(path, 'nuxt.config.js')
    
    return (
      fs.existsSync(packageJsonPath) &&
      (fs.existsSync(nuxtConfigPath) || fs.existsSync(nuxtConfigJsPath))
    )
  } catch (e) {
    return false
  }
}

// 获取项目根目录
async function getProjectRoot() {
  if (typeof process !== 'undefined' && process.server) {
    // 如果已经缓存，直接返回
    if (cachedProjectRoot) {
      return cachedProjectRoot
    }
    
    const { fileURLToPath } = await import('node:url')
    const { dirname, join, resolve } = await import('node:path')
    
    // 方法1: 优先使用 process.cwd() (在 Nuxt 开发模式下通常是项目根目录)
    const projectRootFromCwd = resolve(process.cwd())
    if (await isValidProjectRoot(projectRootFromCwd)) {
      cachedProjectRoot = projectRootFromCwd
      return projectRootFromCwd
    }
    
    // 方法2: 从当前文件位置计算项目根目录 (server/utils/fileUtils.js -> 项目根目录)
    try {
      const currentFileUrl = import.meta.url
      const currentFilePath = fileURLToPath(currentFileUrl)
      const currentDir = dirname(currentFilePath)
      // server/utils -> server -> 项目根目录
      const projectRootFromFile = resolve(join(currentDir, '..', '..'))
      
      if (await isValidProjectRoot(projectRootFromFile)) {
        cachedProjectRoot = projectRootFromFile
        return projectRootFromFile
      }
    } catch (e) {
      // 如果计算失败，继续尝试其他方法
    }
    
    // 方法3: 尝试从 server/utils 向上查找
    try {
      const currentFileUrl = import.meta.url
      const currentFilePath = fileURLToPath(currentFileUrl)
      let currentDir = dirname(currentFilePath)
      // 向上查找，最多查找 5 层
      for (let i = 0; i < 5; i++) {
        const parentDir = resolve(join(currentDir, '..'))
        if (await isValidProjectRoot(parentDir)) {
          cachedProjectRoot = parentDir
          return parentDir
        }
        if (parentDir === currentDir) break // 已到达根目录
        currentDir = parentDir
      }
    } catch (e) {
      // 继续
    }
    
    // 如果都找不到，使用 process.cwd() 作为后备
    cachedProjectRoot = projectRootFromCwd
    return projectRootFromCwd
  }
  return null
}

export const serverUtils = {
  resolvePath: async (url) => {
    if (typeof process !== 'undefined' && process.server) {
      const { fileURLToPath } = await import('node:url')
      const { dirname, join } = await import('node:path')
      const __filename = fileURLToPath(url)
      const __dirname = dirname(__filename)
      const projectRoot = await getProjectRoot()
      return { __filename, __dirname, projectRoot }
    }
    return {}
  },
  
  getProjectRoot: getProjectRoot,
  
  readFile: async (filePath) => {
    if (typeof process !== 'undefined' && process.server) {
      const fs = await import('node:fs')
      if (!fs.existsSync(filePath)) {
        throw new Error(`File not found: ${filePath}`)
      }
      return await fs.promises.readFile(filePath, 'utf8')
    }
    return ''
  },
  
  join: async (...args) => {
    if (typeof process !== 'undefined' && process.server) {
      const { join } = await import('node:path')
      return join(...args)
    }
    return args.join('/')
  },
  
  access: async (filePath) => {
    if (typeof process !== 'undefined' && process.server) {
      const fs = await import('node:fs/promises')
      return await fs.access(filePath)
    }
    return Promise.reject(new Error('Not running on server'))
  },
  
  exists: async (filePath) => {
    if (typeof process !== 'undefined' && process.server) {
      const fs = await import('node:fs')
      return fs.existsSync(filePath)
    }
    return false
  }
}