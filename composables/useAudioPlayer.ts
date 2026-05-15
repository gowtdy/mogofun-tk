import { ref } from 'vue'
import { config } from '~/config/config'
import { useErrorReporter } from './errorReporter'

export function useAudioPlayer() {
  const { reportError } = useErrorReporter()
  // 创建状态
  const state = {
    audioId: ref<string | null>(null),
    isPlaying: ref(false),
    isLoading: ref(false),
    isDownloading: ref(false),
    error: ref<string | null>(null)
  }

  // 在闭包中保存 audio 实例
  let audioInstance: HTMLAudioElement | null = null

  // 确保只在客户端创建 Audio 实例
  const getAudio = () => {
    if (typeof window === 'undefined') return null
    if (!audioInstance) {
      audioInstance = new Audio()
    }
    return audioInstance
  }

  const playAudio = async (audioUrl: string, audioId: string, host: string = config.host) => {
    const audio = getAudio()
    if (!audio) return

    // 添加参数验证
    if (!audioUrl || typeof audioUrl !== 'string') {
      reportError(new Error(`Invalid audioUrl parameter: ${audioUrl}`), 'playAudio parameter validation failed')
      // state.error.value = 'Invalid audio URL'
      return
    }

    if (!audioId || typeof audioId !== 'string') {
      reportError(new Error(`Invalid audioId parameter: ${audioId}`), 'playAudio parameter validation failed')
      // state.error.value = 'Invalid audio ID'
      return
    }

    // 如果是同一个音频，切换播放/暂停状态
    if (state.audioId.value === audioId) {
      if (state.isPlaying.value) {
        audio.pause()
        state.isPlaying.value = false
        state.audioId.value = null
      } else {
        try {
          await audio.play()
          state.isPlaying.value = true
        } catch (err) {
          reportError(err, 'Resume playback failed--playAudio')
        }
      }
      return
    }

    // 播放新的音频
    try {
      
      state.audioId.value = audioId

      if (!audio.paused) {
        audio.pause()
      }

      // 安全地处理 URL，确保 audioUrl 是有效字符串
      const baseUrl = audioUrl.startsWith('http') ? audioUrl : `${host}${audioUrl}`

      // 等待音频加载
      state.isLoading.value = true
      
      const response = await fetch(baseUrl, {
        headers: {
          'Range': 'bytes=0-',
          'Accept': 'audio/mpeg,audio/*;q=0.9,*/*;q=0.8',
          'Content-Type': 'audio/mpeg'
        }
      })
      if (!response.ok) {
        // 尝试获取响应体的错误信息
        let errorBody = ''
        try {
          const text = await response.clone().text()
          errorBody = text.substring(0, 200) // 只取前200个字符，避免过长
        } catch (e) {
          // 如果无法读取响应体，忽略
        }
        
        const errorMessage = `Audio loading failed: HTTP ${response.status} ${response.statusText}`
        const errorContext = {
          message: errorMessage,
          status: response.status,
          statusText: response.statusText,
          url: baseUrl,
          audioId: audioId,
          responseBody: errorBody || 'Unable to read response body',
          headers: Object.fromEntries(response.headers.entries())
        }
        reportError(new Error(errorMessage), errorContext)
        return
      }
      const blob = await response.blob()
      const url = URL.createObjectURL(blob)
      audio.src = url

      await new Promise(async (resolve, reject) => {
        try {
          // 设置超时
          const timeout = setTimeout(() => {
            cleanup()
            reject(new Error('Audio loading timeout'))
          }, 3000)
          
          // 清理函数
          const cleanup = () => {
            clearTimeout(timeout)
            audio.onloadeddata = null
            audio.onerror = null
          }
          
          // 监听加载完成
          audio.onloadeddata = () => {
            cleanup()
            resolve(null)
          }
          
          // 监听错误
          audio.onerror = (e) => {
            cleanup()
            URL.revokeObjectURL(url) // 清理创建的 URL
            reject(e)
          }
          audio.load()
        } catch (err) {
          reject(err)
        }
      })

      state.isLoading.value = false
      state.isPlaying.value = true
      await audio.play()
      
      audio.onended = () => {
        state.isPlaying.value = false
        state.audioId.value = null
        audio.onended = null
        audio.src = ''
        URL.revokeObjectURL(url)
      }
    } catch (err) {
      reportError(err, 'Audio playback failed--playAudio')
      state.error.value = 'Failed to play audio'
      // 重置状态
      state.audioId.value = null
      state.isPlaying.value = false
      state.isLoading.value = false
    }
  }

  const pauseAudio = () => {
    // 使用 requestAnimationFrame 优化音频暂停操作，减少 INP
    requestAnimationFrame(() => {
      const audio = getAudio()
      if (audio && !audio.paused) {
        audio.pause()
      }
      
      // 批量更新状态，减少响应式更新次数
      requestAnimationFrame(() => {
        state.isPlaying.value = false
        state.audioId.value = null
      })
    })
  }

  const downloadAudio = async (audioUrl: string, filename?: string, host: string = config.host) => {
    if (state.isDownloading.value || typeof window === 'undefined') return

    // 添加参数验证
    if (!audioUrl || typeof audioUrl !== 'string') {
      reportError(new Error(`Invalid audioUrl parameter for download: ${audioUrl}`), 'downloadAudio parameter validation failed')
      // state.error.value = 'Invalid audio URL for download'
      return
    }

    state.isDownloading.value = true

    try {
      // 与播放方法保持一致的 URL 处理逻辑，确保 audioUrl 是有效字符串
      const fullUrl = audioUrl.startsWith('http') ? audioUrl : `${host}${audioUrl}`
      
      const response = await fetch(fullUrl)
      if (!response.ok) throw new Error('Download failed')

      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = filename || `audio-${Date.now()}.mp3`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      window.URL.revokeObjectURL(url)
    } catch (err) {
      state.error.value = 'Download failed, please try again'
      throw new Error('Download failed')
    } finally {
      state.isDownloading.value = false
    }
  }

  const cleanup = () => {
    const audio = getAudio()
    if (audio) {
      audio.pause()
      audio.src = ''
    }
    state.isPlaying.value = false
    state.isLoading.value = false
    state.audioId.value = null
    state.error.value = null
  }

  return {
    ...state,
    playAudio,
    pauseAudio,
    downloadAudio,
    cleanup
  }
}