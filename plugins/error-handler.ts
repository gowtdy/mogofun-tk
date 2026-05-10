export default defineNuxtPlugin((nuxtApp) => {
  const { reportError } = useErrorReporter()

  nuxtApp.vueApp.config.errorHandler = (error, instance, info) => {
    reportError(error, `Global Error Handler: ${info}`)
    console.error('Vue Error:', error)
  }
})
