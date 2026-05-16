<template>
  <SeparationPage
    page-slug="audio-extractor"
    hero-emoji="🎵"
    job-variant="extraction"
    :upload="audioExtractorUpload"
    :advantage-icons="audioExtractorAdvantageIcons"
  />
</template>

<script setup lang="ts">
import SeparationPage, { type SeparationUploadConfig } from '~/components/SeparationPage.vue'
import { useActionReporter, ActionType } from '~/composables/actionReporter'
import {
  SparklesIcon,
  CpuChipIcon,
  WrenchScrewdriverIcon,
  ArrowDownTrayIcon,
  ShieldCheckIcon,
  CurrencyDollarIcon
} from '@heroicons/vue/24/outline'

definePageMeta({
  layout: 'footerlink'
})

const audioExtractorUpload: SeparationUploadConfig = {
  mediaType: 'video',
  modelCategory: 'audio extractor',
  modelName: 'audio extractor',
  apiEndpoint: '/upapi/extractaudio',
  actionType: {
    extract: ActionType.AUDIO_EXTRACT,
    login: ActionType.AUDIO_EXTRACT_LOGIN,
    subscript: ActionType.AUDIO_EXTRACT_SUBSCRIPT,
    download: ActionType.AUDIO_DOWNLOAD,
    downloadLogin: ActionType.AUDIO_DOWNLOAD_LOGIN,
    downloadSubscript: ActionType.AUDIO_DOWNLOAD_SUBSCRIPT,
    upload: ActionType.AUDIO_EXTRACT_UPLOAD
  }
}

const audioExtractorAdvantageIcons = [
  SparklesIcon,
  CpuChipIcon,
  WrenchScrewdriverIcon,
  ArrowDownTrayIcon,
  ShieldCheckIcon,
  CurrencyDollarIcon
]
</script>
