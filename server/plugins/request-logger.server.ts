import { defineNitroPlugin } from 'nitropack/runtime/plugin'
import { getRequestHeader, getRequestIP, getRequestURL } from 'h3'
import { shouldSkipLog } from '../utils/shouldSkipLog'

const REQUEST_LOG_START_KEY = '_requestLogStart'

export default defineNitroPlugin((nitroApp) => {
  nitroApp.hooks.hook('request', (event) => {
    const url = getRequestURL(event)
    const pathname = url.pathname

    if (shouldSkipLog(pathname)) {
      return
    }

    event.context[REQUEST_LOG_START_KEY] = Date.now()
  })

  nitroApp.hooks.hook('afterResponse', (event) => {
    const start = event.context[REQUEST_LOG_START_KEY] as number | undefined
    if (start == null) {
      return
    }

    const url = getRequestURL(event)
    const durationMs = Date.now() - start
    const status = event.node.res.statusCode
    const contentLength = event.node.res.getHeader('content-length')
    const ip = getRequestIP(event, { xForwardedFor: true })
    const userAgent = getRequestHeader(event, 'user-agent')
    const referer = getRequestHeader(event, 'referer')
    const lang = event.context.lang

    console.info(
      JSON.stringify({
        level: 'info',
        type: 'access',
        method: event.method,
        pathname: url.pathname,
        url: url.pathname + url.search,
        status,
        durationMs,
        lang: lang ?? undefined,
        ip: ip ?? undefined,
        ua: userAgent ?? undefined,
        referer: referer ?? undefined,
        contentLength: contentLength != null ? String(contentLength) : undefined,
      })
    )
  })
})
