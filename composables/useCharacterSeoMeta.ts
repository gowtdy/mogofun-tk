import { useI18n } from 'vue-i18n'
import { useErrorReporter } from './errorReporter'
import { usePageSeoMeta } from './usePageSeoMeta'

function resolveCharacterLocale(i18nLocale: unknown, fallback: string): string {
  if (typeof i18nLocale === 'string') return i18nLocale
  if (
    i18nLocale &&
    typeof i18nLocale === 'object' &&
    'code' in i18nLocale &&
    typeof (i18nLocale as { code: string }).code === 'string'
  ) {
    return (i18nLocale as { code: string }).code
  }
  return fallback || 'en'
}

export function useCharacterSeoMeta(characterSlug: string, currentLocale: string, dir = '') {
  const { t, locale } = useI18n()
  const { reportError } = useErrorReporter()

  if (!characterSlug) {
    const error = new Error('characterSlug cannot be null or undefined')
    reportError(error, { functionName: 'useCharacterSeoMeta', parameter: 'characterSlug' })
  }
  if (!currentLocale) {
    const error = new Error('currentLocale cannot be null or undefined')
    reportError(error, { functionName: 'useCharacterSeoMeta', parameter: 'currentLocale' })
  }

  usePageSeoMeta({
    locale: () => resolveCharacterLocale(locale.value, currentLocale),
    pathSlug: characterSlug,
    pathPrefix: dir || undefined,
    watchDeps: () => locale.value,
    getContent: () => ({
      title: t(`meta.${characterSlug}.title`),
      description: t(`meta.${characterSlug}.description`),
      keywords: t(`meta.${characterSlug}.keywords`),
      ogTitle: t(`meta.${characterSlug}.og.title`),
      ogDescription: t(`meta.${characterSlug}.og.description`),
      twitterTitle: t(`meta.${characterSlug}.twitter.title`),
      twitterDescription: t(`meta.${characterSlug}.twitter.description`)
    })
  })
}
