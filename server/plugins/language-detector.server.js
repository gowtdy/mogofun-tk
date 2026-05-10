import { defineNitroPlugin } from 'nitropack/runtime/plugin'
import { validLanguages } from '../../config/i18nConfig'

// 根据语言选择默认语言的语音模型。
const lang2SelectLang = {
  'en': 'english',
  'ja': 'japan',
  'zh': 'china',
  'zh-tw': 'china',
  'fr': 'france',
  'de': 'germany',
  'es': 'spain',
  'ru': 'russia',
  'ko': 'korea',
  'pt': 'portugal',
  'ar': 'arab', 
  'it': 'italy',
  'nl': 'holland',
  'pl': 'poland'
}

export default defineNitroPlugin((nitroApp) => {
  // 使用统一的语言配置
  const validLangs = [...validLanguages];

  nitroApp.hooks.hook('request', (event) => {
    var navlang = 'en'; // 默认语言
    var selectedLanguage = 'english';  // 语音模型的默认语言

    // 从 URL 参数获取语言
    const urlLang = event.context.params?.lang || event.req.url?.split('/')[1];

    // 检查 urlLang
    if (urlLang && validLangs.includes(urlLang)) {
      navlang = urlLang;
    }
    console.log('navlang:', navlang)
    console.log('urlLang:', urlLang)
    // 将检测到的语言添加到事件上下文中
    event.context.lang = navlang;

    if (navlang in lang2SelectLang) {
      selectedLanguage = lang2SelectLang[navlang];
    }
    
    // Add selectedLanguage to the event context
    event.context.selectedLanguage = selectedLanguage;
    
    // 设置 HTML lang 属性
    event.res.setHeader('Content-Language', navlang);
  })
})
