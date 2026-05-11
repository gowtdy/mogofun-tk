<template>
  <div class="mt-8 mb-16 max-w-[1400px] mx-auto">
    <h2
      class="text-2xl font-bold text-center mb-8 bg-clip-text text-transparent bg-gradient-to-r from-[#F1AC63] to-[#D76FF4]"
      v-once
    >
      {{ title }}
    </h2>

    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      <NuxtLink
        v-for="character in characters"
        :key="character.slug"
        :title="character.title"
        :to="`/${currentLocale}/${character.slug}`"
        class="group bg-white p-0 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden border border-gray-200/60 hover:border-gray-300"
      >
        <div class="relative overflow-hidden">
          <div class="relative w-full" style="padding-bottom: 75%;">
            <img
              :src="character.image"
              :alt="character.name"
              width="330"
              height="330"
              class="absolute inset-0 w-full h-full object-cover transition-transform duration-500 ease-in-out group-hover:scale-110"
              loading="lazy"
            />
            <div class="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </div>
        </div>

        <div class="p-4">
          <div class="flex items-center justify-between mb-1.5">
            <h3 class="font-semibold text-gray-900 text-sm group-hover:text-[#D76FF4] transition-colors duration-300">
              {{ character.name }}
            </h3>
            <div class="flex items-center gap-1">
              <span class="text-xs font-medium text-amber-700">{{ character.usage }}</span>
              <svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5 text-amber-700" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                <path d="M2 10.5a1.5 1.5 0 113 0v6a1.5 1.5 0 01-3 0v-6zM6 10.333v5.43a2 2 0 001.106 1.79l.05.025A4 4 0 008.943 18h5.416a2 2 0 001.962-1.608l1.2-6A2 2 0 0015.56 8H12V4a2 2 0 00-2-2 1 1 0 00-1 1v.667a4 4 0 01-.8 2.4L6.8 7.933a4 4 0 00-.8 2.4z" />
              </svg>
            </div>
          </div>
          <div class="flex items-center gap-1 text-xs text-gray-500">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            <span>by <span class="text-gray-900">@{{ character.creator }}</span></span>
          </div>
        </div>
      </NuxtLink>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'

const { locale } = useI18n()

defineProps({
  title: {
    type: String,
    required: true
  },
  characters: {
    type: Array,
    required: true
  }
})

const currentLocale = computed(() => {
  return typeof locale.value === 'string' ? locale.value : locale.value?.code || 'en'
})
</script>