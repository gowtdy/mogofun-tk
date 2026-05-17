import { config } from './config'

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
      { rel: 'preconnect', href: config.host },
      { rel: 'preconnect', href: config.cdnHost },
      { rel: 'dns-prefetch', href: config.cdnHost },
    ]
  },
  app: {
    baseURL: '/',
    buildAssetsDir: 'static/',
    cdnURL: '',
  },
};
