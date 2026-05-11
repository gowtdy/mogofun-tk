<template>
  <div class="bg-white">
    <div class="space-y-8 lg:space-y-16 py-6 lg:py-8"
      :style="{ 'content-visibility': 'auto', 'contain-intrinsic-size': '0 500px' }">
      <template v-if="Array.isArray(sections) && sections.length > 0">
        <div v-for="(section, index) in sections" :key="index" class="space-y-4 pb-8 last:pb-0"
          :style="{ 'content-visibility': 'auto', 'contain-intrinsic-size': '0 200px' }">
          <h2 class="text-xl lg:text-2xl font-bold text-gray-900 will-change-transform">
            {{ rt(section.question) }}
          </h2>
          <div class="text-base lg:text-lg text-gray-600 leading-relaxed">
            {{ rt(section.answer) }}
          </div>
        </div>
      </template>
    </div>
  </div>
</template>

<script setup>
import { useI18n } from "vue-i18n"
import { computed } from 'vue'

const props = defineProps({
  sections: {
    type: Array,
    required: true,
    default: () => []
  }
})

const { rt } = useI18n()

// 优化i18n渲染性能
const translatedSections = computed(() => {
  if (!Array.isArray(props.sections)) return []
  return props.sections.map(section => ({
    question: rt(section.question),
    answer: rt(section.answer)
  }))
})
</script>