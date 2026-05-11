<template>
  <GenericPageLayout
    :page-title="pageTitle"
    :is-logged-in="isLoggedIn"
    :advantages="advantages"
    :advantages-title="advantagesTitle"
    :faqs="faqs"
    :faq-title="faqTitle"
    :voice-models="voiceModels"
    :default-category="pageConfig.defaultCategory"
    :default-model="pageConfig.defaultModel"
  />
</template>

<script setup lang="ts">
import { onErrorCaptured, onMounted } from 'vue'
import GenericPageLayout from '~/components/GenericPageLayout.vue'
import { useGenericPage } from '~/composables/useGenericPage'
import { useErrorReporter } from '~/composables/errorReporter'

interface Props {
  pageSlug: string
  dir?: string
}

const props = withDefaults(defineProps<Props>(), {
  dir: ''
})

const { reportError } = useErrorReporter()

// 动态导入配置，避免预加载所有页面配置
const { getPageConfig } = await import('../config/pageConfigs')

// 获取页面配置
const pageConfig = getPageConfig(props.pageSlug)
if (!pageConfig) {
  reportError(new Error(`Page config not found for slug: ${props.pageSlug}`), 
        `Error in page: ${props.pageSlug}`)
}


// 使用通用页面逻辑
const {
  pageTitle,
  voiceModels,
  advantages,
  faqs,
  isLoggedIn,
  initPage,
  reportPageError,
  advantagesTitle,
  faqTitle
} = useGenericPage({
  pageKey: props.pageSlug,
  defaultCategory: pageConfig.defaultCategory,
  defaultModel: pageConfig.defaultModel,
  dir: props.dir
})

onErrorCaptured((error, instance) => {
  reportPageError(error, instance?.$el?.tagName || 'unknown')
})

onMounted(() => {
  requestAnimationFrame(() => {
    requestIdleCallback(() => {
      initPage()
    }, { timeout: 2000 })
  })
})
</script>
