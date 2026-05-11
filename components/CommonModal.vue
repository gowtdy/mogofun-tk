<template>
  <Transition name="modal-fade">
    <div v-if="show" class="fixed inset-0 z-50 flex items-center justify-center">
      <!-- 背景遮罩 -->
      <div 
        class="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
      ></div>
      
      <!-- 模态框内容 -->
      <div class="relative bg-white rounded-xl shadow-xl max-w-md w-full mx-4 transform transition-all">
        <!-- 标题栏 -->
        <div class="flex items-center justify-between p-4 border-b">
          <h3 class="text-lg font-semibold text-gray-900">
            {{ title }}
          </h3>
          <button 
            @click="$emit('close')" 
            class="text-gray-400 hover:text-gray-500 focus:outline-none"
          >
            <svg class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
              <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
            </svg>
          </button>
        </div>

        <!-- 内容区域 -->
        <div class="p-4">
          <div class="text-gray-600">
            {{ message }}
          </div>
        </div>

        <!-- 按钮区域 -->
        <div class="flex justify-center p-4 border-t">
          <button 
            @click="$emit('close')" 
            class="px-8 py-2 text-sm font-medium text-white bg-gradient-to-r from-[#F1AC63] to-[#D76FF4] rounded-md hover:opacity-90 focus:outline-none"
          >
            {{ buttonText }}
          </button>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup>
defineProps({
  show: {
    type: Boolean,
    default: false
  },
  title: {
    type: String,
    default: 'Notice'
  },
  message: {
    type: String,
    default: ''
  },
  buttonText: {
    type: String,
    default: 'Got it'
  }
})

defineEmits(['close'])
</script>

<style scoped>
.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: all 0.3s ease;
}

.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
  transform: scale(0.95);
}
</style> 