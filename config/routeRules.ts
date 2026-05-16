/**
 * Nitro route rules — page Cache-Control is handled by CDN.
 * Keep no-cache for user-specific flows and static pre-render for legal pages.
 */

const noCache = {
  headers: { 'Cache-Control': 'no-cache, no-store, must-revalidate' },
} as const;

const LOCALES = ['en', 'es', 'fr', 'ja', 'zh', 'zh-tw'] as const;

const localeNoCacheRoutes = Object.fromEntries(
  LOCALES.flatMap((locale) => [
    [`/${locale}/settings`, noCache],
    [`/${locale}/pay-success`, noCache],
  ]),
);

export default {
  ...localeNoCacheRoutes,
  '/dmca-policy': { static: true },
  '/privacy-policy': { static: true },
  '/terms-service': { static: true },
};
