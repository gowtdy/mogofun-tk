// 添加计数器用于控制日志打印频率
let requestCount = 0
const LOG_INTERVAL = 10 // 每10次请求打印一次日志

export default defineEventHandler(async (event) => {
  // 只处理页面请求，跳过 API 和静态资源
  if (event.node.req.url?.startsWith('/api/') || 
      event.node.req.url?.startsWith('/_nuxt/') ||
      event.node.req.url?.startsWith('/static/')) {
    return
  }

  const url = event.node.req.url || ''
  const method = event.node.req.method || 'GET'
  
  if (method !== 'GET') {
    return
  }

  // 增加计数器
  requestCount++
  
  // 只有达到指定次数时才打印日志
  const shouldLog = requestCount % LOG_INTERVAL === 0

  const startTime = Date.now()
  
  // 检查是否有对应的路由规则
  const routeRules = {
    '/': { headers: { 'Cache-Control': 's-maxage=300' } },
    // 可以添加更多路由规则用于测试
  }
  
  const matchedRule = routeRules[url as keyof typeof routeRules]
  
  if (shouldLog) {
    console.log(`🔍 [Cache Logger] ${method} ${url} (Request #${requestCount})`)
    console.log(`   - Route rule matched: ${!!matchedRule}`)
    if (matchedRule) {
      console.log(`   - Cache control: ${matchedRule.headers['Cache-Control']}`)
    }
  }
  
  // 检查ISR缓存插件中的缓存
  try {
    // @ts-ignore
    const isrCacheStatus = globalThis.getISRCacheStatus?.() || { entries: 0, keys: [], details: [] }
    const isrCacheExists = isrCacheStatus.keys.includes(url)
    
    if (shouldLog) {
      console.log(`   - ISR Cache exists: ${isrCacheExists}`)
      console.log(`   - Total ISR cache entries: ${isrCacheStatus.entries}`)
      
      if (isrCacheExists) {
        const cacheDetail = isrCacheStatus.details.find((item: any) => item.url === url)
        if (cacheDetail) {
          console.log(`   - ISR Cache age: ${cacheDetail.age}s`)
          console.log(`   - ISR Cache TTL: ${cacheDetail.ttl}s`)
          console.log(`   - ISR Cache size: ${Math.round(cacheDetail.size / 1024)}KB`)
        }
      }
    }
    
  } catch (error: any) {
    if (shouldLog) {
      console.log(`   - ISR Cache check error: ${error.message}`)
    }
  }
  
  // 记录处理完成
  event.node.res.on('finish', () => {
    const endTime = Date.now()
    const duration = endTime - startTime
    const statusCode = event.node.res.statusCode
    
    if (shouldLog) {
      console.log(`✅ [Cache Logger] ${method} ${url} - ${statusCode} (${duration}ms)`)
      
      // 检查响应头
      const cacheControl = event.node.res.getHeader('Cache-Control')
      const etag = event.node.res.getHeader('ETag')
      const age = event.node.res.getHeader('Age')
      
      if (cacheControl) console.log(`   - Response Cache-Control: ${cacheControl}`)
      if (etag) console.log(`   - Response ETag: ${etag}`)
      if (age) console.log(`   - Response Age: ${age}`)
    }
    
    // 检查ISR缓存是否被创建
    setTimeout(async () => {
      try {
        // @ts-ignore
        const isrCacheStatus = globalThis.getISRCacheStatus?.() || { entries: 0, keys: [], details: [] }
        if (shouldLog) {
          console.log(`   - ISR cache entries after request: ${isrCacheStatus.entries}`)
          if (isrCacheStatus.entries > 0) {
            console.log(`   - ISR cache keys: ${isrCacheStatus.keys.slice(0, 3).join(', ')}...`)
          }
        }
      } catch (error: any) {
        if (shouldLog) {
          console.log(`   - Post-request ISR cache check error: ${error.message}`)
        }
      }
    }, 100)
  })
}) 