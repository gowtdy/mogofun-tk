import { defineAsyncComponent, type Component } from 'vue'
import { useErrorReporter } from '~/composables/errorReporter'

/**
 * 懒加载组件工具
 * 提供统一的组件懒加载和错误处理
 */
export function useLazyComponent() {
  /**
   * 创建懒加载组件
   * @param loader 组件加载函数
   * @param options 配置选项
   */
  function createLazyComponent(
    loader: () => Promise<Component>,
    options: {
      delay?: number
      timeout?: number
      loadingComponent?: Component
      errorComponent?: Component
    } = {}
  ) {
    const {
      delay = 200,
      timeout = 10000,
      loadingComponent,
      errorComponent
    } = options

    return defineAsyncComponent({
      loader,
      delay,
      timeout,
      loadingComponent: loadingComponent || {
        template: `
          <div class="flex justify-center items-center py-8">
            <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        `
      },
      errorComponent: errorComponent || {
        template: `
          <div class="flex justify-center items-center py-8 text-red-600">
            <div class="text-center">
              <p>Failed to load component</p>
              <button 
                @click="$emit('retry')" 
                class="mt-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Retry
              </button>
            </div>
          </div>
        `
      },
      onError(error, retry, fail, attempts) {
        reportError(error, `Component loading failed (attempt ${attempts})`, '')
        if (attempts <= 3) {
          retry()
        } else {
          fail()
        }
      }
    })
  }

  /**
   * 预加载组件
   * @param loader 组件加载函数
   */
  function preloadComponent(loader: () => Promise<Component>) {
    if (typeof window !== 'undefined') {
      // Preload during idle time
      if (typeof requestIdleCallback !== 'undefined') {
        requestIdleCallback(() => {
          loader().catch(error => {
            reportError(error, 'Component preload failed', '')
          })
        }, { timeout: 5000 })
      } else {
        // Fallback for browsers without requestIdleCallback
        setTimeout(() => {
          loader().catch(error => {
            reportError(error, 'Component preload failed', '')
          })
        }, 100)
      }
    }
  }

  return {
    createLazyComponent,
    preloadComponent
  }
}
