<template>
  <div class="min-h-screen bg-white">
    <div class="container mx-auto px-4 pt-4 pb-6">
      <!-- 标题区域 -->
      <div class="text-center mb-6">
        <h1 
          data-allow-mismatch="style"
          class="text-4xl font-bold mb-4 gradient-text"
          fetchpriority="high"
          style="visibility: visible;"
        >
          {{ pageTitle.title }}
        </h1>
        <h2
          class="text-gray-600 font-medium text-xl lcp-title"
          fetchpriority="high"
          style="content-visibility: visible; contain-intrinsic-size: auto 32px; min-height: 32px;"
          v-once
        >
          {{ pageTitle.subtitle }}
        </h2>
      </div>

      <!-- 主体内容区域 -->
      <div class="max-w-[1400px] mx-auto bg-white rounded-2xl p-6 shadow-[0_2px_24px_rgba(0,0,0,0.08)]">
        <AICoverConverter 
          :key="route.fullPath"
          :voice-models="voiceModels || []"
          :default-category="defaultCategory"
          :default-model="defaultModel"
        />
      </div>

      <!-- 优势介绍区域 -->
      <AdvantagesSection
        v-if="!isLoggedIn && advantages"
        :title="advantagesTitle"
        :advantages="advantages"
      />

      <!-- FAQ 区域 -->
      <FAQSection
        v-if="!isLoggedIn && faqs"
        :title="faqTitle"
        :faqs="faqs"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, defineAsyncComponent } from 'vue'
import { useRoute } from 'vue-router'
import FAQSection from '~/components/FAQSection.vue'
import AdvantagesSection from '~/components/AdvantagesSection.vue'
import { useWindowSize } from '@vueuse/core'

const route = useRoute()

// 懒加载组件
const AICoverConverter = defineAsyncComponent(() => 
  import('~/components/AICoverConverter.vue')
)

interface Props {
  pageTitle: {
    title: string
    subtitle: string
  }
  isLoggedIn: boolean
  advantages?: any[]
  advantagesTitle?: string
  faqs?: any[]
  faqTitle?: string
  voiceModels?: any[]
  defaultCategory: string
  defaultModel: string
}

const props = withDefaults(defineProps<Props>(), {
  advantages: undefined,
  advantagesTitle: '',
  faqs: undefined,
  faqTitle: '',
  voiceModels: undefined
})

const { width } = useWindowSize()
const isDesktop = computed(() => width.value >= 768)
</script>
