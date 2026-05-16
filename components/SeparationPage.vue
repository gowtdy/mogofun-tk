<template>
  <div class="bg-white px-6 py-8">
    <div class="text-center mb-8">
      <h1
        data-allow-mismatch="style"
        class="text-4xl font-bold mb-4 gradient-text"
        fetchpriority="high"
        style="visibility: visible; content-visibility: visible;"
        v-once
      >
        {{ pageHeading.title }}
      </h1>
      <h2
        class="text-gray-600 font-medium text-xl lcp-title will-change-auto contain-content"
        fetchpriority="high"
        style="content-visibility: visible; contain-intrinsic-size: auto 32px; min-height: 32px; visibility: visible;"
        v-once
      >
        {{ pageHeading.subtitle }}
      </h2>
    </div>

    <UploadPanel
      :result-title="pageCommon('result_title')"
      :process-button-text="pageCommon('process_button')"
      :telemetry-model-slug="pageSlug"
      :job-variant="jobVariant"
      :media-type="upload.mediaType"
      :model-category="upload.modelCategory"
      :model-name="upload.modelName"
      :api-endpoint="upload.apiEndpoint"
      :action-type="upload.actionType"
    />

    <AdvantagesSection
      v-if="!isLoggedIn"
      :title="t(`${pageSlug}.advantages.title`)"
      :advantages="advantages"
    />

    <FAQSection
      v-if="!isLoggedIn"
      :title="t(`${pageSlug}.faqs.title`)"
      :faqs="faqs"
    />
  </div>
</template>

<script setup lang="ts">
import { computed, onErrorCaptured, ref } from 'vue'
import type { Component } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRequestEvent } from '#app'
import UploadPanel from '~/components/UploadPanel.vue'
import AdvantagesSection from '~/components/AdvantagesSection.vue'
import FAQSection from '~/components/FAQSection.vue'
import { useAuth } from '~/composables/useAuth'
import { usePageErrorHandler } from '~/composables/usePageErrorHandler'
import { usePageSeoMeta } from '~/composables/usePageSeoMeta'
import { useUserStore } from '~/store/user'
import type { ActionType } from '~/composables/actionReporter'

export interface SeparationUploadConfig {
  mediaType: string
  modelCategory: string
  modelName: string
  apiEndpoint: string
  actionType: Record<string, ActionType>
}

const props = withDefaults(
  defineProps<{
    pageSlug: string
    upload: SeparationUploadConfig
    advantageIcons: Component[]
    jobVariant?: 'isolation' | 'removal' | 'extraction'
  }>(),
  { jobVariant: 'isolation' }
)

const { t, tm, locale: i18nLocale } = useI18n()
const pageCommon = (key: string) =>
  t(`separation_common.pages.${props.pageSlug}.${key}`)
const { getOrCreateUid } = useAuth()
const uid = ref(getOrCreateUid())
const userStore = useUserStore()
const isLoggedIn = computed(() => !!userStore.user)
const userEmail = computed(() => userStore.user?.email || '')
const event = useRequestEvent()
const lang = useState('lang', () => event?.context?.lang || 'en')

const pageHeading = computed(() => {
  void i18nLocale.value
  const k = props.pageSlug
  return {
    title: t(`${k}.hero.title`),
    subtitle: t(`${k}.hero.subtitle`)
  }
})

usePageSeoMeta({
  locale: lang,
  pathSlug: computed(() => props.pageSlug),
  watchDeps: i18nLocale,
  prefetchHost: true,
  getContent: () => {
    const p = props.pageSlug
    return {
      title: t(`${p}.meta.title`),
      description: t(`${p}.meta.description`),
      keywords: t(`${p}.meta.keywords`)
    }
  }
})

const advantages = computed(() => {
  const advantagesItems = tm(`${props.pageSlug}.advantages.items`) || []
  const items = Array.isArray(advantagesItems) ? advantagesItems : []
  const icons = props.advantageIcons
  return items.map((item: Record<string, unknown>, index: number) => ({
    ...item,
    icon: icons[index] || icons[0]
  }))
})

const faqs = computed(() => {
  const raw = tm(`${props.pageSlug}.faqs.items`) || []
  const items = Array.isArray(raw) ? raw : []
  const p = props.pageSlug
  return items.map((_, idx: number) => ({
    question: t(`${p}.faqs.items.${idx}.question`),
    answer: t(`${p}.faqs.items.${idx}.answer`)
  }))
})

const { onPageError } = usePageErrorHandler(props.pageSlug, uid.value, userEmail.value)
onErrorCaptured((err, _instance, info) => onPageError(err instanceof Error ? err : new Error(String(err)), String(info)))
</script>

<style scoped>
.border-dashed {
  border-style: dashed;
}
</style>
