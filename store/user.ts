import { defineStore } from 'pinia'
import type { UserData } from '~/types/user'
import { useErrorReporter } from '~/composables/errorReporter'

interface UserState {
  user: UserData | null
  isAuthenticated: boolean
  token: string | null
  loading: boolean
}

export const useUserStore = defineStore('user', {
  state: (): UserState => ({
    user: null,
    isAuthenticated: false,
    token: null,
    loading: false,
  }),

  getters: {
    // 获取用户信息
    getUserInfo: (state) => state.user,
    // 判断是否已登录
    isLoggedIn: (state) => state.isAuthenticated,
    // 获取用户头像
    getUserAvatar: (state) => state.user?.picture || '',
    // 获取用户名
    getUserName: (state) => state.user?.name || '',
    // 获取用户邮箱
    getUserEmail: (state) => state.user?.email || ''
  },

  actions: {
    // 设置加载状态
    setLoading(status: boolean) {
      this.loading = status
    },

    // 设置用户信息
    setUser(userData: UserData | null) {
      this.user = userData
      this.isAuthenticated = !!userData
      // 存储到 localStorage，确保是字符串形式
      if (userData) {
        localStorage.setItem('user', JSON.stringify(userData))
      } else {
        localStorage.removeItem('user')
      }
    },

    // 设置 token
    setToken(token: string | null) {
      this.token = token
      // 同步处理 token 的存储
      if (token) {
        localStorage.setItem('token', token)
      } else {
        localStorage.removeItem('token')
      }
    },

    // 登录
    async login(userData: UserData) {
      const { reportError } = useErrorReporter()
      try {
        this.setLoading(true)
        this.setUser(userData)
        return true
      } catch (err) {
        await reportError(err, { action: 'login' }, this.user?.id, this.user?.email)
        return false
      } finally {
        this.setLoading(false)
      }
    },

    // 登出
    async logout() {
      const { reportError } = useErrorReporter()
      try {
        this.setLoading(true)
        this.setUser(null)
        this.setToken(null)
        return true
      } catch (err) {
        await reportError(err, { action: 'logout' }, this.user?.id, this.user?.email)
        return false
      } finally {
        this.setLoading(false)
      }
    },

    async initUserState(): Promise<void> {
      const { reportError } = useErrorReporter()
      try {
        // 同时恢复 user 和 token
        const [savedUser, savedToken] = await Promise.all([
          localStorage.getItem('user'),
          localStorage.getItem('token')
        ])

        if (savedToken) {
          this.setToken(savedToken)
        }

        if (savedUser) {
          const userData = JSON.parse(savedUser)
          this.setUser(userData)
        }
      } catch (err) {
        await reportError(err, { action: 'initUserState' }, this.user?.id, this.user?.email)
        this.setUser(null)
        this.setToken(null)
      }
    },
  },

  persist: {
    storage: process.client ? localStorage : null,
    paths: ['user', 'token', 'isAuthenticated'], // 只持久化需要的字段
  },
})
