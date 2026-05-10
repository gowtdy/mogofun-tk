export default {
  mode: 'history',
  extendRoutes(routes, resolve) {
    return [
      {
        path: '/',
        name: 'index',
        component: resolve(__dirname, 'pages/index.vue')
      },
      {
        path: '/:locale',
        name: 'home',
        component: resolve(__dirname, 'pages/index.vue')
      },
      {
        path: '/:locale/pricing',
        name: 'pricing-localized',
        component: resolve(__dirname, 'pages/pricing.vue')
      }
    ]
  }
}
