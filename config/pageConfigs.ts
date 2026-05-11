// 页面配置 - 移除 mainComponent 避免预加载组件定义
export interface PageConfig {
  pageKey: string
  defaultCategory: string
  defaultModel: string
  hrefPath?: string
}

const pageConfigs: Record<string, PageConfig> = {
  "first-page": {
    pageKey: "first-page",
    defaultCategory: 'english',
    defaultModel: 'adamm-male',
    hrefPath: '/'
  }
}

export function getPageConfig(slug: string): PageConfig | null {
  return pageConfigs[slug] || null
}

export function getAllPageConfigs(): PageConfig[] {
  return Object.values(pageConfigs)
}