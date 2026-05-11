export default {
  head: {
    charset: 'utf-8',
    htmlAttrs: {
      'data-no-capo': 'true',
    },
    viewport: 'width=device-width, initial-scale=1',
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
      { rel: 'apple-touch-icon', href: '/apple-touch-icon.png' },
      { rel: 'preconnect', href: 'https://mogofun.com' },
      { rel: 'preconnect', href: 'https://cdn.mogofun.com' },
      { rel: 'dns-prefetch', href: 'https://cdn.mogofun.com' },
    ]
  },
  app: {
    baseURL: '/',
    buildAssetsDir: 'static/',
    cdnURL: '',
  },
};
