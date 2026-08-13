import { computed, toValue, type MaybeRefOrGetter } from 'vue'
import { useHead, useRuntimeConfig } from '#imports'
import { config } from '~/config/config'
import { buildAbsoluteUrl, buildHomeUrl } from '~/composables/usePageSeoMeta'

const ORG_ID = `${config.host}/#organization`
const WEBSITE_ID = `${config.host}/#website`

export type JsonLdFaqItem = {
  question: string
  answer: string
}

export type UsePageJsonLdOptions = {
  locale: MaybeRefOrGetter<string>
  /** Absolute canonical URL, or omit and use pathSlug / isHome builders */
  canonicalUrl?: MaybeRefOrGetter<string>
  pathSlug?: MaybeRefOrGetter<string>
  pathPrefix?: MaybeRefOrGetter<string | undefined>
  isHome?: MaybeRefOrGetter<boolean>
  name: MaybeRefOrGetter<string>
  description: MaybeRefOrGetter<string>
  faqs?: MaybeRefOrGetter<JsonLdFaqItem[] | undefined>
  /** Default true — emit SoftwareApplication for tool / character pages */
  includeSoftwareApplication?: boolean
  watchDeps?: MaybeRefOrGetter<unknown>
}

function resolveCanonicalUrl(options: UsePageJsonLdOptions): string {
  const explicit = options.canonicalUrl !== undefined ? toValue(options.canonicalUrl) : undefined
  if (explicit) return explicit

  const locale = toValue(options.locale)
  const isHome = toValue(options.isHome) === true
  if (isHome) return buildHomeUrl(config.host, locale)

  return buildAbsoluteUrl(
    config.host,
    locale,
    toValue(options.pathPrefix),
    toValue(options.pathSlug) ?? ''
  )
}

/** Global Organization + WebSite entity markup (call once from app.vue). */
export function useSiteJsonLd() {
  useHead({
    script: [
      {
        key: 'jsonld-site',
        type: 'application/ld+json',
        innerHTML: JSON.stringify({
          '@context': 'https://schema.org',
          '@graph': [
            {
              '@type': 'Organization',
              '@id': ORG_ID,
              name: config.organization.name,
              legalName: config.organization.legalName,
              url: config.host,
              logo: {
                '@type': 'ImageObject',
                url: config.organization.logo
              }
            },
            {
              '@type': 'WebSite',
              '@id': WEBSITE_ID,
              url: config.host,
              name: config.organization.name,
              publisher: { '@id': ORG_ID },
              inLanguage: config.locales
            }
          ]
        })
      }
    ]
  })
}

/** Page-level WebPage + optional FAQPage + SoftwareApplication. */
export function usePageJsonLd(options: UsePageJsonLdOptions) {
  const runtimeConfig = useRuntimeConfig()
  const includeApp = options.includeSoftwareApplication !== false

  useHead(
    computed(() => {
      void toValue(options.watchDeps)

      const locale = toValue(options.locale)
      const name = toValue(options.name)
      const description = toValue(options.description)
      const canonicalUrl = resolveCanonicalUrl(options)
      const faqs = toValue(options.faqs) ?? []
      const dateModified =
        (runtimeConfig.public.buildDate as string | undefined) ||
        new Date().toISOString().slice(0, 10)
      const datePublished = config.seo.datePublished

      const graph: Record<string, unknown>[] = [
        {
          '@type': 'WebPage',
          '@id': `${canonicalUrl}#webpage`,
          url: canonicalUrl,
          name,
          description,
          inLanguage: locale,
          isPartOf: { '@id': WEBSITE_ID },
          author: { '@id': ORG_ID },
          publisher: { '@id': ORG_ID },
          datePublished,
          dateModified
        }
      ]

      if (faqs.length > 0) {
        graph.push({
          '@type': 'FAQPage',
          '@id': `${canonicalUrl}#faq`,
          isPartOf: { '@id': `${canonicalUrl}#webpage` },
          mainEntity: faqs.map((item) => ({
            '@type': 'Question',
            name: item.question,
            acceptedAnswer: {
              '@type': 'Answer',
              text: item.answer
            }
          }))
        })
      }

      if (includeApp) {
        graph.push({
          '@type': 'SoftwareApplication',
          '@id': `${canonicalUrl}#app`,
          name,
          description,
          url: canonicalUrl,
          applicationCategory: 'MultimediaApplication',
          operatingSystem: 'Web',
          offers: {
            '@type': 'Offer',
            price: '0',
            priceCurrency: 'USD'
          },
          publisher: { '@id': ORG_ID }
        })
      }

      return {
        script: [
          {
            key: 'jsonld-page',
            type: 'application/ld+json',
            innerHTML: JSON.stringify({
              '@context': 'https://schema.org',
              '@graph': graph
            })
          }
        ]
      }
    })
  )
}
