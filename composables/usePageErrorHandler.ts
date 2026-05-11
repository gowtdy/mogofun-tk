import { onMounted, onUnmounted, computed } from 'vue'
import { useErrorReporter } from './errorReporter'

export function usePageErrorHandler(pageName: string, uid: string='', userEmail: string='') {
  const { reportError } = useErrorReporter()
  
  const pageUrl = computed(() => {
    if (process.client) {
      return window.location.href
    }
    return ''
  })

  // 处理未捕获的错误
  const handleError = (event: ErrorEvent) => {
    reportError(
      event.error,
      `Runtime error in ${pageName} Page - pageUrl: ${pageUrl.value}, message: ${event.message}`,
      uid,
      userEmail
    )
  }

  // 处理未处理的Promise拒绝
  const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
    reportError(
      event.reason,
      `Unhandled Promise rejection in ${pageName} Page - pageUrl: ${pageUrl.value}`,
      uid,
      userEmail
    )
  }

  onMounted(() => {
    if (process.client) {
      window.addEventListener('error', handleError)
      window.addEventListener('unhandledrejection', handleUnhandledRejection)
    }
  })

  onUnmounted(() => {
    if (process.client) {
      window.removeEventListener('error', handleError)
      window.removeEventListener('unhandledrejection', handleUnhandledRejection)
    }
  })

  const onPageError = (error: Error, info: string) => {
    reportError(error, `Global error in ${pageName} Page - pageUrl: ${pageUrl.value}, errorInfo: ${info}`, uid, userEmail)
    return false
  }

  return {
    onPageError
  }
}