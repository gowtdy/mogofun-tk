export interface PresetItem {
  id: string
  label: string
  text: string
}

const PRESET_IDS = ['greetings', 'emotions', 'actions', 'stories'] as const

const cache = new Map<string, PresetItem[]>()

function buildPresetsFromItems(
  items: Record<string, { label?: string; text?: string }>
): PresetItem[] {
  return PRESET_IDS.map((id) => ({
    id,
    label: items[id]?.label ?? id,
    text: items[id]?.text ?? '',
  }))
}

function isValidPresets(presets: PresetItem[]): boolean {
  return presets.length > 0 && presets.every((p) => p.label && p.text && !p.label.includes('ai_cover.converter'))
}

export async function loadPresetsForLocale(
  targetLocale: string,
  t?: (key: string) => string,
  siteLocale?: string
): Promise<PresetItem[]> {
  if (cache.has(targetLocale)) {
    return cache.get(targetLocale)!
  }

  if (targetLocale === siteLocale && t) {
    const presets = PRESET_IDS.map((id) => ({
      id,
      label: t(`ai_cover.converter.presets.items.${id}.label`),
      text: t(`ai_cover.converter.presets.items.${id}.text`),
    }))
    if (isValidPresets(presets)) {
      cache.set(targetLocale, presets)
      return presets
    }
  }

  try {
    const res = await fetch(`/i18n/locales/${targetLocale}/index.json`)
    if (!res.ok) {
      console.warn(`[usePresetLocaleMessages] Failed to load presets for locale: ${targetLocale}`)
      return []
    }
    const data = await res.json()
    const items = data?.ai_cover?.converter?.presets?.items ?? {}
    const presets = buildPresetsFromItems(items)
    if (presets.length > 0) {
      cache.set(targetLocale, presets)
    }
    return presets
  } catch (error) {
    console.warn(`[usePresetLocaleMessages] Failed to load presets for locale: ${targetLocale}`, error)
    return []
  }
}
