<template>
  <div>
    <main id="main-content">
      <slot />
    </main>
    <div class="bg-white pb-4 md:pb-6">
      <CitationQuoteSection />
    </div>
    <Footer />
  </div>
</template>

<script setup>
import Footer from '~/components/Footer.vue'
import CitationQuoteSection from '~/components/CitationQuoteSection.vue'
</script>

<style scoped>
/* 这里可以添加布局相关的样式 */
</style>
