/**
 * Skip logging / translation load for obvious static asset requests.
 * Do not skip /_payload.* or .html paths (Nuxt SSR / i18n depend on them).
 */
export function shouldSkipLog(pathname: string): boolean {
  const p = (pathname || '').split('#')[0]
  if (!p) return false

  if (p.includes('/_payload.')) {
    return false
  }
  if (p.endsWith('.html')) {
    return false
  }

  return /\.(?:ico|png|jpe?g|gif|webp|svg|avif|css|js|mjs|map|woff2?|ttf|eot|txt|xml|json|webmanifest|wasm)$/i.test(
    p
  )
}
