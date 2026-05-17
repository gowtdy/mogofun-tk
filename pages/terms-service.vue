<template>
  <div class="min-h-screen bg-white py-12">
    <div class="container mx-auto px-4 max-w-4xl">
      <h1 class="text-3xl font-bold mb-8">Terms of Service</h1>
      <div class="prose max-w-none">
        <p class="text-gray-600 mb-4">Last updated: {{ currentDate }}</p>

        <section class="mb-8">
          <h2 class="text-xl font-semibold mb-4">1. Agreement to Terms</h2>
          <p>By accessing and using MoGoFun (https://mogofun.com), you agree to be bound by these Terms of Service.</p>
        </section>

        <section class="mb-8">
          <h2 class="text-xl font-semibold mb-4">2. Description of Service</h2>
          <p>MoGoFun provides an AI-powered voice generation platform that allows users to create and customize synthetic voices for various purposes.</p>
        </section>

        <section class="mb-8">
          <h2 class="text-xl font-semibold mb-4">3. User Rights and Restrictions</h2>
          <p>When purchasing our services:</p>
          <ul class="list-disc pl-6 mb-4">
            <li>You own the rights to the generated voice content for your use</li>
            <li>You may not resell or redistribute the generated voices</li>
            <li>You may request a full refund within 7 days of purchase</li>
          </ul>
        </section>

        <section class="mb-8">
          <h2 class="text-xl font-semibold mb-4">4. Data Collection</h2>
          <p>We collect:</p>
          <ul class="list-disc pl-6 mb-4">
            <li>Personal information (name, email, payment details)</li>
            <li>Non-personal data through cookies</li>
          </ul>
          <p>For more information, please see our <router-link to="/privacy-policy" class="text-blue-600 hover:underline">Privacy Policy</router-link>.</p>
        </section>

        <section class="mb-8">
          <h2 class="text-xl font-semibold mb-4">5. Governing Law</h2>
          <p>These Terms shall be governed by and construed in accordance with the laws of the United States.</p>
        </section>

        <section class="mb-8">
          <h2 class="text-xl font-semibold mb-4">6. Changes to Terms</h2>
          <p>We reserve the right to modify these Terms at any time. Users will be notified of any changes via email.</p>
        </section>

        <section class="mb-8">
          <h2 class="text-xl font-semibold mb-4">7. Contact Information</h2>
          <p>For any questions regarding these Terms, please contact us at: support@mogofun.com</p>
        </section>
      </div>
    </div>
  </div>
</template>

<script setup>
const { t, tm, locale } = useI18n()
const host = 'https://mogofun.com'

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
  title: t('policy_pages.terms.seo.title'),
  meta: [
    { name: 'description', content: t('policy_pages.terms.seo.description') },
    { name: 'keywords', content: t('policy_pages.terms.seo.keywords') },
    { property: 'og:type', content: 'website' },
    { property: 'og:title', content: t('policy_pages.terms.seo.title') },
    { property: 'og:description', content: t('policy_pages.terms.seo.description') },
    { property: 'og:url', content: 'https://mogofun.com' },
    { property: 'og:image', content: 'https://cdn.mogofun.com/img/fb-avl.jpg'},
    { name: 'twitter:card', content: 'summary_large_image' },
    { name: 'twitter:title', content: t('policy_pages.terms.seo.title') },
    { name: 'twitter:description', content: t('policy_pages.terms.seo.description') },
    { name: 'twitter:site', content: 'https://mogofun.com' },
    { name: 'twitter:image', content: 'https://cdn.mogofun.com/img/tw-avl.jpg' }
  ]
})
</script>