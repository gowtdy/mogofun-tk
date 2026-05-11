/**
 * 分片上传 composable
 * 提供统一的分片上传功能，支持断点续传、进度跟踪等
 */

import { ref, computed, onBeforeUnmount, nextTick, readonly, type Ref } from 'vue'
import { config } from '~/config/config'
import { useUserStore } from '@/store/user'
import { useAuth } from '~/composables/useAuth'
import { useErrorReporter } from '~/composables/errorReporter'
import { getUploadStrategy, generateFileIdentifier } from '~/composables/uploadStrategy'
import { useI18n } from 'vue-i18n'
import Uploader from 'simple-uploader.js'

export interface ChunkedUploadOptions {
  maxSize?: number // 最大文件大小（字节）
  mediaType?: 'audio' | 'video' // 媒体类型
  onProgress?: (progress: number) => void // 进度回调
  onSuccess?: (response: any) => void // 成功回调
  onError?: (error: string) => void // 错误回调
  onStatusChange?: (status: string) => void // 状态变化回调
}

export interface ChunkedUploadResult {
  upload: (file: File) => Promise<void> // 上传文件
  reset: () => void // 重置上传器
  isUploading: Readonly<Ref<boolean>> // 是否正在上传
  uploadProgress: Readonly<Ref<number>> // 上传进度 (0-100)
  uploadStatus: Readonly<Ref<string>> // 上传状态文本
}

// 分片上传接口地址
const chunkedUploadEndpoint = `${config.apiHost}/gwupapi/multiupload`

// 分片检查接口地址
const chunkedCheckEndpoint = `${config.apiHost}/gwupapi/multicheck`

// 分片合并接口地址
const mergeEndpoint = `${config.apiHost}/gwupapi/merge`

const allowedAudioTypes = [
  'audio/webm',  // .webm
  'audio/mpeg',  // .mp3
  'audio/wav',   // .wav
  'audio/x-wav',
  'audio/mp3',   // .mp3
  'audio/m4a',   // .m4a
  'audio/x-m4a',
  'audio/mp4',   // .mp4 audio
  'audio/flac',   // .flac
  'audio/aac',   // .aac
  'audio/ogg',   // .ogg
  'video/mp4',   // .mp4 video
  'video/mov',   // .mov video
  'video/avi',   // .avi video
  'video/wmv',   // .wmv video
  'video/flv',   // .flv video
  'video/x-flv',       // .flv
  'video/mkv',         // .mkv
  'video/webm',   // .webm video
  'video/quicktime',   // .mov video
  'video/x-msvideo',   // .avi
  'video/x-ms-wmv',    // .wmv
  'video/x-matroska',  // .mkv
]

const allowedVideoTypes = [
  'video/mp4',   // .mp4 video
  'video/quicktime',   // .mov video
  'video/x-msvideo',   // .avi
  'video/x-flv',       // .flv
  'video/x-ms-wmv',    // .wmv
  'video/x-matroska',  // .mkv
  'video/mkv',         // .mkv
  'video/webm',         // .webm
  'video/quicktime',   // .mov video
  'video/x-msvideo',   // .avi
  'video/x-flv',       // .flv
  'video/x-ms-wmv',    // .wmv
  'video/x-matroska',  // .mkv
  'video/webm'         // .webm
]

export function useChunkedUpload(options: ChunkedUploadOptions = {}): ChunkedUploadResult {
  const {
    maxSize = 20 * 1024 * 1024,
    mediaType = 'audio',
    onProgress,
    onSuccess,
    onError,
    onStatusChange
  } = options

  const { getOrCreateUid, getUserInfo } = useAuth()
  const userStore = useUserStore()
  const userEmail = computed(() => userStore.user?.email || '')
  const isLoggedIn = computed(() => !!userStore.user)
  const uid = ref(getOrCreateUid())
  const { t } = useI18n()
  const { reportError } = useErrorReporter()

  const isUploading = ref(false)
  const uploadProgress = ref(0)
  const uploadStatus = ref('')
  const file = ref<File | null>(null)
  const uploader = ref<any>(null)
  const fileIdentifier = ref<string>('')
  const upday = ref<string>('')
  const isMerging = ref(false)
  const cachedCheckResult = ref<any>(null)
  const checkRequestPromise = ref<Promise<Response> | null>(null)
  const originalFetch = ref<typeof fetch | null>(null)
  const fetchIntercepted = ref(false)

  // 根据 mediaType 动态选择允许的文件类型
  const allowedTypes = computed(() => {
    return mediaType === 'video' ? allowedVideoTypes : allowedAudioTypes
  })

  // 显示进度：限制最大值为98%，避免显示100%后长时间等待
  const displayProgress = computed(() => {
    return Math.min(uploadProgress.value, 98)
  })

  /**
   * 调用 merge 接口合并分片
   */
  const callMergeApi = async (strategy: any, f: File, totalChunks: number, totalSize: number, chunkSize: number) => {
    if (isMerging.value) {
      if (process.dev) {
        console.log('[useChunkedUpload] merge already in progress, skipping')
      }
      return
    }

    isMerging.value = true
    try {
      // 获取用户订阅信息
      let userSubscript = 0
      if (isLoggedIn.value && userEmail.value) {
        try {
          const userinfo = await getUserInfo(userEmail.value)
          if (userinfo?.userinfo) {
            userSubscript = userinfo.userinfo.user_subscript || 0
          }
        } catch (err) {
          if (process.dev) {
            console.warn('[useChunkedUpload] Failed to get user subscription, using default 0:', err)
          }
        }
      }

      const requestData: any = {
        domain: 'aivoicelab.net',
        email: userEmail.value,
        uid: uid.value,
        subscript: userSubscript,
        identifier: fileIdentifier.value,
        filename: f.name,
        totalChunks: totalChunks
      }
      if (upday.value) {
        requestData.upday = upday.value
      }

      if (process.dev) {
        console.log('[useChunkedUpload] Calling merge API:', {
          identifier: fileIdentifier.value,
          filename: f.name,
          totalChunks: totalChunks,
          upday: upday.value
        })
      }

      const response = await fetch(mergeEndpoint, {
        method: 'POST',
        body: JSON.stringify(requestData),
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'no-cache',
          'Pragma': 'no-cache'
        }
      })

      if (!response.ok) {
        throw new Error(`Merge API HTTP error! status: ${response.status}`)
      }

      const result = await response.json()
      if (process.dev) {
        console.log('[useChunkedUpload] Merge API response:', result)
      }

      if (result.ret === 0 && result.uri) {
        // 合并成功，触发上传成功事件
        isUploading.value = false
        uploadStatus.value = ''
        onSuccess?.({ uri: result.uri, ...result })
      } else {
        throw new Error(result.msg || 'Merge failed')
      }
    } catch (err) {
      if (process.dev) {
        console.error('[useChunkedUpload] Merge API error:', err)
      }
      reportError(err, `Merge API failed - identifier: ${fileIdentifier.value}`, uid.value, userEmail.value)
      onError?.(err instanceof Error ? err.message : 'Merge failed')
    } finally {
      isMerging.value = false
    }
  }

  /**
   * 初始化上传器
   */
  const initUploader = (strategy: any, f: File) => {
    if (uploader.value) {
      try {
        if (typeof uploader.value.cancel === 'function') {
          uploader.value.cancel()
        }
        if (typeof uploader.value.off === 'function') {
          uploader.value.off()
        }
      } catch (err) {
        console.warn('Error cleaning up existing uploader:', err)
      } finally {
        uploader.value = null
      }
    }

    // 重置缓存，为新文件准备
    cachedCheckResult.value = null
    checkRequestPromise.value = null

    // 计算分片相关参数
    const totalChunks = Math.ceil(f.size / strategy.chunkSize)
    const totalSize = f.size
    const chunkSize = strategy.chunkSize

    if (process.dev) {
      console.log('[useChunkedUpload] initUploader - calculated values:', {
        fileSize: f.size,
        chunkSize: chunkSize,
        totalChunks: totalChunks,
        expectedChunks: totalChunks
      })
    }

    // 恢复之前的拦截（如果有）
    if (fetchIntercepted.value && originalFetch.value) {
      window.fetch = originalFetch.value
      fetchIntercepted.value = false
      originalFetch.value = null
    }

    // 设置新的 fetch 拦截
    originalFetch.value = window.fetch
    const checkUrlPattern = new RegExp(chunkedCheckEndpoint.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'))

    window.fetch = async (...args: Parameters<typeof fetch>) => {
      const url = typeof args[0] === 'string' ? args[0] : args[0]?.url || ''
      
      // 如果是 multicheck 请求
      if (checkUrlPattern.test(url)) {
        // 如果已有缓存结果，直接返回缓存
        if (cachedCheckResult.value) {
          if (process.dev) {
            console.log('[useChunkedUpload] Intercepted multicheck request (fetch), using cached result:', url)
          }
          return new Response(JSON.stringify(cachedCheckResult.value), {
            status: 200,
            statusText: 'OK',
            headers: {
              'Content-Type': 'application/json'
            }
          })
        }
        
        // 如果有请求正在进行，等待第一个请求完成并返回相同的结果
        if (checkRequestPromise.value) {
          if (process.dev) {
            console.log('[useChunkedUpload] multicheck request in progress (fetch), reusing promise...')
          }
          const response = await checkRequestPromise.value
          const clonedResponse = response.clone()
          return clonedResponse
        }
        
        // 第一次请求，创建 Promise 并缓存
        if (process.dev) {
          console.log('[useChunkedUpload] First multicheck request (fetch), creating promise...')
        }
        checkRequestPromise.value = (async () => {
          try {
            const response = await originalFetch.value!.call(window, ...args)
            const clonedForRead = response.clone()
            const result = await clonedForRead.json()
            if (result && result.ret === 0 && Array.isArray(result.uploaded)) {
              cachedCheckResult.value = result
              if (process.dev) {
                console.log('[useChunkedUpload] Cached multicheck result from first request')
              }
            }
            return response.clone()
          } catch (err) {
            checkRequestPromise.value = null
            throw err
          }
        })()
        
        const response = await checkRequestPromise.value
        checkRequestPromise.value = null
        return response.clone()
      }
      
      // 其他请求正常处理
      return originalFetch.value!.call(window, ...args)
    }
    fetchIntercepted.value = true

    if (process.dev) {
      console.log('[useChunkedUpload] Fetch interception enabled')
    }

    uploader.value = new Uploader({
      target: (file: any, chunk: any, isTest: boolean) => {
        if (isTest) {
          const checkUrl = new URL(chunkedCheckEndpoint)
          checkUrl.searchParams.append('identifier', fileIdentifier.value)
          checkUrl.searchParams.append('filename', f.name)
          checkUrl.searchParams.append('totalSize', String(totalSize))
          checkUrl.searchParams.append('totalChunks', String(totalChunks))
          checkUrl.searchParams.append('chunkSize', String(chunkSize))
          if (upday.value) {
            checkUrl.searchParams.append('upday', upday.value)
          }
          return checkUrl.toString()
        }
        return chunkedUploadEndpoint
      },
      chunkSize: chunkSize,
      forceChunkSize: true,
      simultaneousUploads: strategy.simultaneousUploads,
      testChunks: true,
      testMethod: 'GET',
      uploadMethod: 'POST',
      maxChunkRetries: strategy.retryTimes,
      chunkRetryInterval: strategy.retryDelay,
      checkChunkUploadedByResponse: (chunk: any, message: string | any) => {
        try {
          let response: any
          if (cachedCheckResult.value) {
            response = cachedCheckResult.value
          } else {
            response = typeof message === 'string' ? JSON.parse(message) : message
            if (response && response.ret === 0 && Array.isArray(response.uploaded)) {
              cachedCheckResult.value = response
            }
          }
          
          if (response.ret === 0 && Array.isArray(response.uploaded)) {
            const chunkNumber = chunk.offset + 1
            const isUploaded = response.uploaded.includes(chunkNumber)
            
            const allChunksUploaded = totalChunks > 0 && 
              Array.from({ length: totalChunks }, (_, i) => i + 1).every(
                (chunkNum) => response.uploaded.includes(chunkNum)
              )
            
            if (allChunksUploaded && !isMerging.value) {
              if (process.dev) {
                console.log('[useChunkedUpload] All chunks uploaded, calling merge API')
              }
              callMergeApi(strategy, f, totalChunks, totalSize, chunkSize).catch((err) => {
                if (process.dev) {
                  console.error('[useChunkedUpload] Failed to call merge API:', err)
                }
              })
            }
            
            return isUploaded
          }
          return false
        } catch (err) {
          if (process.dev) {
            console.error('[useChunkedUpload] checkChunkUploadedByResponse error:', err)
          }
          return false
        }
      },
      processResponse: (response: string | any, cb: Function, file: any, chunk: any) => {
        try {
          let data: any
          if (typeof response === 'string') {
            data = JSON.parse(response)
          } else if (response && typeof response === 'object') {
            data = response
          } else {
            const responseStr = String(response)
            if (responseStr === '[object Object]') {
              throw new Error('Response is already an object but was converted to string')
            }
            data = JSON.parse(responseStr)
          }
          if (data.upday) {
            upday.value = data.upday
          }
          cb(null, data)
        } catch (err) {
          if (process.dev) {
            console.error('[useChunkedUpload] processResponse error:', err)
          }
          cb(err, { ret: 1, msg: 'Parse response failed' })
        }
      },
      processParams: (params: any, file: any, chunk: any, isTest: boolean) => {
        params.email = userEmail.value
        params.uid = uid.value
        params.identifier = fileIdentifier.value
        params.filename = f.name
        
        if (!isTest) {
          params.totalSize = totalSize
          params.totalChunks = totalChunks
          params.chunkSize = chunkSize
        }
        
        return params
      },
      query: (file: any, chunk: any, isTest: boolean) => {
        if (isTest) {
          return {
            identifier: fileIdentifier.value,
            filename: f.name,
            totalSize: totalSize,
            totalChunks: totalChunks,
            chunkSize: chunkSize,
            upday: upday.value || ''
          }
        }
        return {}
      },
      headers: {
        'Cache-Control': 'no-cache',
        'Pragma': 'no-cache'
      },
      generateUniqueIdentifier: () => {
        return fileIdentifier.value
      }
    })

    // 监听文件添加
    uploader.value.on('fileAdded', async (file: any) => {
      if (process.dev) {
        console.log('[useChunkedUpload] fileAdded:', {
          fileName: file?.name,
          fileSize: file?.size,
          chunks: file?.chunks?.length,
          expectedChunks: totalChunks
        })
      }
      
      // 在开始上传前，先检查所有分片是否都已上传
      try {
        let checkResult: any = null
        
        if (cachedCheckResult.value) {
          checkResult = cachedCheckResult.value
        } else {
          const checkUrl = new URL(chunkedCheckEndpoint)
          checkUrl.searchParams.append('identifier', fileIdentifier.value)
          checkUrl.searchParams.append('filename', f.name)
          checkUrl.searchParams.append('totalSize', String(totalSize))
          checkUrl.searchParams.append('totalChunks', String(totalChunks))
          checkUrl.searchParams.append('chunkSize', String(chunkSize))
          if (upday.value) {
            checkUrl.searchParams.append('upday', upday.value)
          }
          
          const checkResponse = await fetch(checkUrl.toString(), {
            method: 'GET',
            headers: {
              'Cache-Control': 'no-cache',
              'Pragma': 'no-cache'
            }
          })
          
          if (checkResponse.ok) {
            checkResult = await checkResponse.json()
          }
        }
        
        if (checkResult && checkResult.ret === 0 && Array.isArray(checkResult.uploaded)) {
          if (!cachedCheckResult.value) {
            cachedCheckResult.value = checkResult
          }
          
          const allChunksUploaded = totalChunks > 0 && 
            Array.from({ length: totalChunks }, (_, i) => i + 1).every(
              (chunkNum) => checkResult.uploaded.includes(chunkNum)
            )
          
          if (allChunksUploaded && !isMerging.value) {
            if (process.dev) {
              console.log('[useChunkedUpload] All chunks already uploaded, calling merge API directly')
            }
            await callMergeApi(strategy, f, totalChunks, totalSize, chunkSize)
            return
          }
        }
      } catch (err) {
        if (process.dev) {
          console.warn('[useChunkedUpload] Pre-upload check failed, continuing with upload:', err)
        }
      }
      
      isUploading.value = true
      uploadStatus.value = t('vocal_isolator.messages.uploading') || 'Uploading...'
      uploadProgress.value = 0
      onStatusChange?.(uploadStatus.value)
      
      setTimeout(() => {
        uploader.value?.upload()
      }, 0)
    })

    // 监听上传进度
    uploader.value.on('fileProgress', (rootFile: any, file: any, chunk: any) => {
      let progress = 0
      if (rootFile && typeof rootFile.progress === 'function') {
        progress = Math.round(rootFile.progress() * 100)
      } else if (file && typeof file.progress === 'function') {
        progress = Math.round(file.progress() * 100)
      }
      uploadProgress.value = Math.min(progress, 98)
      onProgress?.(uploadProgress.value)
    })

    // 监听上传成功
    uploader.value.on('fileSuccess', (rootFile: any, file: any, response: string | any, chunk: any) => {
      try {
        const data = typeof response === 'string' ? JSON.parse(response) : response
        if (data.ret === 0 && data.uri) {
          isUploading.value = false
          uploadStatus.value = ''
          onStatusChange?.('')
          onSuccess?.({ uri: data.uri, ...data })
        } else if (data.ret === 0) {
          // 分片上传成功，但还没有合并
        } else {
          const errorMsg = data.msg || t('vocal_isolator.messages.upload_failed') || 'Upload failed'
          onError?.(errorMsg)
          reset()
        }
      } catch (err) {
        const errorMsg = t('vocal_isolator.messages.parse_failed') || 'Parse failed'
        onError?.(errorMsg)
        reset()
      }
    })

    // 监听上传错误
    uploader.value.on('fileError', (rootFile: any, file: any, message: string | any, chunk: any) => {
      try {
        const data = typeof message === 'string' ? JSON.parse(message) : message
        const errorMsg = data.msg || t('vocal_isolator.messages.upload_failed') || 'Upload failed'
        onError?.(errorMsg)
      } catch {
        const errorMsg = typeof message === 'string' ? message : (message?.msg || t('vocal_isolator.messages.upload_failed') || 'Upload failed')
        onError?.(errorMsg)
      }
      reset()
    })

    // 监听分片上传完成
    uploader.value.on('chunkSuccess', (rootFile: any, file: any, chunk: any, response: string | any) => {
      try {
        const data = typeof response === 'string' ? JSON.parse(response) : response
        if (data.upday) {
          upday.value = data.upday
        }
        if (data.uri) {
          uploadStatus.value = 'Merging files...'
          onStatusChange?.(uploadStatus.value)
        }
      } catch (err) {
        // 忽略解析错误
      }
    })

    // 监听上传开始
    uploader.value.on('uploadStart', () => {
      if (!isUploading.value) {
        isUploading.value = true
        uploadStatus.value = t('vocal_isolator.messages.uploading') || 'Uploading...'
        onStatusChange?.(uploadStatus.value)
      }
    })

    // 监听分片上传进度
    uploader.value.on('chunkProgress', (rootFile: any, file: any, chunk: any) => {
      if (rootFile && typeof rootFile.progress === 'function') {
        const progress = Math.round(rootFile.progress() * 100)
        uploadProgress.value = Math.min(progress, 98)
        onProgress?.(uploadProgress.value)
      }
    })
  }

  /**
   * 检查文件类型是否允许
   * 支持带参数的 MIME 类型（如 audio/webm;codecs=opus）
   */
  const isFileTypeAllowed = (fileType: string, allowedTypes: string[]): boolean => {
    // 首先尝试精确匹配
    if (allowedTypes.includes(fileType)) {
      return true
    }
    
    // 如果精确匹配失败，提取基础 MIME 类型（去掉参数）
    // 例如：'audio/webm;codecs=opus' -> 'audio/webm'
    const baseType = fileType.split(';')[0].trim()
    return allowedTypes.includes(baseType)
  }

  /**
   * 执行文件上传
   */
  const upload = async (f: File) => {
    if (!f) return
    
    // 文件大小检查
    if (f.size > maxSize) {
      const errorMsg = t('vocal_isolator.messages.file_too_large') || 'File too large'
      onError?.(errorMsg)
      reset()
      return
    }
    
    // 文件类型检查
    console.log('File info before type check:', {
      name: f.name,
      type: f.type,
      size: f.size,
      lastModified: f.lastModified,
      allowedTypes: allowedTypes.value
    })
    if (!isFileTypeAllowed(f.type, allowedTypes.value)) {
      const errorMsg = t('vocal_isolator.messages.file_type_not_supported') || 'File type not supported'
      onError?.(errorMsg)
      reset()
      return
    }
    
    file.value = f
    
    try {
      // 生成文件唯一标识符
      fileIdentifier.value = await generateFileIdentifier(f, uid.value)
      
      // 获取上传策略
      const strategy = getUploadStrategy(f.size)
      
      // 初始化上传器
      initUploader(strategy, f)
      
      if (!uploader.value) {
        throw new Error('Failed to initialize uploader')
      }
      
      // 添加文件到上传器
      uploader.value.addFile(f)
      
      await nextTick()
      if (uploader.value && !isUploading.value) {
        isUploading.value = true
        uploadStatus.value = t('vocal_isolator.messages.uploading') || 'Uploading...'
        uploadProgress.value = 0
        onStatusChange?.(uploadStatus.value)
        uploader.value.upload()
      }
      
    } catch (err) {
      isUploading.value = false
      const errorMsg = err instanceof Error ? err.message : (t('vocal_isolator.messages.upload_failed') || 'Upload failed')
      onError?.(errorMsg)
      reset()
    }
  }

  /**
   * 重置上传器
   */
  const reset = () => {
    if (uploader.value) {
      try {
        if (typeof uploader.value.cancel === 'function') {
          uploader.value.cancel()
        }
        if (typeof uploader.value.off === 'function') {
          uploader.value.off()
        }
        if (typeof uploader.value.destroy === 'function') {
          uploader.value.destroy()
        }
      } catch (err) {
        console.warn('Error cleaning up uploader:', err)
      } finally {
        uploader.value = null
      }
    }
    file.value = null
    fileIdentifier.value = ''
    upday.value = ''
    cachedCheckResult.value = null
    checkRequestPromise.value = null
    
    // 恢复原始的 fetch 函数
    if (fetchIntercepted.value && originalFetch.value) {
      window.fetch = originalFetch.value
      fetchIntercepted.value = false
      originalFetch.value = null
    }
    
    isUploading.value = false
    uploadProgress.value = 0
    uploadStatus.value = ''
    onStatusChange?.('')
  }

  // 组件卸载时清理
  onBeforeUnmount(() => {
    if (uploader.value) {
      try {
        if (typeof uploader.value.cancel === 'function') {
          uploader.value.cancel()
        }
        if (typeof uploader.value.off === 'function') {
          uploader.value.off()
        }
        if (typeof uploader.value.destroy === 'function') {
          uploader.value.destroy()
        }
      } catch (err) {
        console.warn('Error cleaning up uploader on unmount:', err)
      } finally {
        uploader.value = null
      }
    }
    
    if (fetchIntercepted.value && originalFetch.value) {
      window.fetch = originalFetch.value
      fetchIntercepted.value = false
      originalFetch.value = null
    }
  })

  return {
    upload,
    reset,
    isUploading: readonly(isUploading),
    uploadProgress: readonly(uploadProgress),
    uploadStatus: readonly(uploadStatus)
  }
}

