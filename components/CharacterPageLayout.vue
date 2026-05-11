<template>
  <div class="min-h-screen bg-white">
    <div class="container mx-auto px-4 py-8">
      <div class="max-w-[1400px] mx-auto">
        <!-- 预加载LCP关键图片 -->
        <link 
          v-if="preloadImage" 
          rel="preload" 
          :href="preloadImage" 
          as="image" 
          fetchpriority="high" 
        />

        <!-- 角色基本信息卡片 -->
        <CharacterHeader 
          :character-slug="characterSlug" 
          :image-src="headerImage" 
          :author="author" 
          :views="views" 
          :description="description" 
          class="lcp-critical"
          loading="eager" 
          fetchpriority="high" 
        />

        <div class="space-y-8 lg:space-y-16">
          <AICoverConverter 
            :voice-models="voiceModels" 
            :default-category="defaultCategory" 
            :default-model="defaultModel" 
          />

          <!-- 介绍区域 -->
          <IntroSection 
            v-if="!isLoggedIn && introSections" 
            :sections="introSections" 
            client:idle 
          />

          <!-- FAQ区域 -->
          <FAQSection 
            v-if="!isLoggedIn && faqs" 
            :title="faqTitle" 
            :faqs="faqs" 
            client:idle 
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import CharacterHeader from '~/components/CharacterHeader.vue'
import AICoverConverter from '~/components/AICoverConverter.vue'
import FAQSection from '~/components/FAQSection.vue'
import IntroSection from '~/components/IntroSection.vue'

interface Props {
  characterSlug: string
  headerImage: string
  preloadImage?: string
  author: string
  views: string
  description: string
  voiceModels: any[]
  defaultCategory: string
  defaultModel: string
  isLoggedIn: boolean
  introSections?: any[]
  faqs?: any[]
  faqTitle?: string
}

const props = withDefaults(defineProps<Props>(), {
  preloadImage: undefined,
  introSections: undefined,
  faqs: undefined,
  faqTitle: ''
})
</script> 