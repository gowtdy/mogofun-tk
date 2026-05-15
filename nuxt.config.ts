// https://nuxt.com/docs/api/configuration/nuxt-config
import routerConfig from './router';
import { defineNuxtConfig } from 'nuxt/config';
import { resolve } from 'path';
import appConfig from './config/appConfig';
import { i18nConfig, getTranslationFileGroup } from './config/i18nConfig';
import routeRules from './config/routeRules';

// 定义输出目录配置
const outputDir =
  process.env.NODE_ENV === 'production'
    ? '/home/aigc/service/voice/web_dist/mogofun_dist'
    : './output';

// 设置环境变量解决Node.js兼容性问题
process.env.NODE_OPTIONS = '--max-old-space-size=2248 --expose-gc';

// 添加polyfill解决availableParallelism问题
if (!(process as any).availableParallelism) {
  (process as any).availableParallelism = () => require('os').cpus().length;
}

// 开发环境：在 public 下创建 i18n 软链接
if (process.env.NODE_ENV !== 'production' && !process.argv.includes('build')) {
  (async () => {
    try {
      const fs = require('fs-extra');
      const path = require('path');
      
      const i18nSourcePath = path.join(process.cwd(), 'i18n');
      const i18nTargetPath = path.join(process.cwd(), 'public', 'i18n');
      
      // 确保源目录存在
      if (await fs.pathExists(i18nSourcePath)) {
        // 确保 public 目录存在
        await fs.ensureDir(path.dirname(i18nTargetPath));
        
        // 如果目标路径已存在，先删除它（无论是文件、目录还是软链接）
        if (await fs.pathExists(i18nTargetPath)) {
          try {
            await fs.remove(i18nTargetPath);
          } catch (error: any) {
            // 如果删除失败，尝试使用原生 fs.unlink（处理软链接）
            if (error.code !== 'ENOENT') {
              try {
                const nativeFs = require('fs').promises;
                await nativeFs.unlink(i18nTargetPath);
              } catch (unlinkError) {
                // 忽略错误，继续尝试创建软链接
              }
            }
          }
        }
        
        // 计算相对路径（从 public/i18n 指向 i18n）
        const relativePath = path.relative(
          path.dirname(i18nTargetPath),
          i18nSourcePath
        );
        
        // 创建软链接
        await fs.symlink(relativePath, i18nTargetPath, 'dir');
        console.log('✅ [Nuxt Config] i18n symlink created: public/i18n -> i18n');
      }
    } catch (error) {
      console.error('❌ [Nuxt Config] Failed to create i18n symlink:', error);
      // 不抛出错误，避免阻塞开发服务器启动
      console.warn('⚠️ [Nuxt Config] Continuing despite symlink error...');
    }
  })();
}

export default defineNuxtConfig({
  compatibilityDate: '2026-05-10',
  ssr: true,
  nitro: {
    compressPublicAssets: true,
    // 启用 gzip 和 brotli 压缩（可通过 Accept-Encoding 自动选择）
    minify: true,
    output: {
      dir: '.output',
    },
    publicAssets: [
      {
        dir: 'public',
        baseURL: '/static/',
      },
    ],
    esbuild: {
      options: {
        target: 'esnext',
      },
    },
    storage: {
      cache: {
        driver: 'memory',
        maxSize: 2 * 1024 * 1024, // 进一步降低到 2MB 内存缓存限制
        maxAge: 1000 * 60 * 15, // 15分钟默认TTL，减少内存占用
        // 添加LRU清理策略
        maxKeys: 500, // 减少最大缓存键数量
      },
    },
    routeRules,
    experimental: {
      wasm: true,
    },
    hooks: {
      close: async () => {
        // 只在真正的构建过程中执行，通过检查命令行参数或构建上下文
        const isBuilding =
          process.argv.includes('build') ||
          process.env.NITRO_BUILD === 'true' ||
          process.env.npm_lifecycle_event === 'build';

        if (process.env.NODE_ENV === 'production' && isBuilding) {
          const fs = require('fs-extra');
          const path = require('path');

          // 确保目标目录存在，但不清空它
          await fs.ensureDir(outputDir);

          try {
            // 2. 只复制必要的文件和目录（从 .output 目录）
            const necessaryDirs = [
              'nitro.json',
              'public',
              'server/chunks',
              'server/index.mjs',
              'server/package.json',
            ];

            // 3. 从 .output 复制必要的文件，添加过滤条件避免循环复制
            for (const dir of necessaryDirs) {
              console.log('hooks copy11,  dir', dir);
              const sourcePath = path.join('.output', dir);
              const targetPath = path.join(outputDir, dir);

              if (await fs.pathExists(sourcePath)) {
                await fs.copy(sourcePath, targetPath);
                console.log('hooks copy22,  copy success', dir);
              }
            }

            // 4. 从项目根目录复制 i18n 目录到部署目录
            const i18nSourcePath = path.join(process.cwd(), 'i18n');
            const i18nTargetPath = path.join(outputDir, 'public', 'i18n');
            if (await fs.pathExists(i18nSourcePath)) {
              console.log('hooks copy i18n, source:', i18nSourcePath, 'target:', i18nTargetPath);
              await fs.copy(i18nSourcePath, i18nTargetPath);
              console.log('hooks copy i18n, copy success');
            } else {
              console.warn('hooks copy i18n, source path not found:', i18nSourcePath);
            }

            const packagePath = './.output/server/package.json';
            if (await fs.pathExists(packagePath)) {
              const sourcePackage = require(packagePath);
              const minimalPackage = {
                name: sourcePackage.name,
                version: sourcePackage.version,
                dependencies: sourcePackage.dependencies,
                engines: sourcePackage.engines,
              };
              console.log('hooks copy33,  minimalPackage', minimalPackage);

              await fs.writeJSON(
                path.join(outputDir, 'server/package.json'),
                minimalPackage,
                { spaces: 2 }
              );

              // 6. 复制 node_modules（仅在 package.json 存在时进行）
              if (minimalPackage.dependencies) {
                const targetNodeModules = path.join(
                  outputDir,
                  'server/node_modules'
                );
                await fs.ensureDir(targetNodeModules);

                for (const dep of Object.keys(minimalPackage.dependencies)) {
                  // 修改源路径，使用项目根目录的 node_modules
                  const sourceDep = path.join(
                    process.cwd(),
                    'node_modules',
                    dep
                  );
                  const targetDep = path.join(targetNodeModules, dep);

                  if (await fs.pathExists(sourceDep)) {
                    try {
                      await fs.copy(sourceDep, targetDep, {
                        dereference: true,
                        filter: (src: string) => {
                          return (
                            !src.endsWith('.map') &&
                            !src.endsWith('.ts') &&
                            !src.includes('test') &&
                            !src.includes('example') &&
                            !src.includes('.git')
                          );
                        },
                      });
                    } catch (error) {
                      console.error(`Error copying ${dep}:`, error);
                    }
                  } else {
                    console.warn(
                      `Dependency not found: ${dep} at ${sourceDep}`
                    );
                  }
                }
              }
            }
            console.log(`Successfully built to: ${outputDir}`);
          } catch (error) {
            console.error('Build error:', error);
            console.error('Continuing build process despite error...');
          }
        }
      },
    },
  },

  runtimeConfig: {
    public: {
      voiceModels: [],
      apiHost: 'https://mogofun.com', // api使用域名
      apiBase:
        process.env.NODE_ENV === 'production'
          ? 'https://mogofun.com'
          : 'http://localhost:3000',
    },
  },
  devtools: { enabled: process.env.NODE_ENV !== 'production' },
  typescript: {
    typeCheck: false,
    shim: false,
  },
  css: ['@/assets/css/tailwind.css', '@/assets/css/global.css'],
  postcss: {
    plugins: {
      tailwindcss: {},
      autoprefixer: {},
    },
  },
  // serverPlugins: [
  //   './server/plugins/init-voice-models',
  //   './server/plugins/language-detector',
  // ],
  modules: ['@nuxt/image', '@nuxtjs/i18n', '@pinia/nuxt'],
  alias: {
    '@lib': resolve(__dirname, './lib'),
    // 添加 pages 目录别名，让你可以重新组织页面结构
    '@pages': resolve(__dirname, './pages'),
  },
  experimental: {
    // PM2 cluster: avoid split /_payload.json. Nuxt 3.21+ still emits per-route _payload for isr/swr
    // routeRules — those flags are omitted in config/routeRules.ts (headers-only caching).
    payloadExtraction: false,
    viewTransition: true,
    // renderPayloadJsonScript + devalue can hit Pinia shouldHydrate (obj.hasOwnProperty) on __nuxt_error.
    renderJsonPayloads: false,
    componentIslands: false, // 禁用组件岛屿，确保页面级代码分割正常工作
  },
  image: {
    // 优化图片配置，加快LCP指标
    format: ['webp', 'avif'],
    quality: 80,
    domains: ['cdn.mogofun.com'],
    screens: {
      xs: 320,
      sm: 640,
      md: 768,
      lg: 1024,
      xl: 1280,
      xxl: 1536,
      '2xl': 1536,
    },
    providers: {
      // 添加自定义CDN优化处理
      cdn: {
        provider: 'ipx',
        options: {
          baseURL: 'https://cdn.mogofun.com',
        },
      },
    },
    presets: {
      // 头像等关键图片预设
      avatar: {
        modifiers: {
          format: 'webp',
        },
      },
    },
  },
  vite: {
    build: {
      manifest: true,
      sourcemap: false, // 启用 source maps 用于生产环境调试
      rollupOptions: {
        output: {
          entryFileNames: 'static/[name].[hash].js',
          chunkFileNames: 'static/[name].[hash].js',
          assetFileNames: 'static/[name].[hash].[ext]',
          // 优化的代码分割策略：每个 i18n 翻译文件单独打包成独立的 JS chunk
          // 这样可以直接请求 JS 文件，而不是通过 import() 加载 JSON
          manualChunks(id) {
            // 【优先级最高】确保 Nuxt 核心和 $fetch 相关代码在入口文件中，不分割
            // 这必须在所有其他检查之前，确保这些关键代码不会被分割到其他 chunk
            // 这样可以避免 $fetch is not defined 错误（发生在 Nuxt 初始化时获取 app manifest）
            if (
              id.includes('node_modules/nuxt') || 
              id.includes('node_modules/@nuxt') ||
              id.includes('node_modules/ofetch') ||
              id.includes('#app') ||
              id.includes('#app-manifest') ||
              id.includes('app-manifest') ||
              id.includes('/.nuxt/') ||
              id.includes('nuxt/dist') ||
              id.includes('@nuxt/kit') ||
              id.includes('@nuxt/schema')
            ) {
              return undefined // 不分割，留在入口文件，确保初始化时可用
            }
            // 匹配 i18n 翻译文件路径
            const i18nPatterns = [
              /i18n[/\\]locales[/\\]([a-z-]+)[/\\](.+?)(?:\.json|$)/i,  // i18n/locales/xx/xxx.json 或 i18n/locales/xx/role/xxx.json
              /@nuxtjs[/\\]i18n.*locales[/\\]([a-z-]+)[/\\](.+?)(?:\.json|$)/i,  // 模块路径
              /locales[/\\]([a-z-]+)[/\\](.+?)(?:\.json|$)/i,  // locales/xx/xxx.json 或 locales/xx/role/xxx.json
            ];
            
            for (const pattern of i18nPatterns) {
              const match = id.match(pattern);
              if (match) {
                const locale = match[1];
                // 提取完整的文件路径（包括子目录，如 role/peter-griffin-voice.json）
                let filePath = match[2];
                // 移除 .json 扩展名，统一处理
                filePath = filePath.replace(/\.json$/, '');
                // 将路径中的斜杠替换为连字符，确保文件名合法
                const normalizedPath = filePath.replace(/[/\\]/g, '-');
                // 每个文件单独打包：i18n-{locale}-{filename}
                return `i18n-${locale}-${normalizedPath}`;
              }
            }
            
            // 额外的检查：匹配文件名模式（处理可能的其他路径格式）
            const fallbackPattern = /\/(en|es|fr|ja|zh-tw|zh)\/(.+?)(?:\.json|$)/i;
            const fallbackMatch = id.match(fallbackPattern);
            if (fallbackMatch) {
              const locale = fallbackMatch[1];
              let filePath = fallbackMatch[2];
              // 移除 .json 扩展名，统一处理
              filePath = filePath.replace(/\.json$/, '');
              // 将路径中的斜杠替换为连字符，确保文件名合法
              const normalizedPath = filePath.replace(/[/\\]/g, '-');
              // 每个文件单独打包：i18n-{locale}-{filename}
              return `i18n-${locale}-${normalizedPath}`;
            }
            
            // 处理第三方库
            if (id.includes('node_modules')) {
              // 将 Vue 生态系统核心放在一起，避免循环依赖
              // 注意：nuxt 和 @nuxt 已经在上面处理了（返回 undefined），这里不再包含
              if (
                id.includes('node_modules/vue') ||
                id.includes('node_modules/@vue') ||
                id.includes('node_modules/vue-router') ||
                id.includes('node_modules/pinia') ||
                id.includes('node_modules/@pinia') ||
                id.includes('node_modules/@vueuse') ||
                id.includes('node_modules/vue-i18n') ||
                id.includes('node_modules/@nuxtjs/i18n')
              ) {
                return 'vendor-core';
              }
              
              // crypto-js 可以独立分割，因为它与 Vue 核心无关
              if (id.includes('node_modules/crypto-js')) {
                return 'vendor-crypto';
              }
              
              // Firebase 可以独立分割
              if (id.includes('node_modules/firebase')) {
                return 'vendor-auth';
              }
              
              // Heroicons 独立分割
              if (id.includes('node_modules/@heroicons')) {
                return 'vendor-icons';
              }
              
              // Toast 通知独立分割
              if (id.includes('node_modules/vue-toastification')) {
                return 'vendor-toast';
              }
              
              // 其他第三方库统一放在 vendor
              return 'vendor';
            }
            
            // 只对图标组件做分割（已验证不影响交互）
            if (id.includes('/components/icons/')) {
              return 'components-icons';
            }
            
            // 其他应用代码让 Nuxt 自动处理
            return undefined;
          },
        },
        // 限制并行处理以减少内存使用
        maxParallelFileOps: 5,
        external: (id) => {
          // 排除服务端模块，避免在客户端构建中导入
          if (id.includes('node:') || id.includes('fs')) {
            return true;
          }
          // 排除 Node.js 内置的 crypto 模块，但保留 crypto-js 库
          if (id === 'crypto' || id.startsWith('crypto/')) {
            return true;
          }
          return false;
        },
        treeshake: {
          moduleSideEffects: (id) => {
            // i18n 翻译文件有副作用，不应该被 tree-shake
            // 这些文件需要被单独打包成 chunk，即使没有被直接使用
            if (id.includes('i18n/locales') || id.includes('locales/')) {
              // 返回 true 表示这些文件有副作用，不应该被 tree-shake
              return true;
            }
            // 对于其他模块，返回 false 允许 tree-shaking
            // 这样既能保证 i18n 文件被保留，又能让其他未使用的代码被移除
            return false;
          },
          propertyReadSideEffects: true,
          tryCatchDeoptimization: false
        }
      },
      cssCodeSplit: false,
      chunkSizeWarningLimit: 1000,
      // 使用 terser 代替 esbuild，提供更好的压缩率（可减少 10-20% 文件大小）
      // 如果没有安装 terser，请运行: npm install -D terser
      minify: 'terser',
      terserOptions: {
        compress: {
          // 移除未使用的代码
          dead_code: true,
          drop_console: true, // 保留 console，方便调试
          drop_debugger: true,
          // 合并重复的变量和函数
          collapse_vars: true,
          reduce_vars: true,
          // 移除未使用的函数参数（保守模式，避免破坏某些代码模式）
          unused: false, // 改为 false，避免破坏 SSR 代码
          // 简化表达式
          evaluate: true,
          // 移除多余的代码 - 减少压缩遍历次数，避免过度优化导致 SSR 问题
          passes: 2, // 从 3 降到 2，更保守
          // 移除未使用的导入
          pure_funcs: [],
          // 合并字符串常量
          inline: 1, // 从 2 降到 1，更保守
          // 保留函数参数（避免破坏 SSR）
          keep_fargs: true, // 改为 true
        },
        mangle: {
          // 压缩变量名（不压缩属性名，避免破坏动态属性访问）
          safari10: true,
          // 混淆顶级作用域的变量名（包括 i18n 文件的变量）
          toplevel: true,
          // 启用更激进的混淆
          properties: false, // 不混淆对象属性名，避免破坏动态属性访问（如 i18n 键名）
        },
        format: {
          // 移除所有注释以减小体积
          comments: false,
        },
        // 避免压缩某些可能导致问题的模式
        keep_classnames: false,
        keep_fnames: false,
      },
      // 如果 terser 导致 SSR 错误，可以使用以下 esbuild 配置（更稳定但压缩率略低）
      // minify: 'esbuild',
      // esbuildMinifyOptions: {
      //   minifyWhitespace: true,
      //   minifyIdentifiers: true,
      //   minifySyntax: true,
      // },
    },
    optimizeDeps: {
      exclude: ['@nuxtjs/i18n'],
      // 确保 i18n JSON 文件被正确处理
      esbuildOptions: {
        loader: {
          '.json': 'json',
        },
      },
    },
    // 添加性能优化
    server: {
      hmr: {
        overlay: false
      }
    },
    // 添加 ssr 配置来解决 i18n 模块问题
    ssr: {
      noExternal: ['@nuxtjs/i18n']
    }
  },
  app: {
    ...appConfig,
    buildAssetsDir: 'static/',
  },
  i18n: i18nConfig,
  routeRules: {
    ...routeRules,
    '/dmca-policy': { static: true },
    '/privacy-policy': { static: true },
    '/terms-of-service': { static: true },
  },
});
