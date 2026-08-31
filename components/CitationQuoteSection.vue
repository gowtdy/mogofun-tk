<template>
  <section
    v-if="!isLoggedIn && !isAboutPage"
    class="citation-quote bg-white"
    aria-label="Citation"
  >
    <div class="max-w-[1400px] mx-auto px-4 py-2 md:py-3">
      <blockquote
        class="text-center text-gray-500 text-sm md:text-base leading-relaxed max-w-3xl mx-auto"
        :cite="aboutAbsoluteUrl"
      >
        <p>“{{ quote }}”</p>
      </blockquote>
      <p class="mt-1 text-center text-xs text-gray-400">
        {{ brandName }} —
        <NuxtLink
          :to="aboutPath"
          :title="aboutLabel"
          class="underline underline-offset-2 hover:text-gray-600 transition-colors"
        >
          {{ aboutLabel }}
        </NuxtLink>
      </p>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRoute } from 'vue-router'
import { config } from '~/config/config'
import { useUserStore } from '~/store/user'

const { t, locale } = useI18n()
const route = useRoute()
const userStore = useUserStore()
const isLoggedIn = computed(() => !!userStore.user)

const brandName = config.organization.name
const quote = computed(() => `${t('comm.aiCover')}. ${t('comm.footerDesc')}`)
const aboutLabel = computed(() => t('comm.aboutUs'))
const aboutPath = computed(() => `/${locale.value}/about`)
const aboutAbsoluteUrl = computed(() => `${config.host}${aboutPath.value}`)

const isAboutPage = computed(() => {
  const path = route.path.replace(/\/$/, '')
  return /\/about(?:-us)?$/.test(path)
})
</script>
