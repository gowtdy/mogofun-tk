<template>
  <section class="mb-16">
    <div class="max-w-[1400px] mx-auto">
      <h2
        class="text-2xl font-bold text-center mb-8 bg-clip-text text-transparent bg-gradient-to-r from-[#F1AC63] to-[#D76FF4]">
        {{ title }}
      </h2>

      <div v-if="Array.isArray(faqs) && faqs.length > 0"
        class="space-y-2 max-w-[1400px] mx-auto divide-y divide-gray-100 border border-gray-200 rounded-lg p-4 lg:p-6"
        :style="{ 'content-visibility': 'auto', 'contain-intrinsic-size': '0 500px' }">
        <div v-for="(faq, index) in faqs" :key="index" class="overflow-hidden pt-2 first:pt-0"
          :style="{ 'content-visibility': 'auto', 'contain-intrinsic-size': '0 100px' }">
          <button @click="toggleFaq(index)" aria-label="FAQ Question"
            class="w-full flex items-center justify-between p-4 text-left transition-colors rounded-lg"
            :class="{ 'hover:bg-gray-50': !isExpanded[index] }">
            <h3 class="text-lg font-bold text-gray-900 pr-8">{{ faq.question }}</h3>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2"
              stroke="currentColor" class="w-5 h-5 text-gray-500 transition-transform duration-200 flex-shrink-0"
              :class="{ 'rotate-180': isExpanded[index] }" :aria-expanded="isExpanded[index]" aria-hidden="true">
              <path stroke-linecap="round" stroke-linejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
            </svg>
          </button>
          <transition enter-active-class="transition duration-200 ease-out"
            enter-from-class="transform scale-y-95 opacity-0" enter-to-class="transform scale-y-100 opacity-100"
            leave-active-class="transition duration-150 ease-in" leave-from-class="transform scale-y-100 opacity-100"
            leave-to-class="transform scale-y-95 opacity-0">
            <div v-show="isExpanded[index]" class="px-4 pb-4"
              :style="{ 'content-visibility': isExpanded[index] ? 'visible' : 'hidden' }">
              <p class="text-sm lg:text-base text-gray-600 leading-relaxed">{{ faq.answer }}</p>
            </div>
          </transition>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'

const props = defineProps({
  title: {
    type: String,
    required: true
  },
  faqs: {
    type: Array,
    required: true
  }
})

// 使用 ref 而不是 reactive 以优化性能
const isExpanded = ref(new Array(props.faqs.length).fill(false))

// 监听faqs变化，重置展开状态
watch(() => props.faqs, (newFaqs) => {
  isExpanded.value = new Array(newFaqs.length).fill(false)
}, { deep: true })

// 客户端激活时添加交互功能
const toggleFaq = (index) => {
  // 关闭其他展开的FAQ
  isExpanded.value = isExpanded.value.map((_, i) => i === index ? !isExpanded.value[i] : false)
}
</script>