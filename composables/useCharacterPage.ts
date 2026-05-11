import { ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useUserStore } from '~/store/user'
import { useAuth } from '~/composables/useAuth'
import { useErrorReporter } from '~/composables/errorReporter'
import { usePageErrorHandler } from '~/composables/usePageErrorHandler'
import { useCharacterSeoMeta } from '~/composables/useCharacterSeoMeta'

export function useCharacterPage(characterSlug: string, dir='') {
  const { t, tm, locale } = useI18n()
  const { getOrCreateUid } = useAuth()
  const uid = ref(getOrCreateUid())

  const userStore = useUserStore()
  const isLoggedIn = computed(() => !!userStore.user)
  const userEmail = computed(() => userStore.user?.email || '')

  const currentLocale = computed(() => {
    return typeof locale.value === 'string' ? locale.value : 'en'
  })

  useCharacterSeoMeta(characterSlug, currentLocale.value, dir)

  // FAQ相关
  const faqTitle = computed(() => tm(`character.${characterSlug}.faqs.title`) || '')
  const faqs = computed(() => {
    // 先拿到原始数组，确保是数组类型
    const raw = tm(`character.${characterSlug}.faqs.items`)
    const items = Array.isArray(raw) ? raw : []
    // 用 t 获取每一项的字符串
    return items.map((_, idx) => ({
      question: t(`character.${characterSlug}.faqs.items.${idx}.question`),
      answer: t(`character.${characterSlug}.faqs.items.${idx}.answer`)
    }))
  })
  const faqOpenStates = ref(Array(faqs.value.length).fill(false))
  
  const toggleFaq = (index: number) => {
    if (index >= 0 && index < faqOpenStates.value.length) {
      faqOpenStates.value[index] = !faqOpenStates.value[index]
    }
  }

  // 介绍部分
  const introSections = computed(() => {
    const raw = tm(`character.${characterSlug}.intro_sections`)
    return Array.isArray(raw) ? raw : []
  })

  // 错误处理
  const { reportError } = useErrorReporter()
  const pageUrl = computed(() => {
    if (process.client) {
      return window.location.href
    }
    return ''
  })

  const { onPageError } = usePageErrorHandler(characterSlug, uid.value, userEmail.value)

  // 初始化函数
  const initPage = () => {
    userStore.initUserState()
  }

  return {
    isLoggedIn,
    userEmail,
    faqs,
    faqOpenStates,
    toggleFaq,
    introSections,
    onPageError,
    initPage,
    t,
    tm
  }
}