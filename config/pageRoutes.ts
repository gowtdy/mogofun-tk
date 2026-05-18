/** Nuxt file-based default path → public URL path */
export const PAGE_ROUTE_OVERRIDES = [
  { from: '/vocal/ai-splitter', to: '/ai-splitter' },
  { from: '/vocal/ai-stem-splitter', to: '/ai-stem-splitter' },
  { from: '/vocal/instrumental-remover', to: '/instrumental-remover' },
  { from: '/vocal/isolate-vocals', to: '/isolate-vocals' },
  { from: '/vocal/music-remover', to: '/music-remover' },
  { from: '/vocal/remove-instrument', to: '/remove-instrument' },
  { from: '/vocal/separate-vocals', to: '/separate-vocals' },
  { from: '/vocal/splitter-ai', to: '/splitter-ai' },
  { from: '/vocal/vocal-extractor', to: '/vocal-extractor' },
  { from: '/vocal/vocal-separator', to: '/vocal-separator' },
  { from: '/vocal/vocal-splitter', to: '/vocal-splitter' },
  { from: '/vocal/voice-isolation', to: '/voice-isolation' },
  { from: '/vocal/voice-isolator', to: '/voice-isolator' },
] as const

export function applyPageRouteOverrides(pages: { path?: string }[]) {
  for (const page of pages) {
    const override = PAGE_ROUTE_OVERRIDES.find((o) => page.path === o.from)
    if (override) {
      page.path = override.to
    }
  }
}
