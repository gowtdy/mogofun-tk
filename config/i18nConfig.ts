import { toNuxtLocaleConfig, validLanguages } from './locales'

export { validLanguages } from './locales'

// 定义翻译文件配置，包含文件名和对应的分组
// 每个文件都有明确的分组配置，确保配置完整且便于维护
// 导出类型，供其他模块使用，统一管理组命名
export type TranslationFileGroup = 'tools' | 'vocal'

interface TranslationFileConfig {
  file: string; // 文件名（包含 .json 扩展名）
  group: TranslationFileGroup; // 所属分组
  /** 对外 URL 的 normalized path（无语言前缀）。省略时默认 = file 去掉 .json */
  route?: string;
}

function getConfigRoute(config: TranslationFileConfig): string {
  return config.route ?? config.file.replace(/\.json$/, '');
}

// 翻译文件配置列表：每个文件都明确指定了所属分组
export const translationFilesConfig: TranslationFileConfig[] = [
  // 工具页面组（tools）：基础页面
  { file: 'index.json', group: 'tools' },
  { file: 'first-page.json', group: 'tools' },
  { file: 'about.json', group: 'tools' },
  { file: 'sounds-effect.json', group: 'tools' },
  { file: 'vocal-isolator.json', group: 'tools' },
  { file: 'audio-extractor.json', group: 'tools' },
  { file: 'vocal-remover.json', group: 'tools' },
  { file: 'pricing.json', group: 'tools' },
  { file: 'settings.json', group: 'tools' },
  { file: 'vocal/ai-splitter.json', group: 'vocal', route: 'ai-splitter' },
  { file: 'vocal/ai-stem-splitter.json', group: 'vocal', route: 'ai-stem-splitter' },
  { file: 'vocal/instrumental-remover.json', group: 'vocal', route: 'instrumental-remover' },
  { file: 'vocal/isolate-vocals.json', group: 'vocal', route: 'isolate-vocals' },
  { file: 'vocal/music-remover.json', group: 'vocal', route: 'music-remover' },
  { file: 'vocal/remove-instrument.json', group: 'vocal', route: 'remove-instrument' },
  { file: 'vocal/separate-vocals.json', group: 'vocal', route: 'separate-vocals' },
  { file: 'vocal/splitter-ai.json', group: 'vocal', route: 'splitter-ai' },
  { file: 'vocal/vocal-extractor.json', group: 'vocal', route: 'vocal-extractor' },
  { file: 'vocal/vocal-separator.json', group: 'vocal', route: 'vocal-separator' },
  { file: 'vocal/vocal-splitter.json', group: 'vocal', route: 'vocal-splitter' },
  { file: 'vocal/voice-isolation.json', group: 'vocal', route: 'voice-isolation' },
  { file: 'vocal/voice-isolator.json', group: 'vocal', route: 'voice-isolator' },
];

/** 由 translationFilesConfig 自动生成：normalized route → locale file */
export const routeToTranslationFile: Record<string, string> = Object.fromEntries(
  translationFilesConfig.map((config) => [getConfigRoute(config), config.file])
);

// 导出翻译文件列表（用于 i18n 配置）
export const translationFiles = translationFilesConfig.map(config => config.file);

// 导出文件分组映射表（用于快速查找文件所属分组）
// 同时支持完整路径（如 'role/peter-griffin-voice'）和文件名（如 'peter-griffin-voice'）
export const translationFileGroupMap: Record<string, TranslationFileGroup> = 
  Object.fromEntries([
    ...translationFilesConfig.map(config => [
      config.file.replace(/\.json$/, ''), // 完整路径作为 key（如 'role/peter-griffin-voice'）
      config.group
    ]),
    ...translationFilesConfig.map(config => {
      const fileName = config.file.split('/').pop()?.replace(/\.json$/, '') || '';
      return fileName ? [fileName, config.group] : null; // 文件名作为 key（如 'peter-griffin-voice'）
    }).filter((entry): entry is [string, TranslationFileGroup] => entry !== null)
  ]) as Record<string, TranslationFileGroup>;

// 导出文件分组函数，用于在构建时确定文件所属的分组
export function getTranslationFileGroup(filePath: string): TranslationFileGroup {
  // 移除 .json 扩展名，统一处理
  const normalizedPath = filePath.replace(/\.json$/, '').toLowerCase();
  
  // 先尝试精确匹配（完整文件名）
  if (translationFileGroupMap[normalizedPath]) {
    return translationFileGroupMap[normalizedPath];
  }
  
  // 尝试匹配路径中的文件名部分（处理 role/xxx.json 这种情况）
  const fileName = normalizedPath.split('/').pop() || normalizedPath;
  if (translationFileGroupMap[fileName]) {
    return translationFileGroupMap[fileName];
  }
  
  // 如果没有找到精确匹配，尝试前缀匹配
  // 对于嵌套路径（如 role/peter-griffin-voice），提取最后一部分
  const pathParts = normalizedPath.split('/');
  const lastPart = pathParts[pathParts.length - 1];
  
  // 查找匹配的文件名
  for (const [fileKey, group] of Object.entries(translationFileGroupMap)) {
    const configFileName = fileKey.split('/').pop() || fileKey;
    if (lastPart === configFileName || lastPart.startsWith(configFileName + '-')) {
      return group;
    }
  }
  
  // 默认返回工具组（向后兼容）
  return 'tools';
}

// 从 translationFilesConfig 自动生成路由到翻译文件组的映射表
// 这样可以避免重复配置，统一管理
const routeToGroupMap: Record<string, TranslationFileGroup> = Object.fromEntries(
  translationFilesConfig.flatMap((config) => {
    const routePath = getConfigRoute(config);
    const filePath = config.file.replace(/\.json$/, '');
    return routePath === filePath
      ? [[routePath, config.group]]
      : [
          [routePath, config.group],
          [filePath, config.group]
        ];
  })
);

// 添加特殊路由映射（这些路由没有对应的翻译文件，但需要映射到某个组）
const specialRoutes: Record<string, TranslationFileGroup> = {
  // 首页和基础路由
  '': 'tools',
  '/': 'tools',
  'index': 'tools',
};

// 合并特殊路由映射
Object.assign(routeToGroupMap, specialRoutes);

/**
 * 规范化路由路径（移除语言前缀和斜杠）
 */
function normalizeRoutePath(routePath: string): string {
  // 移除开头的斜杠和语言前缀
  let normalizedPath = routePath.replace(/^\/+/, ''); // 移除开头的斜杠
  
  // 移除语言前缀，使用 validLanguages 配置
  // 注意：需要先检查较长的语言代码（如 'zh-tw'），再检查较短的（如 'zh'），避免误匹配
  const langPrefixes = [...validLanguages].sort((a, b) => b.length - a.length);
  for (const lang of langPrefixes) {
    if (normalizedPath.startsWith(`${lang}/`)) {
      normalizedPath = normalizedPath.substring(lang.length + 1);
      break;
    }
  }
  
  // 移除末尾的斜杠
  normalizedPath = normalizedPath.replace(/\/+$/, '');
  
  return normalizedPath;
}

/**
 * 基础语言文件：对所有请求都必须加载
 * 这些文件在服务器端和客户端都需要显式加载
 */
export const BASE_TRANSLATION_FILES: string[] = ['index.json', 'first-page.json', 'about.json', 'sounds-effect.json', 'vocal-isolator.json', 'audio-extractor.json', 'vocal-remover.json'];

/**
 * 根据路由路径确定需要加载的具体翻译文件列表（不包含基础文件）
 * @param routePath 路由路径，可能包含语言前缀（如 '/ja/role/ariana-grande-voice' 或 '/role/ariana-grande-voice'）
 * @returns 需要加载的翻译文件列表（只包含当前路由对应的文件，不包含基础文件）
 */
export function getRequiredTranslationFiles(routePath: string): string[] {
  const normalizedPath = normalizeRoutePath(routePath);

  if (!normalizedPath) {
    return [];
  }

  const file = routeToTranslationFile[normalizedPath];
  return file ? [file] : [];
}

/**
 * 根据路由路径确定需要加载的翻译文件组
 * @param routePath 路由路径，可能包含语言前缀（如 '/ja/role/ariana-grande-voice' 或 '/role/ariana-grande-voice'）
 * @returns 需要加载的翻译文件组数组
 */
export function getRequiredTranslationGroups(routePath: string): TranslationFileGroup[] {
  const normalizedPath = normalizeRoutePath(routePath);
  
  // 如果路径为空，返回 tools 组（首页）
  if (!normalizedPath || normalizedPath === '') {
    return ['tools'];
  }
  
  // 查找精确匹配
  if (routeToGroupMap[normalizedPath]) {
    const group = routeToGroupMap[normalizedPath];
    // 通用组件可能需要 tools 组的基础翻译，但角色和名人页面通常不需要
    return group === 'tools' ? ['tools'] : ['tools', group];
  }
  
  // 尝试匹配路径的最后一部分（处理嵌套路径）
  const pathParts = normalizedPath.split('/');
  const lastPart = pathParts[pathParts.length - 1];
  
  if (routeToGroupMap[lastPart]) {
    const group = routeToGroupMap[lastPart];
    return group === 'tools' ? ['tools'] : ['tools', group];
  }
  
  // 尝试匹配完整路径（包括 role/ 前缀）
  const fullPath = pathParts.join('/');
  if (routeToGroupMap[fullPath]) {
    const group = routeToGroupMap[fullPath];
    return group === 'tools' ? ['tools'] : ['tools', group];
  }
  
  // 默认返回 tools 组（向后兼容）
  return ['tools'];
}

export const i18nConfig = {
  lazy: true,
  locales: toNuxtLocaleConfig(),
  strategy: 'prefix_and_default' as const,
  defaultLocale: 'en' as const,
  skipSettingLocaleOnNavigate: true,
  detectBrowserLanguage: false as const,
  bundle: {
    optimizeTranslationDirective: true,
    // 启用代码分割，按语言分割
    splitChunks: {
      locales: true,
      // 不按页面分割，将所有翻译文件打包到一个文件中
      // 这样每个语言只生成一个 JS 文件，访问页面时只需加载一个语言的翻译包
      pages: false,
      // 启用压缩（针对翻译内容的额外压缩优化）
      compress: true,
    },
    // 启用运行时优化，移除未使用的翻译键
    runtimeOnly: false,
  },
  // 启用动态导入
  dynamicRouteParams: true,
  // 优化加载策略
  precompile: {
    strictMessage: false,
    escapeHtml: false
  },
  // SSR 兼容配置
  ssr: true,
  // 启用服务端渲染支持
  serverSideTranslation: true
}; 
