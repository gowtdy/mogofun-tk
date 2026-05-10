export default function ({ store, redirect, route }) {
  const locale = route.params.locale
  if (locale) {
    store.commit('setUrlLang', locale)
  }

  if (route.meta.some(meta => meta.requiresAuth)) {
    if (!store.getters.isLoggedIn) {
      return redirect('/user/login')
    }
  }
}
