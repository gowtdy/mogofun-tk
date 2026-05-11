<template>
  <div class="max-w-[1400px] mx-auto">
    <h2 class="advantages-title text-2xl font-bold text-center mb-8 bg-clip-text text-transparent bg-gradient-to-r from-[#F1AC63] to-[#D76FF4]">
      {{ title }}
    </h2>
    <section class="mb-16">
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div v-for="(advantage, index) in advantages"
             :key="index"
             class="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 border border-gray-200/60 hover:border-gray-300">
          <div class="flex items-start gap-4 mb-4">
            <component
              :is="advantage.icon"
              class="h-8 w-8 flex-shrink-0 text-[#F1AC63]"
              aria-hidden="true"
            />
            <h3 class="text-xl font-semibold bg-clip-text text-transparent bg-gradient-to-r from-[#F1AC63] to-[#D76FF4]">
              {{ rt(advantage.title)}}
            </h3>
          </div>
          <p class="text-gray-600">{{ rt(advantage.description) }}</p>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import {useI18n} from "vue-i18n"

defineProps({
  title: {
    type: String,
    required: true
  },
  advantages: {
    type: Array,
    required: true,
    default: () => []
  }
})

const { rt } = useI18n()
</script>