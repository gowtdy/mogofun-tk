<template>
  <div class="min-h-screen bg-white py-12">
    <div class="container mx-auto px-4 max-w-4xl">
      <h1 class="text-3xl font-bold mb-8">DMCA & Copyright Policy</h1>
      <div class="prose max-w-none">
        <p class="text-gray-600 mb-4">Last updated: {{ currentDate }}</p>

        <section class="mb-8">
          <p class="text-gray-700">AI Voice Lab acts in accordance with the Digital Millennium Copyright Act of 1998. If you own a copyright or have authority to act on behalf of a copyright owner and want to report a claim that a third party is infringing that material on or through AI Voice Lab's services, please send a notice that meets the minimum requirements of the DMCA to support@gmail.com, and we will take appropriate action.</p>
        </section>

        <section class="mb-8">
          <h2 class="text-xl font-semibold mb-4">DMCA Notice Requirements</h2>
          <p class="text-gray-700 mb-2">You must include:</p>
          <ul class="list-decimal pl-6 mb-4 space-y-2 text-gray-700">
            <li>Identification of the copyrighted work or works claimed to have been infringed.</li>
            <li>A description of the material you claim is infringing and that you want removed or access to which you want disabled and the URL or other location of that material.</li>
            <li>Your name, title (if acting as an agent), address, telephone number, and email address.</li>
            <li>The following statement: "I have a good faith belief that the use of the copyrighted material I am complaining of is not authorized by the copyright owner, its agent, or the law (e.g., as a fair use)".</li>
            <li>The following statement: "The information in this notice is accurate and, under penalty of perjury, I am the owner, or authorized to act on behalf of the owner, of the copyright or of an exclusive right that is allegedly infringed".</li>
            <li>An electronic or physical signature of the owner of the copyright or a person authorized to act on the owner's behalf.</li>
          </ul>
        </section>

        <section class="mb-8">
          <h2 class="text-xl font-semibold mb-4">Trademark Takedown Request Requirements</h2>
          <p class="text-gray-700 mb-2">If you want to report content that you believe infringes your trademark, please provide:</p>
          <ul class="list-decimal pl-6 mb-4 space-y-2 text-gray-700">
            <li>Details of the original trademark (and a description if it's a logo).</li>
            <li>A list of the countries in which the trademark is registered.</li>
            <li>The registration number(s) of the trademark.</li>
            <li>A scanned copy of the trademark registration certificate(s) or screenshot of the registration.</li>
            <li>A declaration stating: "By submitting this notice, I state that I have a good-faith belief that the reported use, in the manner that I have complained of, is not authorized by the intellectual property rights owner, its agent or the law; that the information contained in this notice is accurate; and, under penalty of perjury, that I am authorized to act on behalf of the owner of the intellectual property rights at issue".</li>
          </ul>
        </section>

        <section class="mb-8">
          <h2 class="text-xl font-semibold mb-4">Repeat Infringer Policy</h2>
          <p class="text-gray-700">We will suspend or terminate accounts if the user is determined to be a "repeat infringer". In appropriate cases and at our sole discretion, we may limit access to the AI Voice Lab service and/or terminate accounts of users who blatantly infringe the intellectual property rights of others whether or not repeat infringement has occurred.</p>
        </section>

        <section class="mb-8">
          <h2 class="text-xl font-semibold mb-4">Contact Information</h2>
          <p class="text-gray-700">Please send all DMCA and trademark notices to:</p>
          <p class="mt-2 text-gray-700">Email: <a href="mailto:support@gmail.com" class="text-blue-600 hover:text-blue-800 transition-colors duration-200">support@gmail.com</a></p>
        </section>
      </div>
    </div>
  </div>
</template>

<script setup>
import { definePageMeta, useError } from '#imports'
import { useI18n } from 'vue-i18n'
import { useErrorReporter } from '~/composables/errorReporter'
import { onMounted, onErrorCaptured } from 'vue'

const { t, tm, locale } = useI18n()
const host = 'https://aivoicelab.net'
const error = useError()
const { reportError } = useErrorReporter()

definePageMeta({
  layout: 'footerlink',
  name: 'dmca-policy',
  path: '/dmca-policy',
  keepalive: false
})

// 处理 Nuxt 级别的错误
onMounted(() => {
  if (error.value) {
    reportError(error.value, 'Nuxt error--dmca-policy')
    error.value = null
  }
})

// 处理组件级别的错误
onErrorCaptured((err, instance, info) => {
  reportError(err, `Component error--dmca-policy: ${info}`)
  return false
})

const currentDate = new Date().toLocaleDateString('en-US', {
  year: 'numeric',
  month: 'long',
  day: 'numeric'
})
// SEO Meta Tags
useHead({
  htmlAttrs: {
    lang: locale.value
  },
  title: t('seo.title'),
  meta: [
    { name: 'description', content: t('seo.description') },
    { name: 'keywords', content: t('seo.keywords') },
    { property: 'og:type', content: 'website' },
    { property: 'og:title', content: t('seo.title') },
    { property: 'og:description', content: t('seo.description') },
    { property: 'og:url', content: 'https://aivoicelab.net' },
    { property: 'og:image', content: 'https://cdn.aivoicelab.net/img/fb-avl.jpg'},
    { name: 'twitter:card', content: 'summary_large_image' },
    { name: 'twitter:title', content: t('seo.title') },
    { name: 'twitter:description', content: t('seo.description') },
    { name: 'twitter:site', content: 'https://aivoicelab.net' },
    { name: 'twitter:image', content: 'https://cdn.aivoicelab.net/img/tw-avl.jpg' }
  ]
})
</script>

<style scoped>
.prose {
  max-width: 65ch;
  margin: 0 auto;
}
</style> 