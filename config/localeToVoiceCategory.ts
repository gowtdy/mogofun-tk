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
}

export function getVoiceCategoryForLocale(locale: string): string | undefined {
  return LOCALE_TO_VOICE_CATEGORY[locale]
}

/** Voice category (catid) → preset文案 locale for i18n lookup. */
export const VOICE_CATEGORY_TO_PRESET_LOCALE: Record<string, string> = {
  english: 'en',
  english_uk: 'en',
  english_gb: 'en',
  english_ca: 'en',
  english_au: 'en',
  english_nz: 'en',
  english_ie: 'en',
  english_in: 'en',
  english_za: 'en',
  china: 'zh',
  china_yueyu: 'zh',
  japan: 'ja',
  france: 'fr',
  germany: 'de',
  spain: 'es',
  korea: 'ko',
  portugal: 'pt',
  arab: 'ar',
}

export function getPresetLocaleForVoiceCategory(catid: string, fallback = 'en'): string {
  return VOICE_CATEGORY_TO_PRESET_LOCALE[catid] ?? fallback
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
