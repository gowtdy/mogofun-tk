import { computed } from 'vue'
import { useAuth } from '~/composables/useAuth'
import { useUserStore } from '~/store/user'
import { useActionReporter, ActionType } from '~/composables/actionReporter'
import { useErrorReporter } from '~/composables/errorReporter'

// 功能类型枚举
export enum QuotaType {
  TTS = 'tts',                    // 语音生成（检查字符数）
  COVER = 'cover',                // 翻唱生成（检查次数）
  SOUND = 'sound',                // 音效生成（检查次数）
  VOCALISOLATE = 'vocalisolate',  // 人声分离（检查次数）
  VOCALREMOVER = 'vocalremover',  // 人声移除（检查次数）
  AUDIOEXTRACTOR = 'audioextractor' // 音频提取（检查次数）
}

/**
 * 测试模式：用于测试订阅弹窗功能
 * 使用方法：在浏览器控制台执行以下代码来开启/关闭测试模式
 * 
 * // 开启测试模式，强制将 TTS 剩余字符数设为 0
 * localStorage.setItem('quota_test_mode', 'tts')
 * 
 * // 开启测试模式，强制将 Cover 剩余次数设为 0
 * localStorage.setItem('quota_test_mode', 'cover')
 * 
 * // 开启测试模式，强制将 Sound 剩余次数设为 0
 * localStorage.setItem('quota_test_mode', 'sound')
 * 
 * // 开启测试模式，强制将 VocalIsolate 剩余次数设为 0
 * localStorage.setItem('quota_test_mode', 'vocalisolate')
 * 
 * // 开启测试模式，强制将 VocalRemover 剩余次数设为 0
 * localStorage.setItem('quota_test_mode', 'vocalremover')
 * 
 * // 开启测试模式，强制将 AudioExtractor 剩余次数设为 0
 * localStorage.setItem('quota_test_mode', 'audioextractor')
 * 
 * // 关闭测试模式
 * localStorage.removeItem('quota_test_mode')
 */
const getTestMode = (): QuotaType | null => {
  if (typeof window === 'undefined') return null
  const testMode = localStorage.getItem('quota_test_mode')
  if (testMode && Object.values(QuotaType).includes(testMode as QuotaType)) {
    return testMode as QuotaType
  }
  return null
}

export const useQuotaCheck = () => {
  const { getUserInfo, getOrCreateUid } = useAuth()
  const userStore = useUserStore()
  const { trackAction } = useActionReporter()
  const { reportError } = useErrorReporter()
  
  const userEmail = computed(() => (userStore as any).getUserEmail || '')
  const isLoggedInValue = computed(() => (userStore as any).isLoggedIn || false)

  /**
   * 检查用户是否可以继续使用某个功能
   * @param quotaType 功能类型
   * @param showPayModal 显示订阅弹窗的函数（可选）
   * @returns Promise<{ canUse: boolean, leftCount: number, message?: string, quotaType: QuotaType }>
   */
  const checkQuota = async (
    quotaType: QuotaType,
    showPayModal?: () => void
  ): Promise<{ canUse: boolean; leftCount: number; message?: string; quotaType: QuotaType }> => {
    // 如果未登录，返回 false
    if (!isLoggedInValue.value || !userEmail.value) {
      return {
        canUse: true,
        leftCount: 1,
        message: 'Please login first',
        quotaType
      }
    }

    try {
      // 获取用户信息
      const response = await getUserInfo(userEmail.value)
      
      if (response.ret !== 0 || !response.userinfo) {
        return {
          canUse: true,
          leftCount: 1,
          message: 'Failed to get user info',
          quotaType
        }
      }

      const userInfo = response.userinfo
      let leftCount = 0
      let canUse = false

      // 检查测试模式：如果当前功能类型在测试模式下，强制将剩余次数/字符数设为 0
      // const testMode = getTestMode()
      const isTestMode = false

      // 根据功能类型检查剩余次数/字符
      switch (quotaType) {
        case QuotaType.TTS:
          // TTS 检查剩余字符数
          leftCount = userInfo.tts_left_count
          break

        case QuotaType.COVER:
          // Cover 检查剩余次数
          leftCount = userInfo.cover_left_count
          break

        case QuotaType.SOUND:
          // Sound 检查剩余次数
          leftCount = userInfo.sound_left_count
          break

        case QuotaType.VOCALISOLATE:
          // VocalIsolate 检查剩余次数
          leftCount = userInfo.vocalisolate_left_count
          break

        case QuotaType.VOCALREMOVER:
          // VocalRemover 检查剩余次数
          leftCount = userInfo.vocalremover_left_count
          break

        case QuotaType.AUDIOEXTRACTOR:
          // AudioExtractor 检查剩余次数
          leftCount = userInfo.audioextractor_left_count
          break

        default:
          leftCount = 1
      }

      canUse = leftCount > 0
      // 如果剩余为0且提供了显示弹窗的函数，则显示订阅提示
      if (!canUse && showPayModal) {
        // 先调用回调函数，设置 quotaTypeForModal 和 showPayModal
        showPayModal()
        
        // 记录行为
        let actionType: ActionType
        switch (quotaType) {
          case QuotaType.TTS:
            actionType = ActionType.TTS_EXHAUSTED_SUBSCRIPT
            break
          case QuotaType.COVER:
            actionType = ActionType.COVER_SONG_EXHAUSTED_SUBSCRIPT
            break
          case QuotaType.SOUND:
            actionType = ActionType.SOUND_EXHAUSTED_SUBSCRIPT
            break
          case QuotaType.VOCALISOLATE:
            actionType = ActionType.VOCAL_EXTRACT_EXHAUSTED_SUBSCRIPT
            break
          case QuotaType.VOCALREMOVER:
            actionType = ActionType.VOCAL_REMOVE_EXHAUSTED_SUBSCRIPT
            break
          case QuotaType.AUDIOEXTRACTOR:
            actionType = ActionType.AUDIO_EXTRACT_EXHAUSTED_SUBSCRIPT
            break
          default:
            actionType = ActionType.UNKNOWN as ActionType
        }
        
        trackAction({
          email: userEmail.value,
          action: actionType,
          domain: 'aivoicelab.net',
          modelcat: "quota-check",
          modelname: "quota-check",
          uid: ''
        })
      }

      return {
        canUse,
        leftCount,
        message: canUse ? undefined : 'Quota exhausted. Please upgrade your subscription.',
        quotaType
      }
    } catch (error) {
      const uid = getOrCreateUid()
      reportError(error, `Check quota failed - quotaType: ${quotaType}`, uid, userEmail.value)
      return {
        canUse: true,
        leftCount: 1,
        message: 'Failed to check quota',
        quotaType
      }
    }
  }

  /**
   * 快速检查并处理（如果剩余为0则显示弹窗）
   * @param quotaType 功能类型
   * @param showPayModal 显示订阅弹窗的函数
   * @returns Promise<boolean> 是否可以继续使用
   */
  const checkAndHandle = async (
    quotaType: QuotaType,
    showPayModal: () => void
  ): Promise<boolean> => {
    const result = await checkQuota(quotaType, showPayModal)
    return result.canUse
  }

  return {
    checkQuota,
    checkAndHandle,
    QuotaType
  }
}
