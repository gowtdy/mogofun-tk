// composables/useSeoMeta.js
import { useHead } from '#imports'
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRoute } from 'vue-router'
import { useErrorReporter } from './errorReporter'

export function useCharacterSeoMeta(characterSlug: string, currentLocale: string, dir='') {
  const { t } = useI18n()
  const route = useRoute()
  const host = 'https://mogofun.com'
  const cdnHost = 'https://cdn.mogofun.com'
  const { reportError } = useErrorReporter()

  // 错误检查
  if (!characterSlug) {
    const error = new Error('characterSlug cannot be null or undefined')
    reportError(error, { functionName: 'useCharacterSeoMeta', parameter: 'characterSlug' })
  }
  if (!currentLocale) {
    const error = new Error('currentLocale cannot be null or undefined')
    reportError(error, { functionName: 'useCharacterSeoMeta', parameter: 'currentLocale' })
  }

  // 构建URL路径的辅助函数
  const buildUrl = (locale: string) => {
    const basePath = dir ? `${locale}/${dir}/${characterSlug}` : `${locale}/${characterSlug}`
    return `${host}/${basePath}`
  }

  useHead({
    htmlAttrs: {
      lang: currentLocale
    },
    title: t(`meta.${characterSlug}.title`),
    meta: [
      { name: 'description', content: t(`meta.${characterSlug}.description`) },
      { name: 'keywords', content: t(`meta.${characterSlug}.keywords`) },
      { property: 'og:type', content: 'website' },
      { property: 'og:title', content: t(`meta.${characterSlug}.og.title`) },
      { property: 'og:description', content: t(`meta.${characterSlug}.og.description`) },
      { property: 'og:url', content: `${host}` },
      { property: 'og:image', content: `${cdnHost}/img/aivoicelab-fbtw.webp` },
      { name: 'twitter:card', content: 'summary_large_image' },
      { name: 'twitter:title', content: t(`meta.${characterSlug}.twitter.title`) },
      { name: 'twitter:description', content: t(`meta.${characterSlug}.twitter.description`) },
      { name: 'twitter:site', content: `${host}` },
      { name: 'twitter:image', content: `${cdnHost}/img/aivoicelab-fbtw.webp` }
    ],
    link: [
      { rel: 'canonical', href: buildUrl(currentLocale) },
      { rel: 'alternate', hreflang: 'x-default', href: buildUrl('en') },
      { rel: 'alternate', hreflang: 'en', href: buildUrl('en') },
      { rel: 'alternate', hreflang: 'zh', href: buildUrl('zh') },
      { rel: 'alternate', hreflang: 'zh-tw', href: buildUrl('zh-tw') },
      { rel: 'alternate', hreflang: 'es', href: buildUrl('es') },
      { rel: 'alternate', hreflang: 'ja', href: buildUrl('ja') },
      { rel: 'alternate', hreflang: 'fr', href: buildUrl('fr') }
    ]
  })
}