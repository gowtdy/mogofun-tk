import { ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useUserStore } from '~/store/user'
import { useAuth } from '~/composables/useAuth'
import { useErrorReporter } from '~/composables/errorReporter'
import { usePageErrorHandler } from '~/composables/usePageErrorHandler'
import { useCharacterSeoMeta } from '~/composables/useCharacterSeoMeta'
import { usePageJsonLd } from '~/composables/useJsonLd'
import { config } from '~/config/config'
import { buildAbsoluteUrl } from '~/composables/usePageSeoMeta'

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

  // FAQ相关（keys typed as string to avoid vue-i18n deep ResourcePath instantiation）
  const faqTitleKey = `character.${characterSlug}.faqs.title` as string
  const faqItemsKey = `character.${characterSlug}.faqs.items` as string
  const faqTitle = computed(() => t(faqTitleKey) || '')
  const faqs = computed(() => {
    const raw = tm(faqItemsKey) || []
    const items = Array.isArray(raw) ? raw : []
    return items.map((_, idx) => ({
      question: t(`${faqItemsKey}.${idx}.question`),
      answer: t(`${faqItemsKey}.${idx}.answer`)
    }))
  })

  usePageJsonLd({
    locale: currentLocale,
    pathSlug: characterSlug,
    pathPrefix: dir || undefined,
    watchDeps: () => locale.value,
    name: () => t(`meta.${characterSlug}.title` as string),
    description: () => t(`meta.${characterSlug}.description` as string),
    faqs,
  })

  const faqOpenStates = ref(Array(faqs.value.length).fill(false))
  
  const toggleFaq = (index: number) => {
    if (index >= 0 && index < faqOpenStates.value.length) {
      faqOpenStates.value[index] = !faqOpenStates.value[index]
    }
  }

  // 介绍部分
  const introSections = computed(() => {
    const raw = tm(`character.${characterSlug}.intro_sections` as string)
    return Array.isArray(raw) ? raw : []
  })

  // 错误处理
  const { reportError } = useErrorReporter()
  const pageUrl = computed(() => {
    if (process.client) {
      return window.location.href
    }
    return buildAbsoluteUrl(config.host, currentLocale.value, dir || undefined, characterSlug)
  })

  const { onPageError } = usePageErrorHandler(characterSlug, uid.value, userEmail.value)

  // 初始化函数
  const initPage = () => {
    // @ts-ignore - initUserState exists in store actions
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