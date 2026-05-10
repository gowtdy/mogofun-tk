<template>
  <div>
    <Header />
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </div>
</template>

<script setup>
import Header from '~/components/Header.vue'
import { useErrorReporter } from '~/composables/errorReporter'
import { useAuth } from '~/composables/useAuth'

const { reportError } = useErrorReporter()
const { getOrCreateUid } = useAuth()
const uid = ref(process.client ? getOrCreateUid() : '')

// 预加载 Google Sign-In 库
if (process.client) {
  const loadGoogleSignIn = () => {
    if (!document.querySelector('script[src*="accounts.google.com/gsi/client"]')) {
      const script = document.createElement('script')
      script.src = 'https://accounts.google.com/gsi/client'
      script.async = true
      document.head.appendChild(script)
    }
  }

  // 页面加载完成后立即预加载
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', loadGoogleSignIn)
  } else {
    loadGoogleSignIn()
  }

}

// 全局错误处理
onErrorCaptured((err, instance, info) => {
  if (process.client) {
    reportError(err, `Vue Error - Component: ${instance?.$options?.name || 'unknown'}, Info: ${info}`, uid.value)
  }
  return false
})

// 客户端全局错误处理
if (process.client) {
  window.addEventListener('unhandledrejection', (event) => {
    const error = event.reason instanceof Error ? event.reason : new Error(String(event.reason))
    reportError(error, 'Unhandled Promise Rejection', uid.value)
  })

  window.addEventListener('error', (event) => {
    if (event.target instanceof HTMLElement) {
      reportError(new Error(`Resource load failed: ${event.target.src || event.target.href}`),
        `Resource Loading Error - Type: ${event.target.tagName}`, uid.value)
      return
    }
    reportError(event.error || new Error(event.message), 'Global Error', uid.value)
  }, true)
}
</script>

<!-- 样式已在global.css中定义，此处无需重复 -->
