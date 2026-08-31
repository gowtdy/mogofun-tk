import { defineNitroPlugin } from 'nitropack/runtime/plugin'

/** Must match composables/useJsonLd.ts */
const JSON_LD_CONTEXT_KEY = 'jsonLdScripts'

/**
 * Inject JSON-LD as plain <script> tags into the SSR HTML head.
 * Avoids Unhead data-hid attributes that GEO tools flag as "JS-injected".
 */
export default defineNitroPlugin((nitroApp) => {
  nitroApp.hooks.hook('render:html', (html, { event }) => {
    const scripts = event.context[JSON_LD_CONTEXT_KEY] as string[] | undefined
    if (!scripts?.length) return

    for (const raw of scripts) {
      // Prevent early </script> termination if FAQ text contains that sequence
      const safe = raw.replace(/</g, '\\u003c')
      html.head.push(`<script type="application/ld+json">${safe}</script>`)
    }
  })
})
