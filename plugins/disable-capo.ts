// 禁用CapoPlugin插件
export default defineNuxtPlugin({
  name: 'disable-capo',
  enforce: 'pre',
  setup() {
    // 禁用unhead的CapoPlugin
    useHead({
      htmlAttrs: {
        'data-no-capo': 'true'
      }
    })
  }
}) 