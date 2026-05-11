/**
 * usePageDescription Composable
 * 
 * 用于处理页面描述的初始化和语言切换逻辑的可复用组合函数
 * 
 * @example
 * ```typescript
 * // 在页面组件中使用
 * const { pageDescription } = usePageDescription({
 *   pageKey: 'ariana-grande',
 *   defaultDescription: 'Default character description...'
 * })
 * 
 * // 在模板中使用
 * <CharacterHeader :description="pageDescription.description" />
 * ```
 * 
 * @param options 配置选项
 * @param options.pageKey 页面标识键，用于从 constants/characterDescription 中获取对应的描述数据
 * @param options.defaultDescription 默认描述，当获取不到翻译数据时使用
 * 
 * @returns 返回响应式的页面描述对象
 */

import { ref, watch, computed, readonly } from 'vue'
import { getCharacterDescription } from '~/constants/characterDescription'
import { useErrorReporter } from '~/composables/errorReporter'
import { useAuth } from '~/composables/useAuth'
import { useUserStore } from '~/store/user'
import { useRequestEvent } from '#app'

interface PageDescriptionOptions {
  pageKey: string
  defaultDescription?: string
}

export const usePageDescription = (options: PageDescriptionOptions) => {
  const { pageKey, defaultDescription = '' } = options
  
  const { reportError } = useErrorReporter()
  const { getOrCreateUid } = useAuth()
  const userStore = useUserStore()
  
  const uid = ref(getOrCreateUid())
  const userEmail = computed(() => userStore.user?.email || '')
  
  // 获取当前语言，确保有安全的回退值
  const event = useRequestEvent()
  const lang = useState('lang', () => event?.context?.lang || 'en')

  // 优化描述初始化 - 确保服务端渲染时就有稳定内容
  let initialPageDescription
  try {
    const descriptionData = getCharacterDescription(pageKey, lang.value)[0]
    initialPageDescription = {
      description: descriptionData?.description || defaultDescription
    }
  } catch (error) {
    initialPageDescription = {
      description: defaultDescription
    }
  }

  const pageDescription = ref(initialPageDescription)

  // 监听语言变化 - 仅在客户端且语言确实变化时更新
  watch(() => lang.value, async (newLang, oldLang) => {
    // 避免初始化时的无意义更新
    if (process.client && newLang !== oldLang) {
      try {
        const descriptionData = getCharacterDescription(pageKey, newLang)[0]
        if (descriptionData?.description && descriptionData.description !== pageDescription.value.description) {
          pageDescription.value = {
            description: descriptionData.description
          }
        }
      } catch (error) {
        reportError(
          error,
          `Error updating page description - pageKey: ${pageKey}, lang: ${newLang}`,
          uid.value,
          userEmail.value
        )
      }
    }
  })

  return {
    pageDescription: readonly(pageDescription),
    lang: readonly(lang)
  }
} 