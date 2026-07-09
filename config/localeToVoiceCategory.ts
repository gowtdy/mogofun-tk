/** Site locale → voice model category (catid) mapping. */
export const LOCALE_TO_VOICE_CATEGORY: Record<string, string> = {
  en: 'english',
  ja: 'japan',
  zh: 'china',
  'zh-tw': 'china',
  fr: 'france',
  de: 'germany',
  es: 'spain',
  ru: 'russia',
  ko: 'korea',
  pt: 'portugal',
  ar: 'arab',
  it: 'italy',
  nl: 'holland',
  pl: 'poland',
}

export function getVoiceCategoryForLocale(locale: string): string | undefined {
  return LOCALE_TO_VOICE_CATEGORY[locale]
}

interface VoiceModelCategory {
  catid: string
  options?: { modelid: string }[]
}

/**
 * Resolve the voice category for the current page.
 * Non-English locales prefer the locale mapping; English keeps page-specific defaults.
 */
export function resolveVoiceCategory(
  locale: string,
  voiceModels: VoiceModelCategory[],
  pageDefaultCategory: string
): string {
  const available = new Set(voiceModels.map((m) => m.catid))
  const localeCategory = getVoiceCategoryForLocale(locale)

  if (locale !== 'en' && localeCategory && available.has(localeCategory)) {
    return localeCategory
  }

  if (pageDefaultCategory && available.has(pageDefaultCategory)) {
    return pageDefaultCategory
  }

  if (localeCategory && available.has(localeCategory)) {
    return localeCategory
  }

  return voiceModels[0]?.catid ?? ''
}

export function resolveVoiceModel(
  categoryId: string,
  voiceModels: VoiceModelCategory[],
  pageDefaultModel: string
): string {
  const category = voiceModels.find((m) => m.catid === categoryId)
  if (!category?.options?.length) {
    return pageDefaultModel
  }

  const defaultInCategory = category.options.find((o) => o.modelid === pageDefaultModel)
  return defaultInCategory?.modelid ?? category.options[0].modelid
}
