// 缓存规则配置
// 这个文件定义了不同路由的缓存策略，与 nuxt.config.ts 中的 routeRules 保持一致

export interface CacheRule {
  maxAge: number; // 缓存时间（秒）
  description: string; // 规则描述
}

export const cacheRules: Record<string, CacheRule> = {
  '/en': { maxAge: 300, description: 'EN缓存' },
  '/es': { maxAge: 300, description: 'ES缓存' },
  '/fr': { maxAge: 300, description: 'FR缓存' },
  '/ja': { maxAge: 300, description: 'JA缓存' },
  '/zh': { maxAge: 300, description: 'ZH缓存' },
  '/zh-tw': { maxAge: 300, description: 'ZH-TW缓存' },

  // 静态页面
  '/en/about': { maxAge: 86400, description: 'About EN缓存' },
  '/es/about': { maxAge: 86400, description: 'About ES缓存' },
  '/fr/about': { maxAge: 86400, description: 'About FR缓存' },
  '/ja/about': { maxAge: 86400, description: 'About JA缓存' },
  '/zh/about': { maxAge: 86400, description: 'About ZH缓存' },
  '/zh-tw/about': { maxAge: 86400, description: 'About ZH-TW缓存' },
  '/en/pricing': { maxAge: 3600, description: 'Pricing EN缓存' },
  '/es/pricing': { maxAge: 3600, description: 'Pricing ES缓存' },
  '/fr/pricing': { maxAge: 3600, description: 'Pricing FR缓存' },
  '/ja/pricing': { maxAge: 3600, description: 'Pricing JA缓存' },
  '/zh/pricing': { maxAge: 3600, description: 'Pricing ZH缓存' },
  '/zh-tw/pricing': { maxAge: 3600, description: 'Pricing ZH-TW缓存' },
  '/en/dmca-policy': { maxAge: 86400, description: 'Dmca Policy EN缓存' },
  '/es/dmca-policy': { maxAge: 86400, description: 'Dmca Policy ES缓存' },
  '/fr/dmca-policy': { maxAge: 86400, description: 'Dmca Policy FR缓存' },
  '/ja/dmca-policy': { maxAge: 86400, description: 'Dmca Policy JA缓存' },
  '/zh/dmca-policy': { maxAge: 86400, description: 'Dmca Policy ZH缓存' },
  '/zh-tw/dmca-policy': { maxAge: 86400, description: 'Dmca Policy ZH-TW缓存' },
  '/en/privacy-policy': { maxAge: 86400, description: 'Privacy Policy EN缓存' },
  '/es/privacy-policy': { maxAge: 86400, description: 'Privacy Policy ES缓存' },
  '/fr/privacy-policy': { maxAge: 86400, description: 'Privacy Policy FR缓存' },
  '/ja/privacy-policy': { maxAge: 86400, description: 'Privacy Policy JA缓存' },
  '/zh/privacy-policy': { maxAge: 86400, description: 'Privacy Policy ZH缓存' },
  '/zh-tw/privacy-policy': { maxAge: 86400, description: 'Privacy Policy ZH-TW缓存' },
  '/en/terms-of-service': { maxAge: 86400, description: 'Terms Of-Service EN缓存' },
  '/es/terms-of-service': { maxAge: 86400, description: 'Terms Of-Service ES缓存' },
  '/fr/terms-of-service': { maxAge: 86400, description: 'Terms Of-Service FR缓存' },
  '/ja/terms-of-service': { maxAge: 86400, description: 'Terms Of-Service JA缓存' },
  '/zh/terms-of-service': { maxAge: 86400, description: 'Terms Of-Service ZH缓存' },
  '/zh-tw/terms-of-service': { maxAge: 86400, description: 'Terms Of-Service ZH-TW缓存' },
}

// 获取缓存时间的函数
export const getCacheTime = (url: string): number => {
  const rule = cacheRules[url]
  if (rule) {
    return rule.maxAge
  }
  
  // 默认缓存时间 5 分钟
  return 300
}

// 获取缓存规则描述的函数
export const getCacheDescription = (url: string): string => {
  const rule = cacheRules[url]
  return rule ? rule.description : '默认缓存'
}
