import { getCacheTime, getCacheDescription } from '../config/cache-rules'

export default defineNitroPlugin((nitroApp) => {
  // ISR缓存管理
  const cacheMap = new Map<string, { 
    content: string, 
    timestamp: number, 
    expiry: number 
  }>()
  
  console.log('🚀 ISR Cache Plugin initialized')
  
  // 监听渲染完成事件
  nitroApp.hooks.hook('render:response', async (response, { event }) => {
    const url = event.node.req.url || ''
    
    // 只处理页面路由
    if (url.startsWith('/api/') || url.startsWith('/_nuxt/') || url.startsWith('/static/')) {
      return
    }
    
    // 检查是否已经缓存
    const now = Date.now()
    const cached = cacheMap.get(url)
    
    if (cached && cached.expiry > now) {
      console.log(`🎯 Cache HIT for ${url} (age: ${Math.round((now - cached.timestamp) / 1000)}s)`)
      return
    }
    
    // 从缓存规则配置中获取缓存时间
    const cacheTime = getCacheTime(url)
    const cacheDescription = getCacheDescription(url)
    
    const expiry = now + (cacheTime * 1000)
    const content = response.body || ''
    
    cacheMap.set(url, {
      content: content,
      timestamp: now,
      expiry: expiry
    })
    
    console.log(`💾 Cached ${url} for ${cacheTime}s (${cacheDescription}) - Total entries: ${cacheMap.size}`)
  })
  
  // 清理过期缓存
  setInterval(() => {
    const now = Date.now()
    let cleaned = 0
    
    for (const [url, cache] of cacheMap.entries()) {
      if (cache.expiry <= now) {
        cacheMap.delete(url)
        cleaned++
      }
    }
    
    if (cleaned > 0) {
      console.log(`🧹 Cleaned ${cleaned} expired cache entries (Remaining: ${cacheMap.size})`)
    }
  }, 60000) // 每分钟检查一次
  
  // 暴露缓存状态API
  const getCacheStatus = () => {
    const totalSize = Array.from(cacheMap.values()).reduce((sum, cache) => sum + cache.content.length, 0)
    
    return {
      entries: cacheMap.size,
      totalSize,
      keys: Array.from(cacheMap.keys()),
      details: Array.from(cacheMap.entries()).map(([url, cache]) => ({
        url,
        age: Math.round((Date.now() - cache.timestamp) / 1000),
        ttl: Math.round((cache.expiry - Date.now()) / 1000),
        size: cache.content.length,
        description: getCacheDescription(url)
      }))
    }
  }
  
  // 将缓存状态函数添加到全局
  // @ts-ignore
  globalThis.getISRCacheStatus = getCacheStatus
}) 