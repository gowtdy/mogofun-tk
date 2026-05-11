/**
 * 高级页面错误处理 Composable
 * 
 * 提供统一的页面级错误处理功能，包括：
 * - 全局未捕获错误处理
 * - Promise 拒绝处理  
 * - 手动错误报告
 * - 响应式用户信息支持
 * 
 * @example
 * // 基本使用
 * const { reportPageError } = useAdvancedPageErrorHandler({
 *   pageName: 'HomePage'
 * })
 * 
 * @example  
 * // 完整配置使用
 * const uid = ref('user123')
 * const userEmail = ref('user@example.com')
 * 
 * const { reportPageError, handleError, handleUnhandledRejection } = useAdvancedPageErrorHandler({
 *   pageName: 'HomePage',
 *   uid,
 *   userEmail,
 *   enableGlobalHandlers: true
 * })
 * 
 * // 手动报告错误
 * try {
 *   // 一些可能出错的代码
 * } catch (error) {
 *   reportPageError(error, 'Failed to load data')
 * }
 * 
 * @example
 * // 禁用全局错误处理器（只使用手动报告）
 * const { reportPageError } = useAdvancedPageErrorHandler({
 *   pageName: 'HomePage', 
 *   enableGlobalHandlers: false
 * })
 */

import { onMounted, onUnmounted, computed, type Ref } from 'vue'
import { useErrorReporter } from './errorReporter'

interface AdvancedPageErrorHandlerOptions {
  pageName: string
  uid?: Ref<string> | string
  userEmail?: Ref<string> | string
  enableGlobalHandlers?: boolean
}

export function useAdvancedPageErrorHandler(options: AdvancedPageErrorHandlerOptions) {
  const { reportError } = useErrorReporter()
  
  const { pageName, uid, userEmail, enableGlobalHandlers = true } = options
  
  const pageUrl = computed(() => {
    if (process.client) {
      return window.location.href
    }
    return ''
  })

  // 获取响应式的 uid 和 userEmail 值
  const getUidValue = () => {
    if (!uid) return ''
    return typeof uid === 'string' ? uid : uid.value
  }

  const getUserEmailValue = () => {
    if (!userEmail) return ''
    return typeof userEmail === 'string' ? userEmail : userEmail.value
  }

  // 处理未捕获的错误
  const handleError = (event: ErrorEvent) => {
    reportError(
      event.error,
      `Runtime error in ${pageName} Page - pageUrl: ${pageUrl.value}, message: ${event.message}`,
      getUidValue(),
      getUserEmailValue()
    )
  }

  // 处理未处理的Promise拒绝
  const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
    reportError(
      event.reason,
      `Unhandled Promise rejection in ${pageName} Page - pageUrl: ${pageUrl.value}`,
      getUidValue(),
      getUserEmailValue()
    )
  }

  // 手动报告错误的方法
  const reportPageError = (error: Error | any, context: string = '') => {
    reportError(
      error,
      `Manual error report in ${pageName} Page - pageUrl: ${pageUrl.value}${context ? `, context: ${context}` : ''}`,
      getUidValue(),
      getUserEmailValue()
    )
  }

  // 设置全局错误处理器
  const setupGlobalHandlers = () => {
    if (process.client && enableGlobalHandlers) {
      window.addEventListener('error', handleError)
      window.addEventListener('unhandledrejection', handleUnhandledRejection)
    }
  }

  // 清理全局错误处理器
  const cleanupGlobalHandlers = () => {
    if (process.client && enableGlobalHandlers) {
      window.removeEventListener('error', handleError)
      window.removeEventListener('unhandledrejection', handleUnhandledRejection)
    }
  }

  onMounted(() => {
    setupGlobalHandlers()
  })

  onUnmounted(() => {
    cleanupGlobalHandlers()
  })

  return {
    reportPageError,
    setupGlobalHandlers,
    cleanupGlobalHandlers,
    handleError,
    handleUnhandledRejection,
    pageUrl
  }
}

// 导出类型供其他文件使用
export type { AdvancedPageErrorHandlerOptions } 