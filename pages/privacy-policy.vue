<template>
  <div class="min-h-screen bg-white py-12">
    <div class="container mx-auto px-4 max-w-4xl">
      <h1 class="text-3xl font-bold mb-8">Privacy Policy</h1>
      <div class="prose max-w-none">
        <p class="text-gray-600 mb-4">Last updated: {{ currentDate }}</p>
        
        <section class="mb-8">
          <h2 class="text-xl font-semibold mb-4">1. Introduction</h2>
          <p>Welcome to AI Voice Lab ("we," "our," or "us"). We are committed to protecting your privacy and personal information. This Privacy Policy explains how we collect, use, and protect your information when you use our website (https://aivoicelab.net) and services.</p>
        </section>

        <section class="mb-8">
          <h2 class="text-xl font-semibold mb-4">2. Information We Collect</h2>
          <p>We collect the following types of information:</p>
          <ul class="list-disc pl-6 mb-4">
            <li>Name</li>
            <li>Email address</li>
            <li>Payment information</li>
            <li>Non-personal data through web cookies</li>
          </ul>
        </section>

        <section class="mb-8">
          <h2 class="text-xl font-semibold mb-4">3. Purpose of Data Collection</h2>
          <p>We collect and process your data for:</p>
          <ul class="list-disc pl-6 mb-4">
            <li>Processing your orders and providing our services</li>
            <li>Improving our website and services</li>
            <li>Communicating with you about your account and our services</li>
          </ul>
        </section>

        <section class="mb-8">
          <h2 class="text-xl font-semibold mb-4">4. Data Sharing</h2>
          <p>We do not share your personal information with any third parties except as required by law or to provide our services.</p>
        </section>

        <section class="mb-8">
          <h2 class="text-xl font-semibold mb-4">5. Children's Privacy</h2>
          <p>We do not knowingly collect or maintain information from persons under 13 years of age.</p>
        </section>

        <section class="mb-8">
          <h2 class="text-xl font-semibold mb-4">6. Updates to Privacy Policy</h2>
          <p>We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating you via email.</p>
        </section>

        <section class="mb-8">
          <h2 class="text-xl font-semibold mb-4">7. Contact Us</h2>
          <p>If you have any questions about this Privacy Policy, please contact us at: support@gmail.com</p>
        </section>
      </div>
    </div>
  </div>
</template>

<script setup>
const { t, tm, locale } = useI18n()
const host = 'https://aivoicelab.net'

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