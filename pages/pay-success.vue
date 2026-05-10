<template>
  <div class="flex items-center justify-center min-h-screen bg-white">
    <div class="bg-white rounded-xl shadow-lg p-8 md:p-10 text-center max-w-md w-full mx-4 relative overflow-hidden">
      <!-- 装饰元素 -->
      <div class="absolute -right-12 -top-12 w-24 h-24 bg-orange-500 opacity-5 rounded-full"></div>
      <div class="absolute -left-12 -bottom-12 w-24 h-24 bg-purple-500 opacity-5 rounded-full"></div>
      
      <!-- 成功图标 -->
      <div class="mb-6 relative">
        <div class="w-20 h-20 mx-auto bg-green-50 rounded-full flex items-center justify-center">
          <svg class="w-10 h-10 text-green-500" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M7 13L10 16L17 9" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2"/>
          </svg>
        </div>
      </div>
      
      <h2 class="text-2xl md:text-3xl font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-[#F1AC63] to-[#D76FF4]">Payment Successful!</h2>
      <p class="mt-3 text-gray-600 mb-6">Thank you for your purchase. Your transaction has been completed successfully.</p>
      
      <button 
        class="w-full py-3 px-6 rounded-lg bg-gradient-to-r from-[#F1AC63] to-[#D76FF4] text-white font-medium hover:opacity-90 transition-all duration-300 shadow-md flex items-center justify-center"
        @click="startUsing"
      >
        {{ $t('comm.startUsing') }}
      </button>
    </div>
  </div>
</template>

<script setup lang='ts'>
import { useI18n } from 'vue-i18n'

const { locale, t } = useI18n()
const startUsing = () => {
  window.location.href = locale.value === 'en' ? '/' : `/${locale.value}`
}
</script>

<style scoped>
/* 为了更精致的效果添加一些微妙动画 */
button {
  position: relative;
  overflow: hidden;
}

button:after {
  content: '';
  position: absolute;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  background: linear-gradient(
    to bottom right,
    rgba(255, 255, 255, 0) 0%,
    rgba(255, 255, 255, 0.1) 100%
  );
  transform: rotate(30deg);
  transition: transform 0.3s ease-out;
}

button:hover:after {
  transform: rotate(30deg) translate(10%, 10%);
}
</style>