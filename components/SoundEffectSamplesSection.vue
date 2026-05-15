<template>
  <div class="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mb-4">
    <!-- 音效卡片网格 -->
    <h2 class="text-2xl font-medium mb-6 text-center bg-gradient-to-r from-[#F1AC63] to-[#D76FF4] bg-clip-text text-transparent">{{ $t('soundeffect_common.display_title') }}</h2>

    <!-- 分类标签 -->
    <div class="flex flex-wrap justify-center gap-2 mb-5">
      <button
        v-for="cat in categories"
        :key="cat.id"
        type="button"
        class="px-5 py-1.5 rounded-full border text-sm transition-all duration-200 font-medium tracking-wide"
        :class="currentCategory === cat.id
          ? 'bg-gradient-to-r from-[#F1AC63] to-[#D76FF4] text-white border-transparent shadow-sm'
          : 'border-gray-200 text-gray-500 bg-white hover:border-pink-200 hover:text-pink-500'"
        @click="onCategoryClick(cat.id)"
      >
        {{ $t(cat.name) }}
      </button>
    </div>
    
    <div class="grid grid-cols-2 sm:grid-cols-5 gap-3">
      <div
        v-for="sample in currentSamples"
        :key="sample.id"
        class="flex items-center gap-3 px-4 py-3 border rounded-xl bg-gradient-to-r from-pink-50/40 to-purple-50/40 cursor-pointer transition-all duration-200 hover:shadow-md group min-w-0"
        :class="[
          currentPlaying === sample.id
            ? 'border-[#D76FF4] shadow-md bg-gradient-to-r from-pink-100/50 to-purple-100/50'
            : 'border-gray-200 hover:border-pink-300'
        ]"
        @click="emit('play-sample', sample)"
      >
        <div class="text-2xl">{{ sample.emoji }}</div>
        <div class="flex-grow text-left text-sm text-gray-600 font-medium">{{ $t(sample.name) }}</div>
        <button
          class="flex-shrink-0 transition-all duration-200 w-9 h-9 rounded-full flex items-center justify-center"
          :class="[
            currentPlaying === sample.id
              ? 'bg-gradient-to-r from-[#F1AC63] to-[#D76FF4] text-white shadow-sm'
              : 'bg-gradient-to-r from-[#F1AC63]/10 to-[#D76FF4]/10 text-[#D76FF4] group-hover:from-[#F1AC63]/20 group-hover:to-[#D76FF4]/20'
          ]"
          :aria-label="sample.id"
          :disabled="isLoadingSample === sample.id"
        >
          <!-- 加载中状态 -->
          <svg v-if="isLoadingSample === sample.id" class="loading-icon animate-spin w-6 h-6" viewBox="0 0 24 24">
            <path fill="currentColor" d="M12,4V2A10,10 0 0,0 2,12H4A8,8 0 0,1 12,4Z"/>
          </svg>
          <!-- 播放/暂停状态 -->
          <svg v-else-if="currentPlaying === sample.id" class="pause-icon w-6 h-6" viewBox="0 0 24 24">
            <path fill="currentColor" d="M8 6h3v12H8V6zm5 0h3v12h-3V6z"/>
          </svg>
          <!-- 默认状态 -->
          <svg v-else class="play-icon w-6 h-6" viewBox="0 0 24 24">
            <path fill="currentColor" d="M7 6v12l10-6z"/>
          </svg>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { config } from '~/config/config'

export type SoundEffectCategoryId = 'nature' | 'special' | 'instrument' | 'human' | 'ambient'

export interface SoundEffectSampleItem {
  id: string
  emoji: string
  url: string
  name: string
}

defineProps<{
  currentPlaying: string
  isLoadingSample: string
}>()

const emit = defineEmits<{
  'play-sample': [sample: SoundEffectSampleItem]
  'category-change': []
}>()

const cdnHost = config.cdnHost

const categories = [
  { id: 'nature' as SoundEffectCategoryId, name: 'soundeffect_common.prompt_nature.name' },
  { id: 'special' as SoundEffectCategoryId, name: 'soundeffect_common.prompt_special.name' },
  { id: 'instrument' as SoundEffectCategoryId, name: 'soundeffect_common.prompt_instruments.name' },
  { id: 'human' as SoundEffectCategoryId, name: 'soundeffect_common.prompt_human.name' },
  { id: 'ambient' as SoundEffectCategoryId, name: 'soundeffect_common.prompt_ambient.name' }
]

const samples: Record<SoundEffectCategoryId, SoundEffectSampleItem[]> = {
  nature: [
    { id: 'rain', emoji: '🌧️', url: `${cdnHost}/outimage/wavplay/sounds/nature/rain.mp3`, name: 'soundeffect_common.prompt_nature.rain' },
    { id: 'ocean', emoji: '🌊', url: `${cdnHost}/outimage/wavplay/sounds/nature/ocean.mp3`, name: 'soundeffect_common.prompt_nature.ocean_waves' },
    { id: 'water', emoji: '💧', url: `${cdnHost}/outimage/wavplay/sounds/nature/water.mp3`, name: 'soundeffect_common.prompt_nature.flowing_water' },
    { id: 'thunder', emoji: '⚡', url: `${cdnHost}/outimage/wavplay/sounds/nature/thunder.mp3`, name: 'soundeffect_common.prompt_nature.thunder' },
    { id: 'insect', emoji: '🦗', url: `${cdnHost}/outimage/wavplay/sounds/nature/insect.mp3`, name: 'soundeffect_common.prompt_nature.insect_sounds' }
  ],
  special: [
    { id: 'fireworks', emoji: '🎆', url: `${cdnHost}/outimage/wavplay/sounds/special/fireworks.mp3`, name: 'soundeffect_common.prompt_special.fireworks' },
    { id: 'glass', emoji: '💥', url: `${cdnHost}/outimage/wavplay/sounds/special/glass.mp3`, name: 'soundeffect_common.prompt_special.glass_shattering' },
    { id: 'magic', emoji: '✨', url: `${cdnHost}/outimage/wavplay/sounds/special/magic.mp3`, name: 'soundeffect_common.prompt_special.magic_spell' },
    { id: 'spaceship', emoji: '🚀', url: `${cdnHost}/outimage/wavplay/sounds/special/spaceship.mp3`, name: 'soundeffect_common.prompt_special.spaceship' },
    { id: 'action', emoji: '💫', url: `${cdnHost}/outimage/wavplay/sounds/special/action.mp3`, name: 'soundeffect_common.prompt_special.action' }
  ],
  instrument: [
    { id: 'piano', emoji: '🎹', url: `${cdnHost}/outimage/wavplay/sounds/instrument/piano.mp3`, name: 'soundeffect_common.prompt_instruments.piano' },
    { id: 'guitar', emoji: '🎸', url: `${cdnHost}/outimage/wavplay/sounds/instrument/guitar.mp3`, name: 'soundeffect_common.prompt_instruments.electric_guitar' },
    { id: 'violin', emoji: '🎻', url: `${cdnHost}/outimage/wavplay/sounds/instrument/violin.mp3`, name: 'soundeffect_common.prompt_instruments.violin' },
    { id: 'keyboard', emoji: '🎹', url: `${cdnHost}/outimage/wavplay/sounds/instrument/keyboard.mp3`, name: 'soundeffect_common.prompt_instruments.keyboard' },
    { id: 'pipes', emoji: '🎵', url: `${cdnHost}/outimage/wavplay/sounds/instrument/pipes.mp3`, name: 'soundeffect_common.prompt_instruments.irish_pipes' }
  ],
  human: [
    { id: 'baby', emoji: '👶', url: `${cdnHost}/outimage/wavplay/sounds/human/baby.mp3`, name: 'soundeffect_common.prompt_human.baby_laughing' },
    { id: 'clap', emoji: '👏', url: `${cdnHost}/outimage/wavplay/sounds/human/clap.mp3`, name: 'soundeffect_common.prompt_human.clapping' },
    { id: 'celebrate', emoji: '🎉', url: `${cdnHost}/outimage/wavplay/sounds/human/celebrate.mp3`, name: 'soundeffect_common.prompt_human.celebrate' },
    { id: 'footsteps', emoji: '👣', url: `${cdnHost}/outimage/wavplay/sounds/human/footsteps.mp3`, name: 'soundeffect_common.prompt_human.footsteps' },
    { id: 'burp', emoji: '😮', url: `${cdnHost}/outimage/wavplay/sounds/human/burp.mp3`, name: 'soundeffect_common.prompt_human.burp' }
  ],
  ambient: [
    { id: 'typing', emoji: '⌨️', url: `${cdnHost}/outimage/wavplay/sounds/ambient/typing.mp3`, name: 'soundeffect_common.prompt_ambient.typing' },
    { id: 'restaurant', emoji: '🍽️', url: `${cdnHost}/outimage/wavplay/sounds/ambient/restaurant.mp3`, name: 'soundeffect_common.prompt_ambient.noisy_restaurant' },
    { id: 'doorbell', emoji: '🔔', url: `${cdnHost}/outimage/wavplay/sounds/ambient/doorbell.mp3`, name: 'soundeffect_common.prompt_ambient.doorbell_ring' },
    { id: 'tv', emoji: '📺', url: `${cdnHost}/outimage/wavplay/sounds/ambient/tv.mp3`, name: 'soundeffect_common.prompt_ambient.tv_on' },
    { id: 'cooking', emoji: '🍳', url: `${cdnHost}/outimage/wavplay/sounds/ambient/cooking.mp3`, name: 'soundeffect_common.prompt_ambient.cooking' }
  ]
}

const currentCategory = ref<SoundEffectCategoryId>('nature')
const currentSamples = computed(() => samples[currentCategory.value])

function onCategoryClick(id: SoundEffectCategoryId) {
  emit('category-change')
  currentCategory.value = id
}
</script>
