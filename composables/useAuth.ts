import { storeToRefs } from 'pinia'
import { useUserStore } from '~/store/user'
import { useAuthCookie } from '~/composables/cookies'
import { useStorage } from '@vueuse/core'
import { useRuntimeConfig } from '#app'
import { useErrorReporter } from './errorReporter'
import { ActionType } from './actionReporter'

const STORAGE_KEY = 'avuid'

export const useAuth = () => {
  const config = useRuntimeConfig()
  const userStore = useUserStore()
  const { setAuthCookie, removeAuthCookie } = useAuthCookie()
  const { reportError } = useErrorReporter()

  const API_HOST = config.public.apiHost
  const avUid = useStorage(STORAGE_KEY, '')

  /**
     * 生成匿名用户ID
     */
  const genUid = () => {
    const timestamp = new Date().getTime()
    const random = Math.floor(Math.random() * 10000)
    return `av${timestamp}${random}`
  }

  /**
     * 获取或创建匿名用户ID
     */
  const getOrCreateUid = () => {
    try {
        if (!avUid.value) {
            avUid.value = genUid()
        }
        return avUid.value
    } catch (err) {
        reportError(err, 'Error accessing storage--getOrCreateUid')
        return genUid()
    }
  }

  /**
    * 清除匿名用户ID
    */
  const clearUid = () => {
    try {
      avUid.value = null
    } catch (err) {
      reportError(err, 'Error removing anonymous uid--clearUid')
    }
  }

  const handleGoogleLogin = async (credential: string) => {
    if (!credential) {
      reportError(new Error('No credential received from Google'), 'No credential received from Google--handleGoogleLogin')
      return false
    }

    try {
      const response  = await $fetch(config.public.apiHost + '/lapi/aivoicelab/auth', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token: credential })
      })

      const data = response
      
      if (!data) {
        reportError(new Error('No response data'), 'No response data--handleGoogleLogin')
        return false
      }

      if (data.ret === 0) {
        const userData = {
          email: data.email,
          name: data.full_name,
          picture: data.picture,
        }
        await handleLoginSuccess(userData)
        return true
      }

      await handleLoginError('Backend authentication error', {
        reqid: data.reqid,
        ret: data.ret,
        msg: data.msg
      })
      return false

    } catch (err) {
      await handleLoginError('Network or server error', err)
      return false
    }
  }

  const handleLoginSuccess = async (userData: UserData) => {
    await userStore.login(userData)
    await setAuthCookie(userData)
  }

  const handleLoginError = async (message: string, details: any) => {
    reportError(message, details)
    await handleLogout()
  }

  const handleLogout = async () => {
    await userStore.logout()
    await removeAuthCookie()
  }

  const getUserInfo = async (email: string) => {
    if (!email) {
      return {
        ret: 1,
        msg: 'Email is required'
      }
    }

    try {
      const response = await $fetch(config.public.apiHost + '/lapi/aivoicelab/userinfo', {
        method: 'GET',
        params: { email },
        headers: {
          'Content-Type': 'application/json; charset=utf-8',
          'Cache-Control': 'no-cache',
          'Pragma': 'no-cache'
        }
      })

      const data = response
      
      if (data.ret === 0 && data.user_info) {
        return {
          ret: 0,
          userinfo: data.user_info
        }
      } else {
        return {
          ret: 1,
          msg: data.msg
        }
      }
    } catch (err) {
      reportError(err, 'fetch userinfo failed--getUserInfo')
      return {
        ret: 1,
        msg: 'fetch userinfo failed'
      }
    }
  }

  const updateUserCounter = async (email: string, textlen: number, actionType: ActionType = ActionType.TTS_GENERATE) => {
    // 如果email为空直接返回  
    if (!email) {
      return {
        ret: 0,
        msg: 'Email is required'
      }
    }

    try {
      const formData = new FormData()
      formData.append('email', email)
      formData.append('action_type', actionType)  // 添加 action_type 参数
      formData.append('textlen', textlen.toString())

      const response = await $fetch(config.public.apiHost + '/lapi/aivoicelab/counter', {
        method: 'POST',
        body: formData
      })

      const data = response
      
      if (data.ret === 0) {
        return {
          ret: 0,
          msg: 'Counter updated successfully'
        }
      } else {
        return {
          ret: 1,
          msg: data.msg || 'Failed to update counter'
        }
      }
    } catch (err) {
      reportError(err, 'update counter failed--updateUserCounter')
      return {
        ret: 1,
        msg: 'Failed to update counter'
      }
    }
  }

  // 更新功能使用次数（Cover、Sound、VocalIsolate等）
  // 只需要 action_type 和 email，不需要 textlen
  const updateUsageCount = async (email: string, actionType: ActionType) => {
    // 如果email为空直接返回  
    if (!email) {
      return {
        ret: 0,
        msg: 'Email is required'
      }
    }

    try {
      const formData = new FormData()
      formData.append('email', email)
      formData.append('action_type', actionType)
      // 注意：其他功能不需要 textlen 参数

      const response = await $fetch(config.public.apiHost + '/lapi/aivoicelab/counter', {
        method: 'POST',
        body: formData
      })

      const data = response
      
      if (data.ret === 0) {
        return {
          ret: 0,
          msg: 'Usage count updated successfully'
        }
      } else {
        return {
          ret: 1,
          msg: data.msg || 'Failed to update usage count'
        }
      }
    } catch (err) {
      reportError(err, 'update usage count failed--updateUsageCount')
      return {
        ret: 1,
        msg: 'Failed to update usage count'
      }
    }
  }

  return {
    getOrCreateUid,
    clearUid,
    handleGoogleLogin,
    handleLogout,
    getUserInfo,
    updateUserCounter,
    updateUsageCount
  }
}