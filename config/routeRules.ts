/**
 * 路由规则配置
 * 优雅的函数式配置，告别重复代码！
 */

// 支持的语言列表
const LANGUAGES = ['', 'es', 'fr', 'ja', 'zh', 'zh-tw'] as const;

// 角色列表
const CHARACTERS = [
] as const;

// 功能页面列表
const FEATURE_PAGES = [
  'sound-effect'
] as const;

// 工具页面列表
const TOOL_PAGES = [
  'vocal-isolator',
  'vocal-remover',
  'audio-extractor'
] as const;

// 缓存配置模板（仅 Cache-Control；不使用 Nitro isr/swr）
// Nuxt 3.21+ 对 isr/swr 路由会单独请求 /path/_payload.json，PM2 cluster 无粘滞时易 404。
const CACHE_TEMPLATES = {
  // 首页缓存 (5分钟)
  home: {
    maxAge: 300,
    sMaxAge: 300,
    staleWhileRevalidate: 600,
  },
  // 角色页面缓存 (30分钟)
  character: {
    maxAge: 1800,
    sMaxAge: 1800,
    staleWhileRevalidate: 3600,
  },
  // 功能页面缓存 (30分钟)
  feature: {
    maxAge: 1800,
    sMaxAge: 1800,
    staleWhileRevalidate: 3600,
  },
  // 工具页面缓存 (15分钟，交互性强)
  tool: {
    maxAge: 900,
    sMaxAge: 900,
    staleWhileRevalidate: 1800,
  },
  // 关于页面缓存 (2小时，减少内存占用)
  about: {
    maxAge: 7200,
    sMaxAge: 7200,
    staleWhileRevalidate: 14400,
  },
  // 定价页面缓存 (1小时)
  pricing: {
    maxAge: 3600,
    sMaxAge: 3600,
    staleWhileRevalidate: 7200,
  },
} as const;

/**
 * 生成缓存头配置
 */
function createCacheHeaders(template: typeof CACHE_TEMPLATES[keyof typeof CACHE_TEMPLATES]) {
  return {
    'Cache-Control': `public, max-age=${template.maxAge}, s-maxage=${template.sMaxAge}, stale-while-revalidate=${template.staleWhileRevalidate}`,
  };
}

/**
 * 生成路由规则
 */
function createRouteRule(template: typeof CACHE_TEMPLATES[keyof typeof CACHE_TEMPLATES]) {
  return {
    headers: createCacheHeaders(template),
  };
}

/**
 * 生成多语言路由规则
 */
function generateMultiLanguageRoutes(
  pagePath: string, 
  template: typeof CACHE_TEMPLATES[keyof typeof CACHE_TEMPLATES]
) {
  const routes: Record<string, any> = {};
  
  LANGUAGES.forEach(lang => {
    const route = lang ? `/${lang}${pagePath}` : pagePath;
    routes[route] = createRouteRule(template);
  });
  
  return routes;
}

/**
 * 生成角色页面路由规则
 */
function generateCharacterRoutes() {
  const routes: Record<string, any> = {};
  
  CHARACTERS.forEach(character => {
    const characterRoutes = generateMultiLanguageRoutes(
      `/en/${character}`,
      CACHE_TEMPLATES.character
    );
    Object.assign(routes, characterRoutes);
  });
  
  return routes;
}

/**
 * 生成功能页面路由规则
 */
function generateFeatureRoutes() {
  const routes: Record<string, any> = {};
  
  FEATURE_PAGES.forEach(page => {
    const featureRoutes = generateMultiLanguageRoutes(
      `/en/${page}`,
      CACHE_TEMPLATES.feature
    );
    Object.assign(routes, featureRoutes);
  });
  
  return routes;
}

/**
 * 生成工具页面路由规则
 */
function generateToolRoutes() {
  const routes: Record<string, any> = {};
  
  TOOL_PAGES.forEach(page => {
    const toolRoutes = generateMultiLanguageRoutes(
      `/en/${page}`,
      CACHE_TEMPLATES.tool
    );
    Object.assign(routes, toolRoutes);
  });
  
  return routes;
}

/**
 * 生成首页路由规则
 */
function generateHomeRoutes() {
  return generateMultiLanguageRoutes('', CACHE_TEMPLATES.home);
}

/**
 * 生成关于页面路由规则
 */
function generateAboutRoutes() {
  return generateMultiLanguageRoutes('/en/about-us', CACHE_TEMPLATES.about);
}

/**
 * 生成定价页面路由规则
 */
function generatePricingRoutes() {
  return generateMultiLanguageRoutes('/en/pricing', CACHE_TEMPLATES.pricing);
}

/**
 * 生成静态页面路由规则
 */
function generateStaticRoutes() {
  return {
    '/dmca-policy': { static: true },
    '/privacy-policy': { static: true },
    '/terms-of-service': { static: true }
  };
}

/**
 * 生成无缓存页面路由规则
 */
function generateNoCacheRoutes() {
  const noCacheHeader = { 'Cache-Control': 'no-cache, no-store, must-revalidate' };
  
  return {
    '/settings': { headers: noCacheHeader },
    '/en/pay-success': { headers: noCacheHeader },
    '/zh/pay-success': { headers: noCacheHeader },
    '/zh-tw/pay-success': { headers: noCacheHeader },
    '/ja/pay-success': { headers: noCacheHeader },
    '/es/pay-success': { headers: noCacheHeader },
    '/fr/pay-success': { headers: noCacheHeader }
  };
}

/**
 * 生成API路由规则
 */
function generateApiRoutes() {
  return {
    '/api/**': {
      headers: { 'Cache-Control': 'public, max-age=60, s-maxage=60' } // 1分钟
    }
  };
}

/**
 * 生成完整的路由规则配置
 */
export function generateRouteRules() {
  return {
    // 首页路由
    ...generateHomeRoutes(),
    
    // 角色页面路由
    ...generateCharacterRoutes(),
    
    // 功能页面路由
    ...generateFeatureRoutes(),
    
    // 工具页面路由
    ...generateToolRoutes(),
    
    // 关于页面路由
    ...generateAboutRoutes(),
    
    // 定价页面路由
    ...generatePricingRoutes(),
    
    // 静态页面路由
    ...generateStaticRoutes(),
    
    // 无缓存页面路由
    ...generateNoCacheRoutes(),
    
    // API路由
    ...generateApiRoutes()
  };
}

// 导出默认配置
export default generateRouteRules();
