export default defineEventHandler(async (event) => {
  try {
    // 获取 ISR 缓存状态
    // @ts-ignore
    const isrCacheStatus = globalThis.getISRCacheStatus?.() || {
      entries: 0,
      totalSize: 0,
      keys: [],
      details: []
    }
    
    // 获取内存使用信息
    const memoryUsage = process.memoryUsage()
    
    return {
      cache: isrCacheStatus,
      memory: {
        heapUsed: Math.round(memoryUsage.heapUsed / 1024 / 1024), // MB
        heapTotal: Math.round(memoryUsage.heapTotal / 1024 / 1024), // MB
        external: Math.round(memoryUsage.external / 1024 / 1024), // MB
        rss: Math.round(memoryUsage.rss / 1024 / 1024), // MB
        arrayBuffers: Math.round(memoryUsage.arrayBuffers / 1024 / 1024) // MB
      },
      timestamp: new Date().toISOString()
    }
  } catch (error: any) {
    console.error('获取 ISR 缓存状态失败:', error)
    return {
      error: error.message,
      cache: { entries: 0, totalSize: 0, keys: [], details: [] },
      memory: {
        heapUsed: 0,
        heapTotal: 0,
        external: 0,
        rss: 0,
        arrayBuffers: 0
      },
      timestamp: new Date().toISOString()
    }
  }
}) 