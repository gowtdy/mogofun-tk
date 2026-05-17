import yaml from 'js-yaml'
import { config } from '~/config/config'

type ServerUtils = {
  getProjectRoot: () => Promise<string | null>
}

type VoiceModelOption = {
  name: string
  gender: string
  author: string
  modelid: string
  modelicon: string
  exampleAudio: string
  cover_catid?: string
  cover_modelname?: string
}

type VoiceModelCategory = {
  catname: string
  catid: string
  options: VoiceModelOption[]
}

type YamlModelItem = {
  catname: string
  display: string
  name: string
  wavplay?: string
  cover_catid?: string
  cover_modelname?: string
}

const isServer =
  typeof window === 'undefined' ||
  (typeof process !== 'undefined' && (process as { server?: boolean }).server) ||
  import.meta.env?.SSR ||
  false

let serverUtils: ServerUtils | null = null
let serverUtilsInitialized: Promise<boolean | undefined> | null = null

const serverOnlyUtils = {
  async init() {
    if (!isServer) return
    const module = await import('../server/utils/fileUtils.js')
    serverUtils = module.serverUtils as ServerUtils
    return true
  },
}

if (isServer) {
  serverUtilsInitialized = serverOnlyUtils.init()
}

async function resolveServerFilePath(): Promise<string | null> {
  if (!isServer) return null

  const isDev = process.env.NODE_ENV !== 'production'
  const configPath = isDev
    ? config.indexVoiceModels.development
    : config.indexVoiceModels.production

  try {
    await serverUtilsInitialized

    if (!serverUtils) {
      throw new Error('serverUtils is not initialized')
    }

    const projectRoot = await serverUtils.getProjectRoot()
    const { resolve } = await import('node:path')
    const fs = await import('node:fs')

    if (configPath.startsWith('/')) {
      return configPath
    }

    const possiblePaths: string[] = []

    if (projectRoot) {
      possiblePaths.push(resolve(projectRoot, configPath))
    }

    const cwdBasedPath = resolve(process.cwd(), configPath)
    if (cwdBasedPath !== possiblePaths[0]) {
      possiblePaths.push(cwdBasedPath)
    }

    for (const path of possiblePaths) {
      try {
        if (fs.existsSync(path)) {
          if (isDev) {
            console.log(`Found index voice models file at: ${path}`)
          }
          return path
        }
      } catch {
        // try next path
      }
    }

    if (projectRoot) {
      const fallbackPath = resolve(projectRoot, configPath)
      if (isDev) {
        console.warn(`Index voice models file not found. Tried paths: ${possiblePaths.join(', ')}`)
        console.warn(`Using fallback path: ${fallbackPath}`)
      }
      return fallbackPath
    }

    const finalPath = resolve(process.cwd(), configPath)
    if (isDev) {
      console.warn(`Using process.cwd() based path: ${finalPath}`)
    }
    return finalPath
  } catch (error) {
    console.warn('Failed to resolve server file path:', error)
    const { resolve } = await import('node:path')
    return resolve(process.cwd(), configPath)
  }
}

export async function readVoiceModelsFile(filePath: string | null): Promise<string> {
  try {
    if (!isServer) {
      return ''
    }

    await serverUtilsInitialized

    if (!filePath) {
      throw new Error('filePath is undefined or null')
    }

    const fs = await import('node:fs')

    if (!fs.existsSync(filePath)) {
      console.warn(`Voice models file not found at ${filePath}, returning empty data`)
      return ''
    }

    return fs.promises.readFile(filePath, 'utf8')
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error)
    console.warn(`Warning: Failed to read voice models file: ${message}`)
    return ''
  }
}

let cachedVoiceModels: VoiceModelCategory[] | null = null
let initializationPromise: Promise<VoiceModelCategory[]> | null = null

function parseVoiceModels(content: string) {
  try {
    if (!content) return null
    return yaml.load(content) as { models?: Record<string, YamlModelItem[]> } | null
  } catch (error) {
    console.warn('parse voice models failed:', error)
    return null
  }
}

export async function getIndexVoiceModels(): Promise<VoiceModelCategory[]> {
  try {
    if (cachedVoiceModels) {
      return cachedVoiceModels
    }

    if (initializationPromise) {
      return initializationPromise
    }

    if (!isServer) {
      initializationPromise = fetch('/api/index-voice-models')
        .then((res) => res.json())
        .then((data: VoiceModelCategory[]) => {
          cachedVoiceModels = data
          return cachedVoiceModels
        })
      return initializationPromise
    }

    initializationPromise = (async () => {
      const filePath = await resolveServerFilePath()
      const fileCont = await readVoiceModelsFile(filePath)
      const cdnHost = config.cdnHost

      const allVoiceModels: VoiceModelCategory[] = []
      const data = parseVoiceModels(fileCont)

      if (!data?.models) {
        console.warn('No valid data found in voice models file')
        return []
      }

      const modelsYaml = data.models

      for (const catid in modelsYaml) {
        const langModels: VoiceModelCategory = {
          catname: catid,
          catid,
          options: [],
        }
        const items = modelsYaml[catid] ?? []

        const models: VoiceModelOption[] = []
        let catName = catid

        for (const item of items) {
          catName = item.catname
          const [gender, name] = item.display.split('-')
          models.push({
            name: name.trim(),
            gender: gender.trim(),
            author: '',
            modelid: item.name.trim(),
            modelicon: '',
            exampleAudio: cdnHost + (item.wavplay || ''),
            cover_catid: item.cover_catid,
            cover_modelname: item.cover_modelname,
          })
        }

        models.sort((a, b) => a.name.localeCompare(b.name))
        langModels.catname = catName
        langModels.catid = catid
        langModels.options = models
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
