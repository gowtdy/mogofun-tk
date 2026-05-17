/** Single source of truth for supported site locales (routes, i18n, language selector). */
export const LOCALES = [
  { code: 'en', name: 'English' },
  { code: 'zh', name: '中文' },
  { code: 'zh-tw', name: '繁體中文' },
  { code: 'ja', name: '日本語' },
  { code: 'fr', name: 'Français' },
  { code: 'de', name: 'Deutsch' },
  { code: 'es', name: 'Español' },
  { code: 'pt', name: 'Português' },
  { code: 'ko', name: '한국어' },
  { code: 'ar', name: 'العربية', dir: 'rtl' as const },
] as const

export type LocaleCode = (typeof LOCALES)[number]['code']

/** Language codes for config.locales, validLanguages, URL prefix detection, etc. */
export const localeCodes: LocaleCode[] = LOCALES.map((l) => l.code)

export const validLanguages = localeCodes

/** Nuxt @nuxtjs/i18n locale entries (no files — dynamic loader handles translations). */
export function toNuxtLocaleConfig() {
  return LOCALES.map((entry) => {
    const { code, name } = entry
    return 'dir' in entry ? { code, name, dir: entry.dir } : { code, name }
  })
}
