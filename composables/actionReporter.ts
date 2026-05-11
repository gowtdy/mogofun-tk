import { $fetch } from 'ofetch'
import { config } from '~/config/config'

// 定义用户行为类型枚举
export enum ActionType {
  UNKNOWN = 'unknown',
  PAYMODAL_UPGRADE = 'paymodal-upgrade',
  PRICING_POP_LOGIN = 'pricing-pop-login',
  PRICING_CHECKOUT_SUCCESS = 'pricing-checkout-success',
  PRICING_CHECKOUT_FAILED = 'pricing-checkout-failed',

  GOOGLE_SEARCH = 'google-search',
  UPLOAD_AUDIO = 'cover-upload-audio',
  RECORD_AUDIO = 'cover-record-audio',

  COVER_SONG_GENERATE = 'cover-song-generate',
  COVER_SONG_SAMPLE_GENERATE = 'cover-song-sample-generate',
  COVER_SAMPLE_GENERATE = 'cover-sample-generate',
  COVER_SONG_PLAY = 'cover-song-play',
  COVER_SONG_GENPOP_LOGIN = 'cover-song-genpop-login',
  COVER_SONG_GENPOP_SUBSCRIPT = 'cover-song-genpop-subscript',
  COVER_SONG_DOWNLOAD_LOGIN = 'cover-song-download-login',
  COVER_SONG_DOWNLOAD = 'cover-song-download',
  COVER_SONG_DOWNPOP_SUBSCRIPT = 'cover-song-downpop-subscript',
  COVER_SONG_EXHAUSTED_SUBSCRIPT = 'cover-song-exhausted-subscript',

  TTS_GENERATE = 'tts-generate',
  TTS_PLAY = 'tts-play',
  TTS_GENPOP_LOGIN = 'tts-genpop-login',
  TTS_GENPOP_SUBSCRIPT = 'tts-genpop-subscript',
  TTS_DOWNLOAD_LOGIN = 'tts-download-login',
  TTS_DOWNLOAD = 'tts-download',
  TTS_DOWNPOP_SUBSCRIPT = 'tts-downpop-subscript',
  TTS_EXHAUSTED_SUBSCRIPT = 'tts-exhausted-subscript',

  SOUND_GENERATE = 'sound-generate',
  SOUND_PLAY = 'sound-play',
  SOUND_GENPOP_LOGIN = 'sound-genpop-login',
  SOUND_GENPOP_SUBSCRIPT = 'sound-genpop-subscript',
  SOUND_DOWNLOAD_LOGIN = 'sound-download-login',
  SOUND_DOWNLOAD = 'sound-download',
  SOUND_DOWNPOP_SUBSCRIPT = 'sound-downpop-subscript',
  SOUND_EXHAUSTED_SUBSCRIPT = 'sound-exhausted-subscript',

  // Vocal Isolator 行为类型
  VOCAL_EXTRACT = 'vocal-extract',
  VOCAL_EXTRACT_LOGIN = 'vocal-extract-login',
  VOCAL_EXTRACT_SUBSCRIPT = 'vocal-extract-subscript',
  VOCAL_DOWNLOAD = 'vocal-download',
  VOCAL_DOWNLOAD_LOGIN = 'vocal-download-login',
  VOCAL_DOWNLOAD_SUBSCRIPT = 'vocal-download-subscript',
  VOCAL_EXTRACT_DOWNLOAD = 'vocal-extract-download',
  VOCAL_EXTRACT_DOWNLOAD_LOGIN = 'vocal-extract-download-login',
  VOCAL_EXTRACT_DOWNLOAD_SUBSCRIPT = 'vocal-extract-download-subscript',
  VOCAL_EXTRACT_UPLOAD = 'vocal-extract-upload',
  VOCAL_EXTRACT_EXHAUSTED_SUBSCRIPT = 'vocal-extract-exhausted-subscript',

  // Vocal Remover 行为类型
  VOCAL_REMOVE = 'vocal-remove',
  VOCAL_REMOVE_LOGIN = 'vocal-remove-login',
  VOCAL_REMOVE_SUBSCRIPT = 'vocal-remove-subscript',
  VOCAL_REMOVE_DOWNLOAD = 'vocal-remove-download',
  VOCAL_REMOVE_DOWNLOAD_LOGIN = 'vocal-remove-download-login',
  VOCAL_REMOVE_DOWNLOAD_SUBSCRIPT = 'vocal-remove-download-subscript',
  VOCAL_REMOVE_UPLOAD = 'vocal-remove-upload',
  VOCAL_REMOVE_EXHAUSTED_SUBSCRIPT = 'vocal-remove-exhausted-subscript',

  // Audio Extractor 行为类型
  AUDIO_EXTRACT = 'audio-extract',
  AUDIO_EXTRACT_LOGIN = 'audio-extract-login',
  AUDIO_EXTRACT_SUBSCRIPT = 'audio-extract-subscript',
  AUDIO_DOWNLOAD = 'audio-download',
  AUDIO_DOWNLOAD_LOGIN = 'audio-download-login',
  AUDIO_DOWNLOAD_SUBSCRIPT = 'audio-download-subscript',
  AUDIO_EXTRACT_UPLOAD = 'audio-extract-upload',
  AUDIO_EXTRACT_EXHAUSTED_SUBSCRIPT = 'audio-extract-exhausted-subscript',
}

export const useActionReporter = () => {
  const { reportError } = useErrorReporter()
  
  /**
   * 记录用户行为数据
   * @param {Object} params - 行为数据参数
   * @param {string} params.email - 用户邮箱
   * @param {ActionType} params.action - 行为类型
   * @param {string} params.domain - 域名
   * @param {string} params.modelcat - 模型类别
   * @param {string} params.modelname - 模型名称
   * @returns {Promise} 请求结果
   */
  const trackAction = async ({
    email,
    action,
    domain = 'aivoicelab.net',
    modelcat = '',
    modelname = '',
    uid = '',
    useBeacon = false
  }: {
    email: string,
    action: ActionType,
    domain?: string,
    modelcat?: string,
    modelname?: string,
    uid?: string,
    useBeacon?: boolean
  }) => {
    try {
      // 如果使用 sendBeacon（通常在页面卸载时），使用 URLSearchParams
      // URLSearchParams 会被浏览器自动编码为 application/x-www-form-urlencoded 格式
      if (useBeacon && typeof navigator !== 'undefined' && navigator.sendBeacon) {
        const params = new URLSearchParams()
        params.append('email', email || '')
        params.append('action', action)
        params.append('domain', domain)
        params.append('modelcat', modelcat)
        params.append('modelname', modelname)
        params.append('uid', uid || '')
        
        // sendBeacon 是同步的，会立即返回 true/false
        const sent = navigator.sendBeacon(`${config.host}/lapi/actionadd`, params)
        // 如果 sendBeacon 失败（返回 false），静默失败，不抛出错误
        // 因为此时页面可能正在卸载，无法处理错误
        if (!sent) {
          // 静默记录，不抛出错误，避免影响页面跳转
          console.warn('sendBeacon failed for trackAction')
        }
        return // sendBeacon 是异步的，不需要等待
      } else {
        // 正常情况使用 FormData 和 $fetch
        const formData = new FormData()
        formData.append('email', email)
        formData.append('action', action)
        formData.append('domain', domain)
        formData.append('modelcat', modelcat)
        formData.append('modelname', modelname)
        formData.append('uid', uid)
        await $fetch(`${config.host}/lapi/actionadd`, {
          method: 'POST',
          body: formData,
        })
      }
    } catch (err) {
      reportError(err, `trackAction error - uid: ${uid}, email: ${email}, action: ${action}, domain: ${domain}, modelcat: ${modelcat}, modelname: ${modelname}`)
    }
  }

  /**
   * 获取用户行为统计数据
   * @param {Object} params - 查询参数
   * @param {string} params.email - 用户邮箱
   * @param {string} params.uid - 用户ID
   * @param {ActionType} params.action - 行为类型，默认为 'download'
   * @param {string} params.domain - 域名，默认为 'aivoicelab.net'
   * @returns {Promise<number>} 行为次数
   */
  const actionCounts = async ({
    email = '',
    uid = '',
    action = ActionType.TTS_DOWNLOAD,
    domain = 'aivoicelab.net'
  }: {
    email?: string,
    uid?: string,
    action?: ActionType,
    domain?: string
  }) => {
    try {
      const data = await $fetch(`${config.host}/lapi/actioncounts`, {
        method: 'GET',
        params: {
          email,
          uid,
          action,
          domain
        }
      })
      if (data?.ret === 0) {
        return {
          dayCount: data.day_count,
          monthCount: data.month_count,
        }
      } 
    } catch (err) {
      reportError(err, `actionCounts error - email: ${email}, uid: ${uid}, action: ${action}, domain: ${domain}`)
    }
    return {
      dayCount: 0,
      monthCount: 0,
    }
  }

  return {
    trackAction,
    actionCounts
  }
}

//  使用示例
//  const { trackAction } = useActionReporter()
//  await trackAction({
//    email: 'user@example.com',
//    action: 'login'
//  })