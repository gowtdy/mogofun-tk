<template>
  <div>
    <div class="flex flex-col lg:flex-row items-start gap-8 mb-8 lg:mb-12" fetchpriority="high">
      <div class="relative w-24 h-24 lg:w-40 lg:h-40 flex-shrink-0 mx-auto lg:mx-0">
        <img
          :src="imageSrc"
          :alt="$t(`character.${characterSlug}.name`)"
          width="160"
          height="160"
          class="rounded-xl w-full h-full object-cover"
          fetchpriority="high"
          loading="eager"
          decoding="async"
          importance="high"
        >
      </div>
      <div class="flex-1 text-center lg:text-left">
        <div class="flex flex-col lg:flex-row items-center gap-3 mb-2 lg:mb-3">
          <h2 class="text-xl lg:text-3xl font-bold text-gray-900 will-change-auto" v-once>{{ $t(`character.${characterSlug}.name`) }}</h2>
        </div>
        <div class="flex flex-wrap justify-center lg:justify-start gap-3 lg:gap-6 text-sm text-gray-500 mb-3 lg:mb-4">
          <div class="flex items-center gap-1.5">
            <i class="ri-user-line"></i>
            <span>by <span class="text-gray-900">{{ author }}</span></span>
          </div>
          <span class="text-gray-900 font-bold">{{ views }}</span>
        </div>
        <p class="text-sm lg:text-lg text-gray-600 will-change-auto" style="content-visibility: visible;">{{ description }}</p>
      </div>
    </div>

    <h1 class="text-xl lg:text-2xl font-semibold text-gray-800 mb-4 lg:mb-6 text-center will-change-auto" v-once>{{ $t(`character.${characterSlug}.try_voice`) }}</h1>
  </div>
</template>

<script setup lang="ts">
import { onMounted, nextTick } from 'vue'

defineProps<{
  characterSlug: string
  imageSrc: string
  author: string
  views: string
  description?: string
}>()
</script>