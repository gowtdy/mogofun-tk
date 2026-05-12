<template>
  <div class="min-h-screen bg-white py-12">
    <div class="container mx-auto px-4 max-w-5xl">
      <h1 class="text-3xl font-bold mb-8">{{ $t('about.title') }}</h1>
      
      <!-- 公司简介 -->
      <section class="mb-12">
        <div class="max-w-3xl mx-auto">
          <h2 class="text-2xl font-semibold mb-4">{{ $t('about.companyProfile.title') }}</h2>
          <div class="prose max-w-none text-gray-700">
            <p class="mb-4">{{ $t('about.companyProfile.description1') }}</p>
            <p class="mb-4">{{ $t('about.companyProfile.description2') }}</p>
            <p>{{ $t('about.companyProfile.description3') }}</p>
          </div>
        </div>
      </section>
      
      <!-- 使命和愿景 -->
      <section class="mb-12 bg-gray-50 p-8 rounded-xl">
        <h2 class="text-2xl font-semibold mb-6 text-center">{{ $t('about.mission.title') }}</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div class="bg-white p-6 rounded-lg shadow-md">
            <div class="flex items-center mb-4">
              <div class="w-10 h-10 bg-primary rounded-full flex items-center justify-center text-white mr-4">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 class="text-xl font-semibold">{{ $t('about.mission.missionTitle') }}</h3>
            </div>
            <p class="text-gray-700">{{ $t('about.mission.missionText') }}</p>
          </div>
          <div class="bg-white p-6 rounded-lg shadow-md">
            <div class="flex items-center mb-4">
              <div class="w-10 h-10 bg-primary rounded-full flex items-center justify-center text-white mr-4">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              </div>
              <h3 class="text-xl font-semibold">{{ $t('about.mission.visionTitle') }}</h3>
            </div>
            <p class="text-gray-700">{{ $t('about.mission.visionText') }}</p>
          </div>
        </div>
      </section>
      
      <!-- 核心价值观 -->
      <section class="mb-12">
        <h2 class="text-2xl font-semibold mb-6 text-center">{{ $t('about.values.title') }}</h2>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div class="p-6 border border-gray-200 rounded-lg">
            <div class="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <h3 class="text-lg font-semibold mb-2">{{ $t('about.values.innovation.title') }}</h3>
            <p class="text-gray-700">{{ $t('about.values.innovation.description') }}</p>
          </div>
          <div class="p-6 border border-gray-200 rounded-lg">
            <div class="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center text-green-600 mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <h3 class="text-lg font-semibold mb-2">{{ $t('about.values.userCentric.title') }}</h3>
            <p class="text-gray-700">{{ $t('about.values.userCentric.description') }}</p>
          </div>
          <div class="p-6 border border-gray-200 rounded-lg">
            <div class="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center text-purple-600 mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h3 class="text-lg font-semibold mb-2">{{ $t('about.values.excellence.title') }}</h3>
            <p class="text-gray-700">{{ $t('about.values.excellence.description') }}</p>
          </div>
        </div>
      </section>
      
      <!-- 团队 -->
      <section class="mb-12">
        <h2 class="text-2xl font-semibold mb-6 text-center">{{ $t('about.team.title') }}</h2>
        <p class="text-center text-gray-700 mb-8 max-w-2xl mx-auto">{{ $t('about.team.description') }}</p>
      </section>
      
      <!-- 联系我们 -->
      <section class="mb-8 bg-gray-50 p-8 rounded-xl">
        <h2 class="text-2xl font-semibold mb-6 text-center">{{ $t('about.contact.title') }}</h2>
        <div class="flex flex-col md:flex-row md:space-x-6">
          <div class="flex-1">
            <div class="bg-white p-6 rounded-lg shadow-md h-full">
              <h3 class="text-xl font-semibold mb-4">{{ $t('about.contact.getInTouch') }}</h3>
              <p class="text-gray-700 mb-4">{{ $t('about.contact.message') }}</p>
              <div class="flex items-center mb-3">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-500 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <a href="mailto:support@mogofun.com" class="text-primary hover:underline">support@mogofun.com</a>
              </div>
              <div class="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-500 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <a href="https://mogofun.com" class="text-primary hover:underline">mogofun.com</a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup>
const { t, locale } = useI18n()
import { config } from '~/config/config'
const host = config.host
const cdnhost = config.cdnHost

// SEO Meta Tags
useHead({
  htmlAttrs: {
    lang: locale.value
  },
  title: t('about.seo.title'),
  meta: [
    { name: 'description', content: t('about.seo.description') },
    { name: 'keywords', content: t('about.seo.keywords') },
    { property: 'og:type', content: 'website' },
    { property: 'og:title', content: t('about.seo.title') },
    { property: 'og:description', content: t('about.seo.description') },
    { property: 'og:url', content: `${host}/about-us` },
    { property: 'og:image', content: `${cdnHost}/img/fb-avl.jpg`},
    { name: 'twitter:card', content: 'summary_large_image' },
    { name: 'twitter:title', content: t('about.seo.title') },
    { name: 'twitter:description', content: t('about.seo.description') },
    { name: 'twitter:site', content: `${host}/about-us` },
    { name: 'twitter:image', content: `${cdnHost}/img/tw-avl.jpg` }
  ]
})
</script> 