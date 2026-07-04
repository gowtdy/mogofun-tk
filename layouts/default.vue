<template>
  <div>
    <main id="main-content">
      <slot />
    </main>
    <Footer />
  </div>
</template>

<script setup>
import Footer from '~/components/Footer.vue'
</script>

<style scoped>
/* 这里可以添加布局相关的样式 */
</style>
