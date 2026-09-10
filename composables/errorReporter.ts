import { config } from '~/config/config'

const REPORT_DEDUP_TTL_MS = 60_000
const reportDedupCache = new Map<string, number>()

function pruneExpired(now: number) {
  for (const [key, ts] of reportDedupCache) {
    if (now - ts >= REPORT_DEDUP_TTL_MS) reportDedupCache.delete(key)
  }
}

/** Compact sync fingerprint (cyrb53) for dedup keys; not a cryptographic signature. */
function hashFingerprint(input: string, seed = 0): string {
  let h1 = 0xdeadbeef ^ seed
  let h2 = 0x41c6ce57 ^ seed
  for (let i = 0; i < input.length; i++) {
    const ch = input.charCodeAt(i)
    h1 = Math.imul(h1 ^ ch, 2654435761)
    h2 = Math.imul(h2 ^ ch, 1597334677)
  }
  h1 = Math.imul(h1 ^ (h1 >>> 16), 2246822507)
  h1 ^= Math.imul(h2 ^ (h2 >>> 13), 3266489909)
  h2 = Math.imul(h2 ^ (h2 >>> 16), 2246822507)
  h2 ^= Math.imul(h1 ^ (h1 >>> 13), 3266489909)
  const combined = 4294967296 * (2097151 & h2) + (h1 >>> 0)
  return combined.toString(36)
}

function buildCacheKey(err: any, context: any, url: string) {
  const error = err?.message || String(err)
  const ctx = typeof context === 'string' ? context : JSON.stringify(context ?? '')
  return hashFingerprint(`${error}\0${ctx}\0${url}`)
}

export const useErrorReporter = () => {
  const host = config.host

  const reportError = async (err: any, context: any, uid: string = '' , email: string = '') => {
    try {
      const url = typeof window !== 'undefined' ? (window.location?.href || '') : ''
      const now = Date.now()
      pruneExpired(now)
      const key = buildCacheKey(err, context, url)
      const last = reportDedupCache.get(key)
      if (last != null && now - last < REPORT_DEDUP_TTL_MS) return
      reportDedupCache.set(key, now)

      const uri = `${host}/lapi/weberrors`
      const formData = new FormData()
      
      formData.append('error', err?.message || String(err))
      formData.append('stack', err?.stack || '')
      formData.append('context', JSON.stringify(context))
      formData.append('url', url)
      formData.append('uid', uid)
      formData.append('email', email)

      // 尝试获取 $fetch，如果不可用则使用原生 fetch
      let fetchFn: any = null
      try {
        const nuxtApp = useNuxtApp()
        fetchFn = nuxtApp.$fetch || (globalThis as any).$fetch
      } catch {
        // 如果 useNuxtApp 不可用，尝试从全局获取
        fetchFn = (globalThis as any).$fetch || null
      }

      if (fetchFn) {
        await fetchFn(uri, {
          method: 'POST',
          body: formData
        })
      } else {
        // 使用原生 fetch 作为 fallback
        await fetch(uri, {
          method: 'POST',
          body: formData
        })
      }
    } catch (err) {
      console.debug('Error reporting failed:', err)
    }
  }

  return {
    reportError
  }
}
