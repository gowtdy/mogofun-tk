import { useCookie } from '#app'
// 导入已定义的 UserData 类型
import type { UserData } from '~/types/user'
import { useErrorReporter } from '~/composables/errorReporter'

// 定义类型
interface CookieOptions {
  expires?: number
  path?: string
  domain?: string
  secure?: boolean
  sameSite?: 'lax' | 'strict' | 'none'
}

// 基础 cookie 操作
const createCookie = (name: string, options: CookieOptions = {}) => {
  return useCookie(name, {
    maxAge: options.expires ? options.expires * 24 * 60 * 60 : undefined,
    path: options.path || '/',
    domain: options.domain,
    secure: options.secure,
    sameSite: options.sameSite || 'lax'
  })
}

// 导出 cookie 操作函数
export function setCookie(name: string, value: any, days = 30) {
  const cookie = createCookie(name, { expires: days })
  cookie.value = value
}

export function getCookie(name: string) {
  const cookie = createCookie(name)
  return cookie.value
}

export function delCookie(name: string) {
  const cookie = createCookie(name)
  cookie.value = null
}

export function checkCookie(name: string): boolean {
  return getCookie(name) !== null
}

export function setAdvancedCookie(name: string, value: any, options: CookieOptions = {}) {
  const cookie = createCookie(name, options)
  cookie.value = value
}

// 用户认证相关的 cookie 操作
export const useAuthCookie = () => {
  const USER_COOKIE_KEY = 'userData'
  const { reportError } = useErrorReporter()

  const setAuthCookie = (userData: UserData, days = 30) => {
    try {
      const cookie = createCookie(USER_COOKIE_KEY, { expires: days })
      cookie.value = JSON.stringify(userData)
    } catch (err) {
      reportError(err, 'Set auth cookie error--setAuthCookie')
    }
  }

  const removeAuthCookie = () => {
    try {
      const cookie = createCookie(USER_COOKIE_KEY)
      cookie.value = null
    } catch (err) {
      reportError(err, 'Remove auth cookie error--removeAuthCookie')
    }
  }

  const getAuthCookie = (): UserData | null => {
    try {
      const cookie = createCookie(USER_COOKIE_KEY)
      return cookie.value ? JSON.parse(cookie.value as string) : null
    } catch (err) {
      reportError(err, 'Get auth cookie error--getAuthCookie')
      return null
    }
  }

  return {
    setAuthCookie,
    removeAuthCookie,
    getAuthCookie,
    // 导出基础 cookie 操作
    setCookie,
    getCookie,
    delCookie,
    checkCookie,
    setAdvancedCookie
  }
}