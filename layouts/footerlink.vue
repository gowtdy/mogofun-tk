<template>
  <div>
    <slot />
    <FooterForLink v-if="showFooter" />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import FooterForLink from '~/components/FooterForLink.vue'

const showFooter = ref(false)

onMounted(() => {
  // 延迟显示Footer组件
  setTimeout(() => {
    showFooter.value = true
  }, 2000)
})
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>