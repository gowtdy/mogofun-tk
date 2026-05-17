/** Nuxt file-based default path → public URL path */
export const PAGE_ROUTE_OVERRIDES = [
  { from: '/vocal/ai-splitter', to: '/ai-splitter' },
  { from: '/vocal/ai-stem-splitter', to: '/ai-stem-splitter' }
] as const

export function applyPageRouteOverrides(pages: { path?: string }[]) {
  for (const page of pages) {
    const override = PAGE_ROUTE_OVERRIDES.find((o) => page.path === o.from)
    if (override) {
      page.path = override.to
    }
  }
}
