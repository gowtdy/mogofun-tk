<template>
  <footer class="bg-black text-white mt-12 py-0">
    <div class="container mx-auto px-4 py-8">
      <div class="flex flex-wrap justify-between">
        <div class="w-full md:w-1/4 mb-6 md:mb-0">
          <h3 class="text-lg font-semibold mb-2">{{ $t('comm.aiCover') }}</h3>
          <p>{{ $t('comm.footerDesc') }}</p>
          <div class="mt-4 flex items-center text-sm text-gray-400">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24"
              stroke="currentColor" aria-hidden="true">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            <span>{{ $t('comm.contact') }}</span>
            <a href="mailto:support@mogofun.com" title="MoGoFun Contact"
              class="ml-1 hover:text-white transition-colors duration-200">
              support@mogofun.com
            </a>
          </div>
        </div>
        <div class="w-full md:w-1/4 mb-6 md:mb-0">
          <div class="text-lg font-semibold mb-2">{{ $t('comm.quickLinks') }}</div>
          <ul class="space-y-2">
            <li><router-link to="/privacy-policy" title="AI Voice Generator Privacy Policy" class="hover:text-primary">{{ $t('comm.privacyPolicy') }}</router-link></li>
            <li><router-link to="/terms-service" title="AI Voice Generator Term of Service" class="hover:text-primary">{{ $t('comm.termsService') }}</router-link></li>
            <li><router-link to="/refund-policy" title="AI Voice Generator Refund of Service" class="hover:text-primary">{{ $t('comm.refundService') }}</router-link></li>
            <li><router-link to="/dmca-policy" title="AI Voice Generator DMCA Policy" class="hover:text-primary">{{ $t('comm.dmcaPolicy') }}</router-link></li>
            <li><a href="/en/friends" title="AI Cover Friends Links" target="_blank" class="hover:text-primary">{{
              $t('comm.friendsLinks') }}</a></li>
          </ul>
        </div>
        <div class="w-full md:w-1/4 mb-6 md:mb-0">
          <div class="text-lg font-semibold mb-2">{{ $t('comm.company') }}</div>
          <ul class="space-y-2">
            <li>
              <NuxtLink 
                :to="localizedPath('/about-us')" 
                title="About Us" 
                class="hover:text-primary"
              >{{ $t('comm.aboutUs') }}</NuxtLink>
            </li>
          </ul>
        </div>
      </div>
      <div class="mt-8 pt-8 border-t border-gray-700 text-center">
        <p>&copy; {{ currentYear }} AI Voice Lab. All rights reserved.</p>
      </div>
    </div>
  </footer>
</template>

<script setup>
import { computed } from 'vue'
const { t, locale } = useI18n()

const currentYear = computed(() => new Date().getFullYear())
// 生成本地化路径的函数
const localizedPath = (path) => {
  return `/${locale.value}${path}`
}
</script>
