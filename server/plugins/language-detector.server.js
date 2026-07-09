import { defineNitroPlugin } from 'nitropack/runtime/plugin'
import { validLanguages } from '../../config/i18nConfig'
import { getVoiceCategoryForLocale } from '../../config/localeToVoiceCategory'

export default defineNitroPlugin((nitroApp) => {
  // 使用统一的语言配置
  const validLangs = [...validLanguages];

  nitroApp.hooks.hook('request', (event) => {
    var navlang = 'en'; // 默认语言
    var selectedLanguage = 'english';  // 语音模型的默认语言

    // 从路径第一段解析语言（仅 pathname，忽略 query）
    // 排除 Nuxt 内部请求如 /_payload.json?dev，避免把 _payload.json?dev 当成「语言码」
    const raw = event.req.url || '/'
    const pathname = raw.split('?')[0].split('#')[0] || '/'
    const segments = pathname.split('/').filter(Boolean)
    let firstSeg = event.context.params?.lang || segments[0]
    if (
      typeof firstSeg === 'string' &&
      (firstSeg.includes('.') || firstSeg.startsWith('_'))
    ) {
      firstSeg = undefined
    }
    const urlLang = firstSeg

    // 检查 urlLang
    if (urlLang && validLangs.includes(urlLang)) {
      navlang = urlLang;
    }
    if (process.env.NODE_ENV === 'development') {
      console.log('navlang:', navlang)
      console.log('urlLang:', urlLang, 'pathname:', pathname)
    }
    // 将检测到的语言添加到事件上下文中
    event.context.lang = navlang;

    const mappedCategory = getVoiceCategoryForLocale(navlang)
    if (mappedCategory) {
      selectedLanguage = mappedCategory
    }
    
    // Add selectedLanguage to the event context
    event.context.selectedLanguage = selectedLanguage;
    
    // 设置 HTML lang 属性
    event.res.setHeader('Content-Language', navlang);
  })
})
