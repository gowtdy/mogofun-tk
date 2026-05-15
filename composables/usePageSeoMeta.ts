import { computed, toValue, type MaybeRefOrGetter } from 'vue'
import { useHead } from '#imports'
import { config } from '../config/config.js'
import { useErrorReporter } from './errorReporter'

/** Same as `useIndexGenericPage` setupSEO */
const ROBOTS_CONTENT =
  'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1'

export type PageSeoMetaContent = {
  title: string
  description: string
  keywords: string
  ogTitle?: string
  ogDescription?: string
  twitterTitle?: string
  twitterDescription?: string
}

/** Same order as `useIndexGenericPage` non-home alternates */
const DEFAULT_ALTERNATE_LOCALES = ['en', 'zh', 'zh-tw', 'ja', 'fr', 'es'] as const

export type UsePageSeoMetaOptions = {
  /** Current page locale (html lang + canonical), e.g. `useState('lang')` or i18n */
  locale: MaybeRefOrGetter<string>
  /** Last URL segment(s) after optional prefix, e.g. `sound-effect` or character slug */
  pathSlug: MaybeRefOrGetter<string>
  /** Optional middle segment: `/{locale}/{pathPrefix}/{pathSlug}` */
  pathPrefix?: MaybeRefOrGetter<string | undefined>
  /** SEO strings; runs inside `computed` so `t()` stays in sync with i18n */
  getContent: () => PageSeoMetaContent
  /** Extra reactive deps (e.g. global i18n locale ref) */
  watchDeps?: MaybeRefOrGetter<unknown>
  /** Defaults to `config.host` (same as `useIndexGenericPage` og:url) */
  ogUrl?: MaybeRefOrGetter<string | undefined>
  /** Defaults to `${cdnHost}${config.ogImage}` */
  ogImage?: MaybeRefOrGetter<string | undefined>
  /** Defaults to `${cdnHost}${config.twitterImage}` */
  twitterImage?: MaybeRefOrGetter<string | undefined>
  /** Defaults to `config.host` */
  twitterSite?: MaybeRefOrGetter<string | undefined>
  /** Adds preconnect + dns-prefetch for `config.host` */
  prefetchHost?: boolean
  alternateLocales?: readonly string[]
  /** Report missing slug/locale via errorReporter */
  validate?: boolean
}

function buildCanonicalPath(
  locale: string,
  pathPrefix: string | undefined,
  pathSlug: string
): string {
  const parts = [locale]
  if (pathPrefix) parts.push(pathPrefix)
  parts.push(pathSlug)
  return parts.join('/')
}

function buildAbsoluteUrl(host: string, locale: string, pathPrefix: string | undefined, pathSlug: string): string {
  return `${host}/${buildCanonicalPath(locale, pathPrefix, pathSlug)}`
}

/**
 * Shared reactive `useHead` setup aligned with `useIndexGenericPage` setupSEO:
 * robots, OG/Twitter field order, default og:url = site root, hreflang order.
 */
export function usePageSeoMeta(options: UsePageSeoMetaOptions) {
  const { reportError } = useErrorReporter()
  const host = config.host
  const cdnHost = config.cdnHost
  const ogImagePath = config.ogImage
  const twitterImagePath = config.twitterImage

  useHead(
    computed(() => {
      void toValue(options.watchDeps)

      const locale = toValue(options.locale)
      const pathSlug = toValue(options.pathSlug)
      const pathPrefix = toValue(options.pathPrefix)

      if (options.validate) {
        if (!pathSlug) {
          reportError(new Error('pathSlug cannot be empty'), {
            functionName: 'usePageSeoMeta',
            parameter: 'pathSlug'
          })
        }
        if (!locale) {
          reportError(new Error('locale cannot be empty'), {
            functionName: 'usePageSeoMeta',
            parameter: 'locale'
          })
        }
      }

      const content = options.getContent()
      const ogTitle = content.ogTitle ?? content.title
      const ogDescription = content.ogDescription ?? content.description
      const twitterTitle = content.twitterTitle ?? ogTitle
      const twitterDescription = content.twitterDescription ?? ogDescription

      const canonicalUrl = buildAbsoluteUrl(host, locale, pathPrefix, pathSlug)
      const ogUrl = toValue(options.ogUrl) ?? host
      const ogImage = toValue(options.ogImage) ?? `${cdnHost}${ogImagePath}`
      const twitterImage = toValue(options.twitterImage) ?? `${cdnHost}${twitterImagePath}`
      const twitterSite = toValue(options.twitterSite) ?? host

      const alternates = options.alternateLocales ?? DEFAULT_ALTERNATE_LOCALES

      const link: { rel: string; href: string; hreflang?: string }[] = []
      if (options.prefetchHost) {
        link.push({ rel: 'preconnect', href: host })
        link.push({ rel: 'dns-prefetch', href: host })
      }
      link.push({ rel: 'canonical', href: canonicalUrl })
      const enHref = buildAbsoluteUrl(host, 'en', pathPrefix, pathSlug)
      link.push({ rel: 'alternate', hreflang: 'x-default', href: enHref })
      for (const loc of alternates) {
        link.push({
          rel: 'alternate',
          hreflang: loc,
          href: buildAbsoluteUrl(host, loc, pathPrefix, pathSlug)
        })
      }

      return {
        htmlAttrs: {
          lang: locale
        },
        title: content.title,
        meta: [
          { name: 'description', content: content.description },
          { name: 'keywords', content: content.keywords },
          { name: 'robots', content: ROBOTS_CONTENT },
          { property: 'og:title', content: ogTitle },
          { property: 'og:description', content: ogDescription },
          { property: 'og:type', content: 'website' },
          { property: 'og:url', content: ogUrl },
          { property: 'og:image', content: ogImage },
          { name: 'twitter:card', content: 'summary_large_image' },
          { name: 'twitter:title', content: twitterTitle },
          { name: 'twitter:description', content: twitterDescription },
          { name: 'twitter:site', content: twitterSite },
          { name: 'twitter:image', content: twitterImage }
        ],
        link
      }
    })
  )
}
